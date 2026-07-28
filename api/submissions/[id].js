const { getData, setData } = require('../_lib');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const id = parseInt(req.query.id);
  const subs = await getData('submissions');

  if (req.method === 'PUT') {
    const idx = subs.findIndex(s => s.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    subs[idx] = { ...subs[idx], ...req.body, id };
    await setData('submissions', subs);
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    const filtered = subs.filter(s => s.id !== id);
    await setData('submissions', filtered);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
