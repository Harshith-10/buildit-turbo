"use client";

import { Plate, usePlateEditor } from "platejs/react";
import { EditorKit } from "@/components/editor/editor-kit";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";
import { TooltipProvider } from "@/components/plate-ui/tooltip";

// Type for rich text editor value (plate-style)
// We use any here to allow flexibility with Plate's complex types,
// but in a real app you might want to import Value from platejs
type Value = any;

interface RichTextEditorProps {
  initialValue?: Value;
  onChange?: (value: Value) => void;
  readOnly?: boolean;
}

export function RichTextEditor({
  initialValue,
  onChange,
  readOnly = false,
}: RichTextEditorProps) {
  const editor = usePlateEditor({
    plugins: EditorKit,
    value: initialValue,
  });

  return (
    <TooltipProvider>
      <Plate
        editor={editor}
        onValueChange={({ value }) => {
          onChange?.(value);
        }}
        readOnly={readOnly}
      >
        <EditorContainer>
          <Editor variant="default" className="min-h-[200px]" />
        </EditorContainer>
      </Plate>
    </TooltipProvider>
  );
}
