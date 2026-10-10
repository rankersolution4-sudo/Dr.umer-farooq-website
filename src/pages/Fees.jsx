import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { locations, videoConsultation, diagnosticsFacility, money } from '../data/siteData.js'

export default function Fees() {
  return (
    <>
      <Seo title="Consultation Fees" description="Fees for priority / online booking and video consultation." />
      <PageHeader title="Consultation Fees" subtitle="Fees may change, please confirm before your visit" />
      <section className="section">
        <div className="container grid grid-2">
          <div className="card">
            <h3>Priority / Online Booking</h3>
            <table className="table">
              <tbody>
                {locations.map((l) => (
                  <tr key={l.id}><td>{l.name}</td><td><strong>{money(l.priorityFee)}</strong></td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <h3>Online Video Consultation</h3>
            <table className="table">
              <tbody>
                <tr><td>Time: {videoConsultation.time}</td><td><strong>{money(videoConsultation.fee)}</strong></td></tr>
              </tbody>
            </table>
          </div>
          <div className="card">
            <h3>NCS / EMG / EEG</h3>
            <table className="table">
              <tbody>
                {Object.entries(diagnosticsFacility.fees).map(([k, v]) => (
                  <tr key={k}><td>{k}</td><td>{v ? <strong>{money(v)}</strong> : <span className="muted">Coming soon</span>}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="center mt"><Link to="/appointment" className="btn btn-primary">Book Appointment</Link></div>
      </section>
    </>
  )
}