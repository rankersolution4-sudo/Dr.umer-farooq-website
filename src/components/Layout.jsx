import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { doctor, contact, locations } from '../data/siteData.js'

const navLinks = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/conditions', 'Conditions'],
  ['/services', 'Services'],
  ['/locations', 'Locations'],
  ['/fees', 'Fees'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">🧠</span>
            <span>
              <strong>{doctor.name}</strong>
              <small>{doctor.title}</small>
            </span>
          </Link>
          <nav className={`nav ${open ? 'open' : ''}`}>
            {navLinks.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>
            ))}
            <Link to="/appointment" className="btn btn-primary nav-cta">Book Appointment</Link>
          </nav>
          <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h4>{doctor.name}</h4>
            <p>{doctor.title}</p>
            {contact.phone && <p>📞 {contact.phone}</p>}
            {contact.email && <p>✉️ {contact.email}</p>}
          </div>
          <div>
            <h4>Locations</h4>
            {locations.map((l) => <p key={l.id}>{l.name}</p>)}
          </div>
          <div>
            <h4>Quick Links</h4>
            <p><Link to="/appointment">Book Appointment</Link></p>
            <p><Link to="/video-consultation">Video Consultation</Link></p>
            <p><Link to="/ncs-emg-eeg">NCS / EMG / EEG</Link></p>
            <p><Link to="/videos">Videos</Link></p>
            <p><Link to="/gallery">Gallery</Link></p>
            <p><Link to="/faqs">FAQs</Link></p>
          </div>
        </div>
        <div className="container copyright">
          © {new Date().getFullYear()} {doctor.name}. All rights reserved.
        </div>
      </footer>

      {contact.whatsapp && (
        <a className="wa-float" href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp">💬</a>
      )}
    </>
  )
}