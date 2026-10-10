import Seo from '../components/Seo.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { contact, locations } from '../data/siteData.js'

export default function Contact() {
  const none = !contact.phone && !contact.whatsapp && !contact.email
  return (
    <>
      <Seo title="Contact Us" description="Contact Dr. Muhammad Umer Farooq." />
      <PageHeader title="Contact Us" />
      <section className="section">
        <div className="container grid grid-2">
          <div className="card">
            <h3>Get in Touch</h3>
            {none && <p className="muted">Contact details coming soon.</p>}
            {contact.phone && <p>📞 <a href={`tel:${contact.phone}`}>{contact.phone}</a></p>}
            {contact.whatsapp && <p>💬 <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a></p>}
            {contact.email && <p>✉️ <a href={`mailto:${contact.email}`}>{contact.email}</a></p>}
            {Object.entries(contact.social).filter(([, v]) => v).map(([k, v]) => (
              <p key={k}><a href={v} target="_blank" rel="noreferrer">{k}</a></p>
            ))}
          </div>
          <div className="card">
            <h3>Clinics</h3>
            {locations.map((l) => (
              <p key={l.id}><strong>{l.name}</strong><br /><span className="muted">{l.address || 'Address coming soon'}</span></p>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}