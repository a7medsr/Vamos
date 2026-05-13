// Inline SVG icons — kept as functional components to keep JSX readable.

export const I = {
  Arrow: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  Video: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
  ),
  External: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h6v6M14 10l7-7M5 21h14a2 2 0 0 0 2-2v-6"/></svg>
  ),
  Copy: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14c-.3 0-.5.1-.7.2l-2.5 1.3c-1.7-.9-3.1-2.3-4-4l1.3-2.5c.1-.2.2-.5.2-.7 0-.3-.1-.5-.2-.7L9 4.2c-.3-.5-.8-.7-1.4-.7H4.5c-.8 0-1.5.7-1.5 1.5 0 8.3 6.7 15 15 15 .8 0 1.5-.7 1.5-1.5v-3.1c0-.6-.2-1.1-.7-1.4l-2.4-1.6c-.2-.1-.5-.2-.7-.2z"/></svg>
  ),
  WhatsApp: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.3A7.8 7.8 0 0 0 12 4a7.9 7.9 0 0 0-6.7 12L4 21l5.2-1.4a7.9 7.9 0 0 0 11.6-6.7c0-2.1-.8-4.1-2.3-5.6zM12 19.4c-1.3 0-2.5-.3-3.6-1l-.3-.2-2.7.7.7-2.7-.2-.3a6.6 6.6 0 1 1 6.1 3.5zm3.6-4.9c-.2-.1-1.2-.6-1.4-.6-.2-.1-.3-.1-.5.1l-.7.8c-.1.2-.2.2-.4.1a5.4 5.4 0 0 1-2.7-2.3c-.2-.4.2-.3.5-1 .1-.1 0-.2 0-.3 0-.1-.5-1.1-.6-1.5-.2-.4-.3-.3-.5-.4h-.4c-.1 0-.4 0-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.7 2.6 4.2 3.5 1.5.6 2 .7 2.7.6.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1 0-.1-.2-.2-.4-.3z"/></svg>
  ),
  Check: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Book: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
  Award: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  ),
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4z"/></svg>
  ),
  TikTok: () => (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 6.3a4.5 4.5 0 0 1-3-1.3 4.5 4.5 0 0 1-1.3-3h-3.4v12.4a2.5 2.5 0 1 1-2.5-2.5c.3 0 .5 0 .8.1V8.4a6 6 0 1 0 5.3 6V9.6a7.4 7.4 0 0 0 4.1 1.3V7.4z"/></svg>
  ),
}
