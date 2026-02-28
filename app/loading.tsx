export default function Loading() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="text-center relative">
        <div className="absolute -inset-8 bg-primary-500/10 blur-3xl rounded-full" />
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-6 shadow-lg shadow-primary-500/20" />
          <h2 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">
            Monroe <span className="text-primary-400">Resource</span> Hub
          </h2>
          <p className="text-slate-500 font-medium">
            Loading community resources...
          </p>
        </div>
      </div>
    </div>
  );
}
