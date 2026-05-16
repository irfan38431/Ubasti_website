import { EventEditor } from "@/components/admin/EventEditor";

interface Props { params: Promise<{ id: string }> }

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  return <EventEditor eventId={id} />;
}
