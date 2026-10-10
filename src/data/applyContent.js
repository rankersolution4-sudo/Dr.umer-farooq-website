import * as site from './siteData.js'

const KEYS = ['doctor', 'contact', 'specialInterests', 'locations', 'diagnosticsFacility', 'videoConsultation', 'services', 'conditionGroups', 'faqs', 'videos', 'gallery', 'posts']

export default function applyContent(saved) {
  if (!saved || typeof saved !== 'object') return
  for (const k of KEYS) {
    const val = saved[k]
    const target = site[k]
    if (val === undefined || !target) continue
    if (Array.isArray(target) && Array.isArray(val)) {
      target.splice(0, target.length, ...val)
    } else if (!Array.isArray(target) && typeof val === 'object') {
      Object.keys(target).forEach((key) => delete target[key])
      Object.assign(target, val)
    }
  }
}