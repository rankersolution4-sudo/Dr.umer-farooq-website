import { useState } from 'react'
import Seo from '../components/Seo.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { locations, videoConsultation, contact, money } from '../data/siteData.js'

const initial = { name: '', phone: '', type: 'priority', location: locations[0].id, date: '', note: '' }

export default function Appointment() {
  const [f, setF] = useState(initial)
  const [notice, setNotice] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const loc = locations.find((l) => l.id === f.location)
  const fee = f.type === 'priority' ? money(loc.priorityFee) : f.type === 'video' ? money(videoConsultation.fee) : null
  const typeLabel = { regular: 'Regular Appointment', priority: 'Priority Appointment', video: 'Online Video Consultation' }[f.type]

  const submit = (e) => {
    e.preventDefault()
    const text =
      `Appointment Request\nName: ${f.name}\nPhone: ${f.phone}\nType: ${typeLabel}\n` +
      (f.type !== 'video' ? `Location: ${loc.name}\n` : `Timing: ${videoConsultation.time}\n`) +
      `Preferred Date: ${f.date}\n` + (fee ? `Fee: ${fee}\n` : '') + (f.note ? `Note: ${f.note}` : '')
    if (contact.whatsapp) {
      window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`, '_blank')
      setNotice('WhatsApp has opened. Please send the message to complete your request.')
    } else {
      setNotice('Online booking is not active yet (contact number not added). Please contact the clinic directly.')
    }
  }

  return (
    <>
      <Seo title="Book Appointment" description="Book a regular, priority or video consultation appointment online." />
      <PageHeader title="Book Appointment" subtitle="Fill in the form and your request will be sent via WhatsApp" />
      <section className="section">
        <div className="container narrow">
          <form className="card form" onSubmit={submit}>
            <label>Patient name
              <input className="input" required value={f.name} onChange={set('name')} />
            </label>
            <label>Phone / WhatsApp
              <input className="input" required type="tel" value={f.phone} onChange={set('phone')} />
            </label>
            <label>Appointment type
              <select className="input" value={f.type} onChange={set('type')}>
                <option value="priority">Priority Appointment</option>
                <option value="regular">Regular Appointment</option>
                <option value="video">Online Video Consultation</option>
              </select>
            </label>
            {f.type !== 'video' ? (
              <label>Location
                <select className="input" value={f.location} onChange={set('location')}>
                  {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </label>
            ) : (
              <p className="muted">Video consultation timing: {videoConsultation.time}</p>
            )}
            <label>Preferred date
              <input className="input" required type="date" value={f.date} onChange={set('date')} />
            </label>
            <label>Brief problem (optional)
              <textarea className="input" rows="3" value={f.note} onChange={set('note')} />
            </label>
            <p className="fee">{fee ? <>Fee: <strong>{fee}</strong></> : 'Please confirm the regular appointment fee with the clinic.'}</p>
            <button className="btn btn-primary" type="submit">Send Request</button>
            {notice && <p className="notice">{notice}</p>}
          </form>
        </div>
      </section>
    </>
  )
}