export default function LoadingSpinner({ fullPage = false }) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <Spinner />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner />
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-3 border-gray-200 border-t-gold-500 rounded-full animate-spin"
        style={{ borderWidth: '3px' }} />
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  )
}
