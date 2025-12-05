"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { rust } from "@codemirror/lang-rust";
import { githubDark } from "@uiw/codemirror-theme-github";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
}: CodeEditorProps) {
  const handleChange = React.useCallback(
    (val: string) => {
      onChange(val);
    },
    [onChange],
  );

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
    <div className="h-full w-full overflow-hidden border bg-[#0d1117]">
      <CodeMirror
        value={value}
        height="100%"
        theme={githubDark}
        extensions={getExtensions()}
        onChange={handleChange}
        className="h-full text-sm"
      />
    </div>
  );
}
