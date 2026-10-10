import Seo from '../components/Seo.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { videos } from '../data/siteData.js'

export default function Videos() {
  return (
    <>
      <Seo title="Videos" description="Educational videos about neurology." />
      <PageHeader title="Videos" subtitle="Health awareness videos" />
      <section className="section">
        <div className="container">
          {videos.length === 0 ? (
            <p className="muted center">Videos coming soon.</p>
          ) : (
            <div className="grid grid-3">
              {videos.map((v) => (
                <div className="card" key={v.youtubeId}>
                  <div className="video-wrap">
                    <iframe src={`https://www.youtube.com/embed/${v.youtubeId}`} title={v.title} allowFullScreen loading="lazy" />
                  </div>
                  <h3>{v.title}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}