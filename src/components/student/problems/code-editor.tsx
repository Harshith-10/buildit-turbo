"use client";

import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { customTheme } from "@/lib/codemirror-theme";
import CodeMirror from "@uiw/react-codemirror";
import { useCallback, useEffect, useState } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
  fontSize?: number;
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  theme = "dark",
  fontSize = 14,
}: CodeEditorProps) {
  const handleChange = useCallback(
    (val: string) => {
      onChange(val);
    },
    [onChange],
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getExtensions = () => {
    switch (language) {
      case "javascript":
        return [javascript({ jsx: true })];
      case "java":
        return [java()];
      case "python":
        return [python()];
      case "cpp":
      case "c":
        return [cpp()];
      case "rust":
        return [rust()];
      default:
        return [javascript({ jsx: true })];
    }
  };

  return (
    <div
      className={`h-full w-full overflow-hidden border bg-background ${theme === "dark" ? "dark" : ""}`}
    >
      <CodeMirror
        value={value}
        height="100%"
        theme={
          mounted ? (theme === "dark" ? customTheme : vscodeLight) : customTheme
        }
        extensions={getExtensions()}
        onChange={handleChange}
        className="h-full"
        style={{ fontSize: `${fontSize}px` }}
      />
    </div>
  );
}
