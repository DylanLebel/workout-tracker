// functions/index.js - COMPLETE WORKING VERSION
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

// Get API key from environment variables
const getApiKey = () => {
  // Try multiple possible environment variable names
  const envKey = process.env.GEMINI_KEY || 
                 process.env.GEMINI_API_KEY || 
                 process.env.GOOGLE_API_KEY;
  
  if (envKey) {
    console.log('API key found in environment variables');
    return envKey;
  }
  
  // Fallback to Firebase config (legacy method)
  try {
    const config = functions.config();
    if (config.gemini && config.gemini.key) {
      console.log('API key found in Firebase config');
      return config.gemini.key;
    }
  } catch (error) {
    console.log('No Firebase config available');
  }
  
  console.log('No API key found');
  return null;
};

// MAIN FUNCTION: Analyze workout routines
// FIXED analyzeRoutine function - Replace in functions/index.js
// FIXED analyzeRoutine function - Replace in functions/index.js

exports.analyzeRoutine = functions.https.onCall(async (data, context) => {
  console.log('=== analyzeRoutine called ===');
  console.log('Received data keys:', Object.keys(data || {}));
  
  // Extract the actual data from the request
  let actualData = data;
  
  // Check if data is nested in a 'data' property (common in Firebase Functions)
  if (data && data.data && typeof data.data === 'object') {
    console.log('📦 Data found nested in data.data property');
    actualData = data.data;
  }
  
  console.log('Actual data keys:', Object.keys(actualData || {}));
  console.log('Data summary:', {
    hasData: !!actualData,
    hasRoutine: !!actualData?.routine,
    hasProfile: !!actualData?.profile,
    isDay: actualData?.isDay,
    hasDay: !!actualData?.day,
    routineName: actualData?.routine?.name || 'N/A',
    dayName: actualData?.day?.name || 'N/A',
    profileGoal: actualData?.profile?.goal || 'N/A'
  });

  try {
    // Basic data validation
    if (!actualData) {
      console.error('❌ No actual data provided');
      throw new functions.https.HttpsError('invalid-argument', 'No data provided');
    }

    console.log('✅ Data object exists');

    const { routine, profile, isDay, day } = actualData;

    console.log('Extracted values:');
    console.log('- routine exists:', !!routine);
    console.log('- routine keys:', routine ? Object.keys(routine) : 'none');
    console.log('- profile exists:', !!profile);
    console.log('- profile keys:', profile ? Object.keys(profile) : 'none');
    console.log('- isDay:', isDay);
    console.log('- day exists:', !!day);
    console.log('- day keys:', day ? Object.keys(day) : 'none');

    // Validation logic - be very specific about what's wrong
    if (isDay) {
      console.log('🔍 Validating for day analysis...');
      // For day analysis
      if (!day) {
        console.error('❌ Day analysis requires day object');
        throw new functions.https.HttpsError('invalid-argument', 'Day analysis requires day object');
      }
      if (!day.name) {
        console.error('❌ Day object missing name property');
        throw new functions.https.HttpsError('invalid-argument', 'Day object missing name property');
      }
      if (!Array.isArray(day.exercises)) {
        console.error('❌ Day object missing exercises array');
        throw new functions.https.HttpsError('invalid-argument', 'Day object missing exercises array');
      }
      console.log('✅ Day validation passed for:', day.name);
    } else {
      console.log('🔍 Validating for routine analysis...');
      // For routine analysis
      if (!routine) {
        console.error('❌ Missing routine object');
        throw new functions.https.HttpsError('invalid-argument', 'Routine analysis requires routine object');
      }
      
      console.log('Routine object details:');
      console.log('- routine type:', typeof routine);
      console.log('- routine keys:', Object.keys(routine));
      console.log('- routine.name:', routine.name);
      console.log('- routine.days type:', typeof routine.days);
      console.log('- routine.days exists:', !!routine.days);
      
      if (!routine.name) {
        console.error('❌ Routine missing name:', routine);
        throw new functions.https.HttpsError('invalid-argument', 'Routine object missing name property');
      }
      
      if (!routine.days) {
        console.error('❌ Routine missing days:', routine);
        throw new functions.https.HttpsError('invalid-argument', 'Routine object missing days property');
      }

      // Additional validation for days structure
      if (typeof routine.days !== 'object') {
        console.error('❌ Days is not an object:', typeof routine.days);
        throw new functions.https.HttpsError('invalid-argument', 'Routine days must be an object');
      }

      if (Array.isArray(routine.days)) {
        console.error('❌ Days should be object, not array');
        throw new functions.https.HttpsError('invalid-argument', 'Routine days must be an object, not an array');
      }

      const dayKeys = Object.keys(routine.days);
      if (dayKeys.length === 0) {
        console.error('❌ Days object is empty');
        throw new functions.https.HttpsError('invalid-argument', 'Routine days object is empty');
      }

      console.log('✅ Routine validation passed:', {
        name: routine.name,
        daysCount: dayKeys.length,
        dayKeys: dayKeys
      });
    }

    // Profile validation
    if (!profile) {
      console.error('❌ Profile is missing');
      throw new functions.https.HttpsError('invalid-argument', 'Profile is required for analysis');
    }

    console.log('Profile validation:');
    console.log('- profile.goal:', profile.goal);
    console.log('- profile.experience:', profile.experience);

    if (!profile.goal || !profile.experience) {
      console.error('❌ Profile missing required fields:', {
        hasGoal: !!profile.goal,
        hasExperience: !!profile.experience
      });
      throw new functions.https.HttpsError('invalid-argument', 'Profile must include goal and experience');
    }

    console.log('✅ Profile validation passed:', {
      goal: profile.goal,
      experience: profile.experience
    });

    // Try to get API key
    const apiKey = getApiKey();
    if (!apiKey) {
      console.log('⚠️ No API key available, returning basic analysis');
      const targetName = isDay ? day.name : routine.name;
      return {
        success: true,
        analysis: `
          <div style="padding: 20px; background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); border-radius: 12px; color: white; margin: 10px 0;">
            <h2 style="margin: 0 0 15px 0;">✅ Basic Analysis Complete</h2>
            <p><strong>${isDay ? 'Workout Day' : 'Routine'}:</strong> ${targetName}</p>
            <p><strong>Goal:</strong> ${profile.goal}</p>
            <p><strong>Experience:</strong> ${profile.experience}</p>
          </div>
          <div style="padding: 15px; background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; margin: 10px 0;">
            <p>Your ${isDay ? 'workout day' : 'routine'} structure looks well-organized for your ${profile.goal.toLowerCase()} goals.</p>
            <p><em>For detailed AI analysis, configure your Gemini API key in the Firebase Console.</em></p>
          </div>
        `
      };
    }

    // Prepare data for AI analysis
    const analysisTarget = isDay ? day : routine;
    const targetName = isDay ? day.name : routine.name;
    
    console.log('🚀 Proceeding with AI analysis for:', targetName);
    
    // Build comprehensive prompt - ENHANCED for day analysis
    const prompt = `
You are an expert personal trainer and strength coach analyzing a ${isDay ? 'single workout day' : 'complete workout routine'}.

${isDay ? 'WORKOUT DAY' : 'WORKOUT ROUTINE'}: "${targetName}"

USER PROFILE:
- Primary Goal: ${profile.goal}
- Experience Level: ${profile.experience}
- Training Frequency: ${profile.daysPerWeek || 'Not specified'} days per week
- Age: ${profile.age || 'Not specified'}
- Weight: ${profile.weight || 'Not specified'} lbs

${isDay ? 
  `EXERCISES FOR THIS DAY:
${day.exercises && day.exercises.length > 0 ? 
  day.exercises.map((e, i) => 
    `${i + 1}. ${e.name}
   - Sets: ${e.sets || 3}
   - Target Reps: ${e.targetReps || '8-12'}
   - Rest Time: ${e.restTime || 60} seconds`
  ).join('\n\n') :
  'No exercises specified for this day'
}

DAY ANALYSIS FOCUS:
- Muscle group coverage and balance
- Exercise selection appropriateness 
- Exercise order optimization
- Volume and intensity analysis
- Missing muscle groups or movements
- Specific improvements for this day` :
  `COMPLETE ROUTINE BREAKDOWN:
${routine.days && Object.keys(routine.days).length > 0 ?
  Object.entries(routine.days).map(([dayNum, dayData]) => 
    `DAY ${dayNum}: ${dayData.name || 'Unnamed Day'}
${dayData.exercises && dayData.exercises.length > 0 ?
  dayData.exercises.map((e, i) => 
    `  ${i + 1}. ${e.name} - ${e.sets || 3} sets × ${e.targetReps || '8-12'} reps (${e.restTime || 60}s rest)`
  ).join('\n') :
  '  No exercises specified'
}`
  ).join('\n\n') :
  'No workout days specified in routine'
}`
}

ANALYSIS REQUIREMENTS:
Please provide a comprehensive analysis in HTML format with:

1. **Overall Assessment** - How well does this ${isDay ? 'day' : 'routine'} align with the user's ${profile.goal} goals and ${profile.experience} experience level?

2. **Key Strengths** - What aspects of this ${isDay ? 'workout day' : 'routine'} are particularly effective?

3. **Areas for Improvement** - What could be optimized or modified?

4. **Specific Recommendations** - Provide 3-5 actionable suggestions for enhancement

${isDay ? 
  `5. **Exercise Modifications** - Suggest specific exercises to add, remove, or replace for better muscle group coverage

6. **Exercise Order** - Comment on the current exercise sequence and suggest improvements` :
  `5. **Progression Strategy** - How should the user progress over the next 4-8 weeks?`
}

FORMAT REQUIREMENTS:
- Use HTML formatting with <h3> for section headers
- Use <strong> for emphasis and <em> for subtle highlights
- Use <ul> and <li> for bullet points
- Use <br/> for line breaks
- Keep total response under 500 words
- Be encouraging yet constructive
- Focus on practical, actionable advice

TONE: Professional but encouraging, like a knowledgeable trainer who wants to help the user succeed.
`;

      console.log('Calling Gemini API with prompt length:', prompt.length);
      
      // Call Gemini API with updated model
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1500,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH", 
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Gemini API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const json = await response.json();
      let analysisText = json.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!analysisText) {
        console.error('❌ No analysis text in response:', json);
        throw new Error('No analysis content received from Gemini API');
      }

      console.log('✅ Gemini API response received, length:', analysisText.length);

      // Clean up and format the response
      analysisText = analysisText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/\n/g, '<br/>');

      return {
        success: true,
        analysis: analysisText,
        metadata: {
          analyzedTarget: targetName,
          userGoal: profile.goal,
          userExperience: profile.experience,
          analysisType: isDay ? 'day' : 'routine',
          timestamp: new Date().toISOString()
        }
      };

  } catch (error) {
    console.error('❌ Analysis error:', error);
    
    // Re-throw Firebase errors as-is
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    // Wrap other errors
    throw new functions.https.HttpsError(
      'internal',
      `Analysis failed: ${error.message}`,
      { originalError: error.toString() }
    );
  }
});

