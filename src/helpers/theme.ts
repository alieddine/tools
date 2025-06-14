
import { useTheme } from  '../components/ui/theme-provider';
 

export const GetJsonTheme = () => {
    const { theme } = useTheme();
    if (theme === 'dark') {
        return 'monokai';
    } else if (theme === 'light') {
        return 'github';
    } else {
        return 'monokai';
    }
}