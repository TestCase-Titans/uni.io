export function TailwindTest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-white text-3xl">🚀</span>
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          Tailwind is Working!
        </h1>
        <p className="text-gray-600 mb-6">
          If you see the rocket bouncing and the gradient background, then TailwindCSS is installed
          <span className="text-indigo-600 font-semibold"> correctly </span>
          in your project.
        </p>
        <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md transition transform hover:scale-105">
          Test Button
        </button>
      </div>
    </div>
  )
}
