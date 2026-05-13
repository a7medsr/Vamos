import { useState, useEffect } from 'react'
import { submitLead } from './submit.js'
import { CONFIG } from './config.js'
import { I } from './icons.jsx'

const COURSE_OPTIONS = [
  { value: 'ورشة مجانية - 15 مايو', label: '🎁 الورشة المجانية (15 مايو)' },
  { value: 'كورس A1 - $60', label: 'كورس A1 — $60' },
  { value: 'كورس A2 - $65', label: 'كورس A2 — $65' },
  { value: 'كورس B1 - $90', label: 'كورس B1 — $90' },
  { value: 'الباكدج الشاملة A1+A2+B1 - $190', label: '⭐ الباكدج الشاملة (A1+A2+B1) — $190' },
  { value: 'كورس المحادثة - $100', label: 'كورس المحادثة — $100' },
  { value: 'استفسار عام', label: 'استفسار عام' },
]

export function ContactForm({ preselectedCourse, onShowToast }) {
  const [form, setForm] = useState({
    name: '', phone: '', country: '', course: '', message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  // Update course field when user clicks a course's "احجز" button elsewhere
  useEffect(() => {
    if (preselectedCourse) {
      setForm((f) => ({ ...f, course: preselectedCourse }))
    }
  }, [preselectedCourse])

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.name.trim() || !form.phone.trim() || !form.course) {
      setError('من فضلك املأ الحقول المطلوبة (الاسم، الواتساب، الكورس).')
      return
    }

    setSubmitting(true)
    try {
      const result = await submitLead(form)
      if (result.success) {
        setSubmitted(true)
        onShowToast?.('تم إرسال طلبك بنجاح! ✓')
        setForm({ name: '', phone: '', country: '', course: '', message: '' })
      } else {
        setError('حدث خطأ — حاول مرة تانية أو راسلنا مباشرة على الواتساب.')
      }
    } catch (err) {
      console.error(err)
      setError('حدث خطأ — حاول مرة تانية أو راسلنا مباشرة على الواتساب.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-wrap">
      <h3>سجّل بياناتك</h3>
      <p className="formsub">رح يتواصل معاك فريقنا على الواتساب خلال ساعات قليلة</p>

      {submitted && (
        <div className="success-banner">
          <I.Check />
          <div>
            <div style={{ fontWeight: 800, marginBottom: 2 }}>تم استلام طلبك ✓</div>
            <div style={{ fontWeight: 500, fontSize: 13 }}>هنتواصل معاك على الواتساب قريباً.</div>
          </div>
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="f-name">الاسم <span>*</span></label>
          <input
            id="f-name" type="text" required
            placeholder="اكتب اسمك بالكامل"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="f-phone">رقم الواتساب <span>*</span></label>
            <input
              id="f-phone" type="tel" required
              placeholder="+20 1XX XXX XXXX"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              disabled={submitting}
              inputMode="tel"
            />
          </div>
          <div className="field">
            <label htmlFor="f-country">الدولة</label>
            <input
              id="f-country" type="text"
              placeholder="مصر / السعودية / ..."
              value={form.country}
              onChange={(e) => update('country', e.target.value)}
              disabled={submitting}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="f-course">الكورس اللي تهمك <span>*</span></label>
          <select
            id="f-course" required
            value={form.course}
            onChange={(e) => update('course', e.target.value)}
            disabled={submitting}
          >
            <option value="">-- اختار --</option>
            {COURSE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="f-message">رسالتك (اختياري)</label>
          <textarea
            id="f-message"
            placeholder="مستواك الحالي، أسئلتك، أو أي تفاصيل تحب تشاركها معانا"
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            disabled={submitting}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <span className="spinner" /> جاري الإرسال...
            </>
          ) : (
            <>
              <I.WhatsApp /> إرسال الطلب
            </>
          )}
        </button>
        <p className="form-note">
          بياناتك بتُرسل مباشرة لفريق Vamos. رح يكلمك على واتساب خلال ساعات قليلة.
        </p>
      </form>
    </div>
  )
}
