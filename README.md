# brain-mirror

第二大腦唯讀儀表板。從 Supabase 讀取資料，顯示今日焦點、進度地圖、靈感池、AI 日誌四個區塊。

## 本地啟動

```bash
# 1. 複製環境變數範本
cp .env.local.example .env.local
# 填入 NEXT_PUBLIC_SUPABASE_URL、NEXT_PUBLIC_SUPABASE_ANON_KEY、ALLOWED_EMAIL

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev
```

打開 http://localhost:3000 即可看到儀表板。

## 部署

連接 GitHub repo 到 Vercel，設定以下環境變數：

| 變數 | 說明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 專案 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `ALLOWED_EMAIL` | 允許登入的 email |

## 技術棧

- Next.js 14+ (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase（共用 second-brain-v2 資料庫）
- Vercel 部署
