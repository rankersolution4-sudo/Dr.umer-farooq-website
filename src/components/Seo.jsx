import { Helmet } from 'react-helmet-async'
import { doctor } from '../data/siteData.js'

export default function Seo({ title, description, schema }) {
  const fullTitle = title ? `${title} | ${doctor.name}` : `${doctor.name} | ${doctor.title}`
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  )
}