// HELPER FUNCTION: Test Firebase Functions connectivity
exports.testFunction = functions.https.onCall(async (data, context) => {
  console.log('testFunction called with data keys:', Object.keys(data || {}));
  
  try {
    const apiKey = getApiKey();
    
    return {
      success: true,
      message: 'Test function working!',
      hasApiKey: !!apiKey,
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      functionVersion: '1.0.0',
      inputDataKeys: Object.keys(data || {}),
      environment: {
        hasGeminiKey: !!process.env.GEMINI_KEY,
        hasGeminiApiKey: !!process.env.GEMINI_API_KEY,
        hasGoogleApiKey: !!process.env.GOOGLE_API_KEY
      }
    };
  } catch (error) {
    console.error('Test function error:', error);
    throw new functions.https.HttpsError('internal', `Test failed: ${error.message}`);
  }
});

// HELPER FUNCTION: Generate exercise information
exports.generateExerciseInfo = functions.https.onCall(async (data, context) => {
  console.log('generateExerciseInfo called for:', data?.exerciseName);

  const { exerciseName } = data || {};

  if (!exerciseName || typeof exerciseName !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Exercise name is required');
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    console.log('No API key available, returning basic exercise info');
    return {
      muscle: 'Multiple muscle groups',
      difficulty: 'Intermediate', 
      equipment: 'Gym equipment',
      form: `Please consult a fitness professional for proper form guidance on ${exerciseName}.`,
      tips: 'Always prioritize proper form over heavy weight. Start with lighter weights to master the movement.',
      progression: 'Progressive overload: gradually increase weight, reps, or sets over time.',
      mistakes: 'Common mistakes include using too much weight, rushing through reps, and neglecting proper warm-up.'
    };
  }

  try {
    const prompt = `
Provide detailed exercise information for: "${exerciseName}"

Format your response as a valid JSON object with these exact keys:
{
  "muscle": "Primary and secondary muscle groups worked",
  "difficulty": "Beginner, Intermediate, or Advanced",
  "equipment": "Required equipment and setup", 
  "form": "Step-by-step form and technique instructions",
  "tips": "Important safety tips and technique cues",
  "progression": "How to progress and advance this exercise",
  "mistakes": "Common mistakes and how to avoid them"
}

Provide practical, actionable information suitable for ${context.auth ? 'an authenticated user' : 'a general user'}.
Keep each field concise but informative.
`;

    console.log('Calling Gemini API for exercise info');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error for exercise info:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const json = await response.json();
    const aiText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';

    console.log('Exercise info response received, length:', aiText.length);

    // Extract JSON from response
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          muscle: parsed.muscle || 'Multiple muscle groups',
          difficulty: parsed.difficulty || 'Intermediate',
          equipment: parsed.equipment || 'Gym equipment',
          form: parsed.form || 'Consult a fitness professional for proper form.',
          tips: parsed.tips || 'Focus on controlled movements and proper form.',
          progression: parsed.progression || 'Gradually increase weight, reps, or sets.',
          mistakes: parsed.mistakes || 'Avoid using momentum and prioritize form over weight.'
        };
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('JSON parse error for exercise info:', parseError);
      
      // Return structured fallback using the AI text
      return {
        muscle: 'Multiple muscle groups',
        difficulty: 'Intermediate',
        equipment: 'Gym equipment',
        form: aiText.substring(0, 200) + '...',
        tips: 'Focus on controlled movements and proper breathing.',
        progression: 'Gradually increase weight, reps, or sets over time.',
        mistakes: 'Avoid using momentum and prioritize form over heavy weight.'
      };
    }

  } catch (error) {
    console.error('Exercise info generation error:', error);
    throw new functions.https.HttpsError('internal', `Exercise info generation failed: ${error.message}`);
  }
});

