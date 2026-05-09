# STATUS.md — brain-mirror

**最後更新**：2026-05-09
**狀態**：V1.5 完成，線上運行中

## 開發進度

| 階段 | 狀態 | 備註 |
|------|------|------|
| 階段 1：骨架 + 部署 | ✅ | brain-mirror.vercel.app |
| 階段 2：Supabase Auth | ✅ | 密碼登入 |
| 階段 3：四區塊資料 | ✅ | 真實 Supabase 資料 |
| 階段 4：樣式收斂 | ✅ | 白卡片 + 統一 empty state |
| V1.5A：拖拉排序 | ✅ | 今日焦點，sort_order 即時同步 |
| V1.5B：快速新增待辦 | ✅ | 今日焦點底部，Enter 送出 |
| V1.5C：改分類拖拉 | ✅ | 靈感池跨 topic 欄拖拉 |

## 環境

- Next.js 14+ (App Router)
- TypeScript + Tailwind CSS + shadcn/ui
- Supabase（共用 second-brain-v2 的同一個專案）
- Vercel 部署

## 需要手動執行

- [ ] Vercel 連接 GitHub repo `brain-mirror`
- [ ] 設定環境變數（見 .env.local.example）
- [ ] 確認 Supabase RLS 允許登入用戶讀取四張表
