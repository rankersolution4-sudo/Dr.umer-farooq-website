import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { videoConsultation, money } from '../data/siteData.js'

export default function VideoConsultation() {
  return (
    <>
      <Seo title="Online Video Consultation" description="Consult a neurologist by video call from home." />
      <PageHeader title="Online Video Consultation" subtitle="Consult the doctor from the comfort of your home" />
      <section className="section">
        <div className="container narrow">
          <div className="card center">
            <div className="icon">🎥</div>
            <h3>Timing</h3>
            <p className="big">{videoConsultation.time}</p>
            <h3>Fee</h3>
            <p className="big">{money(videoConsultation.fee)}</p>
            <Link to="/appointment" className="btn btn-primary">Book Video Consultation</Link>
          </div>
        </div>
      </section>
    </>
  )
}