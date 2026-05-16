import { BlogEditor } from "@/components/admin/BlogEditor";

interface Props { params: Promise<{ id: string }> }

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  return <BlogEditor postId={id} />;
}
