import { useEffect, useRef } from 'react'
import { skills } from '../data/content'
import './Skills.css'

export default function Skills() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-tag').forEach((el, i) => {
              el.style.setProperty('--delay', `${i * 0.05}s`)
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
    <section className="skills" id="skills" ref={sectionRef}>
      <div className="skills-container">
        <h2 className="section-title fade-in-up">核心能力</h2>

        <div className="skills-groups">
          {[skills.ai, skills.business].map((group) => (
            <div key={group.label} className="skills-group fade-in-up">
              <h3 className="skills-group-title">{group.label}</h3>
              <div className="skills-list">
                {group.items.map((skill) => (
                  <div
                    key={skill}
                    className={`skill-tag skill-tag-${group.type}`}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
