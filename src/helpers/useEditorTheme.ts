import { useEffect, useState } from "react";
import { darkThemes, lightThemes } from "@/lib/themes";
import type { ThemeType } from "@/lib/themes";
import { useTheme } from "@/components/ui/theme-provider";
type PageType = "json" | "xml";
type Mode = "light" | "dark";

const getThemeKey = (page: PageType, mode: Mode) => `${page}_theme_${mode}`;

export function useEditorTheme(page: PageType) {
    const [editorTheme, setEditorTheme] = useState<ThemeType | null>(null);
    const { theme } = useTheme();
    useEffect(() => {
        const saved = localStorage.getItem(getThemeKey(page, theme));
        
        if (saved && (darkThemes.includes(saved as ThemeType) || lightThemes.includes(saved as ThemeType))) {
            setEditorTheme(saved as ThemeType);
        } else {
            setEditorTheme(theme === "dark" ? "cloud9_night" : "xcode");
        }
    }, [page, theme]);

    const updateTheme = (newTheme: ThemeType) => {
        // get page from url last / 
        const pageFromUrl = page ?? window.location.pathname.split("/").pop() as PageType;
        if (!pageFromUrl) {
            console.error("useEditorTheme: 'page' is required but was not provided.");
            return;
        }
        localStorage.setItem(getThemeKey(pageFromUrl, theme), newTheme);

        setEditorTheme(newTheme);
    };
    const options = theme === "dark" ? darkThemes : lightThemes;

    return { editorTheme, setEditorTheme: updateTheme, options };
}
