import React, { useState, useEffect, useCallback, memo } from 'react';
import { Calendar, Plus, Trash2, Info, Edit3, Save, X, ChevronRight, BarChart3, Brain, Zap, Loader, User, Clock, Target, TrendingUp } from 'lucide-react';

// --- CONSTANTS for Initial State ---
const initialExerciseDatabase = {
  "Flat Barbell Bench Press": { muscle: "Chest, Triceps, Shoulders", difficulty: "Intermediate", equipment: "Barbell", form: "Lie flat on the bench with feet firmly on the floor. Grip the bar slightly wider than shoulder-width. Retract your scapula (pinch shoulder blades together) and arch your lower back slightly. Unrack the bar and lower it to your mid-chest with control. Press the bar back up explosively until your arms are fully extended.", tips: "Drive through your heels to create leg drive. Keep your elbows tucked at a 45-75 degree angle, not flared out. The bar path should be a slight curve, not straight up and down.", progression: "Focus on adding 5lbs to the bar once you can comfortably complete all sets and reps. If you hit a plateau, try incorporating a deload week or accessory exercises like dumbbell press or push-ups.", mistakes: "Bouncing the bar off your chest; Flaring your elbows too wide; Not controlling the eccentric (lowering) phase; Lifting your hips off the bench during the press." },
  "Incline Dumbbell Press": { muscle: "Upper Chest, Shoulders", difficulty: "Beginner", equipment: "Dumbbells", form: "Set the bench to a 30-45 degree angle. Sit with dumbbells on your knees. Kick the weights up to your shoulders as you lie back. Press the dumbbells up and slightly inwards until they are almost touching. Lower them slowly and with control until you feel a good stretch in your chest.", tips: "Don't let the dumbbells drift too far apart. Focus on squeezing your chest at the top of the movement. Keep your wrists straight and aligned with your forearms.", progression: "Increase reps first. Once you can hit the top of your target rep range for all sets, move up to the next available dumbbell weight. A greater range of motion is often more important than heavier weight here.", mistakes: "Using too much momentum; Not getting a full range of motion; Setting the incline too high (which targets shoulders more); Letting the dumbbells clang together at the top." },
  "Overhead Press": { muscle: "Shoulders, Triceps", difficulty: "Intermediate", equipment: "Barbell", form: "Stand with the bar racked at shoulder height. Grip the bar just outside your shoulders. Keep your core tight and glutes squeezed. Press the bar straight overhead, pushing your head slightly through the 'window' created by your arms at the top. Lower with control back to the starting position.", tips: "Avoid using your legs to create momentum (unless performing a push press). Squeeze your glutes and brace your core throughout the lift to protect your lower back. Think about pressing the bar 'to the ceiling'.", progression: "This is a slow lift to progress. Micro-plates (1.25lbs) are your best friend. Add small amounts of weight and focus on perfect form. Volume is also a key driver; adding an extra set can be as effective as adding weight.", mistakes: "Arching the lower back excessively; Pressing the bar in front of the body instead of straight overhead; Bending the knees to generate momentum; Not controlling the descent." },
  "Pull-Ups": { muscle: "Back, Biceps", difficulty: "Intermediate", equipment: "Pull-up bar", form: "Grip the bar with an overhand grip, slightly wider than your shoulders. Start from a dead hang with arms fully extended. Engage your lats by pulling your shoulder blades down and back. Pull yourself up until your chin is over the bar. Lower yourself back down with control.", tips: "Think about pulling your elbows down to your pockets. Avoid swinging. If you can't do a full pull-up, start with negative pull-ups (jumping to the top and lowering slowly) or use resistance bands for assistance.", progression: "Once you can do 8-10 bodyweight pull-ups with good form, start adding weight using a dip belt. You can also progress by increasing the total number of reps across your sets (e.g., aiming for 25 total reps instead of 3x8).", mistakes: "Using momentum (kipping) unless training for CrossFit; Not going through the full range of motion (starting from a dead hang); Pulling with your biceps instead of your back; Going too fast and not controlling the movement." },
  "Back Squats": { muscle: "Quads, Glutes, Hamstrings", difficulty: "Advanced", equipment: "Barbell", form: "Place the barbell on your upper traps, not your neck. Grip the bar firmly and pull it down into your back. Stand with your feet shoulder-width apart, toes pointed slightly out. Initiate the movement by breaking at the hips and then the knees. Keep your chest up and your back straight. Squat down until your hip crease is below your knee (breaking parallel). Drive back up through your heels.", tips: "Keep your core braced as if you're about to be punched in the stomach. Your knees should track in line with your toes. Film yourself from the side to check your depth and back angle.", progression: "Form is king. Do not add weight until you can consistently hit proper depth with a neutral spine. Progress by adding 5-10lbs at a time. If you stall, focus on variations like pause squats or box squats to build strength in weak points.", mistakes: "Not squatting deep enough (half squats); Letting your chest fall forward; Knees caving inward (valgus collapse); Lifting your heels off the ground." },
  "Deadlifts": { muscle: "Full Body", difficulty: "Advanced", equipment: "Barbell", form: "Stand with your mid-foot under the barbell. Hinge at your hips and bend your knees to grip the bar, hands just outside your shins. Keep your back straight, chest up, and shoulders back. Drive through your feet to lift the weight, keeping the bar close to your body. As the bar passes your knees, thrust your hips forward to stand up straight. Lower the bar with control by reversing the motion.", tips: "Take the 'slack' out of the bar before you lift by pulling up slightly until you feel the weight. Your hips and shoulders should rise at the same rate. Wear flat-soled shoes to have a stable base.", progression: "This lift is very taxing. Progress slowly and prioritize recovery. Adding 10lbs at a time is feasible for beginners, but this will slow down. Never sacrifice form for more weight. If your form breaks down on the last rep, the weight is too heavy.", mistakes: "Rounding your lower back (the most dangerous mistake); Jerking the bar off the floor; Letting the bar drift away from your body; Hyperextending your back at the top." }
};

