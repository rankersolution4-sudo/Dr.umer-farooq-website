import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { posts } from '../data/siteData.js'

export default function Blog() {
  return (
    <>
      <Seo title="Health Articles" description="Articles about neurology and health." />
      <PageHeader title="Blog / Health Articles" />
      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <p className="muted center">Articles coming soon.</p>
          ) : (
            <div className="grid grid-3">
              {posts.map((p) => (
                <article className="card" key={p.slug}>
                  {p.image && <img className="post-img" src={p.image} alt={p.title} loading="lazy" />}
                  <small className="muted">{p.date}</small>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <Link to={`/blog/${p.slug}`} className="link">Read more →</Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)
  if (!post) {
    return (
      <section className="section"><div className="container center">
        <p>Article not found.</p><Link to="/blog" className="btn btn-outline">Back</Link>
      </div></section>
    )
  }
  return (
    <>
      <Seo title={post.title} description={post.excerpt} />
      <PageHeader title={post.title} subtitle={post.date} />
      <section className="section">
        <div className="container narrow">
          {post.image && <img className="post-img" src={post.image} alt={post.title} />}
          {post.content.map((para, i) => <p key={i}>{para}</p>)}
          <Link to="/blog" className="link">← All articles</Link>
        </div>
      </section>
    </>
  )
}