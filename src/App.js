import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, Plus, Trash2, Info, Edit3, Save, X, BarChart3, Brain, Zap, Loader, Clock, Target, TrendingUp, User, Copy, Sparkles, Settings, List, Dumbbell, LogOut } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, collection, writeBatch, query } from 'firebase/firestore';

// --- INITIAL STATE & DEFAULTS ---
const newDefaultRoutine = {
  id: `routine_${Date.now()}`,
  name: "My First Routine",
  days: {
    1: { name: "Push (Chest + Shoulders + Triceps)", exercises: [ { id: 1, name: "Flat Dumbbell Bench Press", sets: 4, targetReps: "2x 6-8, 2x 10-12", restTime: 120 }, { id: 2, name: "Incline Barbell Press", sets: 4, targetReps: "8-10", restTime: 120 }, { id: 3, name: "Smith Machine Incline Press", sets: 3, targetReps: "10-12 (slow negatives)", restTime: 90 }] },
    2: { name: "Pull (Back + Biceps)", exercises: [ { id: 9, name: "Pull-Ups (Weighted)", sets: 4, targetReps: "6-10", restTime: 150 }, { id: 10, name: "Wide-Grip Lat Pulldown", sets: 4, targetReps: "8-10", restTime: 120 }, { id: 11, name: "Smith Underhand Row", sets: 4, targetReps: "8-10", restTime: 120 }] },
    3: { name: "Legs (Quads + Hamstrings + Calves)", exercises: [ { id: 16, name: "Seated Hamstring Curl", sets: 4, targetReps: "8-12 (last set drop)", restTime: 90 }, { id: 17, name: "Pendulum Squat", sets: 4, targetReps: "6-8 heavy, 10-12 lighter", restTime: 180 }, { id: 18, name: "Walking Dumbbell Lunges", sets: 3, targetReps: "10 steps/leg", restTime: 120 }] },
  }
};

const initialExerciseDatabase = {
  "Flat Dumbbell Bench Press": { muscle: "Chest, Triceps, Shoulders", difficulty: "Beginner", equipment: "Dumbbells", form: "Lie on a flat bench with a dumbbell in each hand resting on top of your thighs. Use your thighs to help push the dumbbells up one at a time. Once at shoulder width, rotate your wrists forward so that the palms of your hands are facing away from you. This will be your starting position. As you breathe in, come down slowly until you feel a stretch on your chest. Push the dumbbells back to the starting position as you breathe out. This is one rep.", tips: "Keep the dumbbells over your chest, not your face. Don't arch your back excessively.", progression: "Increase weight or reps.", mistakes: "Bouncing the weights; not controlling the descent." },
  "Incline Barbell Press": { muscle: "Upper Chest, Shoulders", difficulty: "Intermediate", equipment: "Barbell", form: "Lie back on an incline bench. Grip the barbell with a medium-width grip. Lift the bar from the rack and hold it straight over you with your arms locked. Lower the bar slowly to your upper chest as you breathe in. Push the bar back to the starting position as you breathe out. This is one rep.", tips: "Set the incline to 30-45 degrees. Keep your feet flat on the floor for stability.", progression: "Add weight to the bar.", mistakes: "Bouncing the bar off your chest; flaring elbows too wide." },
  "Pull-Ups (Weighted)": { muscle: "Back, Biceps", difficulty: "Advanced", equipment: "Pull-up bar, Dip belt", form: "Attach a weight to a dip belt around your waist. Grab the pull-up bar with an overhand grip, slightly wider than shoulder-width. Hang with your arms fully extended. Pull your body up until your chin is over the bar. Lower your body back down to the starting position. This is one rep.", tips: "Focus on squeezing your lats to initiate the pull. Keep your core tight.", progression: "Increase the weight.", mistakes: "Using momentum (kipping); not using a full range of motion." },
};

const defaultProfile = {
    name: '', age: '', gender: 'Prefer not to say', weight: '',
    goal: 'Bodybuilding', experience: 'Intermediate', daysPerWeek: 7,
};

