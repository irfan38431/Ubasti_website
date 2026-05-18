export interface AuditLabel {
  icon:  string;
  label: string;
}

const LABELS: Record<string, AuditLabel> = {
  // Appointments
  "APPOINTMENT.CREATE":         { icon: "📅", label: "New lounge booking created" },
  "APPOINTMENT.UPDATE":         { icon: "📅", label: "Lounge booking updated" },
  "APPOINTMENT.CANCEL":         { icon: "📅", label: "Lounge booking cancelled" },
  "APPOINTMENT.COMPLETE":       { icon: "📅", label: "Lounge visit completed" },
  // Grooming
  "GROOMING_BOOKING.CREATE":    { icon: "✂️", label: "New grooming booking created" },
  "GROOMING_BOOKING.UPDATE":    { icon: "✂️", label: "Grooming booking updated" },
  "GROOMING_BOOKING.CANCEL":    { icon: "✂️", label: "Grooming booking cancelled" },
  // Boarding
  "BOARDING_BOOKING.CREATE":    { icon: "🏠", label: "New boarding booking created" },
  "BOARDING_BOOKING.UPDATE":    { icon: "🏠", label: "Boarding booking updated" },
  "BOARDING_BOOKING.CANCEL":    { icon: "🏠", label: "Boarding booking cancelled" },
  // Kitties / Cats
  "KITTY.CREATE":               { icon: "🐱", label: "New cat profile added" },
  "KITTY.UPDATE":               { icon: "🐱", label: "Cat profile updated" },
  "KITTY.DELETE":               { icon: "🐱", label: "Cat profile removed" },
  // Adoptions
  "ADOPTION.CREATE":            { icon: "🏡", label: "Cat adoption recorded" },
  "ADOPTION.UPDATE":            { icon: "🏡", label: "Adoption record updated" },
  // Events
  "EVENT.CREATE":               { icon: "🎉", label: "New event published" },
  "EVENT.UPDATE":               { icon: "🎉", label: "Event updated" },
  "EVENT.DELETE":               { icon: "🎉", label: "Event removed" },
  "EVENT_REGISTRATION.CREATE":  { icon: "🎉", label: "Someone registered for an event" },
  "EVENT_REGISTRATION.CANCEL":  { icon: "🎉", label: "Event registration cancelled" },
  // Blog
  "BLOG_POST.CREATE":           { icon: "📝", label: "New blog post created" },
  "BLOG_POST.UPDATE":           { icon: "📝", label: "Blog post updated" },
  "BLOG_POST.DELETE":           { icon: "📝", label: "Blog post deleted" },
  "BLOG_POST.PUBLISH":          { icon: "📝", label: "Blog post published" },
  // Inquiries
  "INQUIRY.UPDATE":             { icon: "💬", label: "Party inquiry updated" },
  // Media
  "MEDIA.UPLOAD":               { icon: "🖼️", label: "Image uploaded" },
  "MEDIA.DELETE":               { icon: "🖼️", label: "Image deleted" },
  // Team
  "TEAM_MEMBER.CREATE":         { icon: "👥", label: "Team member added" },
  "TEAM_MEMBER.UPDATE":         { icon: "👥", label: "Team member updated" },
  "TEAM_MEMBER.DELETE":         { icon: "👥", label: "Team member removed" },
  // Settings
  "SETTINGS.UPDATE":            { icon: "⚙️", label: "Settings updated" },
  "GROOMING_SETTINGS.UPDATE":   { icon: "⚙️", label: "Grooming prices updated" },
  "COUNTERS.UPDATE":            { icon: "⚙️", label: "Impact counters updated" },
  // Auth
  "AUTH.LOGIN":                 { icon: "🔐", label: "Admin logged in" },
  "AUTH.LOGOUT":                { icon: "🔐", label: "Admin logged out" },
  // Subscribers
  "SUBSCRIBER.CREATE":          { icon: "📧", label: "New newsletter subscriber" },
  "NEWSLETTER.SEND":            { icon: "📧", label: "Newsletter sent to subscribers" },
};

export function getAuditLabel(action: string): AuditLabel {
  return LABELS[action] ?? { icon: "🔧", label: action.replace(/[._]/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) };
}

export function formatAuditTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now  = new Date();
  const diffMs   = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHrs  = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  const timeStr = date.toLocaleTimeString("en-MY", { hour: "numeric", minute: "2-digit", hour12: true });

  if (diffMins < 1)   return "Just now";
  if (diffMins < 60)  return `${diffMins} min ago`;
  if (diffHrs  < 6)   return `${diffHrs}h ago`;

  const isToday     = date.toDateString() === now.toDateString();
  const yesterday   = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday)     return `Today at ${timeStr}`;
  if (isYesterday) return `Yesterday at ${timeStr}`;
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-MY", { day: "numeric", month: "short" });
}
