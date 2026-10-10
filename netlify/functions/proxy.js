exports.handler = async function(event, context) {
  const host = event.headers.host || '';
  const referer = event.headers.referer || event.headers.origin || '';
  
  // SISTEM KEAMANAN: Blokir akses langsung dari tab browser atau Postman/Bot
  if (!referer.includes(host) && !referer.includes('localhost')) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: "Akses Ditolak! Permintaan hanya boleh dilakukan dari dalam aplikasi resmi." })
    };
  }

  const GOOGLE_URL = process.env.GOOGLE_SCRIPT_URL;

  if (!GOOGLE_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Variabel Lingkungan GOOGLE_SCRIPT_URL belum disetel di pengaturan Netlify!" })
    };
  }

  try {
    let targetUrl = GOOGLE_URL;
    const queryObj = event.queryStringParameters || {};
    const qs = [];
    for (const key in queryObj) {
        qs.push(encodeURIComponent(key) + '=' + encodeURIComponent(queryObj[key]));
    }
    const paramsString = qs.join('&');
    
    if (paramsString) {
      targetUrl += (targetUrl.includes('?') ? '&' : '?') + paramsString;
    }

    const options = {
      method: event.httpMethod,
    };

    if (event.httpMethod !== 'GET' && event.body) {
      options.body = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;
      options.headers = {
        'Content-Type': event.headers['content-type'] || 'application/x-www-form-urlencoded'
      };
    }

    const response = await fetch(targetUrl, options);
    const responseText = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/javascript',
        'Access-Control-Allow-Origin': '*'
      },
      body: responseText
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gagal memproses request", details: error.toString() })
    };
  }
};
