import type { ReactNode } from "react";

interface TiptapNode {
  type: string;
  content?: TiptapNode[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, string> }[];
  attrs?: Record<string, string | number | boolean>;
}

interface TiptapDoc {
  type: "doc";
  content?: TiptapNode[];
}

function renderMarks(text: string, marks: TiptapNode["marks"] = []): ReactNode {
  return marks.reduce<ReactNode>((node, mark) => {
    if (mark.type === "bold")   return <strong>{node}</strong>;
    if (mark.type === "italic") return <em>{node}</em>;
    if (mark.type === "underline") return <u>{node}</u>;
    if (mark.type === "link")   return <a href={mark.attrs?.href as string} target="_blank" rel="noopener noreferrer">{node}</a>;
    return node;
  }, text);
}

function renderNode(node: TiptapNode, idx: number): ReactNode {
  switch (node.type) {
    case "paragraph":
      return (
        <p key={idx} className="mb-4 leading-relaxed" style={{ color: "var(--ubasti-sage)" }}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </p>
      );
    case "heading": {
      const level = (node.attrs?.level as number) ?? 2;
      const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
      return (
        <Tag
          key={idx}
          className="mb-3 mt-8 leading-tight"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}
        >
          {node.content?.map((child, i) => renderNode(child, i))}
        </Tag>
      );
    }
    case "text":
      return <span key={idx}>{renderMarks(node.text ?? "", node.marks)}</span>;
    case "bulletList":
      return (
        <ul key={idx} className="list-disc pl-6 mb-4 space-y-1" style={{ color: "var(--ubasti-sage)" }}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={idx} className="list-decimal pl-6 mb-4 space-y-1" style={{ color: "var(--ubasti-sage)" }}>
          {node.content?.map((child, i) => renderNode(child, i))}
        </ol>
      );
    case "listItem":
      return <li key={idx}>{node.content?.map((child, i) => renderNode(child, i))}</li>;
    case "blockquote":
      return (
        <blockquote
          key={idx}
          className="border-l-4 pl-4 italic my-6"
          style={{ borderColor: "var(--ubasti-mustard)", color: "var(--ubasti-sage)" }}
        >
          {node.content?.map((child, i) => renderNode(child, i))}
        </blockquote>
      );
    case "hardBreak":
      return <br key={idx} />;
    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={idx}
          src={node.attrs?.src as string}
          alt={(node.attrs?.alt as string) ?? ""}
          className="rounded-xl my-6 w-full"
        />
      );
    default:
      return null;
  }
}

interface Props {
  content: TiptapDoc | Record<string, unknown> | null | undefined;
  className?: string;
}

export function TiptapRenderer({ content, className }: Props) {
  if (!content || typeof content !== "object") return null;
  const doc = content as TiptapDoc;
  return (
    <div className={className}>
      {doc.content?.map((node, i) => renderNode(node, i))}
    </div>
  );
}
