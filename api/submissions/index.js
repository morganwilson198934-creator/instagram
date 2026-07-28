const { getData, setData } = require('../_lib');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const data = await getData('submissions');
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const subs = await getData('submissions');
    const submission = req.body;
    submission.id = Date.now();
    submission.timestamp = new Date().toISOString();
    subs.push(submission);
    await setData('submissions', subs);
    return res.status(200).json({ success: true, submission });
  }

  if (req.method === 'DELETE') {
    await setData('submissions', []);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
