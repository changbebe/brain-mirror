export default function DashboardPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
      <header>
        <h1 className="text-2xl font-bold text-zinc-900">brain-mirror</h1>
        <p className="text-sm text-zinc-500 mt-1">第二大腦唯讀儀表板</p>
      </header>

      {/* 區塊 1：今日焦點 */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-800 mb-4">今日焦點</h2>
        <div className="rounded-lg border border-zinc-200 p-6 text-sm text-zinc-400">
          載入中...
        </div>
      </section>

      {/* 區塊 2：進度地圖 */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-800 mb-4">進度地圖</h2>
        <div className="rounded-lg border border-zinc-200 p-6 text-sm text-zinc-400">
          載入中...
        </div>
      </section>

      {/* 區塊 3：靈感池 */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-800 mb-4">靈感池</h2>
        <div className="rounded-lg border border-zinc-200 p-6 text-sm text-zinc-400">
          載入中...
        </div>
      </section>

      {/* 區塊 4：AI 日誌 */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-800 mb-4">AI 日誌</h2>
        <div className="rounded-lg border border-zinc-200 p-6 text-sm text-zinc-400">
          載入中...
        </div>
      </section>
    </main>
  );
}
