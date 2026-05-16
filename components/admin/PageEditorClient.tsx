"use client";

import { useState, useCallback, useRef } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
  useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BlocksRenderer } from "@/lib/cms/blocks-renderer";
import { BlockSidePanel } from "./BlockSidePanel";
import type { AnyBlock } from "@/lib/cms/blocks";

interface Props {
  slug:          string;
  title:         string;
  initialBlocks: AnyBlock[];
  hasDraft:      boolean;
}

export function PageEditorClient({ slug, title, initialBlocks, hasDraft: initialHasDraft }: Props) {
  const [blocks,  setBlocks]  = useState<AnyBlock[]>(initialBlocks);
  const [saving,  setSaving]  = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasDraft, setHasDraft] = useState(initialHasDraft);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const autosave = useCallback((updated: AnyBlock[]) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaving("saving");
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/pages/${slug}`, {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ draftBlocks: updated }),
        });
        setSaving(res.ok ? "saved" : "error");
        if (res.ok) setHasDraft(true);
      } catch {
        setSaving("error");
      }
    }, 800);
  }, [slug]);

  function updateBlock(idx: number, updated: AnyBlock) {
    const next = blocks.map((b, i) => (i === idx ? updated : b));
    setBlocks(next);
    autosave(next);
  }

  function deleteBlock(idx: number) {
    const next = blocks.filter((_, i) => i !== idx);
    setBlocks(next);
    autosave(next);
    if (editingIdx === idx) setEditingIdx(null);
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const oldIdx = blocks.findIndex((_, i) => `block-${i}` === active.id);
      const newIdx = blocks.findIndex((_, i) => `block-${i}` === over.id);
      if (oldIdx !== -1 && newIdx !== -1) {
        const next = arrayMove(blocks, oldIdx, newIdx);
        setBlocks(next);
        autosave(next);
      }
    }
  }

  async function handlePublish() {
    setSaving("saving");
    const res = await fetch(`/api/admin/pages/${slug}/publish`, { method: "POST" });
    setSaving(res.ok ? "saved" : "error");
    if (res.ok) setHasDraft(false);
  }

  async function handleDiscard() {
    if (!confirm("Discard all draft changes?")) return;
    const res = await fetch(`/api/admin/pages/${slug}/discard`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setBlocks(data.blocks ?? []);
      setHasDraft(false);
      setSaving("idle");
    }
  }

  const saveLabel = saving === "saving" ? "Saving…" : saving === "saved" ? "Saved" : saving === "error" ? "Error saving" : hasDraft ? "Draft" : "No changes";

  return (
    <>
      {/* Top edit bar */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-5 h-12 text-sm"
        style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
      >
        <span className="font-semibold">{title} — Edit Mode</span>
        <div className="flex items-center gap-3">
          <span className="text-xs opacity-60">{saveLabel}</span>
          {hasDraft && (
            <button
              onClick={handleDiscard}
              className="px-3 py-1 rounded-full text-xs border"
              style={{ borderColor: "var(--ubasti-cream)", color: "var(--ubasti-cream)" }}
            >
              Discard
            </button>
          )}
          <button
            onClick={handlePublish}
            disabled={!hasDraft || saving === "saving"}
            className="px-4 py-1.5 rounded-full text-xs font-medium disabled:opacity-40"
            style={{ background: "var(--ubasti-blush)", color: "var(--ubasti-ink)" }}
          >
            Publish
          </button>
          <a href="?" className="text-xs opacity-60 hover:opacity-100">← Exit Edit</a>
        </div>
      </div>

      {/* Editable blocks */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((_, i) => `block-${i}`)} strategy={verticalListSortingStrategy}>
          {blocks.map((block, i) => (
            <SortableBlock
              key={`block-${i}`}
              id={`block-${i}`}
              block={block}
              idx={i}
              isEditing={editingIdx === i}
              onSelect={() => setEditingIdx(editingIdx === i ? null : i)}
              onDelete={() => deleteBlock(i)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Side panel for structured block editing */}
      {editingIdx !== null && blocks[editingIdx] && (
        <BlockSidePanel
          block={blocks[editingIdx]}
          onClose={() => setEditingIdx(null)}
          onUpdate={(updated) => updateBlock(editingIdx, updated)}
        />
      )}
    </>
  );
}

// ── Sortable block wrapper ─────────────────────────────────────────────────

interface SortableBlockProps {
  id:        string;
  block:     AnyBlock;
  idx:       number;
  isEditing: boolean;
  onSelect:  () => void;
  onDelete:  () => void;
}

function SortableBlock({ id, block, isEditing, onSelect, onDelete }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform:  CSS.Transform.toString(transform),
    transition,
    opacity:    isDragging ? 0.5 : 1,
    position:   "relative" as const,
    outline:    isEditing ? "2px solid var(--ubasti-mustard)" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Block controls overlay */}
      <div
        className="absolute top-2 right-2 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{ pointerEvents: "auto" }}
      >
        <div
          className="w-8 h-8 rounded flex items-center justify-center cursor-grab text-xs"
          style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
          {...attributes}
          {...listeners}
          title="Drag to reorder"
        >
          ⠿
        </div>
        <button
          onClick={onSelect}
          className="w-8 h-8 rounded flex items-center justify-center text-xs"
          style={{ background: "var(--ubasti-mustard)", color: "var(--ubasti-ink)" }}
          title="Edit block"
        >
          ✎
        </button>
        <button
          onClick={onDelete}
          className="w-8 h-8 rounded flex items-center justify-center text-xs"
          style={{ background: "var(--ubasti-danger)", color: "white" }}
          title="Delete block"
        >
          ✕
        </button>
      </div>

      {/* Rendered block */}
      <div className="group">
        <BlocksRenderer blocks={[block]} />
      </div>
    </div>
  );
}
