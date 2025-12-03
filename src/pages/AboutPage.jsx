import React from 'react';

const Section = ({ title, english, chinese }) => (
  <section style={{ marginBottom: '3rem' }}>
    <h2 style={{ 
      borderBottom: '1px solid var(--border-color)', 
      paddingBottom: '0.5rem', 
      marginBottom: '1.5rem',
      fontSize: '1.5rem'
    }}>
      {title}
    </h2>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '2rem',
      alignItems: 'start'
    }}>
      <div style={{ paddingRight: '1rem', borderRight: '1px solid var(--border-color)' }}>
        <div style={{ lineHeight: '1.6', fontSize: '0.9rem' }}>{english}</div>
      </div>
      <div style={{ paddingLeft: '1rem' }}>
        <div style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>{chinese}</div>
      </div>
    </div>
  </section>
);

export default function AboutPage() {
  return (
    <div className="page-container" style={{ 
      padding: '3rem', 
      width: '100%', 
      overflowY: 'auto',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>About / 關於</h1>

      <Section 
        title="Project Context / 專案背景"
        english={
          <>
            <p>This project is an experimental exploration by the vTaiwan community, conducted in Sep-Oct 2025. It serves as a speculative inquiry rather than a formal deliberation process for high-stakes decisions.</p>
            <p>In Taiwan, democratic deliberation often faces barriers of time, geography, and resources, frequently centering in major urban areas. This exclusion means that while deliberation is an ideal, many voices remain unheard due to structural constraints.</p>
            <p>This experiment asks: Can AI agents, modeled after participants' values and stances, bridge this gap? By allowing users to create "Sim-like" agents to debate and collaborate in virtual spaces, we attempt to simulate the presence of those usually absent from the table.</p>
            <p>However, this is not an endorsement of replacing human agency with automation. Instead, it is a critical examination of such a future. Democracy is a practice, not just an outcome.</p>
            <p>As Audrey Tang said in the <a href="https://sayit.archive.tw/2025-11-10-berlin-freedom-conference-the-role-of-a" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)' }}>Berlin Freedom Conference</a>: <em>"Because if we delegate democracy and policy to chatbots for debate, that would be like sending our robots to the gym to lift the weights for us. I’m sure it’s very impressive. They can lift a lot. But our civic muscle will atrophy."</em></p>
          </>
        }
        chinese={
          <>
            <p>這個計畫是 vTaiwan 社群在 2025 年 9 月至 10 月進行的一項實驗性探索。這是一個推測性的嘗試，並不是要用來做重大決策的正式審議。</p>
            <p>在台灣，民主審議常常受到時間、地點和資源的限制，而且大多集中在主要城市。這意味著，雖然審議是個理想，但很多聲音因為結構性的限制而無法被聽見。</p>
            <p>這個實驗想問的是：模仿參與者價值觀與立場的 AI 代理人，能不能彌補這個落差？透過讓使用者建立像「模擬市民」般的代理人，在虛擬空間中辯論、協作，我們試著模擬那些通常缺席於談判桌上的聲音。</p>
            <p>然而，這並不是要支持用自動化來取代人類的決策，而是對這種未來的一種批判性檢視。民主是一種實踐，而不僅僅是結果。</p>
            <p>正如唐鳳在<a href="https://sayit.archive.tw/2025-11-10-berlin-freedom-conference-the-role-of-a" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)' }}>柏林自由論壇</a>所言：<em>「因為如果我們把民主和政策辯論授權給聊天機器人，那就好比派我們的機器人去健身房幫我們舉重。我相信那會非常令人印象深刻，它們可以舉起很重的重量。但我們的公民肌肉將會萎縮。」</em></p>
          </>
        }
      />

      <Section 
        title="Participants & Consent / 參與者與授權"
        english={
          <>
            <p>Participants were fully aware of the context and gave full consent to set up their own agents for LLM and open data usage.</p>
            <p>Each participant received a fixed amount as compensation for their contribution to this experiment.</p>
            <p>All collected data, including survey responses and generated persona profiles, is anonymized and released as open data. This ensures that while the agents reflect real values, they do not compromise the privacy of individuals. The data is strictly used for academic research, public deliberation experiments, and the development of civic technology.</p>
          </>
        }
        chinese={
          <>
            <p>參與者完全了解本計畫背景，並同意建立自己的 AI 代理人供大型語言模型與開放資料使用。每位參與者皆獲得獎勵金，感謝他們對此實驗的貢獻。</p>
            <p>所有收集的資料，包括問卷回應與生成的角色檔案，皆經過匿名化處理並以開放資料形式釋出。這確保了代理人雖反映真實價值觀，但不會洩漏個人隱私。這些資料僅用於學術研究、公共審議實驗以及公民科技的發展。</p>
          </>
        }
      />

      <Section 
        title="How Personas are Built / 角色如何建立"
        english={
          <p>These AI agents are built based on survey data provided by participants. Participants shared their values, stances, and issues of concern, which we transformed into AI "personas" to represent these voices in virtual discussions.</p>
        }
        chinese={
          <p>這些 AI 代理人是基於參與者填寫的問卷資料建立的。參與者分享了他們的價值觀、立場和關注的議題，我們將這些資料轉化為 AI 的「人設」，讓它們能在虛擬討論中代表這些聲音。</p>
        }
      />

      <Section 
        title="How to Use / 如何使用"
        english={
          <ul style={{ paddingLeft: '1.2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Chat:</strong> Chat one-on-one with a single agent to deeply understand their perspective.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Debate:</strong> Select 2-5 agents to debate and observe the clash and interaction of different viewpoints.
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Past:</strong> View past deliberation records. Specifically, we ran a session on the topic: <em>"How should social media platforms balance moderation efficiency and respect for cultural diversity when using AI for content moderation?"</em>
            </li>
          </ul>
        }
        chinese={
          <ul style={{ paddingLeft: '1.2rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Chat / 聊天:</strong> 與單一代理人一對一對話，深入了解他們的觀點。
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Debate / 辯論:</strong> 選擇 2-5 位代理人進行辯論，觀察不同觀點的碰撞與互動。
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Past / 紀錄:</strong> 查看過去的審議紀錄。特別是我們針對<em>「你認為社群平台在使用人工智慧審查內容時，應如何在審查效率與尊重文化多樣性之間取得平衡？」</em>這一主題進行的討論。
            </li>
          </ul>
        }
      />
    </div>
  );
}
