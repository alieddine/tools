
import { useTheme } from  '../components/ui/theme-provider';
 

export const GetJsonTheme = () => {
    const { theme } = useTheme();
    if (theme === 'dark') {
        return 'vibrant_ink';
    } else if (theme === 'light') {
        return 'github';
    } else {
        return 'vibrant_ink';
    }
}