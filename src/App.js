import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Info, Edit3, Save, X, ChevronRight, BarChart3, Brain, Zap, Loader } from 'lucide-react';

const WorkoutTracker = () => {
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

  // --- STATE MANAGEMENT ---
  const [routine, setRoutine] = useState({});
  const [exerciseDatabase, setExerciseDatabase] = useState({});
  const [currentView, setCurrentView] = useState('routine');
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [workoutData, setWorkoutData] = useState({});
  const [showExerciseInfo, setShowExerciseInfo] = useState(null);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [isGenerating, setIsGenerating] = useState({});
  const [isLoading, setIsLoading] = useState(true); // New state for initial loading

  // --- LIVE AI FUNCTION ---
  const fetchAiExerciseInfo = async (exerciseName) => {
    console.log(`Fetching REAL AI info for: ${exerciseName}`);
    const apiKey = "AIzaSyDI5aBiF9Nzif5D2Xo3vyitw-fRPy2uPVA"; // API Key added as requested for testing.
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

  const generateExerciseInfo = async (exerciseName, dayNum, exerciseIdx) => {
      const exerciseId = routine[dayNum].exercises[exerciseIdx].id;
      setIsGenerating(prev => ({ ...prev, [exerciseId]: true }));
      try {
          const newInfo = await fetchAiExerciseInfo(exerciseName);
          if (newInfo && newInfo.muscle !== "Error") {
            setExerciseDatabase(prevDb => ({ ...prevDb, [exerciseName]: newInfo }));
          }
      } catch (error) {
          console.error("Failed to generate exercise info:", error);
      } finally {
          setIsGenerating(prev => ({ ...prev, [exerciseId]: false }));
      }
  };

  // --- LOCALSTORAGE & INITIALIZATION ---
  useEffect(() => {
    try {
        const savedHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
        const savedDay = parseInt(localStorage.getItem('currentDay') || '1');
        const savedRoutine = JSON.parse(localStorage.getItem('routine'));
        const savedDatabase = JSON.parse(localStorage.getItem('exerciseDatabase'));

        setWorkoutHistory(savedHistory);
        setCurrentDay(savedDay);
        setExerciseDatabase(savedDatabase || initialExerciseDatabase);
        setRoutine(savedRoutine || defaultRoutine);
    } catch (error) {
        console.error("Error loading data from localStorage", error);
        localStorage.clear();
        setRoutine(defaultRoutine);
        setExerciseDatabase(initialExerciseDatabase);
    } finally {
        setIsLoading(false); // Data is loaded, stop showing the loading screen
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    if (!isLoading) { // Only save to localStorage after initial load is complete
        localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
        localStorage.setItem('currentDay', currentDay.toString());
        localStorage.setItem('routine', JSON.stringify(routine));
        localStorage.setItem('exerciseDatabase', JSON.stringify(exerciseDatabase));
    }
  }, [workoutHistory, currentDay, routine, exerciseDatabase, isLoading]);

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

  const updateSet = (exerciseId, setIndex, field, value) => {
    setWorkoutData(prev => ({ ...prev, exercises: prev.exercises.map(exercise => exercise.id === exerciseId ? { ...exercise, sets: exercise.sets.map((set, index) => index === setIndex ? { ...set, [field]: value } : set ) } : exercise ) }));
  };

  const finishWorkout = () => {
    const duration = workoutStartTime ? Math.floor((Date.now() - workoutStartTime) / 1000 / 60) : 0;
    const completedWorkout = { ...workoutData, completedAt: new Date().toISOString(), duration };
    setWorkoutHistory(prev => [completedWorkout, ...prev]);
    setActiveWorkout(null);
    const dayJustCompleted = workoutData.dayNumber;
    const nextDay = dayJustCompleted >= Object.keys(routine).length ? 1 : dayJustCompleted + 1;
    setCurrentDay(nextDay);
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
    setWorkoutHistory(prev => prev.filter(workout => workout.id !== workoutId));
  };

  const updateRoutineExercise = (dayNumber, exerciseIndex, field, value) => {
    setRoutine(prev => ({ ...prev, [dayNumber]: { ...prev[dayNumber], exercises: prev[dayNumber].exercises.map((ex, idx) => idx === exerciseIndex ? { ...ex, [field]: value } : ex ) } }));
  };

  const addExerciseToDay = (dayNumber) => {
    const newId = Math.max(0, ...Object.values(routine).flatMap(day => day.exercises.map(ex => ex.id)), ...workoutHistory.flatMap(w => w.exercises.map(ex => ex.id))) + 1;
    setRoutine(prev => ({ ...prev, [dayNumber]: { ...prev[dayNumber], exercises: [...prev[dayNumber].exercises, { id: newId, name: "New Exercise", sets: 3, targetReps: "8-12", restTime: 120 }] } }));
  };

  const removeExerciseFromDay = (dayNumber, exerciseIndex) => {
    setRoutine(prev => ({ ...prev, [dayNumber]: { ...prev[dayNumber], exercises: prev[dayNumber].exercises.filter((_, idx) => idx !== exerciseIndex) } }));
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
    const info = exerciseDatabase[exercise.name] || { muscle: "Unknown", difficulty: "N/A", equipment: "N/A", tips: "No information available. Generate it with AI in the routine editor.", form: "No information available. Generate it with AI in the routine editor.", progression: "No information available. Generate it with AI in the routine editor.", mistakes: "No information available. Generate it with AI in the routine editor." };
    const history = getExerciseHistory(exercise.name);
    const suggestion = getProgressionSuggestion(exercise.name, history);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg">
          <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
            <h2 className="text-xl font-bold">{exercise.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
          </div>
          <div className="p-4 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-400">Primary Muscle:</span><p className="font-semibold text-blue-400">{info.muscle}</p></div>
              <div><span className="text-gray-400">Difficulty:</span><p className="font-semibold">{info.difficulty}</p></div>
              <div><span className="text-gray-400">Equipment:</span><p className="font-semibold">{info.equipment}</p></div>
              <div><span className="text-gray-400">Rest Time:</span><p className="font-semibold">{exercise.restTime}s</p></div>
            </div>
            <div>
              <h3 className="font-semibold text-green-400 mb-2 flex items-center"><Brain size={16} className="mr-2" /> AI Progression Advice</h3>
              <div className={`p-3 bg-gray-700 rounded-lg ${suggestion.color}`}>
                <p className="font-medium">{suggestion.message}</p>
                <p className="text-sm mt-1">{suggestion.suggestion}</p>
              </div>
            </div>
            <div><h3 className="font-semibold text-yellow-400 mb-2">How to Perform</h3><p className="text-sm text-gray-300 whitespace-pre-line">{info.form}</p></div>
            <div><h3 className="font-semibold text-purple-400 mb-2">Pro Tips</h3><p className="text-sm text-gray-300 whitespace-pre-line">{info.tips}</p></div>
            <div><h3 className="font-semibold text-red-400 mb-2">Common Mistakes</h3><p className="text-sm text-gray-300 whitespace-pre-line">{info.mistakes}</p></div>
            <div><h3 className="font-semibold text-cyan-400 mb-2">Progression Strategy</h3><p className="text-sm text-gray-300 whitespace-pre-line">{info.progression}</p></div>
            {history.length > 0 && (
              <div>
                <h3 className="font-semibold text-orange-400 mb-2">Recent Performance</h3>
                <div className="space-y-2">
                  {history.slice(0, 3).map((hist, idx) => {
                    const bestSet = hist.sets.reduce((best, set) => {
                      const weight = parseFloat(set.weight) || 0;
                      return weight > (parseFloat(best.weight) || 0) ? set : best;
                    }, { weight: 0, reps: 0, rpe: 0 });
                    return (
                      <div key={idx} className="flex justify-between text-sm bg-gray-700 p-2 rounded">
                        <div><span className="font-semibold">{bestSet.weight || 0}lbs × {bestSet.reps || 0} reps</span><span className="text-gray-400 ml-2">(RPE {bestSet.rpe || 'N/A'})</span></div>
                        <span className="text-gray-500">{formatDate(hist.completedAt)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const RoutineEditorView = () => (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Routine</h1>
          <button onClick={() => setCurrentView('routine')} className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold"><Save size={16} /><span>Save & Close</span></button>
        </div>
        <div className="space-y-4">
          {Object.entries(routine).map(([dayNum, day]) => (
            <div key={dayNum} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div><h3 className="font-semibold text-lg">Day {dayNum}</h3><input type="text" value={day.name} onChange={(e) => setRoutine(prev => ({...prev, [dayNum]: { ...prev[dayNum], name: e.target.value }}))} className="bg-gray-700 rounded px-2 py-1 text-sm mt-1 w-full" placeholder="Workout Name"/></div>
                <button onClick={() => addExerciseToDay(parseInt(dayNum))} className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"><Plus size={16} /></button>
              </div>
              <div className="space-y-3">
                {day.exercises.map((exercise, idx) => {
                    const hasInfo = exerciseDatabase[exercise.name];
                    const isLoading = isGenerating[exercise.id];
                    return (
                        <div key={exercise.id} className="bg-gray-700 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <input type="text" list="exercise-list" value={exercise.name} onChange={(e) => updateRoutineExercise(parseInt(dayNum), idx, 'name', e.target.value)} className="bg-gray-600 rounded px-2 py-1 text-sm font-semibold w-full" placeholder="Exercise name"/>
                            <div className="flex items-center ml-2">
                                {!hasInfo && (<button onClick={() => generateExerciseInfo(exercise.name, dayNum, idx)} disabled={isLoading} className="p-1 text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed">{isLoading ? <Loader size={16} className="animate-spin" /> : <Brain size={16} />}</button>)}
                                <button onClick={() => removeExerciseFromDay(parseInt(dayNum), idx)} className="p-1 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div><label className="text-xs text-gray-400">Sets</label><input type="number" value={exercise.sets} onChange={(e) => updateRoutineExercise(parseInt(dayNum), idx, 'sets', parseInt(e.target.value) || 0)} className="w-full bg-gray-600 rounded px-2 py-1 text-sm"/></div>
                            <div><label className="text-xs text-gray-400">Reps</label><input type="text" value={exercise.targetReps} onChange={(e) => updateRoutineExercise(parseInt(dayNum), idx, 'targetReps', e.target.value)} className="w-full bg-gray-600 rounded px-2 py-1 text-sm" placeholder="8-12"/></div>
                            <div><label className="text-xs text-gray-400">Rest (s)</label><input type="number" value={exercise.restTime} onChange={(e) => updateRoutineExercise(parseInt(dayNum), idx, 'restTime', parseInt(e.target.value) || 0)} className="w-full bg-gray-600 rounded px-2 py-1 text-sm"/></div>
                          </div>
                        </div>
                    );
                })}
                 <datalist id="exercise-list">{Object.keys(exerciseDatabase).map(name => <option key={name} value={name} />)}</datalist>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MainView = () => {
    const stats = getVolumeStats();
    return (
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <div className="container mx-auto px-4 py-6 max-w-md">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold">Smart Training</h1><p className="text-gray-400">Next Up: Day {currentDay} • {routine[currentDay]?.name || 'Rest Day'}</p></div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentView('analytics')} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700" aria-label="View Analytics"><BarChart3 size={20} /></button>
              <button onClick={() => setCurrentView('history')} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700" aria-label="View History"><Calendar size={20} /></button>
              <button onClick={() => setCurrentView('editRoutine')} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700" aria-label="Edit Routine"><Edit3 size={20} /></button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-3 text-center"><div className="text-blue-400 text-2xl font-bold">{stats.workouts}</div><div className="text-xs text-gray-400">Workouts</div><div className="text-xs text-gray-500">Last 4 weeks</div></div>
            <div className="bg-gray-800 rounded-lg p-3 text-center"><div className="text-green-400 text-2xl font-bold">{stats.sets}</div><div className="text-xs text-gray-400">Total Sets</div><div className="text-xs text-gray-500">Volume</div></div>
            <div className="bg-gray-800 rounded-lg p-3 text-center"><div className="text-purple-400 text-2xl font-bold">{stats.avgDuration}</div><div className="text-xs text-gray-400">Avg Duration</div><div className="text-xs text-gray-500">Minutes</div></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-2">Choose a Session</h2>
            {Object.entries(routine).map(([dayNum, day]) => (
                <div key={dayNum} className={`p-4 rounded-lg transition-all border-2 ${parseInt(dayNum) === currentDay ? 'bg-gray-700 border-green-500' : 'bg-gray-800 border-transparent hover:border-gray-600'}`}>
                    <div className="flex justify-between items-center">
                        <div><p className="text-sm text-gray-400">Day {dayNum}</p><p className="font-bold text-lg">{day.name}</p></div>
                        <button onClick={() => startWorkout(dayNum)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"><Zap size={16} /><span>Start</span></button>
                    </div>
                    {parseInt(dayNum) === currentDay && (<p className="text-xs text-green-400 mt-2 font-semibold">Next up!</p>)}
                </div>
            ))}
          </div>
        </div>
        {showExerciseInfo && <ExerciseInfoModal exercise={showExerciseInfo} onClose={() => setShowExerciseInfo(null)} />}
      </div>
    );
  };

  const ActiveWorkoutView = () => (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div><h1 className="text-2xl font-bold">{activeWorkout.name}</h1><p className="text-gray-400">Log your performance</p></div>
          <button onClick={cancelWorkout} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600" aria-label="Cancel Workout"><X size={16} /></button>
        </div>
        <div className="space-y-4">
          {workoutData.exercises.map((exercise) => {
            const history = getExerciseHistory(exercise.name);
            const suggestion = getProgressionSuggestion(exercise.name, history);
            return (
              <div key={exercise.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">{exercise.name}</h3>
                  <button onClick={() => setShowExerciseInfo(exercise)} className="text-gray-400 hover:text-white"><Info size={18} /></button>
                </div>
                <div className={`p-3 bg-gray-700 rounded-lg mb-4 text-sm ${suggestion.color}`}>
                  <p className="font-medium flex items-center gap-2"><Brain size={16} />{suggestion.message}</p>
                  <p className="text-xs mt-1 pl-6">{suggestion.suggestion}</p>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-400 mb-2">
                  <span>SET</span><span>WEIGHT (lbs)</span><span>REPS</span><span>RPE</span>
                </div>
                <div className="space-y-2">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="grid grid-cols-4 gap-2 items-center">
                      <span className="text-center font-bold text-gray-400">{setIndex + 1}</span>
                      <input type="number" placeholder={history[0]?.sets[setIndex]?.weight || "0"} value={set.weight} onChange={(e) => updateSet(exercise.id, setIndex, 'weight', e.target.value)} className="w-full bg-gray-700 rounded px-2 py-2 text-center"/>
                      <input type="number" placeholder={history[0]?.sets[setIndex]?.reps || "0"} value={set.reps} onChange={(e) => updateSet(exercise.id, setIndex, 'reps', e.target.value)} className="w-full bg-gray-700 rounded px-2 py-2 text-center"/>
                      <input type="number" placeholder={history[0]?.sets[setIndex]?.rpe || "8"} value={set.rpe} onChange={(e) => updateSet(exercise.id, setIndex, 'rpe', e.target.value)} className="w-full bg-gray-700 rounded px-2 py-2 text-center"/>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={finishWorkout} className="w-full mt-6 py-3 bg-green-600 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors">Finish Workout</button>
      </div>
      {showExerciseInfo && <ExerciseInfoModal exercise={showExerciseInfo} onClose={() => setShowExerciseInfo(null)} />}
    </div>
  );

  const HistoryView = () => (
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <div className="container mx-auto px-4 py-6 max-w-md">
          <div className="flex items-center mb-6">
            <button onClick={() => setCurrentView('routine')} className="p-2 mr-4 bg-gray-800 rounded-lg hover:bg-gray-700"><ChevronRight className="transform rotate-180" size={20} /></button>
            <h1 className="text-2xl font-bold">Workout History</h1>
          </div>
          <div className="space-y-4">
            {workoutHistory.length > 0 ? (
              workoutHistory.map(workout => (
                <div key={workout.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{workout.name}</p>
                      <p className="text-sm text-gray-400">{formatDate(workout.date)}</p>
                      <p className="text-xs text-gray-500 mt-1">Duration: {workout.duration || 0} mins</p>
                    </div>
                    <button onClick={() => { if (window.confirm('Are you sure you want to delete this workout?')) { deleteWorkout(workout.id) }}} className="p-2 text-red-500 hover:text-red-400" aria-label="Delete Workout"><Trash2 size={18} /></button>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    {workout.exercises.map(ex => (
                      <div key={ex.id} className="flex justify-between text-gray-300">
                        <span>{ex.name}</span>
                        <span>{ex.sets.filter(s => s.weight && s.reps).length} / {ex.sets.length} sets</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                <Calendar size={48} className="mx-auto mb-4" />
                <p>No workout history yet.</p>
                <p>Complete a workout to see it here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
  );

  const AnalyticsView = () => (
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <div className="container mx-auto px-4 py-6 max-w-md">
          <div className="flex items-center mb-6">
            <button onClick={() => setCurrentView('routine')} className="p-2 mr-4 bg-gray-800 rounded-lg hover:bg-gray-700"><ChevronRight className="transform rotate-180" size={20} /></button>
            <h1 className="text-2xl font-bold">Analytics</h1>
          </div>
          <div className="text-center text-gray-500 py-10 bg-gray-800 rounded-lg">
            <BarChart3 size={48} className="mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white">Analytics Coming Soon!</h2>
            <p>Track your progress with insightful charts and graphs.</p>
          </div>
        </div>
      </div>
  );

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
      return <MainView />;
    case 'editRoutine':
      return <RoutineEditorView />;
    case 'workout':
      return activeWorkout ? <ActiveWorkoutView /> : <MainView />;
    case 'history':
      return <HistoryView />;
    case 'analytics':
      return <AnalyticsView />;
    default:
      return <MainView />;
  }
};

export default WorkoutTracker;
