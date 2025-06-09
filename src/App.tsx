import './App.css'
import NavBar from './components/custom/NavBar'

function App() {

  const theme = localStorage.getItem('theme');
  if (theme === undefined || theme === null) {
    localStorage.setItem('theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.add(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  } else if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  }

  return (

    <div className=" w-full h-dvh bg-background space-y-1">
      <NavBar />

      <div className="flex  min-h-[93dvh] flex-col justify-between">
        <div className="flex flex-col text-text items-center justify-start">
          <h1 className="text-4xl font-bold">Welcome to My App</h1>
          <p className="mt-4 text-lg ">This is a simple React application with a custom navigation bar.</p>
          <p className="mt-2 text-sm ">Current theme: {localStorage.getItem('theme')}</p>
        </div>
        <footer className="bg-navbar-background flex flex-col justify-between  text-text text-center my-2">
          <div className='m-auto w-[90%] bg-border h-[0.5px] mb-2'/>
          <p>&copy; 2025 Tools. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
