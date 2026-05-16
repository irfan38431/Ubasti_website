"use client";

import { useState } from "react";
import type { AnyBlock, TFaqBlock, TPricingTiersBlock, TRulesListBlock, TWaiverBlock } from "@/lib/cms/blocks";

interface Props {
  block:    AnyBlock;
  onClose:  () => void;
  onUpdate: (updated: AnyBlock) => void;
}

export function BlockSidePanel({ block, onClose, onUpdate }: Props) {
  return (
    <div
      className="fixed right-0 top-12 bottom-0 w-80 overflow-y-auto z-40 shadow-2xl"
      style={{ background: "var(--ubasti-white)", borderLeft: "1px solid var(--ubasti-blush-light)" }}
    >
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--ubasti-blush-light)" }}>
        <h3 className="font-semibold text-sm capitalize" style={{ color: "var(--ubasti-ink)" }}>
          Edit: {block.type.replace(/_/g, " ")}
        </h3>
        <button onClick={onClose} className="text-xl leading-none" style={{ color: "var(--ubasti-sage)" }}>×</button>
      </div>
      <div className="p-4">
        <BlockEditor block={block} onUpdate={onUpdate} />
      </div>
    </div>
  );
}

function BlockEditor({ block, onUpdate }: { block: AnyBlock; onUpdate: (b: AnyBlock) => void }) {
  switch (block.type) {
    case "hero":
      return <HeroEditor block={block} onUpdate={onUpdate} />;
    case "ideology":
      return <TextFieldsEditor block={block} onUpdate={onUpdate}
        fields={[
          { key: "eyebrow", label: "Eyebrow" },
          { key: "heading", label: "Heading", multiline: true },
          { key: "quote", label: "Quote (optional)" },
          { key: "body", label: "Body", multiline: true },
        ]} />;
    case "booking_cta":
      return <TextFieldsEditor block={block} onUpdate={onUpdate}
        fields={[
          { key: "heading", label: "Heading" },
          { key: "sub", label: "Sub-heading" },
          { key: "ctaText", label: "CTA text" },
          { key: "ctaHref", label: "CTA link" },
          { key: "note", label: "Note (optional)" },
        ]} />;
    case "story":
      return <TextFieldsEditor block={block} onUpdate={onUpdate}
        fields={[
          { key: "eyebrow", label: "Eyebrow" },
          { key: "heading", label: "Heading", multiline: true },
          { key: "body", label: "Body paragraph 1", multiline: true },
          { key: "body2", label: "Body paragraph 2 (optional)", multiline: true },
          { key: "imageUrl", label: "Image URL" },
          { key: "imageAlt", label: "Image alt text" },
        ]} />;
    case "hero_centered":
      return <TextFieldsEditor block={block} onUpdate={onUpdate}
        fields={[
          { key: "eyebrow", label: "Eyebrow" },
          { key: "heading", label: "Heading" },
          { key: "subtitle", label: "Subtitle (optional)" },
        ]} />;
    case "perfect_for":
      return <TextFieldsEditor block={block} onUpdate={onUpdate}
        fields={[
          { key: "eyebrow", label: "Eyebrow" },
          { key: "heading", label: "Heading", multiline: true },
          { key: "body", label: "Body", multiline: true },
          { key: "imageUrl", label: "Image URL" },
          { key: "ctaText", label: "CTA text" },
          { key: "ctaHref", label: "CTA link" },
        ]} />;
    case "faq":
      return <FaqEditor block={block} onUpdate={onUpdate} />;
    case "pricing_tiers":
      return <PricingTiersEditor block={block} onUpdate={onUpdate} />;
    case "rules_list":
      return <RulesListEditor block={block} onUpdate={onUpdate} />;
    case "values_strip":
      return <ValuesStripEditor block={block} onUpdate={onUpdate} />;
    case "waiver":
      return <WaiverEditor block={block} onUpdate={onUpdate} />;
    default:
      return <p className="text-sm" style={{ color: "var(--ubasti-sage)" }}>No editor for this block type.</p>;
  }
}

// ── Generic text fields editor ─────────────────────────────────────────────

interface FieldDef { key: string; label: string; multiline?: boolean }

