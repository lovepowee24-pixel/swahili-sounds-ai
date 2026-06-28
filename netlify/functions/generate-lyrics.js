exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Swahili Sounds AI Function works!"
        })
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

Wimbo uwe wa kisasa, wenye hisia, catchy, radio-quality, na maneno mazuri ya Kiswahili.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        text: data.output_text || "AI imeshindwa kutengeneza lyrics. Jaribu tena."
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