const App = () => {
    // Firebase and Auth State
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // App-specific State
    const [userProfile, setUserProfile] = useState(null);
    const [routines, setRoutines] = useState(null);
    const [activeRoutineId, setActiveRoutineId] = useState(null);
    const [exerciseDatabase, setExerciseDatabase] = useState(null);
    const [currentView, setCurrentView] = useState('routine');
    const [activeWorkout, setActiveWorkout] = useState(null);
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [currentDay, setCurrentDay] = useState(1);
    const [workoutData, setWorkoutData] = useState({});
    const [showExerciseInfo, setShowExerciseInfo] = useState(null);
    const [workoutStartTime, setWorkoutStartTime] = useState(null);
    const [isGenerating, setIsGenerating] = useState({});
    const [notification, setNotification] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const activeRoutine = useMemo(() => {
        if (!routines || !activeRoutineId) return null;
        return routines[activeRoutineId];
    }, [routines, activeRoutineId]);

    // --- FIREBASE INITIALIZATION & AUTH ---
    useEffect(() => {
        try {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
            
            if (!firebaseConfig.apiKey) {
                console.error("Firebase config is missing.");
                setIsLoading(false);
                return;
            }

            const app = initializeApp(firebaseConfig);
            const authInstance = getAuth(app);
            const dbInstance = getFirestore(app);
            setDb(dbInstance);
            setAuth(authInstance);

            const unsubscribe = onAuthStateChanged(authInstance, (user) => {
                setUser(user);
                setIsAuthReady(true);
            });
            return () => unsubscribe();
        } catch (e) {
            console.error("Firebase Initialization Error:", e);
            setError("Could not connect to services.");
            setIsLoading(false);
        }
    }, []);

    // --- DATA FETCHING (PUBLIC & PRIVATE) ---
    useEffect(() => {
        if (!isAuthReady || !db) return;

        if (!user) {
            setIsLoading(false);
            return;
        }

        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        
        const publicExercisesCollectionRef = collection(db, "artifacts", appId, "public", "data", "exercises");
        const unsubscribePublic = onSnapshot(query(publicExercisesCollectionRef), (snapshot) => {
            const exercises = {};
            if (snapshot.empty) {
                const batch = writeBatch(db);
                Object.entries(initialExerciseDatabase).forEach(([name, data]) => {
                    const docRef = doc(publicExercisesCollectionRef, name);
                    batch.set(docRef, data);
                    exercises[name] = data;
                });
                batch.commit();
            } else {
                snapshot.forEach(doc => { exercises[doc.id] = doc.data(); });
            }
            setExerciseDatabase(exercises);
        }, (err) => {
            console.error("Error fetching public exercises:", err);
            setError("Could not load exercise database.");
            setExerciseDatabase(initialExerciseDatabase);
        });

        const userDocRef = doc(db, "artifacts", appId, "users", user.uid, "workoutData", "data");
        const unsubscribePrivate = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const parsedProfile = data.profile ? JSON.parse(data.profile) : {};
                
                if (!parsedProfile.name) setCurrentView('profileSetup');
                
                try {
                    setUserProfile({ ...defaultProfile, ...parsedProfile });
                    
                    if (data.routines) {
                        const routinesData = JSON.parse(data.routines);
                        setRoutines(routinesData.allRoutines);
                        setActiveRoutineId(routinesData.activeRoutineId);
                    } else {
                         const newRoutinesData = { activeRoutineId: newDefaultRoutine.id, allRoutines: { [newDefaultRoutine.id]: newDefaultRoutine } };
                         setRoutines(newRoutinesData.allRoutines);
                         setActiveRoutineId(newRoutinesData.activeRoutineId);
                    }

                    setWorkoutHistory(data.history ? JSON.parse(data.history) : []);
                    setCurrentDay(data.currentDay || 1);
                } catch (e) {
                    console.error("Error parsing user data from Firestore:", e);
                    setError("There was an issue loading your saved data.");
                }
            } else {
                setCurrentView('profileSetup');
                const newRoutinesData = { activeRoutineId: newDefaultRoutine.id, allRoutines: { [newDefaultRoutine.id]: newDefaultRoutine } };
                setUserProfile(defaultProfile);
                setRoutines(newRoutinesData.allRoutines);
                setActiveRoutineId(newRoutinesData.activeRoutineId);
                setWorkoutHistory([]);
                setCurrentDay(1);
                setDoc(userDocRef, { 
                    profile: JSON.stringify(defaultProfile),
                    routines: JSON.stringify(newRoutinesData),
                    history: JSON.stringify([]),
                    currentDay: 1
                });
            }
            setIsLoading(false);
        }, (err) => {
            console.error("Error fetching user data:", err);
            setError("Could not load your personal data.");
            setIsLoading(false);
        });

        return () => {
            unsubscribePublic();
            unsubscribePrivate();
        };
    }, [isAuthReady, db, user]);

    // --- DATA SAVING ---
    const saveDataToFirestore = useCallback(async (dataToSave) => {
        if (!db || !user) return;
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const userDocRef = doc(db, "artifacts", appId, "users", user.uid, "workoutData", "data");
        try {
            const sanitizedData = {};
            if (dataToSave.profile) sanitizedData.profile = JSON.stringify(dataToSave.profile);
            if (dataToSave.routines) sanitizedData.routines = JSON.stringify({ activeRoutineId, allRoutines: routines, ...dataToSave.routines });
            if (dataToSave.workoutHistory) sanitizedData.history = JSON.stringify(dataToSave.workoutHistory);
            if (dataToSave.currentDay) sanitizedData.currentDay = dataToSave.currentDay;
            await setDoc(userDocRef, sanitizedData, { merge: true });
        } catch (e) {
            console.error("Error saving data to Firestore:", e);
            setError("Could not save your changes.");
        }
    }, [db, user, routines, activeRoutineId]);
    
    const saveExerciseToPublicDB = useCallback(async (exerciseName, exerciseData) => {
        if (!db) return;
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const exerciseDocRef = doc(db, "artifacts", appId, "public", "data", "exercises", exerciseName);
        try {
            await setDoc(exerciseDocRef, exerciseData, { merge: true });
        } catch(e) {
            console.error("Error saving exercise to public DB:", e);
            setError("Could not save new exercise.");
        }
    }, [db]);

    // --- NOTIFICATION HELPER ---
    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    // --- AI & EXERCISE INFO ---
    const callGeminiAPI = async (prompt) => {
        const apiKey = ""; // Leave empty, handled by environment
        const model = "gemini-2.5-flash-preview-05-20";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API Error: ${response.status} ${errorBody}`);
            }
            const data = await response.json();
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error("Invalid response structure from API");
            }
        } catch (err) {
            console.error("Gemini API call failed:", err);
            setError("An error occurred while communicating with the AI. Please try again.");
            return null;
        }
    };

    const fetchAiExerciseInfo = async (exerciseName) => {
        setIsGenerating(prev => ({ ...prev, [exerciseName]: true }));
        const prompt = `Provide a detailed guide for the exercise: "${exerciseName}". Respond in JSON format with the following keys: "muscle", "difficulty", "equipment", "form", "tips", "progression", "mistakes".`;
        const resultText = await callGeminiAPI(prompt);
        setIsGenerating(prev => ({ ...prev, [exerciseName]: false }));
        if (resultText) {
            try {
                const cleanedJsonString = resultText.replace(/```json|```/g, '').trim();
                return JSON.parse(cleanedJsonString);
            } catch (e) {
                console.error("Failed to parse AI response:", e);
                setError("AI returned an invalid format.");
                return null;
            }
        }
        return null;
    };

    const generateExerciseInfo = async (exerciseName) => {
        const newInfo = await fetchAiExerciseInfo(exerciseName);
        if (newInfo) {
            await saveExerciseToPublicDB(exerciseName, newInfo);
        }
    };

    const analyzeRoutine = async (routineToAnalyze, profileToAnalyze, isDayAnalysis = false, dayData = null) => {
        setIsAnalyzing(true);
        setAnalysisResult(null);
        setError(null);
        
        const analysisTarget = isDayAnalysis 
            ? `this specific workout day: ${JSON.stringify(dayData, null, 2)}`
            : `the following weekly workout routine: ${JSON.stringify(routineToAnalyze, null, 2)}`;

        const prompt = `
            As an expert fitness coach, analyze ${analysisTarget} based on the user's profile.

            User Profile:
            - Name: ${profileToAnalyze.name || 'Not provided'}
            - Age: ${profileToAnalyze.age || 'Not provided'}
            - Gender: ${profileToAnalyze.gender || 'Not provided'}
            - Weight: ${profileToAnalyze.weight || 'Not provided'} lbs
            - Primary Goal: ${profileToAnalyze.goal}
            - Experience Level: ${profileToAnalyze.experience}
            - Training Days per Week: ${profileToAnalyze.daysPerWeek}

            Evaluate these key areas based on their goal:
            1.  **Volume & Intensity:** Is the number of exercises and sets appropriate for the targeted muscles and the user's goal/experience?
            2.  **Exercise Selection:** Are the chosen exercises optimal for their goal? (e.g., compound vs. isolation movements). Suggest alternatives if necessary.
            3.  **Structure & Balance:** Does the workout make sense? For a full routine, is the split balanced? For a single day, is the muscle grouping logical (e.g., a "Chest and Back" day)?

            Provide a concise summary and a few actionable recommendations in Markdown format.
        `;
        const result = await callGeminiAPI(prompt);
        if (result) {
            setAnalysisResult(result);
        }
        setIsAnalyzing(false);
    };


    // --- CORE APP LOGIC ---
    const getProgressionSuggestion = useCallback((exerciseName, exerciseHistory) => {
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
    }, []);

    const getExerciseHistory = useCallback((exerciseName) => {
        return workoutHistory.filter(workout => workout.exercises.some(ex => ex.name === exerciseName)).map(workout => {
            const exercise = workout.exercises.find(ex => ex.name === exerciseName);
            return { ...exercise, completedAt: workout.completedAt };
        }).filter(Boolean).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    }, [workoutHistory]);

    const startWorkout = useCallback((dayNumber) => {
        const routineDay = activeRoutine.days[dayNumber];
        if (!routineDay) return;
        const workout = { id: Date.now(), date: new Date().toISOString().split('T')[0], dayNumber: parseInt(dayNumber), name: routineDay.name, exercises: routineDay.exercises.map(exercise => ({ ...exercise, completed: false, sets: Array.from({ length: exercise.sets }, () => ({ weight: '', reps: '', rpe: '' })) })) };
        setActiveWorkout(workout);
        setWorkoutData(workout);
        setWorkoutStartTime(Date.now());
        setCurrentView('workout');
    }, [activeRoutine]);

    const updateSet = useCallback((exerciseId, setIndex, field, value) => {
        setWorkoutData(prev => {
          const newExercises = prev.exercises.map(exercise => {
            if (exercise.id === exerciseId) {
              const newSets = [...exercise.sets];
              newSets[setIndex] = { ...newSets[setIndex], [field]: value };
              return { ...exercise, sets: newSets };
            }
            return exercise;
          });
          return { ...prev, exercises: newExercises };
        });
    }, []);

    const finishWorkout = useCallback(async () => {
        const duration = workoutStartTime ? Math.floor((Date.now() - workoutStartTime) / 1000 / 60) : 0;
        const completedWorkout = { ...workoutData, completedAt: new Date().toISOString(), duration };
        const newHistory = [completedWorkout, ...workoutHistory];
        const dayJustCompleted = workoutData.dayNumber;
        const nextDay = dayJustCompleted >= Object.keys(activeRoutine.days).length ? 1 : dayJustCompleted + 1;
        await saveDataToFirestore({ workoutHistory: newHistory, currentDay: nextDay });
        setActiveWorkout(null);
        setWorkoutData({});
        setWorkoutStartTime(null);
        setCurrentView('routine');
    }, [workoutData, workoutHistory, workoutStartTime, activeRoutine, saveDataToFirestore]);

    const cancelWorkout = useCallback(() => {
        setActiveWorkout(null);
        setWorkoutData({});
        setWorkoutStartTime(null);
        setCurrentView('routine');
    }, []);

    const deleteWorkout = useCallback(async (workoutId) => {
        const newHistory = workoutHistory.filter(workout => workout.id !== workoutId);
        await saveDataToFirestore({ workoutHistory: newHistory });
    }, [workoutHistory, saveDataToFirestore]);

    const updateRoutines = useCallback(async (newRoutines, newActiveId) => {
        const updatedRoutines = {
            activeRoutineId: newActiveId || activeRoutineId,
            allRoutines: newRoutines || routines
        };
        setRoutines(updatedRoutines.allRoutines);
        setActiveRoutineId(updatedRoutines.activeRoutineId);
        await saveDataToFirestore({ routines: updatedRoutines });
    }, [routines, activeRoutineId, saveDataToFirestore]);

    const updateUserProfile = useCallback(async (newProfile) => {
        setUserProfile(newProfile);
        await saveDataToFirestore({ profile: newProfile });
    }, [saveDataToFirestore]);

    const formatDate = useCallback((dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }, []);

    const getVolumeStats = useMemo(() => {
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
    }, [workoutHistory]);


    // --- UI COMPONENTS ---
    
    const Notification = ({ message }) => {
        if (!message) return null;
        return (
            <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce z-[100]">
                {message}
            </div>
        );
    };

    const UserDisplay = ({ user }) => {
        const handleLogout = () => {
            signOut(auth);
        };
        return (
            <div className="absolute top-4 right-4 bg-gray-800 p-2 rounded-lg flex items-center gap-2 text-xs z-10">
                <button onClick={() => setCurrentView('profile')} className="p-1 hover:bg-gray-700 rounded"><Settings size={14} /></button>
                <span className="text-gray-300">{user.email || 'Anonymous'}</span>
                <button onClick={handleLogout} className="p-1 hover:bg-gray-700 rounded"><LogOut size={14} /></button>
            </div>
        );
    };

    const ExerciseInfoModal = ({ exercise, onClose }) => {
        if (!exercise) return null;
        const info = exerciseDatabase[exercise.name] || {};
        return (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-white">{exercise.name}</h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-blue-600 px-3 py-1 rounded-full text-white">{info.muscle}</span>
                    <span className="bg-green-600 px-3 py-1 rounded-full text-white">{info.difficulty}</span>
                    <span className="bg-purple-600 px-3 py-1 rounded-full text-white">{info.equipment}</span>
                  </div>
                  <div><h3 className="text-lg font-semibold text-white mb-2 border-b border-gray-700 pb-1">Proper Form</h3><p className="text-gray-300 leading-relaxed">{info.form}</p></div>
                  <div><h3 className="text-lg font-semibold text-white mb-2 border-b border-gray-700 pb-1">Tips for Success</h3><p className="text-gray-300 leading-relaxed">{info.tips}</p></div>
                  <div><h3 className="text-lg font-semibold text-white mb-2 border-b border-gray-700 pb-1">Progression Strategy</h3><p className="text-gray-300 leading-relaxed">{info.progression}</p></div>
                  <div><h3 className="text-lg font-semibold text-white mb-2 border-b border-gray-700 pb-1">Common Mistakes</h3><p className="text-gray-300 leading-relaxed">{info.mistakes}</p></div>
                </div>
              </div>
            </div>
          </div>
        );
    };

    const AnalysisModal = ({ result, onClose, isLoading }) => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Sparkles className="text-purple-400" /> AI Routine Analysis</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-64">
                                <Loader className="animate-spin text-purple-400" size={48} />
                                <p className="mt-4 text-gray-300">Analyzing your routine...</p>
                            </div>
                        ) : (
                            <div className="prose prose-invert prose-sm sm:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: result ? result.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') : '' }}></div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const MainView = () => (
      <div className="min-h-screen bg-gray-900 text-white font-sans relative">
        <div className="container mx-auto p-4 sm:p-6">
          {error && <div className="mb-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg flex justify-between items-center"><p className="text-red-200">{error}</p><button onClick={() => setError(null)} className="text-red-300 hover:text-red-100"><X size={20} /></button></div>}
          <div className="flex justify-between items-center mb-8">
            <div><h1 className="text-3xl font-bold">{activeRoutine.name}</h1><p className="text-gray-400">Next: Day {currentDay} • {activeRoutine.days[currentDay]?.name}</p></div>
            <div className="flex gap-2">
                <button onClick={() => setCurrentView('exerciseDatabase')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" title="Exercise Database"><Dumbbell size={20} /></button>
                <button onClick={() => setCurrentView('routineManager')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" title="Manage Routines"><List size={20} /></button>
                <button onClick={() => setCurrentView('editRoutine')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" title="Edit Routine"><Edit3 size={20} /></button>
                <button onClick={() => setCurrentView('analytics')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" title="Analytics"><BarChart3 size={20} /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-lg"><div className="flex items-center gap-3"><Calendar className="text-blue-400" size={24} /><div><p className="text-gray-400 text-sm">Last 4 Weeks</p><p className="text-2xl font-bold">{getVolumeStats.workouts} workouts</p></div></div></div>
            <div className="bg-gray-800 p-4 rounded-lg"><div className="flex items-center gap-3"><Target className="text-green-400" size={24} /><div><p className="text-gray-400 text-sm">Total Sets</p><p className="text-2xl font-bold">{getVolumeStats.sets}</p></div></div></div>
            <div className="bg-gray-800 p-4 rounded-lg"><div className="flex items-center gap-3"><Clock className="text-purple-400" size={24} /><div><p className="text-gray-400 text-sm">Avg Duration</p><p className="text-2xl font-bold">{getVolumeStats.avgDuration} min</p></div></div></div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">{Object.keys(activeRoutine.days).map((dayNum) => (<button key={dayNum} onClick={() => setCurrentDay(parseInt(dayNum))} className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-sm font-medium ${currentDay === parseInt(dayNum) ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Day {dayNum}</button>))}</div>
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-4"><h3 className="text-xl font-semibold">{activeRoutine.days[currentDay]?.name}</h3><button onClick={() => startWorkout(currentDay)} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition-transform transform hover:scale-105 flex items-center justify-center gap-2"><Zap size={18} />Start Day {currentDay} Workout</button></div>
              <div className="space-y-2">{activeRoutine.days[currentDay]?.exercises.map((exercise, index) => (<div key={exercise.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"><div className="flex items-center gap-3"><span className="text-gray-400 text-sm w-6">{index + 1}.</span><div><p className="font-medium">{exercise.name}</p><p className="text-sm text-gray-400">{exercise.sets} sets × {exercise.targetReps} reps • {exercise.restTime}s rest</p></div></div><button onClick={() => setShowExerciseInfo(exercise)} className="p-2 hover:bg-gray-600 rounded-full transition-colors" title="Exercise Info"><Info size={18} /></button></div>))}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => setCurrentView('history')} className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-colors flex items-center gap-3"><Calendar className="text-blue-400" size={24} /><div className="text-left"><p className="font-medium">Workout History</p><p className="text-sm text-gray-400">{workoutHistory.length} completed</p></div></button>
            <button onClick={() => setCurrentView('analytics')} className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-colors flex items-center gap-3"><TrendingUp className="text-green-400" size={24} /><div className="text-left"><p className="font-medium">Progress Analytics</p><p className="text-sm text-gray-400">Track your gains</p></div></button>
          </div>
        </div>
        {showExerciseInfo && <ExerciseInfoModal exercise={showExerciseInfo} onClose={() => setShowExerciseInfo(null)} />}
      </div>
    );

    const ActiveWorkoutView = () => {
        if (!workoutData.exercises) return <MainView />;
        return (
          <div className="min-h-screen bg-gray-900 text-white font-sans">
            <div className="container mx-auto p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <div><h1 className="text-2xl font-bold">{workoutData.name}</h1><p className="text-gray-400">Day {workoutData.dayNumber}</p></div>
                <div className="flex gap-2"><button onClick={cancelWorkout} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Cancel</button><button onClick={finishWorkout} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-bold">Finish</button></div>
              </div>
              <div className="space-y-6">{workoutData.exercises.map((exercise, exIndex) => (<div key={exercise.id} className="bg-gray-800 rounded-lg p-4 sm:p-6"><div className="flex justify-between items-center mb-4"><div><h3 className="text-lg font-semibold">{exIndex + 1}. {exercise.name}</h3><p className="text-gray-400 text-sm">Target: {exercise.targetReps} reps • Rest {exercise.restTime}s</p></div><button onClick={() => setShowExerciseInfo(exercise)} className="p-2 hover:bg-gray-700 rounded-full transition-colors" title="Exercise Info"><Info size={18} /></button></div><div className="space-y-2"><div className="hidden sm:grid grid-cols-4 gap-2 text-sm font-medium text-gray-400 mb-2 px-2"><span>Set</span><span>Weight (lbs)</span><span>Reps</span><span>RPE</span></div>{exercise.sets.map((set, setIndex) => (<div key={setIndex} className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-700/50 p-2 rounded-md items-center"><div className="flex items-center justify-center font-bold text-lg sm:text-base"><span className="sm:hidden mr-2 text-gray-400 text-xs">SET</span> {setIndex + 1}</div><input type="number" placeholder="Weight" value={set.weight} onChange={(e) => updateSet(exercise.id, setIndex, 'weight', e.target.value)} className="bg-gray-700 rounded p-2 text-center w-full" aria-label="Weight"/><input type="number" placeholder="Reps" value={set.reps} onChange={(e) => updateSet(exercise.id, setIndex, 'reps', e.target.value)} className="bg-gray-700 rounded p-2 text-center w-full" aria-label="Reps"/><input type="number" step="0.5" min="1" max="10" placeholder="RPE" value={set.rpe} onChange={(e) => updateSet(exercise.id, setIndex, 'rpe', e.target.value)} className="bg-gray-700 rounded p-2 text-center w-full" aria-label="RPE"/></div>))}</div>{(() => { const history = getExerciseHistory(exercise.name); if (history.length > 0) { const suggestion = getProgressionSuggestion(exercise.name, history); return (<div className="mt-4 p-3 bg-blue-900/50 rounded-lg border border-blue-800"><div className="flex items-center gap-2 mb-1"><Brain size={16} className="text-blue-400" /><span className="text-sm font-medium text-white">AI Suggestion</span></div><p className="text-sm text-gray-300">{suggestion.message}</p><p className={`text-sm font-bold ${suggestion.color || 'text-blue-400'}`}>{suggestion.suggestion}</p></div>); } return null; })()}</div>))}</div>
            </div>
            {showExerciseInfo && <ExerciseInfoModal exercise={showExerciseInfo} onClose={() => setShowExerciseInfo(null)} />}
          </div>
        );
    };

    const HistoryView = () => (
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <div className="container mx-auto p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Workout History</h1><button onClick={() => setCurrentView('routine')} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Back</button></div>
          <div className="space-y-4">{workoutHistory.length === 0 ? (<div className="text-center py-12 bg-gray-800 rounded-lg"><Calendar className="mx-auto mb-4 text-gray-600" size={48} /><p className="text-gray-400">No workouts completed yet</p><p className="text-gray-500 text-sm">Start your first workout to see it here!</p></div>) : (workoutHistory.map((workout) => (<div key={workout.id} className="bg-gray-800 rounded-lg p-4"><div className="flex justify-between items-start mb-3"><div><h3 className="font-semibold">{workout.name}</h3><p className="text-gray-400 text-sm">{formatDate(workout.completedAt)} • {workout.duration || 0} minutes</p></div><button onClick={() => deleteWorkout(workout.id)} className="p-2 text-red-400 hover:bg-red-900/50 rounded-full transition-colors" title="Delete Workout"><Trash2 size={16} /></button></div><div className="space-y-2 border-t border-gray-700 pt-3">{workout.exercises.map((exercise) => { const completedSets = exercise.sets.filter(set => set.weight && set.reps); if (completedSets.length === 0) return null; return (<div key={exercise.id} className="text-sm"><span className="text-gray-300 font-medium">{exercise.name}: </span>{completedSets.map((set, index) => (<span key={index} className="text-gray-400">{set.weight}lbs × {set.reps}{set.rpe && ` (RPE ${set.rpe})`}{index < completedSets.length - 1 ? ' / ' : ''}</span>))}</div>); })}</div></div>)))}</div>
        </div>
      </div>
    );

    const AnalyticsView = () => (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
          <div className="container mx-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Analytics</h1><button onClick={() => setCurrentView('routine')} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Back</button></div>
            <div className="space-y-6">{workoutHistory.length === 0 ? (<div className="text-center py-12 bg-gray-800 rounded-lg"><BarChart3 className="mx-auto mb-4 text-gray-600" size={48} /><p className="text-gray-400">No data to analyze yet</p><p className="text-gray-500 text-sm">Complete some workouts to see your progress!</p></div>) : (<>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg"><div className="flex items-center gap-3"><Calendar className="text-blue-400" size={24} /><div><p className="text-gray-400 text-sm">Total Workouts</p><p className="text-2xl font-bold">{workoutHistory.length}</p></div></div></div>
                  <div className="bg-gray-800 p-4 rounded-lg"><div className="flex items-center gap-3"><Target className="text-green-400" size={24} /><div><p className="text-gray-400 text-sm">Total Sets</p><p className="text-2xl font-bold">{workoutHistory.reduce((s, w) => s + w.exercises.reduce((es, e) => es + e.sets.filter(set => set.weight && set.reps).length, 0), 0)}</p></div></div></div>
                  <div className="bg-gray-800 p-4 rounded-lg"><div className="flex items-center gap-3"><Clock className="text-purple-400" size={24} /><div><p className="text-gray-400 text-sm">Total Time</p><p className="text-2xl font-bold">{Math.round(workoutHistory.reduce((s, w) => s + (w.duration || 0), 0) / 60)}h</p></div></div></div>
                  <div className="bg-gray-800 p-4 rounded-lg"><div className="flex items-center gap-3"><TrendingUp className="text-yellow-400" size={24} /><div><p className="text-gray-400 text-sm">Avg Duration</p><p className="text-2xl font-bold">{workoutHistory.length > 0 ? Math.round(workoutHistory.reduce((s, w) => s + (w.duration || 0), 0) / workoutHistory.length) : 0} min</p></div></div></div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6"><h2 className="text-xl font-semibold mb-4">Recent Activity</h2><div className="space-y-3">{workoutHistory.slice(0, 5).map((workout) => (<div key={workout.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg"><div><p className="font-medium">{workout.name}</p><p className="text-sm text-gray-400">{formatDate(workout.completedAt)}</p></div><div className="text-right"><p className="text-sm text-gray-400">{workout.duration || 0} min</p><p className="text-sm text-green-400">{workout.exercises.reduce((s, e) => s + e.sets.filter(set => set.weight && set.reps).length, 0)} sets</p></div></div>))}</div></div>
            </>)}</div>
          </div>
        </div>
    );

    const RoutineEditorView = () => {
        const [editingRoutine, setEditingRoutine] = useState(JSON.parse(JSON.stringify(activeRoutine)));
        const [selectedDay, setSelectedDay] = useState(1);
        const [showExerciseDB, setShowExerciseDB] = useState(false);
        const [showAddExercise, setShowAddExercise] = useState(false);
        const [newExerciseName, setNewExerciseName] = useState('');
        const [searchTerm, setSearchTerm] = useState('');
    
        const saveRoutine = () => { 
            const newRoutines = {...routines, [activeRoutineId]: editingRoutine };
            updateRoutines(newRoutines);
            setCurrentView('routine'); 
        };
        const addExerciseToDay = (exerciseName) => { const newEx = { id: Date.now(), name: exerciseName, sets: 3, targetReps: "8-12", restTime: 120 }; setEditingRoutine(p => ({ ...p, days: { ...p.days, [selectedDay]: { ...p.days[selectedDay], exercises: [...p.days[selectedDay].exercises, newEx] } } })); setShowExerciseDB(false); setSearchTerm(''); };
        const removeExerciseFromDay = (exerciseId) => { setEditingRoutine(p => ({ ...p, days: { ...p.days, [selectedDay]: { ...p.days[selectedDay], exercises: p.days[selectedDay].exercises.filter(ex => ex.id !== exerciseId) } } })); };
        const updateExercise = (exerciseId, field, value) => { setEditingRoutine(p => ({ ...p, days: { ...p.days, [selectedDay]: { ...p.days[selectedDay], exercises: p.days[selectedDay].exercises.map(ex => ex.id === exerciseId ? { ...ex, [field]: value } : ex) } } })); };
        const addNewDay = () => {
            const newDayNum = Object.keys(editingRoutine.days).length + 1;
            setEditingRoutine(p => ({ ...p, days: { ...p.days, [newDayNum]: { name: `New Day ${newDayNum}`, exercises: [] } } }));
            setSelectedDay(newDayNum);
        };
        const deleteDay = (dayNumToDelete) => {
            const newDays = { ...editingRoutine.days };
            delete newDays[dayNumToDelete];
            const renumberedDays = {};
            Object.values(newDays).forEach((day, index) => {
                renumberedDays[index + 1] = day;
            });
            setEditingRoutine(p => ({ ...p, days: renumberedDays }));
            setSelectedDay(1);
        };
        const addNewExerciseToDatabase = async () => { if (!newExerciseName.trim() || exerciseDatabase[newExerciseName.trim()]) return; const exerciseName = newExerciseName.trim(); await saveExerciseToPublicDB(exerciseName, { muscle: "...", difficulty: "...", equipment: "...", form: "...", tips: "...", progression: "...", mistakes: "..." }); await generateExerciseInfo(exerciseName); setShowAddExercise(false); setNewExerciseName(''); };
        const filteredExercises = Object.keys(exerciseDatabase).filter(ex => ex.toLowerCase().includes(searchTerm.toLowerCase()));
    
        return (
          <div className="min-h-screen bg-gray-900 text-white font-sans">
            <div className="container mx-auto p-4 sm:p-6">
              {error && <div className="mb-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg flex justify-between items-center"><p className="text-red-200">{error}</p><button onClick={() => setError(null)} className="text-red-300 hover:text-red-100"><X size={20} /></button></div>}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit: {editingRoutine.name}</h1>
                <div className="flex gap-2">
                    <button onClick={() => analyzeRoutine(editingRoutine, userProfile)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2 font-bold" disabled={isAnalyzing}> {isAnalyzing ? <Loader className="animate-spin" size={16} /> : <Sparkles size={16} />} Analyze Full Routine</button>
                    <button onClick={saveRoutine} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2 font-bold"><Save size={16} />Save</button>
                    <button onClick={() => setCurrentView('routine')} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Cancel</button>
                </div>
              </div>
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 items-center">
                {Object.keys(editingRoutine.days).map((dayNum) => (
                    <div key={dayNum} className="relative group">
                        <button onClick={() => setSelectedDay(parseInt(dayNum))} className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors text-sm font-medium ${selectedDay === parseInt(dayNum) ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Day {dayNum}</button>
                        <button onClick={() => deleteDay(dayNum)} className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                    </div>
                ))}
                <button onClick={addNewDay} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full"><Plus size={16} /></button>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-lg font-semibold">Day {selectedDay} Name</label>
                    <button onClick={() => analyzeRoutine(null, userProfile, true, editingRoutine.days[selectedDay])} className="px-3 py-1 bg-purple-600/70 hover:bg-purple-700 rounded-lg text-sm transition-colors flex items-center gap-2" disabled={isAnalyzing}><Sparkles size={14} /> Analyze Day</button>
                </div>
                <input type="text" value={editingRoutine.days[selectedDay]?.name || ''} onChange={(e) => setEditingRoutine(p => ({...p, days: {...p.days, [selectedDay]: {...p.days[selectedDay], name: e.target.value}} }))} className="w-full bg-gray-700 rounded-lg p-3 text-white" placeholder="e.g., Push Day, Pull Day"/>
              </div>
              <div className="bg-gray-800 rounded-lg p-6"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">Exercises for Day {selectedDay}</h3><button onClick={() => setShowExerciseDB(true)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors flex items-center gap-1"><Plus size={14}/>Add</button></div><div className="space-y-4">{editingRoutine.days[selectedDay]?.exercises.map((exercise) => (<div key={exercise.id} className="bg-gray-700 rounded-lg p-4"><div className="flex justify-between items-start mb-3"><h4 className="font-medium flex-1">{exercise.name}</h4><button onClick={() => removeExerciseFromDay(exercise.id)} className="ml-3 p-2 text-red-400 hover:bg-red-900/50 rounded-full transition-colors" title="Remove Exercise"><Trash2 size={16} /></button></div><div className="grid grid-cols-1 md:grid-cols-3 gap-3"><div><label className="block text-xs text-gray-400 mb-1">Sets</label><input type="number" min="1" value={exercise.sets} onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value))} className="w-full bg-gray-600 rounded p-2 text-sm"/></div><div><label className="block text-xs text-gray-400 mb-1">Target Reps</label><input type="text" value={exercise.targetReps} onChange={(e) => updateExercise(exercise.id, 'targetReps', e.target.value)} className="w-full bg-gray-600 rounded p-2 text-sm" placeholder="e.g., 8-12"/></div><div><label className="block text-xs text-gray-400 mb-1">Rest Time (s)</label><input type="number" min="30" step="15" value={exercise.restTime} onChange={(e) => updateExercise(exercise.id, 'restTime', parseInt(e.target.value))} className="w-full bg-gray-600 rounded p-2 text-sm"/></div></div></div>))}{editingRoutine.days[selectedDay]?.exercises.length === 0 && <p className="text-center text-gray-500 py-4">No exercises for this day. Add some!</p>}</div></div>
            </div>
            {showExerciseDB && (<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"><div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-700"><div className="p-6 border-b border-gray-700"><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Exercise Database</h2><button onClick={() => setShowExerciseDB(false)} className="text-gray-400 hover:text-white"><X size={24} /></button></div><div className="flex gap-2"><input type="text" placeholder="Search exercises..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-700 rounded-lg p-3 text-white"/><button onClick={() => setShowAddExercise(true)} className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors flex-shrink-0">New</button></div></div><div className="flex-grow overflow-y-auto p-6 space-y-2">{filteredExercises.map((exName) => (<div key={exName} className="bg-gray-700 rounded-lg p-3 flex justify-between items-center"><div><h3 className="font-medium">{exName}</h3><p className="text-xs text-gray-400">{exerciseDatabase[exName].muscle}</p></div><div className="flex items-center gap-2">{isGenerating[exName] ? <Loader className="animate-spin text-blue-400" size={20} /> : <button onClick={() => generateExerciseInfo(exName)} className="p-2 text-blue-400 hover:bg-blue-900/50 rounded-full" title="Regenerate AI info"><Brain size={16} /></button>}<button onClick={() => addExerciseToDay(exName)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">Add</button></div></div>))}</div></div></div>)}
            {showAddExercise && (<div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-[60]"><div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700"><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Add New Exercise</h2><button onClick={() => setShowAddExercise(false)} className="text-gray-400 hover:text-white"><X size={24} /></button></div><div className="space-y-4"><div><label className="block text-sm font-medium mb-2">Exercise Name</label><input type="text" value={newExerciseName} onChange={(e) => setNewExerciseName(e.target.value)} className="w-full bg-gray-700 rounded-lg p-3 text-white" placeholder="e.g., Cable Flys" onKeyPress={(e) => e.key === 'Enter' && addNewExerciseToDatabase()}/></div><div className="p-3 bg-blue-900/50 rounded-lg border border-blue-800"><div className="flex items-center gap-2 mb-1"><Brain size={16} className="text-blue-400" /><span className="text-sm font-medium">AI Enhancement</span></div><p className="text-xs text-blue-200">Form, tips, and other details will be auto-generated by AI.</p></div><div className="flex gap-2"><button onClick={addNewExerciseToDatabase} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors" disabled={!newExerciseName.trim()}>Add & Generate</button></div></div></div></div>)}
            {(isAnalyzing || analysisResult) && <AnalysisModal result={analysisResult} onClose={() => setAnalysisResult(null)} isLoading={isAnalyzing} />}
          </div>
        );
    };

    const ProfileView = ({ isSetup = false }) => {
        const [editingProfile, setEditingProfile] = useState(userProfile);
    
        const handleSave = () => {
            updateUserProfile(editingProfile);
            showNotification(isSetup ? "Profile Created!" : "Profile Saved!");
            setCurrentView('routine');
        };

        return (
            <div className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center p-4">
                <div className="container mx-auto max-w-2xl">
                    <div className="bg-gray-800 rounded-lg shadow-xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">{isSetup ? "Welcome! Let's Set Up Your Profile" : "My Profile"}</h1>
                            {!isSetup && <button onClick={() => setCurrentView('routine')} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Back</button>}
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Name</label>
                                    <input type="text" placeholder="Your Name" value={editingProfile.name} onChange={(e) => setEditingProfile(p => ({...p, name: e.target.value}))} className="w-full bg-gray-700 rounded-lg p-3 text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Age</label>
                                    <input type="number" placeholder="Your Age" value={editingProfile.age} onChange={(e) => setEditingProfile(p => ({...p, age: e.target.value}))} className="w-full bg-gray-700 rounded-lg p-3 text-white" />
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Gender</label>
                                    <select value={editingProfile.gender} onChange={(e) => setEditingProfile(p => ({...p, gender: e.target.value}))} className="w-full bg-gray-700 rounded-lg p-3 text-white appearance-none">
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Prefer not to say</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Weight (lbs)</label>
                                    <input type="number" placeholder="Your Weight" value={editingProfile.weight} onChange={(e) => setEditingProfile(p => ({...p, weight: e.target.value}))} className="w-full bg-gray-700 rounded-lg p-3 text-white" />
                                </div>
                            </div>
                            <hr className="border-gray-700" />
                            <div>
                                <label className="block text-sm font-medium mb-2">Primary Goal</label>
                                <select value={editingProfile.goal} onChange={(e) => setEditingProfile(p => ({...p, goal: e.target.value}))} className="w-full bg-gray-700 rounded-lg p-3 text-white appearance-none">
                                    <option>Bodybuilding</option>
                                    <option>Powerlifting</option>
                                    <option>General Fitness</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Experience Level</label>
                                <select value={editingProfile.experience} onChange={(e) => setEditingProfile(p => ({...p, experience: e.target.value}))} className="w-full bg-gray-700 rounded-lg p-3 text-white appearance-none">
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Training Days Per Week</label>
                                <input type="number" min="1" max="7" value={editingProfile.daysPerWeek} onChange={(e) => setEditingProfile(p => ({...p, daysPerWeek: parseInt(e.target.value) || 1}))} className="w-full bg-gray-700 rounded-lg p-3 text-white" />
                            </div>
                            <button onClick={handleSave} className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-2 font-bold text-lg mt-4">
                                <Save size={18} />
                                {isSetup ? "Save and Get Started" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const RoutineManagerView = () => {
        const [newRoutineName, setNewRoutineName] = useState("");

        const handleCreateNew = () => {
            if (!newRoutineName.trim()) return;
            const newId = `routine_${Date.now()}`;
            const newRoutine = {
                id: newId,
                name: newRoutineName,
                days: { 1: { name: "New Day 1", exercises: [] } }
            };
            const newRoutines = {...routines, [newId]: newRoutine };
            updateRoutines(newRoutines, newId);
            setNewRoutineName("");
            showNotification("New routine created!");
        };

        const handleDelete = (routineId) => {
            if (Object.keys(routines).length <= 1) {
                setError("You must have at least one routine.");
                return;
            }
            if (window.confirm("Are you sure you want to delete this routine? This cannot be undone.")) {
                const newRoutines = {...routines};
                delete newRoutines[routineId];
                const newActiveId = activeRoutineId === routineId ? Object.keys(newRoutines)[0] : activeRoutineId;
                updateRoutines(newRoutines, newActiveId);
                showNotification("Routine deleted.");
            }
        };

        return (
            <div className="min-h-screen bg-gray-900 text-white font-sans">
                <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Manage Routines</h1>
                        <button onClick={() => setCurrentView('routine')} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Back</button>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold">My Routines</h2>
                        {Object.values(routines).map(r => (
                            <div key={r.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                                <span>{r.name}</span>
                                <div className="flex gap-2">
                                    {activeRoutineId === r.id ? (
                                        <span className="px-3 py-1 text-xs bg-green-600 rounded-full">Active</span>
                                    ) : (
                                        <button onClick={() => updateRoutines(routines, r.id)} className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded-full">Set Active</button>
                                    )}
                                    <button onClick={() => handleDelete(r.id)} className="p-2 text-red-400 hover:bg-red-900/50 rounded-full"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 mt-6 space-y-4">
                        <h2 className="text-lg font-semibold">Create New Routine</h2>
                        <div className="flex gap-2">
                            <input type="text" value={newRoutineName} onChange={e => setNewRoutineName(e.target.value)} placeholder="New routine name..." className="w-full bg-gray-700 rounded-lg p-3 text-white" />
                            <button onClick={handleCreateNew} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold">Create</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ExerciseDatabaseView = () => {
        const [searchTerm, setSearchTerm] = useState('');
        const filteredExercises = Object.entries(exerciseDatabase).filter(([name, data]) => 
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            data.muscle.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="min-h-screen bg-gray-900 text-white font-sans">
                <div className="container mx-auto p-4 sm:p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Exercise Database</h1>
                        <button onClick={() => setCurrentView('routine')} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">Back</button>
                    </div>
                    <div className="mb-6">
                        <input type="text" placeholder="Search exercises by name or muscle..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-800 rounded-lg p-3 text-white border border-gray-700" />
                    </div>
                    <div className="space-y-3">
                        {filteredExercises.map(([name, data]) => (
                            <div key={name} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-lg">{name}</h3>
                                    <p className="text-sm text-gray-400">{data.muscle}</p>
                                </div>
                                <button onClick={() => setShowExerciseInfo({ name, ...data })} className="p-2 hover:bg-gray-700 rounded-full transition-colors"><Info size={18} /></button>
                            </div>
                        ))}
                    </div>
                </div>
                {showExerciseInfo && <ExerciseInfoModal exercise={showExerciseInfo} onClose={() => setShowExerciseInfo(null)} />}
            </div>
        );
    };

    if (isLoading || !isAuthReady) {
        return (
          <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <Loader className="animate-spin mb-4" size={48} />
            <p>Loading...</p>
          </div>
        );
    }

    if (!user) {
        return <AuthView auth={auth} error={error} setError={setError} />;
    }
    
    if (!exerciseDatabase || !userProfile || !routines) {
        return (
          <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <Loader className="animate-spin mb-4" size={48} />
            <p>Loading your data...</p>
          </div>
        );
    }
    
    const views = {
        'routine': <MainView />,
        'editRoutine': <RoutineEditorView />,
        'workout': <ActiveWorkoutView />,
        'history': <HistoryView />,
        'analytics': <AnalyticsView />,
        'profile': <ProfileView />,
        'profileSetup': <ProfileView isSetup={true} />,
        'routineManager': <RoutineManagerView />,
        'exerciseDatabase': <ExerciseDatabaseView />,
    };
    
    return (
        <div className="font-sans relative">
            <Notification message={notification} />
            {currentView !== 'profileSetup' && user && <UserDisplay user={user} />}
            {views[currentView] || <MainView />}
        </div>
    );
};

const AuthView = ({ auth, error, setError }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            setError(error.message.replace('Firebase: ', ''));
        }
        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            setError(error.message.replace('Firebase: ', ''));
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold text-center mb-2">AI Workout Tracker</h1>
                <p className="text-center text-gray-400 mb-6">{isLogin ? "Welcome back!" : "Create your account"}</p>
                
                {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4 text-sm">{error}</p>}

                <form onSubmit={handleAuthAction} className="space-y-4">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full bg-gray-700 p-3 rounded-lg" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full bg-gray-700 p-3 rounded-lg" />
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold flex items-center justify-center">
                        {loading ? <Loader className="animate-spin" size={20} /> : (isLogin ? 'Log In' : 'Sign Up')}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-600" />
                    <span className="mx-4 text-gray-500">OR</span>
                    <hr className="flex-grow border-gray-600" />
                </div>

                <button onClick={handleGoogleSignIn} disabled={loading} className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg font-bold flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.057 4.844C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.596 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                    Sign in with Google
                </button>

                <p className="text-center mt-6 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-blue-400 hover:underline ml-1">
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default App;
