"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { useEffect, useCallback } from "react";

interface Props {
  content: string;
  onChange: (json: string) => void;
  placeholder?: string;
}

const TOOLBAR = [
  { cmd: "bold",        label: "B",   style: { fontWeight: "bold" } },
  { cmd: "italic",      label: "I",   style: { fontStyle: "italic" } },
  { cmd: "underline",   label: "U",   style: { textDecoration: "underline" } },
  { cmd: "h2",          label: "H2",  style: {} },
  { cmd: "h3",          label: "H3",  style: {} },
  { cmd: "bulletList",  label: "• —", style: {} },
  { cmd: "orderedList", label: "1.",  style: {} },
  { cmd: "blockquote",  label: "❝",  style: {} },
  { cmd: "link",        label: "🔗",  style: {} },
];

export function RichTextEditor({ content, onChange, placeholder = "Write something…" }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink.configure({ openOnClick: false }),
      TiptapImage,
      Underline,
      Placeholder.configure({ placeholder }),
      Typography,
    ],
    content: content ? JSON.parse(content) : undefined,
    onUpdate: ({ editor: e }) => {
      onChange(JSON.stringify(e.getJSON()));
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[200px] focus:outline-none p-4",
      },
    },
  });

  // Sync external content changes
  useEffect(() => {
    if (!editor || !content) return;
    try {
      const parsed = JSON.parse(content);
      const current = editor.getJSON();
      if (JSON.stringify(current) !== JSON.stringify(parsed)) {
        editor.commands.setContent(parsed);
      }
    } catch {}
  }, [content, editor]);

  const handleCmd = useCallback((cmd: string) => {
    if (!editor) return;
    const chain = editor.chain().focus();
    switch (cmd) {
      case "bold":        chain.toggleBold().run(); break;
      case "italic":      chain.toggleItalic().run(); break;
      case "underline":   chain.toggleUnderline().run(); break;
      case "h2":          chain.toggleHeading({ level: 2 }).run(); break;
      case "h3":          chain.toggleHeading({ level: 3 }).run(); break;
      case "bulletList":  chain.toggleBulletList().run(); break;
      case "orderedList": chain.toggleOrderedList().run(); break;
      case "blockquote":  chain.toggleBlockquote().run(); break;
      case "link": {
        const url = window.prompt("URL:");
        if (url) chain.setLink({ href: url }).run();
        break;
      }
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--ubasti-sage-light)" }}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2" style={{ background: "var(--ubasti-paper)", borderBottom: "1px solid var(--ubasti-blush-light)" }}>
        {TOOLBAR.map(({ cmd, label, style }) => (
          <button
            key={cmd}
            type="button"
            onClick={() => handleCmd(cmd)}
            className="w-8 h-8 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--ubasti-blush-light)]"
            style={{ ...style, color: "var(--ubasti-ink)" }}
          >
            {label}
          </button>
        ))}
      </div>
      {/* Editor */}
      <div style={{ background: "var(--ubasti-white)" }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
