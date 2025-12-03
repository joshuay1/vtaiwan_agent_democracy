import { useState, useEffect } from 'react';
import '../App.css';

export default function ReferendumPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}referendum.csv`)
      .then(res => res.text())
      .then(text => {
        const lines = text.trim().split('\n');
        // Skip header and parse
        const parsed = lines.slice(1).map(line => {
          // Find the last comma to separate question and percentage
          // This handles cases where the question might contain commas (though unlikely in this dataset)
          const lastCommaIndex = line.lastIndexOf(',');
          if (lastCommaIndex === -1) return null;
          
          const question = line.substring(0, lastCommaIndex).trim();
          const yes_pct = parseFloat(line.substring(lastCommaIndex + 1));
          
          return { question, yes_pct };
        }).filter(item => item !== null);
        
        // Sort by percentage descending for better visualization
        parsed.sort((a, b) => b.yes_pct - a.yes_pct);
        
        setData(parsed);
      });
  }, []);

  return (
    <div className="main-flex-layout">
      <div className="sidebar">
        <div className="sidebar-scroll-area">
          <h1 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}>Referendum / 公投</h1>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '1rem' }}>
              This experiment involved asking each AI agent 14 specific Yes/No questions covering various public issues in Taiwan. 
              The agents were instructed to answer strictly "Yes" or "No" based on their persona's political stance, values, and life experiences.
              While not scientifically rigorous, this comparison may reveal slight divergences between the agents' political leanings and the general Taiwanese society.
            </p>
            <p style={{ marginBottom: '2rem' }}>
              本實驗向每位 AI 代理人提出了 14 個關於台灣公共議題的是非題。
              代理人被指示必須根據其角色的政治立場、價值觀和生活經驗，嚴格回答「是」或「否」。
              雖然不具科學嚴謹性，但由此可稍微看出代理人的政治傾向與整體台灣社會的差異。
            </p>
            <p style={{ fontSize: '0.9em', fontStyle: 'italic', opacity: 0.8 }}>
              * The chart displays the percentage of agents who voted "Yes".<br/>
              * 圖表顯示了針對每個問題投下「是」的代理人百分比。
            </p>
          </div>
        </div>
      </div>

      <div className="main-content" style={{ 
        padding: '3rem', 
        overflowY: 'auto'
      }}>
        <div className="chart-container" style={{ 
          width: '100%'
        }}>
            <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', textAlign: 'center' }}>Voting Results / 投票結果</h2>
            {data.map((item, index) => (
                <div key={index} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                        <span>{item.question}</span>
                        <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{item.yes_pct.toFixed(1)}% Yes</span>
                    </div>
                    <div style={{ 
                        width: '100%', 
                        height: '30px', 
                        background: 'rgba(255,255,255,0.1)', 
                        borderRadius: '15px', 
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <div style={{ 
                            width: `${item.yes_pct}%`, 
                            height: '100%', 
                            background: 'var(--accent-color)',
                            transition: 'width 1s ease-in-out',
                            borderRadius: '15px'
                        }} />
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
