export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  const correctPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (password === correctPassword) {
    return res.status(200).json({
      success: true,
      token: 'vercel-token-' + Date.now(),
      message: 'Login successful'
    });
  }

  return res.status(401).json({ error: 'Wrong password' });
}
