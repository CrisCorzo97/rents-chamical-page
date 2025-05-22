export function TableSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="h-10 w-1/4 bg-muted rounded mb-4"></div>
      <div className="space-y-4">
        <div className="h-12 bg-muted rounded"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded"></div>
        ))}
      </div>
    </div>
  )
}