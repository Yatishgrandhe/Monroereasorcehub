export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="text-center relative">
        <div className="absolute -inset-8 bg-primary-500/10 blur-3xl rounded-full" />
        <div className="relative">
          <div className="w-12 h-12 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-black text-[var(--color-text)] tracking-tighter">
            Monroe <span className="text-primary-500">Resource</span> Hub
          </h2>
        </div>
      </div>
    </div>
  );
}
