// functions/index.js
require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

exports.progressionSuggestion = functions
  .https
  .onCall(async (data, context) => {
    const { exerciseName, history, goal, experience } = data;

    if (
      typeof exerciseName !== 'string' ||
      !Array.isArray(history) ||
      typeof goal !== 'string' ||
      typeof experience !== 'string'
    ) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing or malformed parameters'
      );
    }

    // If no history, return basic suggestion
    if (history.length === 0) {
      return {
        message: 'No previous data available',
        suggestion: 'Start with comfortable weight',
        color: 'text-blue-400'
      };
    }

    // Get the most recent workout
    const lastWorkout = history[history.length - 1];
    const recentSets = lastWorkout.sets?.filter(s => s.weight && s.reps) || [];

    if (recentSets.length === 0) {
      return {
        message: 'No weight/rep data from last session',
        suggestion: 'Log your sets for better recommendations',
        color: 'text-yellow-400'
      };
    }

    // Calculate basic metrics
    const weights = recentSets.map(s => parseFloat(s.weight) || 0);
    const rpes = recentSets.map(s => parseFloat(s.rpe) || 5);

    const maxWeight = Math.max(...weights);
    const avgRpe = rpes.reduce((sum, rpe) => sum + rpe, 0) / rpes.length;

    // Get API key from environment variables
    const apiKey = process.env.GEMINI_KEY;
    if (!apiKey) {
      // Fallback logic without AI
      console.log('Gemini API key not configured, using fallback logic');
      
      if (avgRpe < 7) {
        return {
          message: 'Last session felt easy based on RPE',
          suggestion: `Try ${maxWeight + 5}lbs`,
          color: 'text-green-400'
        };
      } else if (avgRpe > 8.5) {
        return {
          message: 'Last session was very challenging',
          suggestion: `Maintain ${maxWeight}lbs or reduce slightly`,
          color: 'text-red-400'
        };
      } else {
        return {
          message: 'Good intensity last session',
          suggestion: `Maintain ${maxWeight}lbs`,
          color: 'text-blue-400'
        };
      }
    }

    try {
      // Build Gemini prompt
      const prompt = `
You are an expert ${experience.toLowerCase()} level ${goal.toLowerCase()} coach analyzing workout progression.

Exercise: ${exerciseName}
User Profile: ${experience} level, goal: ${goal}

Last workout data:
- Max weight: ${maxWeight} lbs
- Average RPE: ${avgRpe.toFixed(1)}/10
- Sets: ${recentSets.map(s => `${s.weight}lbs × ${s.reps} reps${s.rpe ? ` @ RPE ${s.rpe}` : ''}`).join(', ')}

Based on RPE and performance:
- RPE < 7: suggest weight increase
- RPE 7-8: maintain or slight increase  
- RPE > 8.5: maintain or decrease

Respond with ONLY a JSON object in this exact format:
{"message":"Brief assessment of last performance","suggestion":"Specific weight/rep recommendation","color":"text-green-400 for increase, text-blue-400 for maintain, text-red-400 for decrease"}
`;

      // Correct Gemini API endpoint and format
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              topK: 1,
              topP: 1,
              maxOutputTokens: 200,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      const aiText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiText) {
        throw new Error('No response from Gemini API');
      }

      // Try to parse JSON from AI response
      try {
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            message: parsed.message || 'AI analysis complete',
            suggestion: parsed.suggestion || 'Continue with current progression',
            color: parsed.color || 'text-blue-400'
          };
        } else {
          throw new Error('No JSON found in AI response');
        }
      } catch (parseError) {
        console.error('Failed to parse AI JSON:', parseError, 'Raw response:', aiText);
        
        // Fallback based on simple rules
        if (avgRpe < 7) {
          return {
            message: 'AI suggests: Last session was manageable',
            suggestion: `Try ${maxWeight + 5}lbs`,
            color: 'text-green-400'
          };
        } else if (avgRpe > 8.5) {
          return {
            message: 'AI suggests: Last session was very challenging',
            suggestion: `Maintain or reduce from ${maxWeight}lbs`,
            color: 'text-red-400'
          };
        } else {
          return {
            message: 'AI suggests: Good training intensity',
            suggestion: `Maintain ${maxWeight}lbs`,
            color: 'text-blue-400'
          };
        }
      }

    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Return fallback suggestion based on RPE
      if (avgRpe < 7) {
        return {
          message: 'Last session felt easy (AI unavailable)',
          suggestion: `Try ${maxWeight + 5}lbs`,
          color: 'text-green-400'
        };
      } else if (avgRpe > 8.5) {
        return {
          message: 'Last session was challenging (AI unavailable)',
          suggestion: `Maintain ${maxWeight}lbs`,
          color: 'text-red-400'
        };
      } else {
        return {
          message: 'Good session intensity (AI unavailable)',
          suggestion: `Try ${maxWeight + 2.5}lbs`,
          color: 'text-blue-400'
        };
      }
    }
  });

