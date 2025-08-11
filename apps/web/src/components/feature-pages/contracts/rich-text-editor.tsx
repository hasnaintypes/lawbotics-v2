"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Props for RichTextEditor component
 */
interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Rich text editor component using TipTap with basic formatting options.
 */
export function RichTextEditor({
  content,
  onChange,
  placeholder,
  disabled,
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: {},
        bold: {},
        italic: {},
        bulletList: {},
        orderedList: {},
        listItem: {},
      }),
    ],
    content,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          // Add 'tiptap-editor' for correct CSS targeting
          "tiptap-editor prose prose-sm max-w-none focus:outline-none min-h-[120px] p-4 rounded-xl border border-input bg-background",
          disabled && "opacity-50 cursor-not-allowed"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== content) {
        onChange(html);
      }
    },
    autofocus: false,
    immediatelyRender: false,
  });

  // Sync content when prop changes (but avoid infinite loops)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Use the correct TipTap API - setContent with options object
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  // Handle disabled state changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  if (!isMounted || !editor) return null;

  return (
    <div className="border rounded-2xl overflow-hidden bg-background relative">
      {/* Toolbar */}
      <div className="border-b bg-muted/30 p-2 flex items-center gap-1 flex-wrap">
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          variant={editor.isActive("bold") ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0 rounded-lg"
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0 rounded-lg"
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          variant={editor.isActive("bulletList") ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0 rounded-lg"
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          variant={editor.isActive("orderedList") ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0 rounded-lg"
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          variant={editor.isActive("blockquote") ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0 rounded-lg"
          aria-label="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-lg"
          disabled={!editor.can().undo()}
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-lg"
          disabled={!editor.can().redo()}
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
        {/* Placeholder */}
        {editor.isEmpty && placeholder && (
          <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none select-none z-10">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
