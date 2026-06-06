export default async function handler(req, res) {
  // Grab the ICAO code from the frontend, default to VOMM
  const icao = req.query.icao || 'VOMM';

  try {
    const response = await fetch('https://notams.aim.faa.gov/notamSearch/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // This is the crucial part: Masking the server as a normal desktop browser
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://notams.aim.faa.gov/notamSearch/',
      },
      body: new URLSearchParams({
        searchType: '0',
        designatorsForLocation: icao
      })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `FAA Blocked Request: ${response.status}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