const defaultRoutine = {
  1: { name: "Push (Chest, Shoulders, Triceps)", exercises: [ { id: 1, name: "Flat Barbell Bench Press", sets: 4, targetReps: "6-8", restTime: 180 }, { id: 2, name: "Incline Dumbbell Press", sets: 3, targetReps: "8-10", restTime: 120 }, { id: 3, name: "Overhead Press", sets: 3, targetReps: "6-8", restTime: 180 }, { id: 4, name: "Lateral Raises", sets: 3, targetReps: "12-15", restTime: 90 }, { id: 5, name: "Tricep Rope Pushdowns", sets: 3, targetReps: "10-12", restTime: 90 }, { id: 6, name: "Overhead Dumbbell Extension", sets: 2, targetReps: "10-12", restTime: 90 } ] },
  2: { name: "Pull (Back, Biceps)", exercises: [ { id: 7, name: "Pull-Ups", sets: 4, targetReps: "6-10", restTime: 180 }, { id: 8, name: "Barbell Rows", sets: 4, targetReps: "6-8", restTime: 180 }, { id: 9, name: "Seated Cable Rows", sets: 3, targetReps: "10-12", restTime: 120 }, { id: 10, name: "Face Pulls", sets: 3, targetReps: "12-15", restTime: 90 }, { id: 11, name: "Dumbbell Curls", sets: 3, targetReps: "8-10", restTime: 90 }, { id: 12, name: "Hammer Curls", sets: 2, targetReps: "10-12", restTime: 90 } ] },
  3: { name: "Legs", exercises: [ { id: 13, name: "Back Squats", sets: 4, targetReps: "6-8", restTime: 240 }, { id: 14, name: "Romanian Deadlifts", sets: 3, targetReps: "8-10", restTime: 180 }, { id: 15, name: "Leg Press", sets: 3, targetReps: "10-12", restTime: 120 }, { id: 16, name: "Walking Lunges", sets: 2, targetReps: "10 per leg", restTime: 120 }, { id: 17, name: "Leg Extensions", sets: 3, targetReps: "12-15", restTime: 90 }, { id: 18, name: "Calf Raises", sets: 4, targetReps: "12-15", restTime: 60 } ] },
  4: { name: "Arms + Abs", exercises: [ { id: 19, name: "Close-Grip Bench Press", sets: 4, targetReps: "6-8", restTime: 180 }, { id: 20, name: "Barbell Curls", sets: 4, targetReps: "8-10", restTime: 120 }, { id: 21, name: "Cable Tricep Pushdowns", sets: 3, targetReps: "10-12", restTime: 90 }, { id: 22, name: "Incline Dumbbell Curls", sets: 3, targetReps: "10-12", restTime: 90 }, { id: 23, name: "Skull Crushers", sets: 3, targetReps: "8-10", restTime: 90 }, { id: 24, name: "Hanging Leg Raises", sets: 3, targetReps: "10-15", restTime: 90 }, { id: 25, name: "Cable Crunch", sets: 3, targetReps: "12-15", restTime: 60 } ] },
  5: { name: "Push (Chest, Shoulders, Triceps)", exercises: [ { id: 26, name: "Incline Barbell Bench Press", sets: 4, targetReps: "6-8", restTime: 180 }, { id: 27, name: "Flat Dumbbell Press", sets: 3, targetReps: "8-10", restTime: 120 }, { id: 28, name: "Arnold Press", sets: 3, targetReps: "8-10", restTime: 120 }, { id: 29, name: "Lateral Raises", sets: 3, targetReps: "12-15", restTime: 90 }, { id: 30, name: "Dips", sets: 3, targetReps: "10-12", restTime: 120 }, { id: 31, name: "Overhead Rope Extensions", sets: 2, targetReps: "10-12", restTime: 90 } ] },
  6: { name: "Pull (Back, Biceps)", exercises: [ { id: 32, name: "Deadlifts", sets: 4, targetReps: "4-6", restTime: 300 }, { id: 33, name: "Pull-Ups", sets: 3, targetReps: "6-10", restTime: 180 }, { id: 34, name: "T-Bar Rows", sets: 4, targetReps: "6-8", restTime: 180 }, { id: 35, name: "Single Arm Dumbbell Rows", sets: 3, targetReps: "10-12", restTime: 120 }, { id: 36, name: "Preacher Curls", sets: 3, targetReps: "10-12", restTime: 90 }, { id: 37, name: "Hammer Curls", sets: 2, targetReps: "12", restTime: 90 } ] },
  7: { name: "Legs", exercises: [ { id: 38, name: "Front Squats", sets: 4, targetReps: "6-8", restTime: 240 }, { id: 39, name: "Bulgarian Split Squats", sets: 3, targetReps: "10 per leg", restTime: 120 }, { id: 40, name: "Leg Curls", sets: 3, targetReps: "10-12", restTime: 90 }, { id: 41, name: "Hip Thrusts", sets: 3, targetReps: "8-10", restTime: 120 }, { id: 42, name: "Leg Press", sets: 3, targetReps: "12-15", restTime: 120 }, { id: 43, name: "Calf Raises", sets: 4, targetReps: "12-15", restTime: 60 } ] }
};

