// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
admin.initializeApp();

// Callable from your React app
exports.progressionSuggestion = functions.https.onCall(async (data, context) => {
  const { exerciseName, history, goal, experience } = data;
  if (!exerciseName || !Array.isArray(history) || !goal || !experience) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing parameters');
  }

  // Build your Gemini prompt
  const prompt = `
You are a ${experience} ${goal} coach.
User history for ${exerciseName}:
${history.map(h =>
  `- ${h.sets.filter(s => s.weight && s.reps)
      .map(s => `${s.weight}lbs×${s.reps}${s.rpe?` RPE${s.rpe}`:''}`)
      .join(', ')} on ${new Date(h.completedAt).toLocaleDateString()}`
).join('\n')}
Suggest next weight/reps. Reply JSON: {"message":"…","suggestion":"…","color":"…"}.
  `.trim();

  const res = await fetch('https://api.gemini.example/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
    },
    body: JSON.stringify({ model: 'gemini-pro', prompt, max_tokens: 150 })
  });
  const json = await res.json();
  try {
    return JSON.parse(json.choices[0].text);
  } catch {
    throw new functions.https.HttpsError('internal', 'Invalid AI response');
  }
});