function TextFieldsEditor({ block, onUpdate, fields }: {
  block: AnyBlock;
  onUpdate: (b: AnyBlock) => void;
  fields: FieldDef[];
}) {
  const [local, setLocal] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of fields) {
      init[f.key] = String((block as Record<string, unknown>)[f.key] ?? "");
    }
    return init;
  });

  function commit(key: string, val: string) {
    const next = { ...local, [key]: val };
    setLocal(next);
    onUpdate({ ...block, ...next } as AnyBlock);
  }

  return (
    <div className="flex flex-col gap-4">
      {fields.map((f) => (
        <div key={f.key} className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>{f.label}</label>
          {f.multiline ? (
            <textarea
              rows={3}
              value={local[f.key]}
              onChange={(e) => commit(f.key, e.target.value)}
              className="rounded-xl border px-3 py-2 text-sm resize-none outline-none"
              style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" }}
            />
          ) : (
            <input
              type="text"
              value={local[f.key]}
              onChange={(e) => commit(f.key, e.target.value)}
              className="rounded-xl border px-3 py-2 text-sm outline-none"
              style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Hero editor ────────────────────────────────────────────────────────────

function HeroEditor({ block, onUpdate }: { block: Extract<AnyBlock, { type: "hero" }>; onUpdate: (b: AnyBlock) => void }) {
  return (
    <TextFieldsEditor block={block} onUpdate={onUpdate} fields={[
      { key: "eyebrow", label: "Eyebrow" },
      { key: "heading", label: "Heading (use \\n for line break)", multiline: true },
      { key: "subheading", label: "Subheading", multiline: true },
      { key: "imageUrl", label: "Image URL" },
      { key: "ctaText", label: "Primary CTA text" },
      { key: "ctaHref", label: "Primary CTA link" },
      { key: "ctaSecondaryText", label: "Secondary CTA text (optional)" },
      { key: "ctaSecondaryHref", label: "Secondary CTA link (optional)" },
    ]} />
  );
}

// ── FAQ editor ─────────────────────────────────────────────────────────────

function FaqEditor({ block, onUpdate }: { block: TFaqBlock; onUpdate: (b: AnyBlock) => void }) {
  const [items, setItems] = useState(block.items);

  function updateItem(idx: number, key: "q" | "a", val: string) {
    const next = items.map((it, i) => i === idx ? { ...it, [key]: val } : it);
    setItems(next);
    onUpdate({ ...block, items: next });
  }

  function addItem() {
    const next = [...items, { q: "", a: "" }];
    setItems(next);
    onUpdate({ ...block, items: next });
  }

  function removeItem(idx: number) {
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    onUpdate({ ...block, items: next });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Heading</label>
        <input type="text" value={block.heading}
          onChange={(e) => onUpdate({ ...block, heading: e.target.value })}
          className="rounded-xl border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" }}
        />
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: "var(--ubasti-paper)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Q{i + 1}</span>
            <button onClick={() => removeItem(i)} className="text-xs" style={{ color: "var(--ubasti-danger)" }}>Remove</button>
          </div>
          <input type="text" value={item.q} placeholder="Question"
            onChange={(e) => updateItem(i, "q", e.target.value)}
            className="rounded-lg border px-2 py-1.5 text-sm outline-none"
            style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-white)", color: "var(--ubasti-ink)" }}
          />
          <textarea rows={2} value={item.a} placeholder="Answer"
            onChange={(e) => updateItem(i, "a", e.target.value)}
            className="rounded-lg border px-2 py-1.5 text-sm resize-none outline-none"
            style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-white)", color: "var(--ubasti-ink)" }}
          />
        </div>
      ))}
      <button onClick={addItem}
        className="h-9 rounded-full text-sm border"
        style={{ borderColor: "var(--ubasti-sage-light)", color: "var(--ubasti-sage)" }}>
        + Add Question
      </button>
    </div>
  );
}

// ── Pricing tiers editor ───────────────────────────────────────────────────

