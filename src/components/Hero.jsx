import { hero } from '../data/content'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-particles">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              '--delay': `${Math.random() * 20}s`,
              '--duration': `${15 + Math.random() * 10}s`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="hero-content">
        <div className="hero-status fade-in-up fade-in-up-delay-1">
          {hero.status}
        </div>
        <h1 className="hero-title fade-in-up fade-in-up-delay-2">
          {hero.title}
          <br />
          <span className="hero-highlight">{hero.subtitle}</span>
        </h1>
        <p className="hero-description fade-in-up fade-in-up-delay-3">
          {hero.description}
        </p>
      </div>
    </section>
  )
}
