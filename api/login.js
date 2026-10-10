export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const pw = String(body?.password || body?.pass || '');

  // Direct check for admin123
  if (pw === 'admin123' || pw === (process.env.ADMIN_PASSWORD || 'admin123')) {
    const token = 'token_' + Math.random().toString(36).substring(2) + Date.now();
    return res.status(200).json({
      ok: true,
      success: true,
      token: token,
      message: 'Login successful'
    });
  }

  return res.status(401).json({ error: 'Wrong password' });
}
