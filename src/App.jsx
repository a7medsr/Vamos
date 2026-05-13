import { useEffect, useRef, useState, useCallback } from 'react'
import { CONFIG } from './config.js'
import { COURSES, PACKAGE, CONVERSATION, TESTIMONIALS } from './data.js'
import { CourseCard } from './CourseCard.jsx'
import { ContactForm } from './ContactForm.jsx'
import { I } from './icons.jsx'

const WA_HREF =
  `https://wa.me/${CONFIG.whatsappNumber}?text=` +
  encodeURIComponent('السلام عليكم, محتاج معلومات عن كورسات الإسبانية')

// ============ COUNTDOWN HOOK ============
function useCountdown(targetDate) {
  const target = useRef(new Date(targetDate).getTime()).current
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, target - now)
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  const pad = (n) => String(n).padStart(2, '0')
  return { d: pad(d), h: pad(h), m: pad(m), s: pad(s), done: diff <= 0 }
}

// ============ REVEAL ON SCROLL ============
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  })
}

// ============ TOAST ============
function Toast({ msg, kind, show }) {
  return (
    <div className={`toast ${kind === 'err' ? 'err' : ''} ${show ? 'show' : ''}`}>
      {kind === 'err' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      ) : (
        <I.Check />
      )}
      <span>{msg}</span>
    </div>
  )
}

