exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Gemini function works" })
      };
    }

    const { title, style, voice, mood, idea } = JSON.parse(event.body || "{}");

    const prompt = `
Tengeneza lyrics kamili za wimbo wa Kiswahili.

Title: ${title}
Style: ${style}
Voice: ${voice}
Mood: ${mood}
Idea/Theme: ${idea}

Andika:
1. Jina la wimbo
2. Verse 1
3. Chorus
4. Verse 2
5. Bridge
6. Final Chorus
7. AI music prompt kwa Suno/Udio
`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: "GEMINI_API_KEY haijawekwa Netlify." })
      };
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ success: false, error: data.error?.message || JSON.stringify(data) })
      };
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI imeshindwa kutengeneza lyrics.";

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, text })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
