import Seo from '../components/Seo.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { faqs } from '../data/siteData.js'

export default function FAQs() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return (
    <>
      <Seo title="FAQs" description="Frequently asked questions." schema={schema} />
      <PageHeader title="FAQs" subtitle="Frequently asked questions" />
      <section className="section">
        <div className="container narrow">
          {faqs.map((f) => (
            <details className="faq" key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}