// ============================================================
//   MAIN APP
// ============================================================
export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  const [toast, setToast] = useState({ msg: '', kind: 'ok', show: false })
  const [preselectedCourse, setPreselectedCourse] = useState('')
  const cd = useCountdown(CONFIG.workshop.date)

  useReveal()

  const showToast = useCallback((msg, kind = 'ok') => {
    setToast({ msg, kind, show: true })
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000)
  }, [])

  const handleBook = useCallback((courseValue) => {
    setPreselectedCourse(courseValue)
    // Small timeout to let the form update before scroll
    setTimeout(() => {
      const el = document.getElementById('contact')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => {
        const nameInput = document.getElementById('f-name')
        if (nameInput) nameInput.focus({ preventScroll: true })
      }, 600)
    }, 60)
  }, [])

  const navClick = (id) => (e) => {
    e.preventDefault()
    setNavOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const copyZoom = () => {
    const url = CONFIG.workshop.zoomUrl
    const fallback = () => {
      const ta = document.createElement('textarea')
      ta.value = url
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(ta)
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(
        () => showToast('تم نسخ لينك الزوم!'),
        () => { fallback(); showToast('تم نسخ لينك الزوم!') }
      )
    } else {
      fallback()
      showToast('تم نسخ لينك الزوم!')
    }
  }

  return (
    <>
      {/* ========== ANNOUNCEMENT ========== */}
      <div className="announce">
        🎁 ورشة مجانية يوم <span>الجمعة 15 مايو 2026</span> —{' '}
        <a href="#workshop" onClick={navClick('workshop')}>سجّل دلوقتي ←</a>
      </div>

      {/* ========== NAV ========== */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="#" className="logo" aria-label="Vamos Academy" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            <div className="logo-mark"><span>V</span></div>
            <div className="logo-text">Va<em>mos</em></div>
          </a>
          <div className={`nav-links ${navOpen ? 'open' : ''}`}>
            <a href="#workshop" onClick={navClick('workshop')}>الورشة المجانية</a>
            <a href="#courses" onClick={navClick('courses')}>الكورسات</a>
            <a href="#why" onClick={navClick('why')}>ليه Vamos؟</a>
            <a href="#testimonials" onClick={navClick('testimonials')}>آراء الطلاب</a>
            <a href="#contact" className="nav-cta" onClick={navClick('contact')}>
              احجز مكانك <I.Arrow />
            </a>
          </div>
          <button className="menu-toggle" onClick={() => setNavOpen((v) => !v)} aria-label="Menu">
            <I.Menu />
          </button>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <header className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="eyebrow">أكاديمية متخصصة في تعليم الإسبانية</div>
              <h1>
                اتعلّم <span className="accent">الإسبانية</span><br />
                من الصفر للطلاقة مع <span className="es">¡Vamos!</span>
              </h1>
              <p className="lede">
                منهج <b>Aula Internacional Plus</b> العالمي، مدرّبين متخصصين، ودفعات صغيرة عشان كل طالب ياخد حقه.
                من أول حرف لحد ما تتكلم زي الإسبان فعلاً.
              </p>
              <div className="hero-cta">
                <a href="#courses" className="btn btn-primary" onClick={navClick('courses')}>
                  شوف كورساتنا <I.Arrow size={16} />
                </a>
                <a href="#workshop" className="btn btn-ghost" onClick={navClick('workshop')}>
                  ورشة مجانية 🎁
                </a>
              </div>
              <div className="trust">
                <div className="trust-item"><div><strong>{CONFIG.stats.students}</strong><small>طالب وطالبة</small></div></div>
                <div className="trust-item"><div><strong>{CONFIG.stats.rating}</strong><small>تقييم الطلاب</small></div></div>
                <div className="trust-item"><div><strong>{CONFIG.stats.online}</strong><small>أونلاين تفاعلي</small></div></div>
                <div className="trust-item"><div><strong>{CONFIG.stats.levels}</strong><small>رحلة كاملة</small></div></div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-deco top">¡Vamos!</div>
              <div className="hero-deco bot">Español</div>
              <div className="hero-card">
                <div className="hero-card-flag"><div /><div /><div /></div>
                <h3>المستويات المتاحة</h3>
                <p>اختار اللي يناسب مستواك دلوقتي</p>
                <div className="levels">
                  <a className="lvl-row" href="#course-a1" onClick={navClick('course-a1')}>
                    <div><div className="lvl">A1</div><div className="desc">المبتدئ — انطلاقتك في الإسبانية</div></div><span className="arr">←</span>
                  </a>
                  <a className="lvl-row" href="#course-a2" onClick={navClick('course-a2')}>
                    <div><div className="lvl">A2</div><div className="desc">حكاوي وانطلاق</div></div><span className="arr">←</span>
                  </a>
                  <a className="lvl-row" href="#course-b1" onClick={navClick('course-b1')}>
                    <div><div className="lvl">B1</div><div className="desc">الطلاقة والاستقلالية</div></div><span className="arr">←</span>
                  </a>
                  <a className="lvl-row" href="#course-pack" onClick={navClick('course-pack')}>
                    <div><div className="lvl" style={{ color: 'var(--gold)' }}>★ الباكدج</div><div className="desc">A1 + A2 + B1 — وفّر $85</div></div><span className="arr">←</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========== WORKSHOP ========== */}
      <section id="workshop" className="container workshop">
        <div className="workshop-card reveal">
          <div className="workshop-inner">
            <div>
              <span className="workshop-badge">🎁 FREE WORKSHOP</span>
              <h2>ورشة <em>مجانية</em> للتعريف بالإسبانية</h2>
              <p className="sub">
                ساعتين أونلاين على زوم نحكي فيها عن اللغة، النطق، خطة المذاكرة الذكية،
                وتطبيق عملي يخليك تتكلم من أول يوم.
              </p>

              <div className="workshop-meta">
                <div className="wmeta"><I.Calendar /><span>الجمعة <b>15 مايو 2026</b></span></div>
                <div className="wmeta"><I.Clock /><span><b>8:00 مساءً</b> بتوقيت القاهرة</span></div>
                <div className="wmeta"><I.Video /><span>أونلاين على <b>Zoom</b></span></div>
              </div>

              <div className="countdown">
                <div className="cd-cell"><div className="cd-num">{cd.d}</div><div className="cd-label">يوم</div></div>
                <div className="cd-cell"><div className="cd-num">{cd.h}</div><div className="cd-label">ساعة</div></div>
                <div className="cd-cell"><div className="cd-num">{cd.m}</div><div className="cd-label">دقيقة</div></div>
                <div className="cd-cell"><div className="cd-num">{cd.s}</div><div className="cd-label">ثانية</div></div>
              </div>

              <div className="zoom-box">
                <div className="zoom-box-icon"><I.Video /></div>
                <div className="zoom-box-text">
                  <b>لينك الزوم جاهز:</b>
                  <span>{CONFIG.workshop.zoomDisplay}</span>
                </div>
                <a
                  href={CONFIG.workshop.zoomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-zoom"
                >
                  ادخل الزوم <I.External />
                </a>
                <button className="btn-copy" onClick={copyZoom}>
                  <I.Copy /> نسخ
                </button>
              </div>
            </div>

            <div className="workshop-side">
              <h4>هتتعلم في الورشة:</h4>
              <ul>
                <li>مقدمة شاملة عن اللغة الإسبانية ونشأتها</li>
                <li>أساسيات النطق والمحادثة بلكنة صحيحة</li>
                <li>كيف تبدأ التحدث من أول كورس</li>
                <li>خطة المذاكرة الذكية لتعلّم أسرع</li>
                <li>تطبيق عملي وتدريبات لغوية تفاعلية</li>
              </ul>
              <button className="btn btn-gold" onClick={() => handleBook('ورشة مجانية - 15 مايو')}>
                سجّل في الورشة مجاناً <I.Arrow size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== COURSES ========== */}
      <section id="courses" className="section">
        <div className="container">
          <div className="sec-head reveal">
            <div className="sec-tag">Cursos de Español</div>
            <h2>كورساتنا في <em>الإسبانية</em></h2>
            <p>كل مستوى متصمّم بعناية عشان يوصلك للهدف بأقل وقت وأقل مجهود — من الصفر للطلاقة الكاملة.</p>
          </div>

          <div className="courses">
            {COURSES.map((c) => (
              <CourseCard key={c.id} course={c} onBook={handleBook} />
            ))}
          </div>

          <div className="package-row">
            <CourseCard course={PACKAGE} variant="featured" onBook={handleBook} />
            <CourseCard course={CONVERSATION} variant="conv" onBook={handleBook} />
          </div>
        </div>
      </section>

      {/* ========== WHY ========== */}
      <section id="why" className="section why">
        <div className="container">
          <div className="sec-head reveal">
            <div className="sec-tag">Why Vamos</div>
            <h2>ليه <em>Vamos</em> بالذات؟</h2>
            <p>لأن تجربة التعلّم بتفرق — وإحنا بنشتغل عشان فعلاً تتعلم.</p>
          </div>

          <div className="why-grid">
            <div className="why-card reveal">
              <div className="why-icon"><I.Book /></div>
              <h4>منهج معتمد عالمياً</h4>
              <p>Aula Internacional Plus — المنهج المعتمد في معاهد سرفانتس حول العالم.</p>
            </div>
            <div className="why-card reveal">
              <div className="why-icon"><I.Users /></div>
              <h4>دفعات صغيرة</h4>
              <p>عشان كل طالب ياخد حقه في الكلام والتفاعل والمتابعة الشخصية.</p>
            </div>
            <div className="why-card reveal">
              <div className="why-icon"><I.Star /></div>
              <h4>مدرّبين محترفين</h4>
              <p>متخصصين في تعليم اللغة، مش بس بيقروا من كتاب — عندهم خطة وتكنيك.</p>
            </div>
            <div className="why-card reveal">
              <div className="why-icon"><I.Award /></div>
              <h4>شهادة إتمام</h4>
              <p>شهادة معتمدة في نهاية كل مستوى لتوثيق تقدمك ورحلتك في تعلّم اللغة.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section id="testimonials" className="section">
        <div className="container">
          <div className="sec-head reveal">
            <div className="sec-tag">Opiniones</div>
            <h2>اللي بيقولوه <em>طلابنا</em></h2>
            <p>تقييمات حقيقية من طلابنا الكرام — لأن سمعتنا في كلامهم.</p>
          </div>

          <div className="test-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="test-card reveal" key={i}>
                <div className="test-head">
                  <div className="test-avatar">{t.avatar}</div>
                  <div className="test-info">
                    <h5>{t.name}</h5>
                    <span>{t.role}</span>
                  </div>
                </div>
                <div className="test-body">
                  <p>{t.text}</p>
                  <div className="test-foot">
                    <div className="stars">★★★★★</div>
                    <span>{t.foot}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CONTACT ========== */}
      <section id="contact" className="section contact">
        <div className="container">
          <div className="contact-grid reveal">
            <div className="contact-info">
              <h2>كلمنا <em>دلوقتي</em></h2>
              <p>سيب بياناتك في الفورم وفريقنا هيتواصل معاك على الواتساب لإكمال الحجز.</p>

              <div className="cinfo-list">
                <div className="cinfo-row">
                  <div className="cinfo-icon"><I.Phone /></div>
                  <div>
                    <b>واتساب مباشر</b>
                    <span className="ltr">+20 106 429 8604</span>
                  </div>
                </div>
                <div className="cinfo-row">
                  <div className="cinfo-icon"><I.Clock /></div>
                  <div>
                    <b>مواعيد العمل</b>
                    <span>يومياً من 10 صباحاً حتى 12 منتصف الليل</span>
                  </div>
                </div>
                <div className="cinfo-row">
                  <div className="cinfo-icon"><I.Video /></div>
                  <div>
                    <b>الكورسات</b>
                    <span>100% أونلاين على Zoom — تفاعلية</span>
                  </div>
                </div>
              </div>

              <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                <I.WhatsApp /> راسلنا مباشرة على واتساب
              </a>
            </div>

            <ContactForm
              preselectedCourse={preselectedCourse}
              onShowToast={showToast}
            />
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer>
        <div className="container">
          <div className="foot-grid">
            <div className="foot-brand">
              <h4>Vamos Academy</h4>
              <p>أكاديمية متخصصة في تعليم اللغات. نؤمن إن كل طالب يستحق تجربة تعليمية تفاعلية، ممتعة، وفعّالة.</p>
              <div className="socials">
                <a href="#" aria-label="Facebook"><I.Facebook /></a>
                <a href="#" aria-label="Instagram"><I.Instagram /></a>
                <a href={WA_HREF} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><I.WhatsApp /></a>
                <a href="#" aria-label="TikTok"><I.TikTok /></a>
              </div>
            </div>

            <div className="foot-col">
              <h5>اللغات</h5>
              <ul>
                <li><a>الإسبانية 🇪🇸</a></li>
                <li><a>قريباً: الفرنسية 🇫🇷</a></li>
                <li><a>قريباً: الإيطالية 🇮🇹</a></li>
                <li><a>قريباً: الألمانية 🇩🇪</a></li>
              </ul>
            </div>

            <div className="foot-col">
              <h5>الكورسات</h5>
              <ul>
                <li><a onClick={navClick('course-a1')}>كورس A1</a></li>
                <li><a onClick={navClick('course-a2')}>كورس A2</a></li>
                <li><a onClick={navClick('course-b1')}>كورس B1</a></li>
                <li><a onClick={navClick('course-pack')}>الباكدج الكاملة</a></li>
                <li><a onClick={navClick('course-conv')}>كورس المحادثة</a></li>
              </ul>
            </div>

            <div className="foot-col">
              <h5>تواصل</h5>
              <ul>
                <li><a href={WA_HREF} target="_blank" rel="noopener noreferrer">واتساب</a></li>
                <li><a onClick={navClick('contact')}>سجّل بياناتك</a></li>
                <li><a onClick={navClick('workshop')}>ورشة مجانية</a></li>
                <li><a onClick={navClick('testimonials')}>آراء الطلاب</a></li>
              </ul>
            </div>
          </div>

          <div className="foot-bottom">
            <span>© 2026 Vamos Languages Academy. جميع الحقوق محفوظة.</span>
            <span><em>¡Hablamos español!</em></span>
          </div>
        </div>
      </footer>

      {/* ========== FAB ========== */}
      <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="fab" aria-label="WhatsApp">
        <I.WhatsApp />
      </a>

      {/* ========== TOAST ========== */}
      <Toast msg={toast.msg} kind={toast.kind} show={toast.show} />
    </>
  )
}