const WorkoutTracker = () => {
  // --- STATE MANAGEMENT ---
  const [userId, setUserId] = useState(null);
  const [routine, setRoutine] = useState(defaultRoutine);
  const [exerciseDatabase, setExerciseDatabase] = useState(initialExerciseDatabase);
  const [currentView, setCurrentView] = useState('routine');
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [workoutData, setWorkoutData] = useState({});
  const [showExerciseInfo, setShowExerciseInfo] = useState(null);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [isGenerating, setIsGenerating] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // --- MOCK FIREBASE FUNCTIONS (since we can't use real Firebase in artifacts) ---
  const saveDataToFirestore = useCallback(async (dataToSave) => {
    // Mock function - in real app this would save to Firebase
    console.log("Would save to Firestore:", dataToSave);
  }, [userId]);
  
  // --- LIVE AI FUNCTION ---
  const fetchAiExerciseInfo = async (exerciseName) => {
    console.log(`Fetching REAL AI info for: ${exerciseName}`);
    const apiKey = "AIzaSyDI5aBiF9Nzif5D2Xo3vyitw-fRPy2uPVA";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const prompt = `
      Provide a detailed breakdown for the gym exercise: "${exerciseName}".
      Return ONLY a raw JSON object (no markdown formatting like \`\`\`json) with the following keys: "muscle", "difficulty", "equipment", "form", "tips", "progression", "mistakes".
      - muscle: The primary muscle groups worked (e.g., "Chest, Shoulders, Triceps").
      - difficulty: A single word: "Beginner", "Intermediate", or "Advanced".
      - equipment: The required equipment (e.g., "Dumbbells").
      - form: Step-by-step instructions on how to perform the exercise correctly.
      - tips: Actionable advice for better execution and mind-muscle connection.
      - progression: Specific advice on how to make the exercise harder over time (e.g., "Add 5lbs once you can complete all sets").
      - mistakes: A list of common errors to avoid.
    `;

    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const jsonText = result.candidates[0].content.parts[0].text;
        return JSON.parse(jsonText);
      } else {
        throw new Error("Invalid response structure from AI");
      }
    } catch (error) {
      console.error("Error fetching AI exercise info:", error);
      return {
        muscle: "Error", difficulty: "N/A", equipment: "N/A",
        form: "Could not fetch AI data. Please check your connection or API key.",
        tips: "An error occurred.", progression: "An error occurred.", mistakes: "An error occurred."
      };
    }
  };

  const generateExerciseInfo = async (exerciseName) => {
      const exerciseId = Object.values(routine).flatMap(day => day.exercises).find(ex => ex.name === exerciseName)?.id;
      if (exerciseId) setIsGenerating(prev => ({ ...prev, [exerciseId]: true }));
      try {
          const newInfo = await fetchAiExerciseInfo(exerciseName);
          if (newInfo && newInfo.muscle !== "Error") {
            const newDb = { ...exerciseDatabase, [exerciseName]: newInfo };
            setExerciseDatabase(newDb);
            await saveDataToFirestore({ exerciseDatabase: newDb });
          }
      } catch (error) {
          console.error("Failed to generate exercise info:", error);
      } finally {
          if (exerciseId) setIsGenerating(prev => ({ ...prev, [exerciseId]: false }));
      }
  };

  // --- CORE LOGIC FUNCTIONS ---
  const getProgressionSuggestion = (exerciseName, exerciseHistory) => {
    if (!exerciseHistory || exerciseHistory.length === 0) return { type: "baseline", message: "Start with a comfortable weight to establish your baseline.", suggestion: "Focus on perfect form" };
    const recent = exerciseHistory.slice(0, 3);
    const avgRPE = recent.reduce((sum, w) => {
      const completedSets = w.sets.filter(s => s.weight && s.reps && s.rpe);
      if (completedSets.length === 0) return sum;
      const avgSetRPE = completedSets.reduce((s, set) => s + parseFloat(set.rpe || 0), 0) / completedSets.length;
      return sum + (isNaN(avgSetRPE) ? 0 : avgSetRPE);
    }, 0) / recent.length;
    const lastWorkout = recent[0];
    const bestSet = lastWorkout.sets.reduce((best, set) => {
      const weight = parseFloat(set.weight) || 0;
      const reps = parseInt(set.reps) || 0;
      const volume = weight * reps;
      const bestVolume = (parseFloat(best.weight) || 0) * (parseInt(best.reps) || 0);
      return volume > bestVolume ? set : best;
    }, { weight: 0, reps: 0, rpe: 0 });
    if (avgRPE < 7) return { type: "increase", message: "You're crushing it! Time to level up.", suggestion: `Try ${Math.ceil(parseFloat(bestSet.weight || 0) * 1.025)}lbs or +1-2 reps`, color: "text-green-400" };
    if (avgRPE > 8.5) return { type: "deload", message: "You're pushing hard. Consider a deload.", suggestion: `Drop to ${Math.floor(parseFloat(bestSet.weight || 0) * 0.9)}lbs, focus on form`, color: "text-yellow-400" };
    return { type: "maintain", message: "Perfect intensity! Keep building.", suggestion: `Maintain ${bestSet.weight || 0}lbs, aim for +1 rep`, color: "text-blue-400" };
  };

  const getExerciseHistory = (exerciseName) => {
    return workoutHistory
      .filter(workout => workout.exercises.some(ex => ex.name === exerciseName))
      .map(workout => {
          const exercise = workout.exercises.find(ex => ex.name === exerciseName);
          return { ...exercise, completedAt: workout.completedAt };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  };

  const startWorkout = (dayNumber) => {
    const routineDay = routine[dayNumber];
    if (!routineDay) return;
    const workout = { id: Date.now(), date: new Date().toISOString().split('T')[0], dayNumber: parseInt(dayNumber), name: routineDay.name, startTime: new Date().toISOString(), exercises: routineDay.exercises.map((exercise) => ({ ...exercise, completed: false, sets: Array.from({ length: exercise.sets }, () => ({ weight: '', reps: '', rpe: '' })) })) };
    setActiveWorkout(workout);
    setWorkoutData(workout);
    setWorkoutStartTime(Date.now());
    setCurrentView('workout');
  };

  const updateSet = useCallback((exerciseId, setIndex, field, value) => {
    setWorkoutData(prev => {
        const newExercises = prev.exercises.map(exercise => {
            if (exercise.id === exerciseId) {
                const newSets = exercise.sets.map((set, index) => {
                    if (index === setIndex) {
                        return { ...set, [field]: value };
                    }
                    return set;
                });
                return { ...exercise, sets: newSets };
            }
            return exercise;
        });
        return { ...prev, exercises: newExercises };
    });
  }, []);

  const finishWorkout = async () => {
    const duration = workoutStartTime ? Math.floor((Date.now() - workoutStartTime) / 1000 / 60) : 0;
    const completedWorkout = { ...workoutData, completedAt: new Date().toISOString(), duration };
    
    const newHistory = [completedWorkout, ...workoutHistory];
    const dayJustCompleted = workoutData.dayNumber;
    const nextDay = dayJustCompleted >= Object.keys(routine).length ? 1 : dayJustCompleted + 1;
    
    setWorkoutHistory(newHistory);
    setCurrentDay(nextDay);
    await saveDataToFirestore({ workoutHistory: newHistory, currentDay: nextDay });

    setActiveWorkout(null);
    setWorkoutData({});
    setWorkoutStartTime(null);
    setCurrentView('routine');
  };

  const cancelWorkout = () => {
    setActiveWorkout(null);
    setWorkoutData({});
    setWorkoutStartTime(null);
    setCurrentView('routine');
  };

  const deleteWorkout = (workoutId) => {
    const newHistory = workoutHistory.filter(workout => workout.id !== workoutId);
    setWorkoutHistory(newHistory);
    saveDataToFirestore({ workoutHistory: newHistory });
  };

  const updateRoutine = (newRoutine) => {
    setRoutine(newRoutine);
    saveDataToFirestore({ routine: newRoutine });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getVolumeStats = () => {
    if (workoutHistory.length === 0) return { workouts: 0, sets: 0, avgDuration: 0 };
    const last4Weeks = workoutHistory.filter(w => {
      const date = new Date(w.date);
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
      return date >= fourWeeksAgo;
    });
    if (last4Weeks.length === 0) return { workouts: 0, sets: 0, avgDuration: 0 };
    const totalSets = last4Weeks.reduce((sum, workout) => sum + workout.exercises.reduce((exerciseSum, exercise) => exerciseSum + exercise.sets.filter(set => set.weight && set.reps).length, 0), 0);
    const totalDuration = last4Weeks.reduce((sum, w) => sum + (w.duration || 0), 0);
    const avgDuration = last4Weeks.length > 0 ? totalDuration / last4Weeks.length : 0;
    return { workouts: last4Weeks.length, sets: totalSets, avgDuration: Math.round(avgDuration) };
  };

  // --- UI COMPONENTS ---
  const ExerciseInfoModal = ({ exercise, onClose }) => {
    if (!exercise) return null;
    
    const info = exerciseDatabase[exercise.name] || {
      muscle: "Unknown",
      difficulty: "N/A",
      equipment: "N/A",
      form: "No information available",
      tips: "No tips available",
      progression: "No progression info available",
      mistakes: "No common mistakes listed"
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{exercise.name}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="bg-blue-600 px-3 py-1 rounded-full">{info.muscle}</span>
                <span className="bg-green-600 px-3 py-1 rounded-full">{info.difficulty}</span>
                <span className="bg-purple-600 px-3 py-1 rounded-full">{info.equipment}</span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Proper Form</h3>
                <p className="text-gray-300 leading-relaxed">{info.form}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Tips</h3>
                <p className="text-gray-300 leading-relaxed">{info.tips}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Progression</h3>
                <p className="text-gray-300 leading-relaxed">{info.progression}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Common Mistakes</h3>
                <p className="text-gray-300 leading-relaxed">{info.mistakes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MainView = ({ routine, currentDay, getVolumeStats, setCurrentView, startWorkout, setShowExerciseInfo, userId }) => {
    const stats = getVolumeStats();
    
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Workout Tracker</h1>
              <p className="text-gray-400">Day {currentDay} • {routine[currentDay]?.name}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView('editRoutine')}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Edit3 size={20} />
              </button>
              <button
                onClick={() => setCurrentView('analytics')}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <BarChart3 size={20} />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-400" size={24} />
                <div>
                  <p className="text-gray-400 text-sm">Last 4 Weeks</p>
                  <p className="text-2xl font-bold">{stats.workouts} workouts</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="text-green-400" size={24} />
                <div>
                  <p className="text-gray-400 text-sm">Total Sets</p>
                  <p className="text-2xl font-bold">{stats.sets}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="text-purple-400" size={24} />
                <div>
                  <p className="text-gray-400 text-sm">Avg Duration</p>
                  <p className="text-2xl font-bold">{stats.avgDuration}min</p>
                </div>
              </div>
            </div>
          </div>

          {/* Workout Days */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Workout Routine</h2>
              <button
                onClick={() => setCurrentView('editRoutine')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit3 size={16} />
                Edit Routine
              </button>
            </div>
            
            {/* Day Selection Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {Object.entries(routine).map(([dayNum, day]) => (
                <button
                  key={dayNum}
                  onClick={() => setCurrentDay(parseInt(dayNum))}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    currentDay === parseInt(dayNum)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Day {dayNum}
                </button>
              ))}
            </div>

            {/* Current Day Workout */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">{routine[currentDay]?.name}</h3>
                <button
                  onClick={() => startWorkout(currentDay)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Zap size={16} />
                  Start Day {currentDay}
                </button>
              </div>
              
              <div className="space-y-2">
                {routine[currentDay]?.exercises.map((exercise, index) => (
                  <div key={exercise.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm w-6">{index + 1}.</span>
                      <div>
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-sm text-gray-400">
                          {exercise.sets} sets × {exercise.targetReps} reps • {exercise.restTime}s rest
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowExerciseInfo(exercise)}
                      className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Info size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCurrentView('history')}
              className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-colors flex items-center gap-3"
            >
              <Calendar className="text-blue-400" size={24} />
              <div className="text-left">
                <p className="font-medium">Workout History</p>
                <p className="text-sm text-gray-400">{workoutHistory.length} completed</p>
              </div>
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-colors flex items-center gap-3"
            >
              <TrendingUp className="text-green-400" size={24} />
              <div className="text-left">
                <p className="font-medium">Progress Analytics</p>
                <p className="text-sm text-gray-400">Track your gains</p>
              </div>
            </button>
          </div>
        </div>

        {showExerciseInfo && (
          <ExerciseInfoModal 
            exercise={showExerciseInfo} 
            onClose={() => setShowExerciseInfo(null)} 
          />
        )}
      </div>
    );
  };

  const ActiveWorkoutView = ({ activeWorkout, workoutData, updateSet, finishWorkout, cancelWorkout, setShowExerciseInfo, getExerciseHistory, getProgressionSuggestion }) => {
    if (!workoutData.exercises) return null;

    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">{workoutData.name}</h1>
              <p className="text-gray-400">Day {workoutData.dayNumber}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={cancelWorkout}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={finishWorkout}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                Finish
              </button>
            </div>
          </div>

          {/* Exercises */}
          <div className="space-y-6">
            {workoutData.exercises.map((exercise, exerciseIndex) => (
              <div key={exercise.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{exercise.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {exercise.sets} sets × {exercise.targetReps} reps • Rest {exercise.restTime}s
                    </p>
                  </div>
                  <button
                    onClick={() => setShowExerciseInfo(exercise)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Info size={16} />
                  </button>
                </div>

                {/* Sets */}
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-400 mb-2">
                    <span>Set</span>
                    <span>Weight</span>
                    <span>Reps</span>
                    <span>RPE</span>
                  </div>
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="grid grid-cols-4 gap-2">
                      <div className="flex items-center justify-center bg-gray-700 rounded p-2">
                        {setIndex + 1}
                      </div>
                      <input
                        type="number"
                        placeholder="lbs"
                        value={set.weight}
                        onChange={(e) => updateSet(exercise.id, setIndex, 'weight', e.target.value)}
                        className="bg-gray-700 rounded p-2 text-center"
                      />
                      <input
                        type="number"
                        placeholder="reps"
                        value={set.reps}
                        onChange={(e) => updateSet(exercise.id, setIndex, 'reps', e.target.value)}
                        className="bg-gray-700 rounded p-2 text-center"
                      />
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="10"
                        placeholder="RPE"
                        value={set.rpe}
                        onChange={(e) => updateSet(exercise.id, setIndex, 'rpe', e.target.value)}
                        className="bg-gray-700 rounded p-2 text-center"
                      />
                    </div>
                  ))}
                </div>

                {/* Progress Suggestion */}
                {(() => {
                  const history = getExerciseHistory(exercise.name);
                  if (history.length > 0) {
                    const suggestion = getProgressionSuggestion(exercise.name, history);
                    return (
                      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain size={16} className="text-blue-400" />
                          <span className="text-sm font-medium">AI Suggestion</span>
                        </div>
                        <p className="text-sm text-gray-300">{suggestion.message}</p>
                        <p className={`text-sm ${suggestion.color || 'text-blue-400'}`}>{suggestion.suggestion}</p>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            ))}
          </div>
        </div>

        {showExerciseInfo && (
          <ExerciseInfoModal 
            exercise={showExerciseInfo} 
            onClose={() => setShowExerciseInfo(null)} 
          />
        )}
      </div>
    );
  };

  const HistoryView = ({ workoutHistory, setCurrentView, deleteWorkout, formatDate }) => {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Workout History</h1>
            <button
              onClick={() => setCurrentView('routine')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Back
            </button>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {workoutHistory.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto mb-4 text-gray-600" size={48} />
                <p className="text-gray-400">No workouts completed yet</p>
                <p className="text-gray-500 text-sm">Start your first workout to see it here!</p>
              </div>
            ) : (
              workoutHistory.map((workout) => (
                <div key={workout.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{workout.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {formatDate(workout.completedAt)} • {workout.duration || 0} minutes
                      </p>
                    </div>
                    <button
                      onClick={() => deleteWorkout(workout.id)}
                      className="p-2 text-red-400 hover:bg-red-900 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {workout.exercises.map((exercise) => {
                      const completedSets = exercise.sets.filter(set => set.weight && set.reps);
                      if (completedSets.length === 0) return null;
                      
                      return (
                        <div key={exercise.id} className="text-sm">
                          <span className="text-gray-300">{exercise.name}: </span>
                          {completedSets.map((set, index) => (
                            <span key={index} className="text-gray-400">
                              {set.weight}lbs × {set.reps}
                              {set.rpe && ` (RPE ${set.rpe})`}
                              {index < completedSets.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const AnalyticsView = ({ setCurrentView }) => {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Analytics</h1>
            <button
              onClick={() => setCurrentView('routine')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Back
            </button>
          </div>

          {/* Analytics Content */}
          <div className="space-y-6">
            {workoutHistory.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="mx-auto mb-4 text-gray-600" size={48} />
                <p className="text-gray-400">No data to analyze yet</p>
                <p className="text-gray-500 text-sm">Complete some workouts to see your progress!</p>
              </div>
            ) : (
              <>
                {/* Basic Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-blue-400" size={24} />
                      <div>
                        <p className="text-gray-400 text-sm">Total Workouts</p>
                        <p className="text-2xl font-bold">{workoutHistory.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="text-green-400" size={24} />
                      <div>
                        <p className="text-gray-400 text-sm">Total Sets</p>
                        <p className="text-2xl font-bold">
                          {workoutHistory.reduce((sum, workout) => 
                            sum + workout.exercises.reduce((exerciseSum, exercise) => 
                              exerciseSum + exercise.sets.filter(set => set.weight && set.reps).length, 0), 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="text-purple-400" size={24} />
                      <div>
                        <p className="text-gray-400 text-sm">Total Time</p>
                        <p className="text-2xl font-bold">
                          {Math.round(workoutHistory.reduce((sum, w) => sum + (w.duration || 0), 0) / 60)}h
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="text-yellow-400" size={24} />
                      <div>
                        <p className="text-gray-400 text-sm">Avg Duration</p>
                        <p className="text-2xl font-bold">
                          {workoutHistory.length > 0 ? Math.round(workoutHistory.reduce((sum, w) => sum + (w.duration || 0), 0) / workoutHistory.length) : 0}min
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    {workoutHistory.slice(0, 5).map((workout) => (
                      <div key={workout.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium">{workout.name}</p>
                          <p className="text-sm text-gray-400">{formatDate(workout.completedAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">{workout.duration || 0} min</p>
                          <p className="text-sm text-green-400">
                            {workout.exercises.reduce((sum, ex) => 
                              sum + ex.sets.filter(set => set.weight && set.reps).length, 0)} sets
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const RoutineEditorView = ({ routine, exerciseDatabase, isGenerating, setCurrentView, updateRoutine, generateExerciseInfo }) => {
    const [editingRoutine, setEditingRoutine] = useState(routine);
    const [selectedDay, setSelectedDay] = useState(1);
    const [showExerciseDB, setShowExerciseDB] = useState(false);
    const [showAddExercise, setShowAddExercise] = useState(false);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [localExerciseDB, setLocalExerciseDB] = useState(exerciseDatabase);

    // Update local database when prop changes
    useEffect(() => {
      setLocalExerciseDB(exerciseDatabase);
    }, [exerciseDatabase]);

    const saveRoutine = () => {
      updateRoutine(editingRoutine);
      setCurrentView('routine');
    };

    const addExerciseToDay = (exercise) => {
      const newExercise = {
        id: Date.now(),
        name: exercise,
        sets: 3,
        targetReps: "8-10",
        restTime: 120
      };
      
      setEditingRoutine(prev => ({
        ...prev,
        [selectedDay]: {
          ...prev[selectedDay],
          exercises: [...prev[selectedDay].exercises, newExercise]
        }
      }));
      setShowExerciseDB(false);
    };

    const removeExerciseFromDay = (exerciseId) => {
      setEditingRoutine(prev => ({
        ...prev,
        [selectedDay]: {
          ...prev[selectedDay],
          exercises: prev[selectedDay].exercises.filter(ex => ex.id !== exerciseId)
        }
      }));
    };

    const updateExercise = (exerciseId, field, value) => {
      setEditingRoutine(prev => ({
        ...prev,
        [selectedDay]: {
          ...prev[selectedDay],
          exercises: prev[selectedDay].exercises.map(ex => 
            ex.id === exerciseId ? { ...ex, [field]: value } : ex
          )
        }
      }));
    };

    const updateDayName = (name) => {
      setEditingRoutine(prev => ({
        ...prev,
        [selectedDay]: { ...prev[selectedDay], name }
      }));
    };

    const addNewExerciseToDatabase = async () => {
      if (!newExerciseName.trim()) return;
      
      const exerciseName = newExerciseName.trim();
      
      // Add a placeholder to the local database immediately so it shows up
      const placeholder = {
        muscle: "Loading...",
        difficulty: "N/A",
        equipment: "N/A",
        form: "Generating exercise information...",
        tips: "Please wait while AI generates tips...",
        progression: "Progression info will be available shortly...",
        mistakes: "Common mistakes will be loaded soon..."
      };
      
      // Update local state immediately
      setLocalExerciseDB(prev => ({ ...prev, [exerciseName]: placeholder }));
      
      // Generate AI info in the background
      await generateExerciseInfo(exerciseName);
      
      setNewExerciseName('');
      setShowAddExercise(false);
    };

    const filteredExercises = Object.keys(localExerciseDB).filter(exercise =>
      exercise.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Edit Routine</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowExerciseDB(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Exercise
              </button>
              <button
                onClick={saveRoutine}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                Save
              </button>
              <button
                onClick={() => setCurrentView('routine')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Day Selection */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {Object.entries(editingRoutine).map(([dayNum, day]) => (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(parseInt(dayNum))}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedDay === parseInt(dayNum)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Day {dayNum}
              </button>
            ))}
          </div>

          {/* Day Name Editor */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <label className="block text-sm font-medium mb-2">Day Name</label>
            <input
              type="text"
              value={editingRoutine[selectedDay]?.name || ''}
              onChange={(e) => updateDayName(e.target.value)}
              className="w-full bg-gray-700 rounded-lg p-3 text-white"
              placeholder="Enter day name (e.g., Push Day, Pull Day)"
            />
          </div>

          {/* Exercises Editor */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Exercises</h3>
              <button
                onClick={() => setShowExerciseDB(true)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
              >
                + Add Exercise
              </button>
            </div>

            <div className="space-y-4">
              {editingRoutine[selectedDay]?.exercises.map((exercise, index) => (
                <div key={exercise.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">{exercise.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Sets</label>
                          <input
                            type="number"
                            min="1"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value))}
                            className="w-full bg-gray-600 rounded p-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Target Reps</label>
                          <input
                            type="text"
                            value={exercise.targetReps}
                            onChange={(e) => updateExercise(exercise.id, 'targetReps', e.target.value)}
                            className="w-full bg-gray-600 rounded p-2 text-sm"
                            placeholder="e.g., 8-10"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Rest Time (s)</label>
                          <input
                            type="number"
                            min="30"
                            step="15"
                            value={exercise.restTime}
                            onChange={(e) => updateExercise(exercise.id, 'restTime', parseInt(e.target.value))}
                            className="w-full bg-gray-600 rounded p-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeExerciseFromDay(exercise.id)}
                      className="ml-3 p-2 text-red-400 hover:bg-red-900 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exercise Database Modal */}
        {showExerciseDB && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Exercise Database</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAddExercise(true)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                    >
                      Add New Exercise
                    </button>
                    <button 
                      onClick={() => setShowExerciseDB(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 rounded-lg p-3 text-white"
                  />
                </div>

                {/* Exercise List */}
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredExercises.map((exerciseName) => {
                    const info = localExerciseDB[exerciseName];
                    return (
                      <div key={exerciseName} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{exerciseName}</h3>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs bg-blue-600 px-2 py-1 rounded">{info.muscle}</span>
                            <span className="text-xs bg-green-600 px-2 py-1 rounded">{info.difficulty}</span>
                            <span className="text-xs bg-purple-600 px-2 py-1 rounded">{info.equipment}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {isGenerating[exerciseName] ? (
                            <Loader className="animate-spin" size={16} />
                          ) : (
                            <button
                              onClick={() => generateExerciseInfo(exerciseName)}
                              className="p-2 text-blue-400 hover:bg-blue-900 rounded transition-colors"
                              title="Regenerate AI info"
                            >
                              <Brain size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => addExerciseToDay(exerciseName)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add New Exercise Modal */}
        {showAddExercise && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Add New Exercise</h2>
                  <button 
                    onClick={() => setShowAddExercise(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Exercise Name</label>
                    <input
                      type="text"
                      value={newExerciseName}
                      onChange={(e) => setNewExerciseName(e.target.value)}
                      className="w-full bg-gray-700 rounded-lg p-3 text-white"
                      placeholder="Enter exercise name"
                      onKeyPress={(e) => e.key === 'Enter' && addNewExerciseToDatabase()}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={addNewExerciseToDatabase}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      disabled={!newExerciseName.trim()}
                    >
                      Add Exercise
                    </button>
                    <button
                      onClick={() => setShowAddExercise(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain size={16} className="text-blue-400" />
                    <span className="text-sm font-medium">AI Enhancement</span>
                  </div>
                  <p className="text-xs text-blue-200">
                    Exercise form, tips, and progression will be automatically generated using AI
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };<div className="mt-4 p-3 bg-blue-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain size={16} className="text-blue-400" />
                    <span className="text-sm font-medium">AI Enhancement</span>
                  </div>
                  <p className="text-xs text-blue-200">
                    Exercise form, tips, and progression will be automatically generated using AI
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- MEMOIZED COMPONENTS ---
  const MemoizedExerciseInfoModal = memo(ExerciseInfoModal);
  const MemoizedRoutineEditorView = memo(RoutineEditorView);
  const MemoizedMainView = memo(MainView);
  const MemoizedActiveWorkoutView = memo(ActiveWorkoutView);
  const MemoizedHistoryView = memo(HistoryView);
  const MemoizedAnalyticsView = memo(AnalyticsView);

  // --- VIEW ROUTER ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  switch (currentView) {
    case 'routine':
      return <MemoizedMainView routine={routine} currentDay={currentDay} getVolumeStats={getVolumeStats} setCurrentView={setCurrentView} startWorkout={startWorkout} setShowExerciseInfo={setShowExerciseInfo} userId={userId} />;
    case 'editRoutine':
      return <MemoizedRoutineEditorView routine={routine} exerciseDatabase={exerciseDatabase} isGenerating={isGenerating} setCurrentView={setCurrentView} updateRoutine={updateRoutine} generateExerciseInfo={generateExerciseInfo} />;
    case 'workout':
      return activeWorkout ? <MemoizedActiveWorkoutView activeWorkout={activeWorkout} workoutData={workoutData} updateSet={updateSet} finishWorkout={finishWorkout} cancelWorkout={cancelWorkout} setShowExerciseInfo={(ex) => setShowExerciseInfo(ex)} getExerciseHistory={getExerciseHistory} getProgressionSuggestion={getProgressionSuggestion} /> : <MemoizedMainView routine={routine} currentDay={currentDay} getVolumeStats={getVolumeStats} setCurrentView={setCurrentView} startWorkout={startWorkout} setShowExerciseInfo={setShowExerciseInfo} userId={userId} />;
    case 'history':
      return <MemoizedHistoryView workoutHistory={workoutHistory} setCurrentView={setCurrentView} deleteWorkout={deleteWorkout} formatDate={formatDate} />;
    case 'analytics':
      return <MemoizedAnalyticsView setCurrentView={setCurrentView} />;
    default:
      return <MemoizedMainView routine={routine} currentDay={currentDay} getVolumeStats={getVolumeStats} setCurrentView={setCurrentView} startWorkout={startWorkout} setShowExerciseInfo={setShowExerciseInfo} userId={userId} />;
  }
};

export default WorkoutTracker;