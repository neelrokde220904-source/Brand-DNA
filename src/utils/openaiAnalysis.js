const SYSTEM_PROMPT = `You are a senior industrial designer and brand design analyst with 20+ years of experience in product design, CMF direction, and brand design language research. When given a brand name, analyze its complete design language across geometry, surface language, CMF direction, and design philosophy. Return ONLY a valid JSON object — no markdown fences, no preamble, no explanation outside the JSON. Be specific and accurate, using real material names, actual color values, and precise industrial design vocabulary.`;

const USER_PROMPT = (brand) => `Analyze the brand "${brand}". 
Research their product design language, CMF direction (Color, Material, Finish), 
surface language philosophy, and geometric design vocabulary.
Return ONLY this exact JSON schema, fully populated with accurate data:
{
  "brand": "${brand}",
  "category": "...",
  "geometry": {
    "formVocabulary": "...",
    "cornerRadiusIndex": 0,
    "symmetryAxis": "bilateral|radial|asymmetric|variable",
    "silhouetteType": "...",
    "edgeTension": "hard|soft|compound|mixed",
    "proportionRatio": "...",
    "geometryNarrative": "..."
  },
  "surfaceLanguage": {
    "detailDensity": 0,
    "lineLogic": "...",
    "seamPhilosophy": "hidden|exposed|decorative|functional",
    "affordanceLanguage": "...",
    "textureGrain": "...",
    "graphicIntegration": "embedded|applied|minimal|none",
    "surfaceNarrative": "..."
  },
  "cmf": {
    "primaryPalette": ["#hex","#hex","#hex"],
    "accentPalette": ["#hex","#hex"],
    "materialFamily": "...",
    "heroMaterial": "...",
    "finishType": "...",
    "tactility": "cold precision|warm softness|neutral technical|premium haptic",
    "cmfNarrative": "..."
  },
  "designAxes": {
    "minimalVsMaximal": 0,
    "coldVsWarm": 0,
    "rigidVsSoft": 0,
    "geometricVsOrganic": 0,
    "loudVsQuiet": 0
  },
  "qualitative": {
    "dnaSummary": "...",
    "designKeywords": ["","","","","",""],
    "comparableBrands": ["","",""],
    "differentiationSignal": "...",
    "eraTrendPositioning": "..."
  }
}`;

export async function analyzeBrandWithAI(brandName, apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        temperature: 0.2,
        max_tokens: 2500,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: USER_PROMPT(brandName) }
        ]
      })
    });

    if (response.status === 401) {
      throw new Error('Invalid API key. Check your key in Settings.');
    }
    if (response.status === 429) {
      throw new Error('Rate limit reached. Wait a moment and try again.');
    }

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    const raw = data.choices[0].message.content.trim();
    const cleaned = raw.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      throw new Error('Could not parse AI response. Try again.');
    }
  } catch (error) {
    if (error.message.includes('Invalid API key') ||
        error.message.includes('Rate limit') ||
        error.message.includes('Could not parse')) {
      throw error;
    }
    throw new Error(error.message || 'Failed to connect to OpenAI API.');
  }
}
