import { useEffect, useState } from 'react';
import { Moon, Sun } from "lucide-react";

function ThemeToggle() {
    useEffect(() => {
        if (localStorage.getItem('theme')) {
            setDark(localStorage.getItem('theme') == "dark" ? "light" : "dark");
        } else {
            setDark(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark');
        }
    }, []);

    const [dark, setDark] = useState("dark");

    const toggleTheme = () => {
        if (dark === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', dark);
        setDark(dark === 'dark' ? 'light' : 'dark');
    }
    return (
        <button className='active:rotate-180 text-text duration-100 ease-in-out cursor-pointer' onClick={() => toggleTheme()}>
            {dark === 'dark' ?
                <Moon className="size-6" />
                :
                <Sun className="size-6" />}
        </button>
    );
}


export default ThemeToggle;