// HELPER FUNCTION: Workout progression suggestions
exports.progressionSuggestion = functions.https.onCall(async (data, context) => {
  console.log('progressionSuggestion called');

  try {
    // Extract actual data (same pattern as analyzeRoutine)
    let actualData = data;
    if (data && data.data && typeof data.data === 'object') {
      console.log('📦 Progression data found nested in data.data property');
      actualData = data.data;
    }

    console.log('Progression data keys:', Object.keys(actualData || {}));

    const { exerciseName, history, goal, experience } = actualData || {};

    console.log('Progression input validation:', {
      hasExerciseName: !!exerciseName,
      exerciseName: exerciseName,
      hasHistory: Array.isArray(history),
      historyLength: Array.isArray(history) ? history.length : 'not array',
      hasGoal: !!goal,
      goal: goal,
      hasExperience: !!experience,
      experience: experience
    });

    // Validate input parameters
    if (!exerciseName || typeof exerciseName !== 'string') {
      console.error('❌ Exercise name validation failed');
      throw new functions.https.HttpsError('invalid-argument', 'Exercise name is required');
    }
    
    if (!Array.isArray(history)) {
      console.error('❌ History validation failed');
      throw new functions.https.HttpsError('invalid-argument', 'History must be an array');
    }
    
    if (!goal || typeof goal !== 'string') {
      console.error('❌ Goal validation failed');
      throw new functions.https.HttpsError('invalid-argument', 'Goal is required');
    }
    
    if (!experience || typeof experience !== 'string') {
      console.error('❌ Experience validation failed');
      throw new functions.https.HttpsError('invalid-argument', 'Experience level is required');
    }

    console.log('✅ Progression validation passed');

    // Handle no history case
    if (history.length === 0) {
      console.log('📊 No history available for', exerciseName);
      return {
        message: 'No previous workout data available',
        suggestion: 'Start with a comfortable weight to establish baseline',
        color: 'text-blue-400'
      };
    }

    // Analyze recent performance
    const lastWorkout = history[history.length - 1];
    console.log('📊 Last workout data:', lastWorkout);
    
    const recentSets = lastWorkout.sets?.filter(s => s.weight && s.reps) || [];
    console.log('📊 Recent sets with data:', recentSets.length);

    if (recentSets.length === 0) {
      console.log('📊 No weight/rep data from last session');
      return {
        message: 'No weight/rep data from last session',
        suggestion: 'Log your sets with weight and reps for better recommendations',
        color: 'text-yellow-400'
      };
    }

    // Calculate metrics
    const weights = recentSets.map(s => parseFloat(s.weight) || 0);
    const reps = recentSets.map(s => parseInt(s.reps) || 0);
    const rpes = recentSets.map(s => parseFloat(s.rpe) || 7);

    const maxWeight = Math.max(...weights);
    const avgRpe = rpes.reduce((sum, rpe) => sum + rpe, 0) / rpes.length;
    const totalVolume = weights.reduce((sum, weight, i) => sum + (weight * reps[i]), 0);

    console.log('📊 Calculated metrics:', {
      maxWeight,
      avgRpe: avgRpe.toFixed(1),
      totalVolume,
      setsAnalyzed: recentSets.length
    });

    const apiKey = getApiKey();
    if (!apiKey) {
      console.log('🤖 No API key, using rule-based progression logic');
      
      // Simple rule-based logic
      if (avgRpe < 6.5) {
        return {
          message: 'Last session felt easy based on RPE',
          suggestion: `Try ${maxWeight + 5}lbs next session`,
          color: 'text-green-400'
        };
      } else if (avgRpe > 8.5) {
        return {
          message: 'Last session was very challenging',
          suggestion: `Maintain ${maxWeight}lbs or reduce by 5-10lbs`,
          color: 'text-red-400'
        };
      } else {
        return {
          message: 'Good training intensity last session',
          suggestion: `Try ${maxWeight + 2.5}lbs next time`,
          color: 'text-blue-400'
        };
      }
    }

    try {
      // Build AI prompt for progression
      const prompt = `
You are an expert ${experience.toLowerCase()} level coach specializing in ${goal.toLowerCase()}.

EXERCISE: ${exerciseName}
USER PROFILE: ${experience} level, ${goal} goal

LAST WORKOUT ANALYSIS:
- Heaviest weight used: ${maxWeight} lbs
- Average RPE: ${avgRpe.toFixed(1)}/10
- Total volume: ${totalVolume} lbs
- Set breakdown: ${recentSets.map(s => `${s.weight}lbs × ${s.reps} reps ${s.rpe ? `@ RPE ${s.rpe}` : ''}`).join(', ')}

RPE INTERPRETATION:
- RPE 1-5: Too easy, significant increase needed
- RPE 6-7: Manageable, moderate increase appropriate  
- RPE 8-8.5: Challenging but good, small increase or maintain
- RPE 9-10: Maximum effort, maintain or decrease

RESPOND WITH ONLY THIS JSON FORMAT:
{
  "message": "Brief assessment of last performance (max 50 words)",
  "suggestion": "Specific weight/rep recommendation for next session",
  "color": "text-green-400 for increase, text-blue-400 for maintain, text-red-400 for decrease"
}

Be specific about weight recommendations and consider the user's experience level.
`;

      console.log('🤖 Calling Gemini API for progression suggestion');

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 250,
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Gemini API error for progression:', response.status, errorText);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const json = await response.json();
      const aiText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiText) {
        throw new Error('No response from Gemini API');
      }

      console.log('🤖 AI progression response received, length:', aiText.length);

      // Parse JSON response
      try {
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log('✅ Progression suggestion generated:', parsed);
          return {
            message: parsed.message || 'AI analysis complete',
            suggestion: parsed.suggestion || 'Continue current progression',
            color: parsed.color || 'text-blue-400'
          };
        } else {
          throw new Error('No JSON found in AI response');
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        
        // Fallback to rule-based logic
        if (avgRpe < 7) {
          return {
            message: 'RPE indicates room for progression',
            suggestion: `Try ${maxWeight + 5}lbs`,
            color: 'text-green-400'
          };
        } else if (avgRpe > 8.5) {
          return {
            message: 'High RPE suggests maintaining current load',
            suggestion: `Stay at ${maxWeight}lbs`,
            color: 'text-red-400'
          };
        } else {
          return {
            message: 'Solid performance, small progression appropriate',
            suggestion: `Try ${maxWeight + 2.5}lbs`,
            color: 'text-blue-400'
          };
        }
      }

    } catch (error) {
      console.error('Progression suggestion error:', error);
      
      // Final fallback based on RPE
      if (avgRpe < 7) {
        return {
          message: 'Last session manageable (AI unavailable)',
          suggestion: `Try ${maxWeight + 5}lbs`,
          color: 'text-green-400'
        };
      } else if (avgRpe > 8.5) {
        return {
          message: 'Challenging session (AI unavailable)',
          suggestion: `Maintain ${maxWeight}lbs`,
          color: 'text-red-400'
        };
      } else {
        return {
          message: 'Good intensity (AI unavailable)',
          suggestion: `Try ${maxWeight + 2.5}lbs`,
          color: 'text-blue-400'
        };
      }
    }

  } catch (error) {
    console.error('❌ Progression suggestion error:', error);
    
    // Re-throw Firebase errors as-is
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    // Return fallback suggestion
    return {
      message: 'Error generating suggestion',
      suggestion: 'Use your best judgment based on last session',
      color: 'text-gray-400'
    };
  }
});
  