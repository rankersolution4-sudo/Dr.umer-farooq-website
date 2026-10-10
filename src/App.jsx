import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Conditions from './pages/Conditions.jsx'
import Services from './pages/Services.jsx'
import Locations from './pages/Locations.jsx'
import Fees from './pages/Fees.jsx'
import Appointment from './pages/Appointment.jsx'
import VideoConsultation from './pages/VideoConsultation.jsx'
import Diagnostics from './pages/Diagnostics.jsx'
import Videos from './pages/Videos.jsx'
import Gallery from './pages/Gallery.jsx'
import Blog, { BlogPost } from './pages/Blog.jsx'
import Contact from './pages/Contact.jsx'
import FAQs from './pages/FAQs.jsx'
import NotFound from './pages/NotFound.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/conditions" element={<Conditions />} />
        <Route path="/services" element={<Services />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/video-consultation" element={<VideoConsultation />} />
        <Route path="/ncs-emg-eeg" element={<Diagnostics />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}