# DECISIONS.md — brain-mirror

## 2026-05-09

**決策 1**：前端框架選 Next.js 14+ App Router + TypeScript
- Why：標準配置、Vercel 原生支援、shadcn/ui 相容性最佳

**決策 2**：UI 用 Tailwind CSS + shadcn/ui
- Why：不花時間刻 UI，快速交付可看的 V1

**決策 3**：共用現有 Supabase 專案
- Why：資料已在那裡，不需要搬移，V1 只讀不寫

**決策 4**：認證用 Supabase Auth Magic Link
- Why：單人使用，不需要複雜的帳號系統

**決策 5**：V1 全部唯讀，不做任何寫入功能
- Why：防 scope creep，先讓儀表板跑起來再說

**決策 6**：agent_diary 表不存在時顯示佔位提示，不建表
- Why：建表是另一個任務，V1 不改 schema

## 2026-05-09（V1.5）

**決策 7**：V1.5 輕量微調定義確認
- 微調 = 看著畫面就能決定的動作（拖順序、加待辦、換分類）
- 思考類工作永遠在 claude.ai / Telegram，不進 Dashboard
- Why：防止 Dashboard 變成第二個 claude.ai，失去「鏡子」定位

**決策 8**：靈感池改為 topic 欄位分組顯示
- Why：讓拖拉換分類有明確的目標區域，UX 比平鋪 grid 更直觀
