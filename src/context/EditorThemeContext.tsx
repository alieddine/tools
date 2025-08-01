import React, { createContext, useContext } from "react";
import { useEditorTheme } from "@/helpers/useEditorTheme";
import type { ThemeType } from "@/lib/themes";

type EditorThemeContextType = {
  editorTheme: ThemeType | null;
  setEditorTheme: (theme: ThemeType) => void;
  options: ThemeType[];
};

const EditorThemeContext = createContext<EditorThemeContextType | undefined>(undefined);

export const EditorThemeProvider = ({ page, children }: { page: "json" | "xml"; children: React.ReactNode }) => {
  const { editorTheme, setEditorTheme, options } = useEditorTheme(page);
    
  return (
    <EditorThemeContext.Provider value={{ editorTheme, setEditorTheme, options }}>
      {children}
    </EditorThemeContext.Provider>
  );
};

export const useEditorThemeContext = () => {
  const context = useContext(EditorThemeContext);
  if (!context) {
    throw new Error("useEditorThemeContext must be used within an EditorThemeProvider");
  }
  return context;
};