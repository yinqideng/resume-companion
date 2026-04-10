import { useEffect, useRef } from 'react'
import { about } from '../data/content'
import './About.css'

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.fade-in-up').forEach((el, i) => {
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
    <section className="about" id="about" ref={sectionRef}>
      <div className="about-container">
        <div className="about-left fade-in-up">
          <p className="about-intro">{about.intro}</p>

          <div className="about-item">
            <div className="about-item-label">{about.education.label}</div>
            <div className="about-item-content">{about.education.value}</div>
          </div>

          <div className="about-item">
            <div className="about-item-label">{about.certifications.label}</div>
            <div className="about-item-content">{about.certifications.value}</div>
          </div>
        </div>

        <div className="about-right">
          {about.cards.map((card, i) => (
            <div key={i} className="about-card fade-in-up glass-card">
              <div className="about-card-label">{card.label}</div>
              <div className="about-card-value">{card.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
