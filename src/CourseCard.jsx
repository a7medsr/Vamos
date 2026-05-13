import { I } from './icons.jsx'

export function CourseCard({ course, variant, onBook }) {
  const cls = ['course']
  if (variant === 'featured') cls.push('featured')
  if (variant === 'conv') cls.push('conv')

  const saved = course.priceWas - course.priceNow

  return (
    <article className={`${cls.join(' ')} reveal`} id={`course-${course.id}`}>
      <div>
        <span className="course-tag">{course.tag}</span>
        <div className="course-level">{course.level}</div>
        <h3 className="course-title">{course.title}</h3>
        <p className="course-tagline">{course.tagline}</p>

        <div className="price-row">
          <div className="price-now">${course.priceNow}</div>
          <div className="price-was">${course.priceWas}</div>
          <div className="price-save">وفّر ${saved}</div>
        </div>

        <ul className="specs">
          {course.specs.map((s, i) => (
            <li className="spec" key={i}>
              <span className="spec-label">{s.label}</span>
              <span className="spec-val">{s.value}</span>
            </li>
          ))}
        </ul>

        {course.extraNote && <p className="skills-title">{course.extraNote}</p>}
        <p className="skills-title">ماذا ستتقن؟</p>
        <ul className="skills">
          {course.skills.map((sk, i) => (
            <li key={i}><b>{sk.b}</b>{sk.text}</li>
          ))}
        </ul>
      </div>
      <button
        className={variant === 'conv' ? 'btn btn-gold' : 'btn btn-primary'}
        onClick={() => onBook(`${course.title.replace(/[🇪🇸🗣️🚀💬]/g, '').trim()} - $${course.priceNow}`)}
      >
        {course.ctaLabel}
        <I.Arrow size={16} />
      </button>
    </article>
  )
}
