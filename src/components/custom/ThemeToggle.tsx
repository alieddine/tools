import { Moon, Sun } from "lucide-react";
import { useTheme } from '../ui/theme-provider';

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};
    return (
        <button className='active:rotate-180 text-text duration-100 ease-in-out cursor-pointer' onClick={() => toggleTheme()}>
            {theme === 'dark' ?
                <Moon className="size-6" />
                :
                <Sun className="size-6" />}
        </button>
    );
}


export default ThemeToggle;