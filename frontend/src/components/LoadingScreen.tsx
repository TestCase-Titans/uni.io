export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-destructive rounded-md flex items-center justify-center mx-auto mb-4">
          <span className="text-destructive-foreground font-bold text-lg">E</span>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}