function PricingTiersEditor({ block, onUpdate }: { block: TPricingTiersBlock; onUpdate: (b: AnyBlock) => void }) {
  const [tiers, setTiers] = useState(block.tiers);

  function updateTier(idx: number, key: string, val: string) {
    const next = tiers.map((t, i) => i === idx ? { ...t, [key]: val } : t);
    setTiers(next);
    onUpdate({ ...block, tiers: next });
  }

  function updatePerks(idx: number, raw: string) {
    const perks = raw.split("\n").filter(Boolean);
    const next  = tiers.map((t, i) => i === idx ? { ...t, perks } : t);
    setTiers(next);
    onUpdate({ ...block, tiers: next });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Heading</label>
        <input type="text" value={block.heading}
          onChange={(e) => onUpdate({ ...block, heading: e.target.value })}
          className="rounded-xl border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" }}
        />
      </div>
      {tiers.map((tier, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: "var(--ubasti-paper)" }}>
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>{tier.label || `Tier ${i + 1}`}</span>
          {(["label", "sublabel", "price", "duration", "capacity"] as const).map((k) => (
            <input key={k} type="text" value={tier[k]} placeholder={k}
              onChange={(e) => updateTier(i, k, e.target.value)}
              className="rounded-lg border px-2 py-1.5 text-sm outline-none"
              style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-white)", color: "var(--ubasti-ink)" }}
            />
          ))}
          <textarea rows={4} value={tier.perks.join("\n")} placeholder="One perk per line"
            onChange={(e) => updatePerks(i, e.target.value)}
            className="rounded-lg border px-2 py-1.5 text-sm resize-none outline-none"
            style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-white)", color: "var(--ubasti-ink)" }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Rules list editor ──────────────────────────────────────────────────────

function RulesListEditor({ block, onUpdate }: { block: TRulesListBlock; onUpdate: (b: AnyBlock) => void }) {
  const raw = block.items.join("\n");
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Heading</label>
        <input type="text" value={block.heading}
          onChange={(e) => onUpdate({ ...block, heading: e.target.value })}
          className="rounded-xl border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ubasti-sage)" }}>Rules (one per line)</label>
        <textarea rows={8} value={raw}
          onChange={(e) => onUpdate({ ...block, items: e.target.value.split("\n").filter(Boolean) })}
          className="rounded-xl border px-3 py-2 text-sm resize-none outline-none"
          style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-paper)", color: "var(--ubasti-ink)" }}
        />
      </div>
    </div>
  );
}

// ── Values strip editor ────────────────────────────────────────────────────

function ValuesStripEditor({ block, onUpdate }: { block: Extract<AnyBlock, { type: "values_strip" }>; onUpdate: (b: AnyBlock) => void }) {
  const [values, setValues] = useState(block.values);

  function updateValue(idx: number, key: "title" | "body", val: string) {
    const next = values.map((v, i) => i === idx ? { ...v, [key]: val } : v);
    setValues(next);
    onUpdate({ ...block, values: next });
  }

  return (
    <div className="flex flex-col gap-3">
      {values.map((v, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: "var(--ubasti-paper)" }}>
          <input type="text" value={v.title} placeholder="Title"
            onChange={(e) => updateValue(i, "title", e.target.value)}
            className="rounded-lg border px-2 py-1.5 text-sm outline-none"
            style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-white)", color: "var(--ubasti-ink)" }}
          />
          <textarea rows={2} value={v.body} placeholder="Body"
            onChange={(e) => updateValue(i, "body", e.target.value)}
            className="rounded-lg border px-2 py-1.5 text-sm resize-none outline-none"
            style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-white)", color: "var(--ubasti-ink)" }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Waiver editor ──────────────────────────────────────────────────────────

function WaiverEditor({ block, onUpdate }: { block: TWaiverBlock; onUpdate: (b: AnyBlock) => void }) {
  const [sections, setSections] = useState(block.sections);

  function updateSection(idx: number, key: "heading" | "body", val: string) {
    const next = sections.map((s, i) => i === idx ? { ...s, [key]: val } : s);
    setSections(next);
    onUpdate({ ...block, sections: next });
  }

  return (
    <div className="flex flex-col gap-3">
      {sections.map((s, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: "var(--ubasti-paper)" }}>
          <input type="text" value={s.heading}
            onChange={(e) => updateSection(i, "heading", e.target.value)}
            className="rounded-lg border px-2 py-1.5 text-sm outline-none"
            style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-white)", color: "var(--ubasti-ink)" }}
          />
          <textarea rows={3} value={s.body}
            onChange={(e) => updateSection(i, "body", e.target.value)}
            className="rounded-lg border px-2 py-1.5 text-sm resize-none outline-none"
            style={{ borderColor: "var(--ubasti-sage-light)", background: "var(--ubasti-white)", color: "var(--ubasti-ink)" }}
          />
        </div>
      ))}
    </div>
  );
}
