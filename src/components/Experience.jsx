import { useEffect, useRef } from 'react'
import { experiences } from '../data/content'
import './Experience.css'

export default function Experience() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.timeline-item').forEach((el, i) => {
              el.style.setProperty('--delay', `${i * 0.1}s`)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section className="experience" id="experience" ref={sectionRef}>
      <div className="experience-container">
        <h2 className="section-title fade-in-up">职业经历</h2>

        <div className="timeline">
          {experiences.map((exp) => (
            <div key={exp.id} className="timeline-item fade-in-up glass-card">
              <div className="timeline-marker">{exp.id}</div>
              <div className="timeline-content">
                <h3>{exp.title}</h3>
                <p className="timeline-company">{exp.company} · {exp.period}</p>
                {exp.description && (
                  <p className="timeline-description">{exp.description}</p>
                )}
                {exp.metrics && (
                  <div className="metrics-grid">
                    {exp.metrics.map((metric, i) => (
                      <div key={i} className="metric">
                        <div className="metric-value">{metric.value}</div>
                        <div className="metric-label">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
