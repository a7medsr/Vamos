import { useState } from 'react'

const PASSWORD = 'Admin1313'

const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
const MONTH_NAMES = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

function isoToInputs(isoDate) {
  const [datePart, timePart] = isoDate.split('T')
  return { date: datePart, time: timePart ? timePart.substring(0, 5) : '20:00' }
}

function buildPreview(date, time) {
  if (!date || !time) return ''
  const [year, month, day] = date.split('-').map(Number)
  const [hours, minutes] = time.split(':').map(Number)
  const dayName = DAY_NAMES[new Date(year, month - 1, day).getDay()]
  const monthName = MONTH_NAMES[month - 1]
  const period = hours >= 12 ? 'مساءً' : 'صباحاً'
  const h = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  const minStr = minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : ':00'
  return `${dayName} ${day} ${monthName} ${year} — ${h}${minStr} ${period} بتوقيت القاهرة`
}

export default function AdminPage({ onClose, currentDate }) {
  const [auth, setAuth] = useState(false)
  const [pw, setPw] = useState('')
  const [pwErr, setPwErr] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  const { date: initDate, time: initTime } = isoToInputs(currentDate || '2026-05-15T20:00:00+02:00')
  const [date, setDate] = useState(initDate)
  const [time, setTime] = useState(initTime)

  function login(e) {
    e.preventDefault()
    if (pw === PASSWORD) { setAuth(true); setPwErr(false) }
    else setPwErr(true)
  }

  async function save(e) {
    e.preventDefault()
    setSaveError('')
    setSaving(true)
    const isoDate = `${date}T${time}:00+02:00`

    try {
      const res = await fetch('/api/workshop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: PASSWORD, date: isoDate }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')
      setSaved(true)
    } catch (err) {
      setSaveError(err.message || 'حدث خطأ، حاول مرة أخرى')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.panel} dir="rtl">
        <div style={s.header}>
          <h2 style={s.title}>لوحة التحكم — Vamos</h2>
          <button style={s.closeBtn} onClick={onClose} aria-label="إغلاق">✕</button>
        </div>

        {!auth ? (
          <form onSubmit={login} style={s.form}>
            <label style={s.label}>كلمة المرور</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setPwErr(false) }}
              style={{ ...s.input, ...(pwErr ? s.inputErr : {}) }}
              placeholder="أدخل كلمة المرور"
              autoFocus
            />
            {pwErr && <p style={s.errMsg}>كلمة المرور غير صحيحة</p>}
            <button type="submit" style={s.btn}>دخول</button>
          </form>
        ) : saved ? (
          <div style={s.form}>
            <div style={s.successMsg}>✓ تم تحديث التاريخ بنجاح!</div>
            <p style={{ margin: 0, fontSize: 14, color: '#444', lineHeight: 1.8 }}>
              التاريخ الجديد محفوظ — كل المستخدمين هيشوفوه فوراً لما يفتحوا الصفحة.
            </p>
            <button style={{ ...s.btn, background: '#444' }} onClick={onClose}>إغلاق</button>
          </div>
        ) : (
          <form onSubmit={save} style={s.form}>
            <p style={s.hint}>تعديل تاريخ ووقت الورشة (بتوقيت القاهرة +02:00)</p>

            <label style={s.label}>التاريخ</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={s.input}
              required
            />

            <label style={s.label}>الوقت (بتوقيت القاهرة)</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={s.input}
              required
            />

            {date && time && (
              <div style={s.preview}>
                <span style={s.previewLabel}>المعاينة: </span>
                <strong>{buildPreview(date, time)}</strong>
              </div>
            )}

            {saveError && <div style={s.errBanner}>{saveError}</div>}

            <button type="submit" style={{ ...s.btn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
              {saving ? '⏳ جاري الحفظ...' : 'حفظ وتحديث الموقع'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999, backdropFilter: 'blur(4px)',
  },
  panel: {
    background: '#fff', borderRadius: 16, padding: '32px',
    width: '100%', maxWidth: 460, margin: '0 16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)', fontFamily: 'inherit',
    maxHeight: '90vh', overflowY: 'auto',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 24,
  },
  title: { margin: 0, fontSize: 20, fontWeight: 800, color: '#1a1a2e' },
  closeBtn: {
    background: 'none', border: 'none', fontSize: 20, cursor: 'pointer',
    color: '#888', padding: '4px 8px', borderRadius: 6, lineHeight: 1,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  label: { fontWeight: 700, fontSize: 14, color: '#333', marginBottom: -6 },
  input: {
    width: '100%', padding: '11px 14px', fontSize: 15,
    border: '1.5px solid #ddd', borderRadius: 8, outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  },
  inputErr: { borderColor: '#e53e3e' },
  errMsg: { margin: 0, color: '#e53e3e', fontSize: 13, fontWeight: 600 },
  btn: {
    marginTop: 4, padding: '12px', background: '#e63946', color: '#fff',
    border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700,
    cursor: 'pointer', width: '100%',
  },
  hint: { margin: 0, color: '#555', fontSize: 14 },
  preview: {
    background: '#f0f4ff', border: '1px solid #c7d2fe', borderRadius: 8,
    padding: '12px 14px', fontSize: 14, color: '#2d3a8c',
  },
  previewLabel: { color: '#666' },
  successMsg: {
    background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb',
    borderRadius: 8, padding: '16px', fontSize: 15, fontWeight: 700,
    textAlign: 'center',
  },
  errBanner: {
    background: '#fde8e8', color: '#c53030', border: '1px solid #f5c6cb',
    borderRadius: 8, padding: '12px 14px', fontSize: 13,
  },
}
