import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { useEditorThemeContext } from "@/context/EditorThemeContext";
import type { ThemeType } from '@/lib/themes';

export function ThemeSelector() {
  const { editorTheme, setEditorTheme, options } = useEditorThemeContext();
  
  return (
    <div className=" text-text ">
      <Select  value={editorTheme || ""} onValueChange={(value) => {
        setEditorTheme(value as ThemeType)
        }}>
        <SelectTrigger className="w-[150px] rounded-md border-2 border-border bg-card text-text hover:bg-card hover:border-border focus:ring-0 focus:border-border">
          <SelectValue className="text-text" placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {options.map((t) => (
            <SelectItem key={t} value={t}>
              {t.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
