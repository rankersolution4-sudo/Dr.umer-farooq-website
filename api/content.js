export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  
  if (req.method === 'GET') {
    return res.status(200).json({
      doctor: {
        name: "Dr. Muhammad Umer Farooq",
        title: "Neurologist",
        degree: "MBBS, FCPS (Neurology)"
      }
    });
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    return res.status(200).json({ ok: true, message: 'Saved' });
  }

  return res.status(200).json({});
}
