
import { useState, useEffect, useRef } from 'react';
import './App.css';

function App({ forcedMode }) {
  const [agents, setAgents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [debateMode, setDebateMode] = useState(false);
  // Which layer to use as system prompt (default aligns with run_deliberation)
  const layerKey = 'persona_text_open';
  const [selectedAgents, setSelectedAgents] = useState([]); // array of ids, up to 3
  const [debating, setDebating] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || "");
  const [model, setModel] = useState("gpt-5.1");
  const [useAiAttitude, setUseAiAttitude] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('openai_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}personas.json`)
      .then(res => res.json())
      .then(setAgents);
  }, []);

  // Sync debate mode with optional forcedMode prop ("chat" | "debate")
  useEffect(() => {
    if (!forcedMode) return;
    setDebateMode(forcedMode === 'debate');
  }, [forcedMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-select first agent in Chat and Debate Mode
  useEffect(() => {
    if (agents.length > 0 && !selected) {
      setSelected(agents[0]);
    }
  }, [agents, selected]);

  const handleSelect = (id) => {
    setSelected(agents.find(a => a.id === id));
    setMessages([]);
  };

  const toggleAgentSelection = (id) => {
    setSelectedAgents(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 5) return prev; // ignore extra selections
      return [...prev, id];
    });
  };

  const formatMeta = (a) => {
    if (!a) return '';
    const parts = [];
    const d = a.demographics || {};
    if (d.age) parts.push(d.age);
    if (d.gender) parts.push(d.gender);
    if (d.residence) parts.push(d.residence);
    if (d.occupation) parts.push(d.occupation);
    return parts.join(', ');
  };

  // derived system prompt based on selected layer
  const resolveLayerPrompt = (agent, key) => {
    if (!agent) return '';
    
    // If AI attitude is disabled, prefer the no_ai version
    if (!useAiAttitude && agent.persona_text_open_no_ai) {
      return agent.persona_text_open_no_ai;
    }

    try {
      // prioritize persona_text_open for consistency with run_deliberation.py
      if ((key === 'persona_text_open' || !key) && agent.persona_text_open) return agent.persona_text_open;
      if (key === 'system_prompt' && agent.layers && agent.layers.system_prompt) return agent.layers.system_prompt;
      if (key === 'persona_text' && agent.layers && agent.layers.persona_text) return agent.layers.persona_text;
      if (key === 'short_bio' && agent.layers && agent.layers.humanized && agent.layers.humanized.short_bio) return agent.layers.humanized.short_bio;
      // fallbacks if key not found
      if (agent.persona_text_open) return agent.persona_text_open;
      if (agent.persona_text_full) return agent.persona_text_full;
    } catch {
      // ignore and fallback
    }
    return agent.persona || agent.layers?.persona_text || '';
  };

  // Consistent with scripts/run_deliberation.py -> build_agent_system_instruction
  const buildAgentSystemInstruction = (sysPrompt) => (
    `你是一位模擬市民代理人，請以下列角色描述回應：\n${sysPrompt}\n\n` +
    '回應要求：強烈表達個人角色的意見，多講到自己的經驗或背景，可回應其他人有意思的論點，' +
    '講到自己的關注的面相，提出自己的想法；語氣簡單自然順暢，回應不列表，不用術語，不列重點，不超過300字。'
  );

  const systemPrompt = selected ? buildAgentSystemInstruction(resolveLayerPrompt(selected, layerKey)) : '';

  useEffect(() => {
    if (selected) {
      console.log('System prompt for selected agent:', systemPrompt);
    }
  }, [selected, systemPrompt]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    if (debateMode) {
      if (selectedAgents.length === 0) {
        alert('請選擇至少一位代理人 (最多 3 位)。');
        return;
      }
      setLoading(true);
      await runDebate(input);
      setInput("");
      setLoading(false);
      return;
    }

    if (!selected) return;
    setLoading(true);
    const userMsg = { role: 'user', content: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput("");
    // use the derived systemPrompt defined in component scope
    console.debug('Using system prompt:', systemPrompt);
    // Show typing indicator
    setMessages(msgs => [...msgs, { role: 'assistant', content: '正在輸入...' }]);
    const reply = await callGptReply(systemPrompt, [...messages, userMsg], model);
    setMessages(msgs => {
      // Remove typing indicator and add real reply
      const filtered = msgs.filter(m => m.content !== '正在輸入...');
      return [...filtered, { role: 'assistant', content: reply, nickname: selected.nickname }];
    });
    setLoading(false);
  };

  // Real GPT-5 API call
  // call GPT with a primary model and a single-model fallback if the response is empty
  async function callGptReply(system, msgs, model = 'gpt-5') {
    // const apiKey = import.meta.env.VITE_OPENAI_API_KEY; // Removed env var
    const url = "https://api.openai.com/v1/chat/completions";

    const doCall = async (mdl) => {
      const payload = {
        model: mdl,
        messages: [
          { role: "system", content: system },
          ...msgs.map(m => ({ role: m.role, content: m.content }))
        ]
      };
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          // try to surface a helpful error message
          let txt = await res.text();
          return `API 錯誤: ${res.status} ${res.statusText} - ${txt.slice(0, 200)}`;
        }
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || '';
        return (typeof content === 'string') ? content : JSON.stringify(content);
      } catch (e) {
        return `API 呼叫失敗: ${String(e)}`;
      }
    };

    // Primary call
    const primary = await doCall(model);
    if (primary && String(primary).trim()) return primary;

    // If primary returned empty or whitespace, attempt a single fallback to gpt-3.5-turbo
    if (model !== 'gpt-3.5-turbo') {
      const fallback = await doCall('gpt-3.5-turbo');
      if (fallback && String(fallback).trim()) return fallback;
    }

    // final fallback
    return primary || '無回覆';
  }

  // Compose system instruction per agent, consistent with run_deliberation.py (topic goes in user message, not system)
  const makeSystemPromptFor = (agent) => buildAgentSystemInstruction(resolveLayerPrompt(agent, layerKey));

  const runDebate = async (topic) => {
    if (!debateMode) return;
    setDebating(true);
    // Prepend the debate topic as a visible conversation item labeled '議題'
    setMessages(prev => [{ role: 'assistant', content: `${topic}`, nickname: '議題', isTopic: true }, ...prev]);
    const transcript = []; // {agentId,nickname,content,round}

    for (let round = 1; round <= 2; round++) {
      for (const agentId of selectedAgents) {
        const agent = agents.find(a => a.id === agentId);
        if (!agent) continue;
        const system = makeSystemPromptFor(agent);
        // Build context: debate topic + prior rounds
        const prior = transcript.map(t => `${t.nickname} (第${t.round}輪): ${t.content}`).join('\n');
        const userContent = `辯論主題：\n${topic}\n\n先前發言:\n${prior}\n\n（第${round}輪）請以角色身分自然回應，不超過300字。`;
        // show typing indicator for this agent
        setMessages(m => [...m, { role: 'assistant', content: '正在回應...', nickname: agent.nickname, agentId, round }]);
        const reply = await callGptReply(system, [{ role: 'user', content: userContent }], model);
        // replace the typing indicator with real reply
        setMessages(m => {
          const filtered = m.filter(x => !(x.content === '正在回應...' && x.nickname === agent.nickname && x.agentId === agentId));
          return [...filtered, { role: 'assistant', content: reply, nickname: agent.nickname, agentId, round }];
        });
        transcript.push({ agentId, nickname: agent.nickname, content: reply, round });
      }
    }

    // Moderator summary
    const moderatorSystem = (
      '你是一位中立的會議總結者。請閱讀下列各位代理人的發言，並以3行回應：\n' +
      "第一行以 'Disagreement:' 開頭，給出一項主要分歧；\n" +
      "第二行以 'Consensus:' 開頭，給出一項主要共識；\n" +
      "第三行以 'Solution:' 開頭，給出一項具體可行的解決方案。\n" +
      '每項中文不超過150字，不要用術語，用簡單自然的語言。'
    );
    const aggregated = transcript.map(t => `${t.nickname} (輪次 ${t.round}): ${t.content}`).join('\n\n');
    setMessages(m => [...m, { role: 'assistant', content: '正在產出總結（Moderator）...', nickname: 'Moderator' }]);
    const modReply = await callGptReply(moderatorSystem, [{ role: 'user', content: `以下為辯論紀錄：\n\n${aggregated}\n` }], model);
    setMessages(m => {
      // remove moderator typing indicator
      const filtered = m.filter(x => !(x.nickname === 'Moderator' && x.content.includes('正在產出')));
      return [...filtered, { role: 'assistant', content: modReply, nickname: 'Moderator', isModerator: true }];
    });

    setDebating(false);
  };

  return (
    <div className="main-flex-layout">
      <div className="sidebar">
        <div className="sidebar-scroll-area">
          <div className="sidebar-block">
            <label className="agent-label">OPENAI API KEY:</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-..."
              style={{ width: '100%', fontSize: '0.9rem', padding: '8px' }}
            />
          </div>

          <div className="sidebar-block">
            <label className="agent-label">Model:</label>
            <select 
              value={model} 
              onChange={e => setModel(e.target.value)}
              style={{ width: '100%', fontSize: '0.9rem', padding: '8px', marginTop: '4px' }}
            >
              <option value="gpt-4o">gpt-4o</option>
              <option value="gpt-5">gpt-5</option>
              <option value="gpt-5.1">gpt-5.1 (Recommended)</option>
              <option value="gpt-5.1-chat-latest">gpt-5.1-chat-latest</option>
            </select>
          </div>

          {!forcedMode && (
            <div className="sidebar-block">
              <label className="agent-label">模式：</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <label style={{ fontSize: '0.95em' }}><input type="checkbox" checked={debateMode} onChange={e => setDebateMode(e.target.checked)} /> 辯論模式</label>
              </div>
            </div>
          )}

          {!debateMode && (
            <div className="sidebar-block">
              <label className="agent-label">選擇代理人：</label>
              <div className="conversation-list">
                {agents.map(a => (
                  <button
                    key={a.id}
                    onClick={() => handleSelect(a.id)}
                    className={selected?.id === a.id ? 'conversation-item selected' : 'conversation-item'}
                  >
                    <div style={{ fontWeight: 600, color: selected?.id === a.id ? 'var(--accent-color)' : 'inherit', fontSize: '1.1rem' }}>{a.nickname}</div>
                    <div style={{ fontSize: '0.9em', color: 'var(--text-dim)', marginTop: '4px' }}>{formatMeta(a)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {debateMode && (
            <div style={{ width: '100%' }}>
              <label className="agent-label">選擇代理人參與：</label>
              <div className="conversation-list" style={{ marginBottom: '1.5rem' }}>
                {agents.map(a => {
                  const isSelected = selectedAgents.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => { toggleAgentSelection(a.id); setSelected(a); }}
                      disabled={!isSelected && selectedAgents.length >= 5}
                      className={isSelected ? 'conversation-item selected' : 'conversation-item'}
                      style={{ opacity: (!isSelected && selectedAgents.length >= 5) ? 0.5 : 1 }}
                    >
                      <div style={{ fontWeight: 600, color: isSelected ? 'var(--accent-color)' : 'inherit', fontSize: '1.1rem' }}>{a.nickname}</div>
                      <div style={{ fontSize: '0.9em', color: 'var(--text-dim)', marginTop: '2px' }}>{formatMeta(a)}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {selected && (
          <div className="persona-card-container">
            <div className="persona-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0 }}>{selected.nickname}</h3>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    id="aiAttitude" 
                    checked={useAiAttitude} 
                    onChange={e => setUseAiAttitude(e.target.checked)} 
                    style={{ marginRight: '6px' }}
                  />
                  <label htmlFor="aiAttitude" style={{ fontSize: '0.8rem', color: 'var(--text-dim)', cursor: 'pointer' }}>
                    AI Attitude
                  </label>
                </div>
              </div>
              <div style={{ fontSize: '0.9em', color: 'var(--text-dim)', marginBottom: 8 }}>{formatMeta(selected)}</div>
              <div className="persona-meta">{resolveLayerPrompt(selected, layerKey)}</div>
            </div>
          </div>
        )}
      </div>
      <div className="main-content">
        <div className="chat-area">
          <div className="chat-window">
            {messages.length === 0 && (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', flexDirection: 'column', textAlign: 'center', opacity: 0.7 }}>
                <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--accent-color)' }}>_</div>
                
                {!apiKey && (
                  <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid var(--accent-color)', borderRadius: '8px', color: 'var(--accent-color)', backgroundColor: 'rgba(224, 122, 95, 0.1)' }}>
                    <strong>Please enter your OpenAI API Key in the sidebar first.</strong><br/>
                    <small>請先在側邊欄輸入您的 OpenAI API Key。</small>
                  </div>
                )}

                {debateMode ? (
                  <div style={{ maxWidth: '600px', lineHeight: '1.6' }}>
                    <h3 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Debate Mode / 辯論模式</h3>
                    <ol style={{ textAlign: 'left', paddingLeft: '1.5rem', fontSize: '1.2rem' }}>
                      <li style={{ marginBottom: '0.8rem' }}>Select 2-5 agents from the sidebar.<br/><small style={{ fontSize: '0.9em', color: 'var(--text-dim)' }}>從側邊欄選擇 2-5 位代理人。</small></li>
                      <li style={{ marginBottom: '0.8rem' }}>Enter a debate topic below.<br/><small style={{ fontSize: '0.9em', color: 'var(--text-dim)' }}>在下方輸入辯論主題。</small></li>
                      <li>Click Send to start the debate (2 rounds by default).<br/><small style={{ fontSize: '0.9em', color: 'var(--text-dim)' }}>點擊送出開始辯論（預設為兩輪）。</small></li>
                    </ol>
                  </div>
                ) : (
                  <div style={{ maxWidth: '600px', lineHeight: '1.6' }}>
                    <h3 style={{ color: 'var(--text-color)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Chat Mode / 聊天模式</h3>
                    <ol style={{ textAlign: 'left', paddingLeft: '1.5rem', fontSize: '1.2rem' }}>
                      <li style={{ marginBottom: '0.8rem' }}>Select an agent from the sidebar.<br/><small style={{ fontSize: '0.9em', color: 'var(--text-dim)' }}>從側邊欄選擇一位代理人。</small></li>
                      <li style={{ marginBottom: '0.8rem' }}>Type your message below.<br/><small style={{ fontSize: '0.9em', color: 'var(--text-dim)' }}>在下方輸入您的訊息。</small></li>
                      <li>Start chatting!<br/><small style={{ fontSize: '0.9em', color: 'var(--text-dim)' }}>開始對話！</small></li>
                    </ol>
                  </div>
                )}
              </div>
            )}
            {messages.map((msg, i) => {
              const isUser = msg.role === 'user';
              let label = '代理人';
              if (isUser) label = '你';
              else if (msg.isModerator) label = 'Moderator';
              else if (msg.nickname) {
                // try to find agent metadata by agentId or nickname
                const agentObj = agents.find(a => a.id === msg.agentId || a.nickname === msg.nickname);
                const meta = agentObj ? formatMeta(agentObj) : '';
                label = msg.nickname + (msg.round ? `（第${msg.round}輪）` : '') + (meta ? ` · ${meta}` : '');
              }
              return (
                <div key={i} className={isUser ? 'user-msg' : (msg.isModerator ? 'moderator-msg' : 'agent-msg')}>
                  <span className="nickname-label">{label}</span>
                  <span className="msg-content">{msg.content}</span>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={!apiKey ? "請先輸入 API Key..." : (debateMode ? "請輸入辯論主題..." : (selected ? "請輸入訊息..." : "請先選擇代理人..."))}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              disabled={loading || !apiKey || (!debateMode && !selected)}
            />
            <button onClick={sendMessage} disabled={loading || !apiKey || (!debateMode && !selected)}>
              {loading ? '...' : '送出'}
            </button>
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
