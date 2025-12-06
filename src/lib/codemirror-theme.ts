import { tags as t } from "@lezer/highlight";
import { createTheme, type CreateThemeOptions } from "@uiw/codemirror-themes";

export const defaultSettingsCustom: CreateThemeOptions["settings"] = {
  background: "var(--background)",
  foreground: "var(--foreground)",
  caret: "var(--foreground)",
  selection: "var(--accent)",
  selectionMatch: "var(--accent)",
  gutterBackground: "var(--background)",
  gutterForeground: "var(--muted-foreground)",
  gutterBorder: "transparent",
  lineHighlight: "var(--muted)",
};

export const customHighlightStyle: CreateThemeOptions["styles"] = [
  { tag: t.comment, color: "#6272a4" },
  { tag: t.string, color: "#f1fa8c" },
  { tag: t.atom, color: "#bd93f9" },
  { tag: t.meta, color: "#f8f8f2" },
  { tag: [t.keyword, t.operator, t.tagName], color: "#ff79c6" },
  { tag: [t.function(t.propertyName), t.propertyName], color: "#66d9ef" },
  {
    tag: [
      t.definition(t.variableName),
      t.function(t.variableName),
      t.className,
      t.attributeName,
    ],
    color: "#50fa7b",
  },
  { tag: t.variableName, color: "#f8f8f2" },
  { tag: t.typeName, color: "#8be9fd" },
  { tag: t.number, color: "#bd93f9" },
];

export const customThemeInit = (options?: Partial<CreateThemeOptions>) => {
  const { theme = "dark", settings = {}, styles = [] } = options || {};
  return createTheme({
    theme: theme,
    settings: {
      ...defaultSettingsCustom,
      ...settings,
    },
    styles: [...customHighlightStyle, ...styles],
  });
};

export const customTheme = customThemeInit();
