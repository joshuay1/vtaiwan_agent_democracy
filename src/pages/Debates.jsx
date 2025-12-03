import { useMemo, useState } from 'react';
import '../App.css';
import transcriptData from '../assets/deliberations_你認為社群平台在使用人工智慧審查內容時_應如何在_審查效率_與_尊重文化多樣性_之間取得平衡_20251026_190008_20251026_205829.json';

function Debates() {
  const data = transcriptData;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const topicZh = '你認為社群平台在使用人工智慧審查內容時，應如何在審查效率與尊重文化多樣性之間取得平衡？';

  const currentGroup = useMemo(() => {
    if (!data) return null;
    const g = data[selectedIdx];
    if (!g) return null;
    const byId = Object.fromEntries((g.agents || []).map(a => [String(a.id), a]));
    return { ...g, byId };
  }, [data, selectedIdx]);

  return (
    <div className="debates-page main-flex-layout">
      <div className="sidebar">
        <div className="sidebar-scroll-area">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--accent-color)' }}>PAST_LOGS</h2>
          </div>

          <div className="sidebar-block">
            <label className="agent-label">TOPIC:</label>
            <div style={{ marginTop: 6, color: 'var(--text-color)', fontSize: '0.9em', lineHeight: '1.4' }}>{topicZh}</div>
          </div>

          <div className="sidebar-block">
            <label className="agent-label">NOTE:</label>
            <ul style={{ marginTop: 6, color: 'var(--text-color)', fontSize: '0.9em', lineHeight: '1.4', paddingLeft: '1.2rem', margin: '6px 0 0 0' }}>
              <li style={{ marginBottom: 4 }}>
                This session was run in October 2025.<br/>
                本次審議於 2025 年 10 月執行。
              </li>
              <li style={{ marginBottom: 4 }}>
                The grouping ensures people from four different sides of the spectrum are in each group.<br/>
                分組確保了來自光譜四個不同面向的人都在同一組中。
              </li>
              <li>
                The model used was gpt-5. It sounded a bit robotic; gpt-5.1 would have been better.<br/>
                使用的模型是 gpt-5。聽起來有點像機器人；gpt-5.1 會更好。
              </li>
            </ul>
          </div>

          {data && (
            <div className="sidebar-block">
              <label className="agent-label">AVAILABLE_LOGS:</label>
              <div className="conversation-list">
                {data.map((g, idx) => {
                  const names = (g.agents || []).map(a => a.nickname).slice(0, 5).join('、');
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedIdx(idx)}
                      className={idx === selectedIdx ? 'conversation-item selected' : 'conversation-item'}
                      title={`Group ${g.group}`}
                    >
                      <div style={{ fontWeight: 600, color: idx === selectedIdx ? 'var(--accent-color)' : 'inherit' }}>#{g.group} · {names}</div>
                      <div style={{ fontSize: '0.8em', color: 'var(--text-dim)' }}>{(g.transcript || []).length} messages</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="main-content">
        <div className="chat-area">
          <div className="chat-window">
            {!currentGroup && <div style={{ color: 'var(--text-dim)', padding: '2rem' }}>No conversation loaded.</div>}
            {currentGroup && (
              <>
                {(currentGroup.transcript || []).map((msg, i) => {
                  const a = currentGroup.byId && currentGroup.byId[String(msg.agent_id)];
                  const isModerator = msg.nickname === 'Moderator' || msg.agent_id === 'moderator' || msg.isModerator;
                  const meta = a ? [a.demographics?.age, a.demographics?.gender, a.demographics?.residence, a.demographics?.occupation].filter(Boolean).join(' · ') : '';
                  let label = msg.nickname || (a ? a.nickname : 'Agent');
                  if (msg.round) label += `（第${msg.round}輪）`;
                  if (meta) label += ` · ${meta}`;
                  return (
                    <div key={i} className={isModerator ? 'moderator-msg' : 'agent-msg'}>
                      <span className="nickname-label">{label}</span>
                      <span className="msg-content">{msg.content}</span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Debates;
