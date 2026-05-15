// ============================================================
//  VAMOS ACADEMY — CONFIG
//  All settings you need to change are in this one file.
// ============================================================

export const CONFIG = {
  // === Your WhatsApp number (for the floating button + direct chat link) ===
  whatsappNumber: '201029949035',

  // === Workshop details ===
  workshop: {
    date: '2026-05-15T20:00:00+02:00', // ISO format with Cairo timezone (+02:00)
    zoomUrl: 'https://us04web.zoom.us/j/71704485310?pwd=wmAJVKRHXAuz2l0k8wDkybfKXg8o5T.1',
    zoomDisplay: 'us04web.zoom.us/j/71704485310',
  },

  // === Background form submission ===
  // The form fires BOTH of these in parallel, so leads aren't lost if one fails.
  // Fill in whichever you set up. Leave the other empty.
  submission: {
    // --- OPTION A: WhatsApp via CallMeBot (free, sends to your WhatsApp) ---
    // Setup (one-time, 1 minute):
    //  1. Add this number to your WhatsApp contacts: +34 644 51 95 23
    //  2. Send it this exact message: I allow callmebot to send me messages
    //  3. Wait for the reply — it gives you an API key like "1234567"
    //  4. Paste the key below. Leave blank to disable.
    callMeBotApiKey: '5189369',

    // --- OPTION B: Email via Web3Forms (free, very reliable) ---
    // Setup (one-time, 30 seconds):
    //  1. Go to https://web3forms.com
    //  2. Enter your email — they send you an access key by email
    //  3. Paste the access key below. Leave blank to disable.
    web3FormsAccessKey: '', // <-- paste your Web3Forms access key here
  },

  // === Stats shown in the hero (edit freely) ===
  stats: {
    students: '+1500',
    rating: '4.9★',
    online: '100%',
    levels: 'A1→B1',
  },
}

// ─── Workshop date management (admin can override via localStorage) ───────────
const STORAGE_KEY = 'vamos_workshop_date'

export function getWorkshopDate() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return saved
  } catch {}
  return CONFIG.workshop.date
}

export function setWorkshopDate(isoDate) {
  try {
    localStorage.setItem(STORAGE_KEY, isoDate)
  } catch {}
}

const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
const MONTH_NAMES = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

export function getWorkshopInfo(isoDate) {
  const isoDate_ = isoDate || CONFIG.workshop.date
  const [datePart, timePart] = isoDate_.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hours, minutes] = timePart.split(':').map(Number)

  const dayName = DAY_NAMES[new Date(year, month - 1, day).getDay()]
  const monthName = MONTH_NAMES[month - 1]

  const period = hours >= 12 ? 'مساءً' : 'صباحاً'
  const h = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  const minStr = minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : ':00'

  return {
    isoDate: isoDate_,
    dateDisplay: `${dayName} ${day} ${monthName} ${year}`,
    dayName,
    dayNum: day,
    monthName,
    year,
    timeDisplay: `${h}${minStr} ${period}`,
    workshopLabel: `ورشة مجانية - ${day} ${monthName}`,
    workshopOptionLabel: `🎁 الورشة المجانية (${day} ${monthName})`,
  }
}
