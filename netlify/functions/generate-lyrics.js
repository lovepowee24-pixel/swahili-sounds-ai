exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Gemini function works" })
      };
    }

    const { title, style, voice, idea } = JSON.parse(event.body || "{}");

    const prompt = `
Tengeneza lyrics kamili za wimbo wa Kiswahili.

Title: ${title}
Style: ${style}
Voice: ${voice}
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

   const res = await fetch("/.netlify/functions/generate-lyrics", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title, style, voice, idea })
}); 

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI imeshindwa. Jaribu tena.";

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
