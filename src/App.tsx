import { StrictMode } from 'react';
import './App.css'
import AppRoutes from './AppRoutes';
import { ThemeProvider } from './components/ui/theme-provider';

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
    <ThemeProvider>
      <StrictMode>
      <AppRoutes />
      </StrictMode>
    </ThemeProvider>

  )
}

export default App
