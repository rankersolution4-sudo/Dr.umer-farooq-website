import Seo from '../components/Seo.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { gallery } from '../data/siteData.js'

export default function Gallery() {
  return (
    <>
      <Seo title="Gallery" description="Photos of the clinic and facilities." />
      <PageHeader title="Gallery" />
      <section className="section">
        <div className="container">
          {gallery.length === 0 ? (
            <p className="muted center">Photos coming soon.</p>
          ) : (
            <div className="grid grid-3">
              {gallery.map((g, i) => (
                <figure className="card gallery-item" key={i}>
                  <img src={g.src} alt={g.caption || 'Gallery'} loading="lazy" />
                  {g.caption && <figcaption>{g.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}