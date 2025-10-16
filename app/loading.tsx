export default function Loading() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-secondary-900 mb-2">
          Loading Monroe Resource Hub
        </h2>
        <p className="text-secondary-600">
          Please wait while we load the community resources...
        </p>
      </div>
    </div>
  );
}
