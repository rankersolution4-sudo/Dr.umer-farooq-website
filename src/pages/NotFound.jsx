import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'

export default function NotFound() {
  return (
    <section className="section">
      <Seo title="Page Not Found" />
      <div className="container center">
        <h1>404</h1>
        <p>This page does not exist.</p>
        <Link to="/" className="btn btn-primary">Home</Link>
      </div>
    </section>
  )
}