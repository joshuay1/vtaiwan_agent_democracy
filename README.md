# vTaiwan Agent Democracy (模擬市民大會)

This project is an experimental exploration by the vTaiwan community, creating a virtual space where AI agents—modeled after real participants' values and stances—can debate and collaborate.

## About / 關於

### Project Context / 專案背景

**English**
This project is an experimental exploration by the vTaiwan community, conducted in Sep-Oct 2025. It serves as a speculative inquiry rather than a formal deliberation process for high-stakes decisions.

In Taiwan, democratic deliberation often faces barriers of time, geography, and resources, frequently centering in major urban areas. This exclusion means that while deliberation is an ideal, many voices remain unheard due to structural constraints.

This experiment asks: Can AI agents, modeled after participants' values and stances, bridge this gap? By allowing users to create "Sim-like" agents to debate and collaborate in virtual spaces, we attempt to simulate the presence of those usually absent from the table.

However, this is not an endorsement of replacing human agency with automation. Instead, it is a critical examination of such a future. Democracy is a practice, not just an outcome.

As Audrey Tang said in the [Berlin Freedom Conference](https://sayit.archive.tw/2025-11-10-berlin-freedom-conference-the-role-of-a): *"Because if we delegate democracy and policy to chatbots for debate, that would be like sending our robots to the gym to lift the weights for us. I’m sure it’s very impressive. They can lift a lot. But our civic muscle will atrophy."*

**中文**
這個計畫是 vTaiwan 社群在 2025 年 9 月至 10 月進行的一項實驗性探索。這是一個推測性的嘗試，並不是要用來做重大決策的正式審議。

在台灣，民主審議常常受到時間、地點和資源的限制，而且大多集中在主要城市。這意味著，雖然審議是個理想，但很多聲音因為結構性的限制而無法被聽見。

這個實驗想問的是：模仿參與者價值觀與立場的 AI 代理人，能不能彌補這個落差？透過讓使用者建立像「模擬市民」般的代理人，在虛擬空間中辯論、協作，我們試著模擬那些通常缺席於談判桌上的聲音。

然而，這並不是要支持用自動化來取代人類的能動性，而是對這種未來的一種批判性檢視。民主是一種實踐，而不僅僅是結果。

正如唐鳳在[柏林自由論壇](https://sayit.archive.tw/2025-11-10-berlin-freedom-conference-the-role-of-a)所言：*「因為如果我們把民主和政策辯論授權給聊天機器人，那就好比派我們的機器人去健身房幫我們舉重。我相信那會非常令人印象深刻，它們可以舉起很重的重量。但我們的公民肌肉將會萎縮。」*

### Participants & Consent / 參與者與授權

**English**
Participants were fully aware of the context and gave full consent to set up their own agents for LLM and open data usage. Each participant received a fixed amount as compensation for their contribution to this experiment.

All collected data, including survey responses and generated persona profiles, is anonymized and released as open data. This ensures that while the agents reflect real values, they do not compromise the privacy of individuals. The data is strictly used for academic research, public deliberation experiments, and the development of civic technology.

**中文**
參與者完全了解本計畫背景，並同意建立自己的 AI 代理人供大型語言模型與開放資料使用。每位參與者皆獲得獎勵金，感謝他們對此實驗的貢獻。

所有收集的資料，包括問卷回應與生成的角色檔案，皆經過匿名化處理並以開放資料形式釋出。這確保了代理人雖反映真實價值觀，但不會洩漏個人隱私。這些資料僅用於學術研究、公共審議實驗以及公民科技的發展。

### How Personas are Built / 角色如何建立

**English**
These AI agents are built based on survey data provided by participants. Participants shared their values, stances, and issues of concern, which we transformed into AI "personas" to represent these voices in virtual discussions.

**中文**
這些 AI 代理人是基於參與者填寫的問卷資料建立的。參與者分享了他們的價值觀、立場和關注的議題，我們將這些資料轉化為 AI 的「人設」，讓它們能在虛擬討論中代表這些聲音。

### How to Use / 如何使用

**English**
*   **Chat:** Chat one-on-one with a single agent to deeply understand their perspective.
*   **Debate:** Select 2-5 agents to debate and observe the clash and interaction of different viewpoints.
*   **Referendum:** View binary voting results from agents on various issues.

**中文**
*   **Chat / 聊天:** 與單一代理人一對一對話，深入了解他們的觀點。
*   **Debate / 辯論:** 選擇 2-5 位代理人進行辯論，觀察不同觀點的碰撞與互動。
*   **Referendum / 公投:** 查看代理人針對各項議題的二元投票結果。

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd chatbot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in browser:**
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

## Usage

To use the Chat and Debate features, you will need an OpenAI API Key.
1.  Open the application in your browser.
2.  In the sidebar, enter your **OpenAI API Key**.
3.  Select an agent to chat or multiple agents to debate.

## Deployment

This project is configured for deployment to GitHub Pages.

```bash
npm run deploy
```

## Tech Stack

- React 19
- Vite
- OpenAI API

## License

[License Type]

