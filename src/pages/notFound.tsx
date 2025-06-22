function notFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <h1 className="text-9xl font-bold text-danger">404</h1>
      <p className="mt-4 text-xl text-text">Page Not Found</p>
      <p className="mt-2 text-sm text-text-secondary">The page you are looking for does not exist.</p>
    </div>
  )
}

export default notFound
