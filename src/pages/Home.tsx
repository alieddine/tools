function Home() {
    return (
        <div className="flex flex-col text-text items-center justify-start">
            <h1 className="text-4xl font-bold">Welcome to My App</h1>
            <p className="mt-4 text-lg ">This is a simple React application with a custom navigation bar.</p>
            <p className="mt-2 text-sm ">Current theme: {localStorage.getItem('theme')}</p>
        </div>
    )
}

export default Home
