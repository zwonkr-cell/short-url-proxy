import fetch from 'node-fetch';

const APP_KEY = process.env.SHORT_URL_APP_KEY;
const API_URL = "https://api-shorturl.nhncloudservice.com/open-api/v1.0/appkeys";

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await fetch(`${API_URL}/${APP_KEY}/urls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        endDateTime: "2099-12-31T23:59:59Z"
      })
    });

    const result = await response.json();

    if (response.ok && result.body?.shortUrl) {
      return res.status(200).json({ shortUrl: result.body.shortUrl });
    } else {
      return res.status(response.status).json({
        error: result.header?.resultMessage || "API error"
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};