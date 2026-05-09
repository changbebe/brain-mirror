# brain-mirror BACKLOG

## 🧭 核心架構原則（永不改變）

Dashboard 功能分三層：

| 層級 | 操作類型 | 在哪裡做 |
|---|---|---|
| 看 | 瀏覽全局、確認狀態 | Dashboard（唯讀區） |
| 微調 | 拖拉順序、改分類、加一行待辦 | Dashboard（輕量編輯） |
| 思考 | 討論方向、分析問題、新增複雜案件 | claude.ai / Telegram |

**「思考」永遠不在 Dashboard 做。**
紅線不是「不能寫入」，而是「不在 Dashboard 做需要思考的事」。

### ⚠️ 永遠不做的事

- ❌ Dashboard 內嵌對話框（跟 AI 在 Dashboard 裡聊天）
- ❌ Dashboard 內加大型文字編輯器（修改 thoughts 正文）
- ❌ Dashboard 上的複雜新增表單（大型案件、複雜分類）
- ❌ 把「思考類」工作搬進 Dashboard

---

## V1.5：輕量微調功能（下一步）✅ 任務書已產出

- [x] 拖拉調整優先順序（weight / 排序）
- [x] 快速新增一行待辦（不需要 AI，直接寫進 Supabase）
- [x] 改分類（拖拉到不同 topic 區塊）
- [x] 所有微調操作直接呼叫 Supabase API，即時同步

---

## V1.5：claude.ai 自動歸檔

核心問題：怎麼讓 bebe 在 claude.ai 跟 Claude 討論完，結論自動寫進 Supabase？

候選方案（評估後選一）：
- [ ] 方案 A：Claude 在對話結尾主動呼叫 /save API
- [ ] 方案 B：手動指令「@save 這段討論」由 Claude 觸發 API
- [ ] Dashboard 加「最近從 claude.ai 自動歸檔」區塊

---

## V2：進度地圖升級

現在進度地圖用「筆記數量」當代理指標，需要換成真實專案進度：

- [ ] 新增 `projects` 表（專案名、狀態、總任務數、完成數）
- [ ] 把 V2.2 系統地圖（21個項目）匯入 `projects` 表
- [ ] 進度地圖改讀 `projects` 表，顯示真實進度條
- [ ] AI 可以直接更新 projects 表（討論完自動同步狀態）

---

## V2：Dashboard 智能化（仍然唯讀區）

- [ ] 「今日焦點」改成 AI 主動推薦（你昨天說想做 X，今天要不要繼續？）
- [ ] 進度地圖點擊某專案 → 子頁面看細節
- [ ] 異常偵測（某專案太久沒動 → 紅燈提示）
- [ ] 搜尋 / 過濾

---

## V3：跨 AI 統一

- [ ] GPT 對話也能歸檔到同一個 Supabase
- [ ] 統一對話歷史（不論用哪個 AI，記憶連續）
- [ ] 所有 AI 共用同一個 thoughts / artifacts 表