exports.analyzeRoutine = functions
  .https
  .onCall(async (data, context) => {
    const { routine, profile, isDay, day } = data;

    const apiKey = process.env.GEMINI_KEY;
    if (!apiKey) {
      return {
        analysis: '<strong>AI Analysis Unavailable</strong><br/>Gemini API key not configured. Your routine structure looks organized for your goals.'
      };
    }

    const analysisTarget = isDay ? day : routine;
    const targetName = isDay ? day.name : routine.name;
    
    const prompt = `
You are an expert personal trainer analyzing a ${isDay ? 'workout day' : 'workout routine'}.

${isDay ? 'Workout Day' : 'Routine'}: ${targetName}

User Profile:
- Goal: ${profile.goal}
- Experience: ${profile.experience}
- Training Days/Week: ${profile.daysPerWeek}

${isDay ? 
  `Exercises for this day:
${day.exercises.map(e => `- ${e.name}: ${e.sets} sets × ${e.targetReps} reps, ${e.restTime}s rest`).join('\n')}` :
  `Complete routine:
${Object.entries(routine.days).map(([dayNum, dayData]) => 
  `Day ${dayNum} - ${dayData.name}:
${dayData.exercises.map(e => `  - ${e.name}: ${e.sets} sets × ${e.targetReps} reps`).join('\n')}`
).join('\n\n')}`
}

Provide HTML-formatted analysis with:
1. Overall assessment 
2. Strengths
3. Areas for improvement  
4. Muscle balance
5. Specific recommendations

Use <strong> for headings, <br/> for breaks.
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const json = await response.json();
      let analysisText = json.candidates?.[0]?.content?.parts?.[0]?.text || 'Analysis failed';

      // Clean up formatting
      analysisText = analysisText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/\n/g, '<br/>');

      return { analysis: analysisText };

    } catch (error) {
      console.error('Routine analysis error:', error);
      return { 
        analysis: '<strong>Analysis Error</strong><br/>Unable to connect to AI service. Your routine appears well-structured for your experience level.' 
      };
    }
  });

exports.generateExerciseInfo = functions
  .https
  .onCall(async (data, context) => {
    const { exerciseName } = data;

    if (!exerciseName || typeof exerciseName !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Exercise name is required'
      );
    }

    const apiKey = process.env.GEMINI_KEY;
    if (!apiKey) {
      return {
        muscle: 'API not configured',
        difficulty: 'Unknown',
        equipment: 'Various',
        form: 'Please consult a fitness professional for proper form',
        tips: 'Always prioritize proper form over heavy weight',
        progression: 'Progressive overload: gradually increase weight, reps, or sets',
        mistakes: 'Most common mistakes: using too much weight, poor form, inadequate rest'
      };
    }

    const prompt = `
Provide detailed exercise information for: "${exerciseName}"

Format your response as a JSON object with these exact keys:
{
  "muscle": "Primary muscle groups worked",
  "difficulty": "Beginner, Intermediate, or Advanced", 
  "equipment": "Required equipment",
  "form": "Step-by-step form instructions",
  "tips": "Important safety and technique tips",
  "progression": "How to progress this exercise",
  "mistakes": "Common mistakes and how to avoid them"
}

Be specific and practical.
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 800,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const json = await response.json();
      const aiText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Try to extract JSON
      try {
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return {
          muscle: 'Multiple muscle groups',
          difficulty: 'Intermediate',
          equipment: 'Gym equipment',
          form: aiText,
          tips: 'Focus on controlled movements',
          progression: 'Gradually increase weight or reps',
          mistakes: 'Avoid using momentum'
        };
      }

    } catch (error) {
      console.error('Exercise generation error:', error);
      return {
        muscle: 'Exercise analysis failed',
        difficulty: 'Unknown',
        equipment: 'Various',
        form: 'Please consult a fitness professional',
        tips: 'Always prioritize proper form',
        progression: 'Progressive overload',
        mistakes: 'Consult proper exercise guides'
      };
    }
  });