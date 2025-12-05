"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/student/problems/code-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code2 } from "lucide-react";

interface CodeEditorWrapperProps {
  starterCode: string;
}

export function CodeEditorWrapper({ starterCode }: CodeEditorWrapperProps) {
  const [code, setCode] = useState(starterCode);
  const [language, setLanguage] = useState("javascript");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/20 shrink-0">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Code Editor
          </span>
        </div>
        <Select value={language} onValueChange={setLanguage}>
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
      </div>
      <div className="flex-1 overflow-hidden">
        <CodeEditor value={code} onChange={setCode} language={language} />
      </div>
    </div>
  );
}
