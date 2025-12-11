"use client";

import { Code2 } from "lucide-react";
import { useState } from "react";
import { CodeEditor } from "@/components/student/problems/code-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CodeEditorSettings,
  type CodeEditorSettingsState,
} from "./code-editor-settings";

interface CodeEditorWrapperProps {
  starterCode: string;
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
}

export function CodeEditorWrapper({
  starterCode,
  value,
  onChange,
  language: externalLanguage,
  onLanguageChange,
}: CodeEditorWrapperProps) {
  const [internalCode, setInternalCode] = useState(starterCode);
  const [internalLanguage, setInternalLanguage] = useState("javascript");
  const [settings, setSettings] = useState<CodeEditorSettingsState>({
    fontSize: 14,
  });

  // Use controlled language if provided, otherwise use internal state
  const language = externalLanguage ?? internalLanguage;
  const handleLanguageChange = (newLanguage: string) => {
    setInternalLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  const handleCodeChange = (newCode: string) => {
    setInternalCode(newCode);
    onChange?.(newCode);
  };

  const currentCode = value !== undefined ? value : internalCode;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/20 shrink-0">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Code Editor
          </span>
        </div>
        <div className="flex items-center">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
            </SelectContent>
          </Select>
          <CodeEditorSettings
            settings={settings}
            onSettingsChange={setSettings}
          />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <CodeEditor
          value={currentCode}
          onChange={handleCodeChange}
          language={language}
          fontSize={settings.fontSize}
        />
      </div>
    </div>
  );
}
