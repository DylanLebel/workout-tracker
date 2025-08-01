<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Workout Tracker</title>
  <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7/babel.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/firebase@10.12.2/dist/firebase-app.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/firebase@10.12.2/dist/firebase-auth.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/firebase@10.12.2/dist/firebase-database.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lucide@0.441.0/dist/umd/lucide.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useCallback, useMemo } = React;

    // Environment variables should be set in a real environment, mocked here for demo
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "mock-api-key",
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "mock-auth-domain",
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://mock-database-url.firebaseio.com",
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "mock-project-id",
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "mock-storage-bucket",
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "mock-sender-id",
      appId: process.env.REACT_APP_FIREBASE_APP_ID || "mock-app-id",
    };

    // Initial state defaults (placeholders)
    const adminRoutine = { id: "admin", name: "Admin Routine", days: { 1: { name: "Day 1", exercises: [] } } };
    const blankRoutineForNewUsers = { id: "new", name: "New User Routine", days: { 1: { name: "Day 1", exercises: [] } } };
    const initialExerciseDatabase = { "push-up": { name: "Push Up", category: "Chest" } };
    const defaultProfile = { setupComplete: false, name: "New User" };

    // Notification Component
    const Notification = ({ message }) => {
      if (!message) return null;
      return (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {message}
        </div>
      );
    };

    // Loading Component
    const LoadingView = () => (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <lucide-icon name="Loader" className="animate-spin mb-4" size={48}></lucide-icon>
        <p>Loading...</p>
      </div>
    );

    // Auth View Component (Placeholder)
    const AuthView = () => (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
          Sign In (Placeholder)
        </button>
      </div>
    );

    // Main View Component
    const MainView = ({ activeRoutine, startWorkout, error }) => (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 text-red-200 rounded-lg">
            {error}
          </div>
        )}
        <h1 className="text-3xl font-bold mb-4">{activeRoutine?.name || "No Routine Selected"}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(activeRoutine?.days || {}).map((dayNum) => (
            <div key={dayNum} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-semibold">{activeRoutine.days[dayNum].name}</h3>
              <button
                onClick={() => startWorkout(dayNum)}
                className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center"
              >
                <lucide-icon name="Plus" size={18} className="inline mr-2"></lucide-icon>
                Start Workout
              </button>
            </div>
          ))}
        </div>
      </div>
    );

    // Active Workout View Component (Placeholder)
    const ActiveWorkoutView = ({ workout, onFinish }) => (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-4">{workout?.name || "Workout"}</h1>
        <p>Workout in progress (Placeholder)</p>
        <button
          onClick={onFinish}
          className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
        >
          Finish Workout
        </button>
      </div>
    );

    // Profile Setup View Component (Placeholder)
    const ProfileSetupView = ({ onSetupComplete }) => (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Setup Your Profile</h1>
        <button
          onClick={onSetupComplete}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Complete Setup (Placeholder)
        </button>
      </div>
    );

    // Main App Component
    const App = () => {
      // State Management
      const [db, setDb] = useState(null);
      const [auth, setAuth] = useState(null);
      const [user, setUser] = useState(null);
      const [isAuthReady, setIsAuthReady] = useState(false);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState(null);

      const [userProfile, setUserProfile] = useState(null);
      const [routines, setRoutines] = useState(null);
      const [activeRoutineId, setActiveRoutineId] = useState(null);
      const [exerciseDatabase, setExerciseDatabase] = useState(null);
      const [currentView, setCurrentView] = useState("routine");
      const [activeWorkout, setActiveWorkout] = useState(null);
      const [workoutHistory, setWorkoutHistory] = useState([]);
      const [currentDay, setCurrentDay] = useState(1);
      const [notification, setNotification] = useState(null);

      // Memoized active routine
      const activeRoutine = useMemo(() => {
        if (!routines || !activeRoutineId) return null;
        return routines[activeRoutineId];
      }, [routines, activeRoutineId]);

      // Firebase Initialization
      useEffect(() => {
        try {
          const app = firebase.initializeApp(firebaseConfig);
          const authInstance = firebase.auth(app);
          const dbInstance = firebase.database(app);
          setDb(dbInstance);
          setAuth(authInstance);

          const unsubscribe = authInstance.onAuthStateChanged((user) => {
            setUser(user);
            setIsAuthReady(true);
          });
          return () => unsubscribe();
        } catch (e) {
          console.error("Firebase Initialization Error:", e);
          setError("Failed to connect to services. Please try again.");
          setIsLoading(false);
        }
      }, []);

      // Data Fetching
      useEffect(() => {
        if (!isAuthReady || !db || !user) {
          setIsLoading(false);
          return;
        }

        const appId = "my-workout-tracker-app-d8d61";
        const publicExercisesRef = db.ref(`artifacts/${appId}/public/data/exercises`);
        const unsubscribePublic = publicExercisesRef.on(
          "value",
          (snapshot) => {
            const data = snapshot.val() || initialExerciseDatabase;
            setExerciseDatabase(data);
          },
          (err) => {
            console.error("Error fetching exercises:", err);
            setError("Failed to load exercise database.");
            setExerciseDatabase(initialExerciseDatabase);
          }
        );

        const userRef = db.ref(`artifacts/${appId}/users/${user.uid}`);
        const unsubscribePrivate = userRef.on(
          "value",
          (snapshot) => {
            const data = snapshot.val();
            if (data?.profile?.setupComplete) {
              setUserProfile({ ...defaultProfile, ...data.profile });
              setRoutines(data.routines?.allRoutines || { [blankRoutineForNewUsers.id]: blankRoutineForNewUsers });
              setActiveRoutineId(data.routines?.activeRoutineId || blankRoutineForNewUsers.id);
              setWorkoutHistory(data.history || []);
              setCurrentDay(data.currentDay || 1);
            } else {
              setCurrentView("profileSetup");
              setUserProfile(defaultProfile);
              setRoutines({ [blankRoutineForNewUsers.id]: blankRoutineForNewUsers });
              setActiveRoutineId(blankRoutineForNewUsers.id);
            }
            setIsLoading(false);
          },
          (err) => {
            console.error("Error fetching user data:", err);
            setError("Failed to load your data.");
            setIsLoading(false);
          }
        );

        return () => {
          unsubscribePublic();
          unsubscribePrivate();
        };
      }, [isAuthReady, db, user]);

      // Data Saving
      const saveDataToRTDB = useCallback(async (dataToSave) => {
        if (!db || !user) return;
        const userRef = db.ref(`artifacts/my-workout-tracker-app-d8d61/users/${user.uid}`);
        try {
          await userRef.update(dataToSave);
          setNotification("Data saved successfully!");
          setTimeout(() => setNotification(null), 3000);
        } catch (e) {
          console.error("Error saving data:", e);
          setError("Failed to save changes.");
        }
      }, [db, user]);

      // Core Logic
      const startWorkout = useCallback((dayNumber) => {
        const routineDay = activeRoutine?.days[dayNumber];
        if (!routineDay) return;

        const workout = {
          id: Date.now(),
          date: new Date().toISOString().split("T")[0],
          dayNumber: parseInt(dayNumber),
          name: routineDay.name,
          exercises: routineDay.exercises.map((ex) => ({
            ...ex,
            sets: Array(ex.sets || 3).fill({ weight: "", reps: "", rpe: "" }),
          })),
        };
        setActiveWorkout(workout);
        setCurrentView("workout");
      }, [activeRoutine]);

      const finishWorkout = useCallback(() => {
        if (!activeWorkout) return;
        const updatedHistory = [...workoutHistory, activeWorkout];
        setWorkoutHistory(updatedHistory);
        saveDataToRTDB({ history: updatedHistory });
        setActiveWorkout(null);
        setCurrentView("routine");
      }, [activeWorkout, workoutHistory, saveDataToRTDB]);

      const completeProfileSetup = useCallback(() => {
        const updatedProfile = { ...userProfile, setupComplete: true };
        setUserProfile(updatedProfile);
        saveDataToRTDB({ profile: updatedProfile });
        setCurrentView("routine");
      }, [userProfile, saveDataToRTDB]);

      // Render Logic
      if (isLoading || !isAuthReady) return <LoadingView />;

      if (!user) return <AuthView />;

      return (
        <div className="font-sans relative">
          <Notification message={notification} />
          {currentView === "routine" && (
            <MainView activeRoutine={activeRoutine} startWorkout={startWorkout} error={error} />
          )}
          {currentView === "workout" && (
            <ActiveWorkoutView workout={activeWorkout} onFinish={finishWorkout} />
          )}
          {currentView === "profileSetup" && (
            <ProfileSetupView onSetupComplete={completeProfileSetup} />
          )}
        </div>
      );
    };

    // Render the App
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
  </script>
</body>
</html>