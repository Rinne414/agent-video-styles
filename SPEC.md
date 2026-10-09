# Agent Video Styles — 規格（2026-10-10）

## 目標

整理「用 AI agent 寫程式做影片」的風格，同時給兩種對象用：

- **Agent**：載入 skill 後知道每種風格具體怎麼做，從需求一路做到渲染驗證。
- **開發者**：瀏覽圖鑑，判斷哪種風格適合自己，也看得到做得好的創作者用什麼工具、怎麼做。

這份整理的特色在於**有觀點、經過驗證**：講清楚哪種需求該用哪種風格、為什麼、具體怎麼做，而且每一項都有實際做出來的範本佐證。目標不是收錄最多。

## 分兩個版本

| 版本 | 收錄內容 | 時程 |
|------|---------|------|
| **v1 精簡版** | 主流、有實證、可信度高的風格（core） | 現在做 |
| **v2 完整版** | 可信度較低或只在特定場景好用的風格（candidate） | 之後補 |

### v1 收錄標準（全部符合才收）

1. 至少有 **2 個彼此獨立的公開範例**（不同創作者或不同專案）
2. 能用程式碼工具重現（不依賴影片模型）
3. 光靠 skill，agent 就能做出可渲染的範本（見「範本即測試」）

研究過程中，沒達到標準的風格一律記到 `data/candidates.yaml`，註明證據、缺什麼，以及可能特別適合的場景。這份就是 v2 的待辦清單，研究成果不會浪費。

## 範圍決定

| 項目 | 決定 |
|------|------|
| 工具 | 只做程式碼驅動：Remotion、HyperFrames、Motion Canvas / Revideo、Manim、HTML + GSAP / CSS 錄製、Three.js 等。**不做影片模型生成**，也不做數位人 |
| 音訊 | TTS 配音加逐字字幕同步為選配，預設用免費的 Edge TTS；另外處理 BGM、音效與節拍對齊 |
| 分類主軸 | 視覺風格。用途、平台與比例、工具、難度都做成標籤 |
| 語言 | Skill 用英文；圖鑑網站與 README 用英文和簡體中文 |
| 工具層 | 不重寫工具教學。API 細節交給現成的工具 skill，本專案只寫各工具與風格相關的坑 |
| KOL | 每個風格附 1 到 3 個代表作作為出處，不另做名錄。研究範圍：中國、英語圈、GitHub 開源作者、台日韓 |
| 推進方式 | 一口氣做完 v1，中途不停 |
| 發布 | GitHub **private** repo |

## 原則

- 只用公開資料，付費 skill 不取得、不轉載，只從公開成品反推。
- 創作者的作品只附連結，不轉存他們的影片或截圖。
- 字型只用開源字型。
- README 註明 Remotion 授權：超過 3 人的公司商用需要購買授權。

## 範本即測試

每個範本都由一個子代理**只讀 skill**、照著製作並渲染出來：

- 做得出來，代表 skill 有效，產出就成為範本和圖鑑預覽。
- 做不出來或做得很差，就回頭修 skill 再重跑。

子代理要回報卡住的地方，這些回報是改進 skill 的主要依據。

## 交付物結構（暫定）

```
agent-video-styles/
├── README.md / README.zh-CN.md
├── LICENSE                     # MIT
├── data/
│   ├── styles/<id>.yaml        # v1 core 風格，單一資料來源
│   ├── candidates.yaml         # v2 待辦：低信心或小眾風格
│   └── tools.yaml              # 工具比較
├── skill/                      # 可獨立安裝的 skill
│   ├── SKILL.md                # 路由：理解需求 → 選風格 → 選工具 → 製作 → 渲染 → 驗證
│   ├── references/styles/<id>.md
│   ├── references/tools/<tool>.md
│   ├── references/audio-tts-captions.md
│   └── scripts/                # 渲染、抽幀檢查、TTS 加字幕
├── templates/<id>/             # 由 skill 產生並驗證過的範本（各自獨立）
├── previews/<id>.mp4 + .webp   # 壓縮過的短預覽
├── research/                   # 原始研究筆記與出處
└── site/                       # 從 data/ 產生的靜態圖鑑（英文 / 簡中）
```

每個風格的欄位：`id`、名稱（英文、簡中）、`tier`、視覺特徵、適合與不適合的用途、平台與比例、主要工具和替代工具（附理由）、難度、出處（創作者、平台、連結、地區、使用工具）、製作配方（場景結構、時長節奏、緩動、字體、配色、版面）、常見坑、範本路徑。

## v1 完成（2026-10-10）

- 已推送到 private repo：https://github.com/Rinne414/agent-video-styles
- 17 個範本都由子代理只靠 skill 做出來，實際渲染並逐幀檢查過；每份測試報告在 `research/06-template-reports/`，回報的缺口已分兩輪修進 skill。
- 程式碼由不同模型（Sonnet）審查：1 個 HIGH、5 個 MEDIUM、4 個 LOW，全部修正並重測。
- 圖鑑網站用 headless Chrome 測過：篩選、選擇器、細節頁、語言切換、手機版、鍵盤焦點、返回捲動位置。

### 後續（v2 與發布）

1. 從 `data/candidates.yaml` 挑風格補證據；`data/drafts/` 已有 editorial-swiss、map-geo-story 的配方草稿。
2. 修正後的 skill 尚未重新跑一次全部範本（第二輪修正之後沒有再測）；改版時建議抽幾個風格重跑當回歸測試。
3. 公開前：改 repo 可見性，部署 `site/dist`（GitHub Pages 或 Vercel）。
4. 未驗證項目：macOS / Linux 安裝指令、旁白與畫面的聽覺同步（只檢查了時間戳）。

## 過程紀錄

- v1 核心風格 17 種。研究後符合標準的有 19 種，其中 editorial-swiss 與 map-geo-story 的完整成片證據不足，已降級到 candidates，配方草稿保留在 `data/drafts/`。
- 範本改為**每個資料夾獨立**（`templates/<id>/`，各自的 lockfile），不使用 pnpm workspace：避免並行製作時搶寫同一個 lockfile，使用者也能直接複製單一資料夾。
- 網站、README 與 SKILL.md 中的風格表，全部由 `pnpm build` 從 `data/` 產生。

## 執行清單（v1）

1. **環境檢查**：Node、Python、FFmpeg、Chrome、Manim、Edge TTS、gh 登入狀態。
2. **研究**：分四路並行（工具與既有整理、英語圈、中國、台日韓與開源作者），原始筆記寫入 `research/`。
3. **工具盤點**：寫入 `data/tools.yaml` 和 `skill/references/tools/`。
4. **風格分類**：套用收錄標準，core 寫入 `data/styles/`，其餘寫入 `data/candidates.yaml`。
5. **Skill 撰寫**：`SKILL.md`、各風格與工具參考檔、腳本。
6. **範本即測試**：用 Sonnet 子代理逐一以 skill 製作範本並渲染，依回報修正 skill。
7. **預覽**：壓縮輸出到 `previews/`，並抽幀確認畫面。
8. **圖鑑網站**：從 `data/` 產生，提供風格瀏覽、標籤篩選、「哪種適合我」、英簡切換；用真實瀏覽器跑過並截圖。
9. **README 與授權**：英文與簡中 README、MIT LICENSE、Remotion 授權說明、出處致謝。
10. **審查**：由不同模型（Sonnet）審查 skill 與範本，修正發現的問題。
11. **發布**：`git init`，用 `gh` 建立 private repo `agent-video-styles` 並 push。網站先在本機執行。
