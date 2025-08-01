export type ThemeType =
  | 'github' | 'vibrant_ink' | 'chaos' | 'chrome' | 'cloud9_day' | 'cloud9_night'
  | 'cloud9_night_low_color' | 'cloud_editor' | 'cloud_editor_dark' | 'clouds'
  | 'clouds_midnight' | 'cobalt' | 'crimson_editor' | 'dawn' | 'dracula'
  | 'dreamweaver' | 'eclipse' | 'github_dark' | 'github_light_default' | 'gob'
  | 'gruvbox' | 'gruvbox_dark_hard' | 'gruvbox_light_hard' | 'idle_fingers'
  | 'iplastic' | 'katzenmilch' | 'kr_theme' | 'kuroir' | 'merbivore'
  | 'merbivore_soft' | 'mono_industrial' | 'monokai' | 'nord_dark'
  | 'one_dark' | 'pastel_on_dark' | 'solarized_dark' | 'solarized_light'
  | 'sqlserver' | 'terminal' | 'textmate' | 'tomorrow' | 'tomorrow_night'
  | 'tomorrow_night_blue' | 'tomorrow_night_bright' | 'tomorrow_night_eighties'
  | 'twilight' | 'xcode';


export const darkThemes: ThemeType[] = [
    'dracula', 'monokai', 'vibrant_ink', 'twilight', 'one_dark', 'github_dark',
    'gruvbox_dark_hard', 'nord_dark', 'solarized_dark', 'tomorrow_night',
    'tomorrow_night_blue', 'tomorrow_night_bright', 'tomorrow_night_eighties',
    'clouds_midnight', 'cloud9_night', 'cloud9_night_low_color', 'chaos',
    'merbivore', 'merbivore_soft', 'pastel_on_dark', 'terminal', 'mono_industrial'
  ];
  
  export const lightThemes: ThemeType[] = [
    'github', 'chrome', 'cloud9_day', 'cloud_editor', 'cloud_editor_dark',
    'crimson_editor', 'dawn', 'dreamweaver', 'eclipse', 'github_light_default',
    'gruvbox_light_hard', 'iplastic', 'katzenmilch', 'kuroir', 'solarized_light',
    'sqlserver', 'textmate', 'tomorrow', 'xcode', 'idle_fingers', 'gob'
  ];
  