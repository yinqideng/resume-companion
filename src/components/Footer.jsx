import { footer } from '../data/content'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-copyright">{footer.copyright}</p>
        <div className="footer-links">
          {footer.links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
