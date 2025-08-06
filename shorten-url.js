import fetch from 'node-fetch';

const APP_KEY = process.env.SHORT_URL_APP_KEY;
const API_URL = "https://api-shorturl.nhncloudservice.com/open-api/v1.0/appkeys";

// import fetch from 'node-fetch'; 
// Vercel 환경에서는 기본적으로 fetch가 제공되므로 이 import 문은 필요 없습니다.

// ... 나머지 코드는 그대로 둡니다 ...

module.exports = async (req, res) => {
    // 기존 export default async (req, res) => { ... } 안의 코드를 여기에 붙여넣으세요.
};

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
