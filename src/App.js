import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Firebase Auth imports (needed for the AuthView component)
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth';

// Firebase Database imports
import {
  ref,
  onValue,
  set,
  update
} from 'firebase/database';

// Firebase Functions import
import { httpsCallable } from 'firebase/functions';

// Your Firebase instances
import { auth, db, functions } from './firebase';

// Lucide React icons
import {
  Calendar,
  Plus,
  Trash2,
  Info,
  Edit3,
  Save,
  X,
  BarChart3,
  Brain,
  Zap,
  Loader,
  Clock,
  Target,
  TrendingUp,
  Dumbbell,
  LogOut,
  Settings,
  List,
  ChevronUp,
  ChevronDown,
  Sparkles
} from 'lucide-react';

// Your custom components
import { useProgressionSuggestion } from './hooks/useProgressionSuggestion';
import ActiveWorkoutView from './components/ActiveWorkoutView';
import RoutineEditorView from './components/RoutineEditorView';
import MainView from './components/MainView';
import HistoryView from './components/HistoryView';



// --- Static Data and Constants ---
const adminRoutine = {
  id: 'routine_admin_1',
  name: 'Bodybuilding Split',
  days: {
    1: { name: 'Push (Chest + Shoulders + Triceps)', exercises: [ { id: 1, name: 'Flat Dumbbell Bench Press', sets: 4, targetReps: '2x 6-8, 2x 10-12', restTime: 120 }, { id: 2, name: 'Incline Barbell Press', sets: 4, targetReps: '8-10', restTime: 120 }, { id: 3, name: 'Smith Machine Incline Press', sets: 3, targetReps: '10-12 (slow negatives)', restTime: 90 }, { id: 4, name: 'Cable Fly (High to Low)', sets: 3, targetReps: '12-15 (2s squeeze)', restTime: 60 }, { id: 5, name: 'Overhead Rope Tricep Extension', sets: 3, targetReps: '10-12', restTime: 60 }, { id: 6, name: 'V-Bar Pushdown', sets: 3, targetReps: '10-12 + drop set', restTime: 60 }, { id: 7, name: 'Dumbbell Lateral Raise', sets: 4, targetReps: '12-15', restTime: 60 }, { id: 8, name: 'Face Pull', sets: 3, targetReps: '12-15', restTime: 60 } ] },
    2: { name: 'Pull (Back + Biceps)', exercises: [ { id: 9, name: 'Pull-Ups (Weighted)', sets: 4, targetReps: '6-10', restTime: 150 }, { id: 10, name: 'Wide-Grip Lat Pulldown', sets: 4, targetReps: '8-10', restTime: 120 }, { id: 11, name: 'Smith Underhand Row', sets: 4, targetReps: '8-10', restTime: 120 }, { id: 12, name: 'Seated Single-Arm Cable Row', sets: 3, targetReps: '10-12 per arm', restTime: 90 }, { id: 13, name: 'Dumbbell Bicep Curl (Seated)', sets: 3, targetReps: '8-10', restTime: 60 }, { id: 14, name: 'Incline Dumbbell Curl', sets: 3, targetReps: '10-12', restTime: 60 }, { id: 15, name: 'Reverse Pec Deck', sets: 3, targetReps: '12-15', restTime: 60 } ] },
    3: { name: 'Legs (Quads + Hamstrings + Calves)', exercises: [ { id: 16, name: 'Seated Hamstring Curl', sets: 4, targetReps: '8-12 (last set drop)', restTime: 90 }, { id: 17, name: 'Pendulum Squat', sets: 4, targetReps: '6-8 heavy, 10-12 lighter', restTime: 180 }, { id: 18, name: 'Walking Dumbbell Lunges', sets: 3, targetReps: '10 steps/leg', restTime: 120 }, { id: 19, name: 'Leg Press (Feet Low)', sets: 4, targetReps: '8-10', restTime: 120 }, { id: 20, name: 'Leg Extension', sets: 3, targetReps: '12-15 (slow squeeze)', restTime: 90 }, { id: 21, name: 'Cable Abductor', sets: 3, targetReps: '12-15', restTime: 60 }, { id: 22, name: 'Standing Calf Raise', sets: 5, targetReps: '10-12 (2s squeeze)', restTime: 60 } ] },
    4: { name: 'Arms + Abs', exercises: [ { id: 23, name: 'Seated Dumbbell Curl', sets: 3, targetReps: '8-10', restTime: 60 }, { id: 24, name: 'Preacher Curl', sets: 3, targetReps: '8-12', restTime: 60 }, { id: 25, name: 'Hammer Curl', sets: 3, targetReps: '10-12', restTime: 60 }, { id: 26, name: 'Overhead Rope Extension', sets: 3, targetReps: '8-10', restTime: 60 }, { id: 27, name: 'V-Bar Pushdowns', sets: 3, targetReps: '10-12 + drop set', restTime: 60 }, { id: 28, name: 'Dips', sets: 3, targetReps: '8-12 (to failure)', restTime: 90 }, { id: 29, name: 'Cable Crunch', sets: 3, targetReps: '12-15', restTime: 60 }, { id: 30, name: 'Hanging Knee Raises', sets: 3, targetReps: '10-12', restTime: 60 }, { id: 31, name: 'Plank', sets: 2, targetReps: '45 sec', restTime: 60 } ] },
    5: { name: 'Push (Chest + Shoulders + Triceps)', exercises: [ { id: 32, name: 'Flat Barbell Bench Press', sets: 4, targetReps: '6-8 heavy, 10-12 lighter', restTime: 150 }, { id: 33, name: 'Incline Dumbbell Press', sets: 4, targetReps: '8-10', restTime: 120 }, { id: 34, name: 'Cable Fly (Low to High)', sets: 3, targetReps: '12-15', restTime: 60 }, { id: 35, name: 'Overhead Rope Extension', sets: 3, targetReps: '8-10', restTime: 60 }, { id: 36, name: 'V-Bar Pushdown', sets: 3, targetReps: '10-12', restTime: 60 }, { id: 37, name: 'Dumbbell Lateral Raise', sets: 4, targetReps: '12-15', restTime: 60 }, { id: 38, name: 'Face Pull', sets: 3, targetReps: '12-15', restTime: 60 } ] },
    6: { name: 'Pull (Back + Biceps)', exercises: [ { id: 39, name: 'Pull-Ups (Weighted)', sets: 4, targetReps: '6-10', restTime: 150 }, { id: 40, name: 'Wide Lat Pulldown', sets: 4, targetReps: '8-10', restTime: 120 }, { id: 41, name: 'Dumbbell Row (One Arm)', sets: 4, targetReps: '8-10 per side', restTime: 90 }, { id: 42, name: 'Lat Pullovers', sets: 3, targetReps: '12-15', restTime: 90 }, { id: 43, name: 'Incline Dumbbell Curl', sets: 3, targetReps: '8-10', restTime: 60 }, { id: 44, name: 'Spider Curl', sets: 3, targetReps: '10-12', restTime: 60 }, { id: 45, name: 'Face Pull', sets: 3, targetReps: '12-15', restTime: 60 } ] },
    7: { name: 'Legs + Abs', exercises: [ { id: 46, name: 'Seated Hamstring Curl', sets: 4, targetReps: '8-12', restTime: 90 }, { id: 47, name: 'Bulgarian Split Squat', sets: 3, targetReps: '8-10 each leg', restTime: 120 }, { id: 48, name: 'Smith Squat', sets: 4, targetReps: '6-8 heavy, 10-12 lighter', restTime: 180 }, { id: 49, name: 'Leg Extension', sets: 3, targetReps: '12-15', restTime: 90 }, { id: 50, name: 'Hip Thrust', sets: 3, targetReps: '8-10', restTime: 120 }, { id: 51, name: 'Standing Calf Raise', sets: 5, targetReps: '10-12', restTime: 60 }, { id: 52, name: 'Cable Crunch', sets: 3, targetReps: '12-15', restTime: 60 }, { id: 53, name: 'Side Plank', sets: 2, targetReps: '30 sec each side', restTime: 60 }, { id: 54, name: 'Decline Sit-Ups', sets: 3, targetReps: '10-12', restTime: 60 } ] }
  }
};

const blankRoutineForNewUsers = {
  id: 'routine_blank_1',
  name: 'My First Routine',
  days: {
    1: { name: 'New Day', exercises: [] }
  }
};

const initialExerciseDatabase = {
  'Flat Dumbbell Bench Press': { muscle: 'Chest, Triceps, Shoulders', difficulty: 'Beginner', equipment: 'Dumbbells', form: 'Lie on a flat bench with a dumbbell in each hand resting on top of your thighs. Use your thighs to help push the dumbbells up one at a time. Once at shoulder width, rotate your wrists forward so that the palms of your hands are facing away from you. As you breathe in, come down slowly until you feel a stretch on your chest. Push the dumbbells back to the starting position as you breathe out.', tips: 'Keep the dumbbells over your chest, not your face. Do not arch your back excessively.', progression: 'Increase weight or reps.', mistakes: 'Bouncing the weights; not controlling the descent.' },
  'Incline Barbell Press': { muscle: 'Upper Chest, Shoulders', difficulty: 'Intermediate', equipment: 'Barbell', form: 'Lie back on an incline bench. Grip the barbell with a medium-width grip. Lift the bar from the rack and hold it straight over you with your arms locked. Lower the bar slowly to your upper chest as you breathe in. Push the bar back to the starting position as you breathe out.', tips: 'Set the incline to 30-45 degrees. Keep your feet flat on the floor.', progression: 'Add weight to the bar.', mistakes: 'Bouncing the bar off your chest; flaring elbows too wide.' },
  'Pull-Ups (Weighted)': { muscle: 'Back, Biceps', difficulty: 'Advanced', equipment: 'Pull-up bar, Dip belt', form: 'Attach a weight to a dip belt around your waist. Grab the pull-up bar with an overhand grip, slightly wider than shoulder-width. Hang with your arms fully extended. Pull your body up until your chin is over the bar. Lower your body back down.', tips: 'Squeeze your lats to initiate the pull. Keep your core tight.', progression: 'Increase the weight.', mistakes: 'Using momentum; not using full range of motion.' }
};

const defaultProfile = { name: '', age: '', gender: 'Prefer not to say', weight: '', goal: 'Bodybuilding', experience: 'Intermediate', daysPerWeek: 7, setupComplete: false };

const MUSCLE_COLORS = {
  'chest': { bg: 'bg-red-600', text: 'text-red-400', border: 'border-red-500' },
  'back': { bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-500' },
  'shoulders': { bg: 'bg-yellow-600', text: 'text-yellow-400', border: 'border-yellow-500' },
  'arms': { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500' },
  'biceps': { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500' },
  'triceps': { bg: 'bg-indigo-600', text: 'text-indigo-400', border: 'border-indigo-500' },
  'legs': { bg: 'bg-green-600', text: 'text-green-400', border: 'border-green-500' },
  'quads': { bg: 'bg-green-600', text: 'text-green-400', border: 'border-green-500' },
  'hamstrings': { bg: 'bg-emerald-600', text: 'text-emerald-400', border: 'border-emerald-500' },
  'calves': { bg: 'bg-teal-600', text: 'text-teal-400', border: 'border-teal-500' },
  'abs': { bg: 'bg-orange-600', text: 'text-orange-400', border: 'border-orange-500' },
  'core': { bg: 'bg-orange-600', text: 'text-orange-400', border: 'border-orange-500' },
  'full body': { bg: 'bg-gray-600', text: 'text-gray-400', border: 'border-gray-500' }
};

// --- Helper Functions (defined outside components) ---
const extractPrimaryMuscle = (muscleField) => {
  if (!muscleField) return 'full body';
  if (typeof muscleField === 'object') {
    const primary = muscleField.primary || muscleField.Primary;
    if (primary) return primary.toLowerCase();
    const firstValue = Object.values(muscleField).find(v => v && typeof v === 'string');
    if (firstValue) return firstValue.toLowerCase();
  }
  if (typeof muscleField === 'string') {
    return muscleField.toLowerCase().split(',')[0].trim();
  }
  return 'full body';
};

const getMuscleColor = (muscleField) => {
  const primaryMuscle = extractPrimaryMuscle(muscleField);
  if (MUSCLE_COLORS[primaryMuscle]) return MUSCLE_COLORS[primaryMuscle];
  for (const [muscle, colors] of Object.entries(MUSCLE_COLORS)) {
    if (primaryMuscle.includes(muscle) || muscle.includes(primaryMuscle)) {
      return colors;
    }
  }
  return MUSCLE_COLORS['full body'];
};

const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString();

// --- UI Components (defined outside App) ---

const MuscleGroupBadge = ({ muscle, size = 'sm' }) => {
  const colors = getMuscleColor(muscle);
  const primaryMuscle = extractPrimaryMuscle(muscle);
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base'
  };
  return (
    <span className={`${colors.bg} ${sizeClasses[size]} rounded-full text-white font-medium`}>
      {primaryMuscle.charAt(0).toUpperCase() + primaryMuscle.slice(1)}
    </span>
  );
};

function ExerciseInfoModal({ exercise, onClose, exerciseDatabase }) {
  if (!exercise) return null;
  const info = exerciseDatabase[exercise.name] || {};
  const colors = getMuscleColor(info.muscle);

  const renderField = (field) => {
    if (Array.isArray(field)) {
      return field.map((txt, i) => <p key={i} className="text-gray-300 leading-relaxed">{txt}</p>);
    }
    if (typeof field === 'object' && field !== null) {
      return Object.values(field).map((txt, i) => <p key={i} className="text-gray-300 leading-relaxed">{txt}</p>);
    }
    return <p className="text-gray-300 leading-relaxed">{field}</p>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        <div className={`p-6 ${colors.bg} bg-opacity-20 border-b ${colors.border}`}>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white">{exercise.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
          </div>
          <MuscleGroupBadge muscle={info.muscle} />
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div><h3 className="text-lg font-semibold text-white mb-2 border-b border-gray-700 pb-1">Proper Form</h3>{renderField(info.form)}</div>
            <div><h3 className="text-lg font-semibold text-white mb-2 border-b border-gray-700 pb-1">Tips for Success</h3>{renderField(info.tips)}</div>
            <div><h3 className="text-lg font-semibold text-white mb-2 border-b border-gray-700 pb-1">Progression Strategy</h3>{renderField(info.progression)}</div>
            <div><h3 className="text-lg font-semibold text-white mb-2 border-b border-gray-700 pb-1">Common Mistakes</h3>{renderField(info.mistakes)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationBanner({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-[100]">
      {message}
    </div>
  );
}

function UserDisplay({ user, setCurrentView }) {
  return (
    <div className="absolute top-4 right-4 bg-gray-800 p-2 rounded-lg flex items-center gap-2 text-xs z-10">
      <button onClick={() => setCurrentView('profile')} className="p-1 hover:bg-gray-700 rounded"><Settings size={14} /></button>
      <span className="text-gray-300">{user.email || 'Anonymous'}</span>
      <button onClick={() => signOut(auth)} className="p-1 hover:bg-gray-700 rounded"><LogOut size={14} /></button>
    </div>
  );
}

function AnalysisModal({ result, onClose, isLoading }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Sparkles className="text-purple-400" />AI Routine Analysis</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
          </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader className="animate-spin text-purple-400" size={48} />
              <p className="mt-4 text-gray-300">Analyzing your routine...</p>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm sm:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: result?.replace(/\n/g, '<br />')?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')?.replace(/\*(.*?)\*/g, '<em>$1</em>') || '' }} />
          )}
        </div>
      </div>
    </div>
  );
}


// …then lower down, replace your old function with this:

function ExerciseCard({
  exercise,
  displayIndex,
  isCompleted,
  onSkip,
  onComplete,
  onMoveUp,
  onMoveDown,
  editMode,
  setShowExerciseInfo,
  updateSet,
  getExerciseHistory,
  userProfile
}) {
  const colors = getMuscleColor(exercise.muscle || exercise.name);

  // Scroll inputs into view on focus
  const handleFocus = (e) => {
    e.target.style.fontSize = '16px';
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }, 100);
  };

  // Fetch history and AI suggestion
  const history = getExerciseHistory(exercise.name);
  const { message, suggestion, color, loading } = useProgressionSuggestion(
    exercise.name,
    history,
    userProfile.goal,
    userProfile.experience
  );

  return (
    <div
      className={`
        bg-gray-800 rounded-lg p-4
        ${colors.border} border-l-4
        ${isCompleted ? 'opacity-75 bg-green-900/30 border-green-500' : ''}
      `}
    >
      {/* Header with controls */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-400">{displayIndex + 1}.</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{exercise.name}</h3>
              <MuscleGroupBadge muscle={exercise.muscle || exercise.name} size="xs" />
            </div>
            <p className="text-gray-400 text-sm">
              Target: {exercise.targetReps} reps • Rest {exercise.restTime}s
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {editMode && onMoveUp && (
            <button onClick={onMoveUp} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full">
              <ChevronUp size={18} />
            </button>
          )}
          {editMode && onMoveDown && (
            <button onClick={onMoveDown} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full">
              <ChevronDown size={18} />
            </button>
          )}
          <button
            onClick={() => setShowExerciseInfo(exercise)}
            className="p-2 hover:bg-gray-700 rounded-full"
          >
            <Info size={18} />
          </button>
          {!isCompleted && (
            <>
              <button
                onClick={onSkip}
                className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-full text-xs"
              >
                Skip
              </button>
              <button
                onClick={onComplete}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-full text-xs"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sets grid */}
      <div className="space-y-3">
        <div className="hidden sm:grid grid-cols-4 gap-2 text-sm font-medium text-gray-400 mb-2 px-2">
          <span>Set</span>
          <span>Weight (lbs)</span>
          <span>Reps</span>
          <span>RPE</span>
        </div>
        {exercise.sets.map((s, i) => (
          <div key={i} className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-4 sm:gap-2">
            <div className="flex items-center justify-center font-bold text-lg sm:text-base">
              <span className="sm:hidden mr-2 text-gray-400 text-xs">SET</span>
              {i + 1}
            </div>
            <input
              type="number"
              placeholder="Weight"
              value={s.weight}
              onFocus={handleFocus}
              onChange={(e) => updateSet(exercise.id, i, 'weight', e.target.value)}
              className="bg-gray-700 rounded p-3 text-center focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Reps"
              value={s.reps}
              onFocus={handleFocus}
              onChange={(e) => updateSet(exercise.id, i, 'reps', e.target.value)}
              className="bg-gray-700 rounded p-3 text-center focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              step="0.5"
              min="1"
              max="10"
              placeholder="RPE"
              value={s.rpe}
              onFocus={handleFocus}
              onChange={(e) => updateSet(exercise.id, i, 'rpe', e.target.value)}
              className="bg-gray-700 rounded p-3 text-center focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      {/* AI Suggestion */}
      {history.length > 0 && (
        <div className="mt-4 p-3 bg-blue-900/50 rounded-lg border border-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <Brain size={16} className="text-blue-400" />
            <span className="text-sm font-medium text-white">AI Suggestion</span>
          </div>
          {loading ? (
            <Loader size={18} className="animate-spin text-blue-400" />
          ) : (
            <>
              <p className="text-sm text-gray-300">{message}</p>
              <p className={`text-sm font-bold ${color}`}>{suggestion}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}




// --- View Components (Defined outside of App) ---




function AnalyticsView({ workoutHistory, setCurrentView }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <button onClick={() => setCurrentView('routine')} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Back</button>
        </div>
        {!workoutHistory.length ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg"><BarChart3 className="mx-auto mb-4 text-gray-600" size={48} /><p className="text-gray-400">No data yet</p><p className="text-gray-500 text-sm">Complete workouts to see progress!</p></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg"><div className="flex items-center gap-3"><Calendar className="text-blue-400" size={24} /><div><p className="text-gray-400 text-sm">Total Workouts</p><p className="text-2xl font-bold">{workoutHistory.length}</p></div></div></div>
              <div className="bg-gray-800 p-4 rounded-lg"><div className="flex items-center gap-3"><Target className="text-green-400" size={24} /><div><p className="text-gray-400 text-sm">Total Sets</p><p className="text-2xl font-bold">{workoutHistory.reduce((sum, w) => sum + w.exercises.reduce((es, e) => es + e.sets.filter((s) => s.weight && s.reps).length, 0), 0)}</p></div></div></div>
              <div className="bg-gray-800 p-4 rounded-lg"><div className="flex items-center gap-3"><Clock className="text-purple-400" size={24} /><div><p className="text-gray-400 text-sm">Total Time</p><p className="text-2xl font-bold">{Math.round(workoutHistory.reduce((sum, w) => sum + (w.duration || 0), 0) / 60)}h</p></div></div></div>
              <div className="bg-gray-800 p-4 rounded-lg"><div className="flex items-center gap-3"><TrendingUp className="text-yellow-400" size={24} /><div><p className="text-gray-400 text-sm">Avg Duration</p><p className="text-2xl font-bold">{Math.round(workoutHistory.reduce((sum, w) => sum + (w.duration || 0), 0) / workoutHistory.length)}{' '}min</p></div></div></div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6"><h2 className="text-xl font-semibold mb-4">Recent Activity</h2><div className="space-y-3">{workoutHistory.slice(0, 5).map((w) => (<div key={w.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg"><div><p className="font-medium">{w.name}</p><p className="text-sm text-gray-400">{formatDate(w.completedAt)}</p></div><div className="text-right"><p className="text-sm text-gray-400">{w.duration || 0} min</p><p className="text-sm text-green-400">{w.exercises.reduce((sum, e) => sum + e.sets.filter((s) => s.weight && s.reps).length, 0)}{' '}sets</p></div></div>))}</div></div>
            {workoutHistory.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Muscle Group Volume</h2>
                <div className="space-y-3">{(() => { const muscleData = {}; workoutHistory.forEach(workout => { workout.exercises.forEach(exercise => { const muscle = extractPrimaryMuscle(exercise.muscle || exercise.name); const sets = exercise.sets.filter(s => s.weight && s.reps).length; muscleData[muscle] = (muscleData[muscle] || 0) + sets; }); }); const maxSets = Math.max(...Object.values(muscleData)); return Object.entries(muscleData).sort(([, a], [, b]) => b - a).map(([muscle, sets]) => { const colors = getMuscleColor(muscle); const percentage = (sets / maxSets) * 100; return (<div key={muscle} className="flex items-center gap-3"><div className="w-24"><MuscleGroupBadge muscle={muscle} size="xs" /></div><div className="flex-1 bg-gray-700 rounded-full h-3"><div className={`${colors.bg} h-3 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div></div><span className="text-sm text-gray-400 w-12 text-right">{sets}</span></div>); }); })()}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


function ProfileView({ userProfile, updateUserProfile, showNotification, setCurrentView, isSetup = false }) {
  const [editingProfile, setEditingProfile] = useState(userProfile);
  const handleSave = () => {
    updateUserProfile(editingProfile, isSetup);
    showNotification(isSetup ? 'Profile Created!' : 'Profile Saved!');
    setCurrentView('routine');
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">{isSetup ? "Welcome! Let's Set Up Your Profile" : 'My Profile'}</h1>{!isSetup && (<button onClick={() => setCurrentView('routine')} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Back</button>)}</div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-2">Name</label><input type="text" placeholder="Your Name" value={editingProfile.name} onChange={(e) => setEditingProfile((p) => ({ ...p, name: e.target.value }))} className="w-full bg-gray-700 rounded-lg p-3 text-white" /></div>
              <div><label className="block text-sm font-medium mb-2">Age</label><input type="number" placeholder="Your Age" value={editingProfile.age} onChange={(e) => setEditingProfile((p) => ({ ...p, age: e.target.value }))} className="w-full bg-gray-700 rounded-lg p-3 text-white" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-2">Gender</label><select value={editingProfile.gender} onChange={(e) => setEditingProfile((p) => ({ ...p, gender: e.target.value }))} className="w-full bg-gray-700 rounded-lg p-3 text-white"><option>Male</option><option>Female</option><option>Prefer not to say</option></select></div>
              <div><label className="block text-sm font-medium mb-2">Weight (lbs)</label><input type="number" placeholder="Your Weight" value={editingProfile.weight} onChange={(e) => setEditingProfile((p) => ({ ...p, weight: e.target.value }))} className="w-full bg-gray-700 rounded-lg p-3 text-white" /></div>
            </div>
            <hr className="border-gray-700" />
            <div><label className="block text-sm font-medium mb-2">Primary Goal</label><select value={editingProfile.goal} onChange={(e) => setEditingProfile((p) => ({ ...p, goal: e.target.value }))} className="w-full bg-gray-700 rounded-lg p-3 text-white"><option>Bodybuilding</option><option>Powerlifting</option><option>General Fitness</option></select></div>
            <div><label className="block text-sm font-medium mb-2">Experience Level</label><select value={editingProfile.experience} onChange={(e) => setEditingProfile((p) => ({ ...p, experience: e.target.value }))} className="w-full bg-gray-700 rounded-lg p-3 text-white"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
            <div><label className="block text-sm font-medium mb-2">Training Days Per Week</label><input type="number" min="1" max="7" value={editingProfile.daysPerWeek} onChange={(e) => setEditingProfile((p) => ({ ...p, daysPerWeek: parseInt(e.target.value, 10) || 1 }))} className="w-full bg-gray-700 rounded-lg p-3 text-white" /></div>
            <button onClick={handleSave} className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center gap-2 font-bold text-lg mt-4"><Save size={18} />{isSetup ? 'Save and Get Started' : 'Save Changes'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoutineManagerView({ routines, activeRoutineId, updateRoutines, setCurrentView, showNotification, setError }) {
  const [newRoutineName, setNewRoutineName] = useState('');
  const handleCreate = () => {
    const name = newRoutineName.trim();
    if (!name) return;
    const id = `routine_${Date.now()}`;
    const newRoutine = { id, name, days: { 1: { name: 'New Day 1', exercises: [] } } };
    const all = { ...routines, [id]: newRoutine };
    updateRoutines(all, id);
    setNewRoutineName('');
    showNotification('New routine created!');
  };
  const handleDelete = (rid) => {
    if (Object.keys(routines).length <= 1) {
      setError('Must have at least one routine.');
      return;
    }
    if (window.confirm('Delete this routine? This cannot be undone.')) {
      const all = { ...routines };
      delete all[rid];
      const newActive = activeRoutineId === rid ? Object.keys(all)[0] : activeRoutineId;
      updateRoutines(all, newActive);
      showNotification('Routine deleted.');
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4 pt-20 max-w-3xl">
        <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Manage Routines</h1><button onClick={() => setCurrentView('routine')} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Back</button></div>
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">My Routines</h2>
          {Object.values(routines).map((r) => (<div key={r.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center"><span>{r.name}</span><div className="flex gap-2">{activeRoutineId === r.id ? (<span className="px-3 py-1 text-xs bg-green-600 rounded-full">Active</span>) : (<button onClick={() => updateRoutines(routines, r.id)} className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded-full">Set Active</button>)}<button onClick={() => handleDelete(r.id)} className="p-2 text-red-400 hover:bg-red-900/50 rounded-full"><Trash2 size={14} /></button></div></div>))}
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mt-6 space-y-4">
          <h2 className="text-lg font-semibold">Create New Routine</h2>
          <div className="flex gap-2"><input type="text" value={newRoutineName} onChange={(e) => setNewRoutineName(e.target.value)} placeholder="New routine name..." className="w-full bg-gray-700 rounded-lg p-3 text-white" /><button onClick={handleCreate} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold">Create</button></div>
        </div>
      </div>
    </div>
  );
}

function ExerciseDatabaseView({ exerciseDatabase, setCurrentView, setShowExerciseInfo }) {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = Object.entries(exerciseDatabase).filter(([name, data]) => {
    const lower = searchTerm.toLowerCase();
    const nameMatches = name.toLowerCase().includes(lower);
    const muscleField = data.muscle;
    const muscleText = typeof muscleField === 'object' ? Object.values(muscleField).filter(Boolean).join(', ') : muscleField;
    const muscleMatches = muscleText && muscleText.toLowerCase().includes(lower);
    return nameMatches || muscleMatches;
  });
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4 pt-20">
        <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Exercise Database</h1><button onClick={() => setCurrentView('routine')} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Back</button></div>
        <div className="mb-6"><input type="text" placeholder="Search by name or muscle..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-800 rounded-lg p-3 text-white border border-gray-700" /></div>
        <div className="space-y-3">{filtered.map(([name, data]) => (<div key={name} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"><div><h3 className="font-semibold text-lg">{name}</h3><p className="text-sm text-gray-400">{typeof data.muscle === 'object' ? Object.values(data.muscle).filter(Boolean).join(', ') : data.muscle}</p></div><button onClick={() => setShowExerciseInfo({ name, ...data })} className="p-2 hover:bg-gray-700 rounded-full"><Info size={18} /></button></div>))}</div>
      </div>
    </div>
  );
}

function AuthView() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setLocalError(err.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setLocalError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setLocalError(err.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2">AI Workout Tracker</h1>
        <p className="text-center text-gray-400 mb-6">{isLogin ? 'Welcome back!' : 'Create your account'}</p>
        {localError && <p className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4 text-sm">{localError}</p>}
        <form onSubmit={handleAction} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full bg-gray-700 p-3 rounded-lg" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full bg-gray-700 p-3 rounded-lg" />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold flex items-center justify-center">{loading ? <Loader className="animate-spin" size={20} /> : isLogin ? 'Log In' : 'Sign Up'}</button>
        </form>
        <div className="flex items-center my-6"><hr className="flex-grow border-gray-600" /><span className="mx-4 text-gray-500">OR</span><hr className="flex-grow border-gray-600" /></div>
        <button onClick={handleGoogle} disabled={loading} className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg font-bold flex items-center justify-center gap-2"><svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" /><path fill="#FF3D00" d="M6.306 14.691l6.057 4.844C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" /><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" /><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.596 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z" /></svg>Sign in with Google</button>
        <p className="text-center mt-6 text-sm">{isLogin ? "Don't have an account?" : 'Already have an account?'}<button onClick={() => setIsLogin(!isLogin)} className="text-blue-400 hover:underline ml-1">{isLogin ? 'Sign Up' : 'Log In'}</button></p>
      </div>
    </div>
  );
}

// --- App Component ---
function App() {
  // --- State Management ---
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [routines, setRoutines] = useState(null);
  const [activeRoutineId, setActiveRoutineId] = useState(null);
  const [exerciseDatabase, setExerciseDatabase] = useState({});
  const [currentView, setCurrentView] = useState('routine');
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [workoutData, setWorkoutData] = useState({});
  const [showExerciseInfo, setShowExerciseInfo] = useState(null);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isGenerating, setIsGenerating] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [exerciseOrder, setExerciseOrder] = useState([]);
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [skippedExercises, setSkippedExercises] = useState(new Set());
  const [editMode, setEditMode] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
// only prompt once per session if there’s a saved workout
const [resumeChecked, setResumeChecked] = useState(false);



  // --- Derived State ---
  const activeRoutine = useMemo(() => {
    if (!routines || !activeRoutineId) return null;
    return routines[activeRoutineId];
  }, [routines, activeRoutineId]);

  const getVolumeStats = useMemo(() => {
    const last4Weeks = Date.now() - 4 * 7 * 24 * 60 * 60 * 1000;
    const recentWorkouts = workoutHistory.filter(w => w.completedAt > last4Weeks);
    const totalWorkouts = recentWorkouts.length;
    const totalSets = recentWorkouts.reduce((sum, w) =>
      sum + w.exercises.reduce((s, e) => s + e.sets.filter(set => set.weight && set.reps).length, 0), 0);
    const totalDuration = recentWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    return {
      workouts: totalWorkouts,
      sets: totalSets,
      avgDuration: totalWorkouts ? Math.round(totalDuration / totalWorkouts) : 0
    };
  }, [workoutHistory]);

  // --- Effects ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
      if (!user) {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !user) {
      setIsLoading(false);
      return;
    }

    const appId = 'my-workout-tracker-app-d8d61';
    const adminUserId = 'dTF8r04xSUVzpGxtnJqaxx2eQ6I3';

    const publicRef = ref(db, `artifacts/${appId}/public/data/exercises`);
    const unsubPublic = onValue(
      publicRef,
      (snap) => {
        const data = snap.val();
        if (data) {
          setExerciseDatabase(data);
        } else {
          set(publicRef, initialExerciseDatabase);
          setExerciseDatabase(initialExerciseDatabase);
        }
      },
      (err) => {
        console.error('Error fetching public exercises', err);
        setError('Could not load exercise database.');
        setExerciseDatabase(initialExerciseDatabase);
      }
    );

    const userRef = ref(db, `artifacts/${appId}/users/${user.uid}`);
    const unsubPrivate = onValue(
      userRef,
      (snap) => {
        const data = snap.val();
        if (data && data.profile && data.profile.setupComplete) {
          setUserProfile({ ...defaultProfile, ...data.profile });
          if (user.uid === adminUserId && (!data.routines || !data.routines.allRoutines[adminRoutine.id])) {
            const newRoutinesData = {
              activeRoutineId: adminRoutine.id,
              allRoutines: { ...(data.routines?.allRoutines || {}), [adminRoutine.id]: adminRoutine }
            };
            setRoutines(newRoutinesData.allRoutines);
            setActiveRoutineId(newRoutinesData.activeRoutineId);
            update(userRef, { routines: newRoutinesData });
          } else if (data.routines) {
            setRoutines(data.routines.allRoutines);
            setActiveRoutineId(data.routines.activeRoutineId);
          } else {
            const newRoutinesData = {
              activeRoutineId: blankRoutineForNewUsers.id,
              allRoutines: { [blankRoutineForNewUsers.id]: blankRoutineForNewUsers }
            };
            setRoutines(newRoutinesData.allRoutines);
            setActiveRoutineId(newRoutinesData.activeRoutineId);
          }
          setWorkoutHistory(data.history || []);
          setCurrentDay(data.currentDay || 1);
        } else {
          setCurrentView('profileSetup');
          setUserProfile(defaultProfile);
          const initialRoutine = user.uid === adminUserId ? adminRoutine : blankRoutineForNewUsers;
          const newRoutinesData = {
            activeRoutineId: initialRoutine.id,
            allRoutines: { [initialRoutine.id]: initialRoutine }
          };
          setRoutines(newRoutinesData.allRoutines);
          setActiveRoutineId(newRoutinesData.activeRoutineId);
          setWorkoutHistory([]);
          setCurrentDay(1);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching user data', err);
        setError('Could not load your data.');
        setIsLoading(false);
      }
    );

    return () => {
      unsubPublic();
      unsubPrivate();
    };
  }, [isAuthReady, user]);



// On mount, if we left a workout half-done, offer to resume
useEffect(() => {
  if (
    !resumeChecked &&
    isAuthReady &&
    user &&
    currentView !== 'workout'
  ) {
    setResumeChecked(true);
    const saved = localStorage.getItem('workout_state');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.workoutData && p.exerciseOrder) {
          if (
            window.confirm(
              'You have an in-progress workout. Resume?'
            )
          ) {
            setWorkoutData(p.workoutData);
            setExerciseOrder(p.exerciseOrder);
            setSkippedExercises(new Set(p.skippedExercises || []));
            setCompletedExercises(new Set(p.completedExercises || []));
            setEditMode(p.editMode || false);
            setWorkoutStartTime(p.workoutStartTime || Date.now());
            setCurrentView('workout');
          } else {
            localStorage.removeItem('workout_state');
            if (user.uid) {
              update(
                ref(
                  db,
                  `artifacts/my-workout-tracker-app-d8d61/users/${user.uid}`
                ),
                { inProgressWorkout: null }
              );
            }
          }
        }
      } catch (err) {
        console.error('Error parsing workout_state', err);
      }
    }
  }
}, [resumeChecked, isAuthReady, user, currentView]);



// Auto-save workout state every 5s when in workout view
useEffect(() => {
  if (
    currentView === 'workout' &&
    workoutData.exercises?.length
  ) {
    const interval = setInterval(() => {
      const stateToSave = {
        workoutData,
        exerciseOrder,
        skippedExercises: Array.from(skippedExercises),
        completedExercises: Array.from(completedExercises),
        editMode,
        workoutStartTime,
      };
      localStorage.setItem(
        'workout_state',
        JSON.stringify(stateToSave)
      );
      setLastSaved(new Date().toLocaleTimeString());
    }, 5000);
    return () => clearInterval(interval);
  }
}, [
  currentView,
  workoutData,
  exerciseOrder,
  skippedExercises,
  completedExercises,
  editMode,
  workoutStartTime,
]);







  // --- Utility Functions ---
  const showNotification = useCallback((message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const getExerciseHistory = useCallback((exerciseName) => {
    return workoutHistory
      .flatMap(w => w.exercises)
      .filter(e => e.name === exerciseName);
  }, [workoutHistory]);

  const getProgressionSuggestion = useCallback((name, history) => {
    return {
      message: 'Add 5 lbs if last workout was easy',
      suggestion: '+5 lbs',
      color: 'text-green-400'
    };
  }, []);

  const updateSet = useCallback((exId, setIdx, key, value) => {
    setWorkoutData(prev => {
      const newExercises = [...prev.exercises];
      const exIndex = newExercises.findIndex(e => e.id === exId);
      if (exIndex > -1) {
        const newSets = [...newExercises[exIndex].sets];
        newSets[setIdx] = { ...newSets[setIdx], [key]: value };
        newExercises[exIndex] = { ...newExercises[exIndex], sets: newSets };
        return { ...prev, exercises: newExercises };
      }
      return prev;
    });
  }, []);

  const startWorkout = useCallback((dayNum) => {
    if (!activeRoutine) return;
    const day = activeRoutine.days[dayNum];
    const exercises = day.exercises.map(e => ({
      ...e,
      sets: Array.from({ length: e.sets }).map(() => ({ weight: '', reps: '', rpe: '' }))
    }));
    setWorkoutData({ name: day.name, dayNumber: dayNum, exercises });
    setExerciseOrder(exercises.map((_, i) => i));
    setCompletedExercises(new Set());
    setSkippedExercises(new Set());
    setWorkoutStartTime(Date.now());
    setCurrentView('workout');
  }, [activeRoutine]);

  const cancelWorkout = useCallback(() => {
    setWorkoutData({});
    setCurrentView('routine');
  }, []);

  const finishWorkout = useCallback(() => {
    const duration = Math.round((Date.now() - workoutStartTime) / 60000);
    const newWorkout = { ...workoutData, id: Date.now(), completedAt: Date.now(), duration };
    const updatedHistory = [...workoutHistory, newWorkout];
    setWorkoutHistory(updatedHistory);
    if (user?.uid) {
      update(ref(db, `artifacts/my-workout-tracker-app-d8d61/users/${user.uid}`), {
        history: updatedHistory
      });
    }
    setWorkoutData({});
    setCurrentView('routine');
    showNotification('Workout saved!');
  }, [workoutData, workoutHistory, workoutStartTime, user, showNotification]);

  const unskipExercise = useCallback((index) => {
    setSkippedExercises(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  }, []);

  const skipExercise = useCallback((index) => {
    setSkippedExercises(prev => new Set(prev).add(index));
  }, []);

  const markExerciseComplete = useCallback((index) => {
    setCompletedExercises(prev => new Set(prev).add(index));
  }, []);

  const moveExercise = useCallback((from, to) => {
    setExerciseOrder(prev => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  }, []);

  const deleteWorkout = useCallback((id) => {
    const updated = workoutHistory.filter(w => w.id !== id);
    setWorkoutHistory(updated);
    if (user?.uid) {
      update(ref(db, `artifacts/my-workout-tracker-app-d8d61/users/${user.uid}`), {
        history: updated
      });
    }
    showNotification('Workout deleted.');
  }, [workoutHistory, user, showNotification]);

  const updateRoutines = useCallback((all, newActiveId = activeRoutineId) => {
    setRoutines(all);
    setActiveRoutineId(newActiveId);
    if (user?.uid) {
      update(ref(db, `artifacts/my-workout-tracker-app-d8d61/users/${user.uid}`), {
        routines: { allRoutines: all, activeRoutineId: newActiveId }
      });
    }
  }, [activeRoutineId, user]);

  const saveExerciseToPublicDB = useCallback(async (name, data) => {
    const publicRef = ref(db, `artifacts/my-workout-tracker-app-d8d61/public/data/exercises/${name}`);
    await set(publicRef, data);
  }, []);

  const generateExerciseInfo = useCallback(async (exerciseName) => {
  setIsGenerating(prev => ({ ...prev, [exerciseName]: true }));

  try {
    console.log('[App] Generating exercise info for:', exerciseName);
    const generateExerciseInfoFn = httpsCallable(functions, 'generateExerciseInfo');
    const response = await generateExerciseInfoFn({ exerciseName });
    
    console.log('[App] Exercise generation response:', response);
    const exerciseData = response.data;
    await saveExerciseToPublicDB(exerciseName, exerciseData);
    
  } catch (error) {
    console.error('[App] Exercise generation error:', error);
    // Save fallback data
    const fallbackData = {
      muscle: 'AI generation failed',
      difficulty: 'Unknown',
      equipment: 'Check manually',
      form: `AI generation failed for ${exerciseName}. Please add manually.`,
      tips: 'Consult with a trainer',
      progression: 'Progressive overload',
      mistakes: 'Consult proper form guides'
    };
    await saveExerciseToPublicDB(exerciseName, fallbackData);
  }

  setIsGenerating(prev => ({ ...prev, [exerciseName]: false }));
}, [saveExerciseToPublicDB]);

// App.js
const analyzeRoutine = useCallback(async (routine, profile, isDay = false, day = null) => {
  console.log('[App] analyzeRoutine called with Firebase Functions:', { routine, profile, isDay, day });
  setIsAnalyzing(true);
  setAnalysisResult(null);

  try {
    // Call your deployed Firebase Function
    const analyzeRoutineFn = httpsCallable(functions, 'analyzeRoutine');
    console.log('[App] Calling Firebase Function...');
    
    const response = await analyzeRoutineFn({
      routine,
      profile,
      isDay,
      day
    });

    console.log('[App] Firebase Function response:', response);
    const resultHtml = response.data?.analysis || 'Analysis completed but no data received.';
    console.log('[App] Setting analysis result:', resultHtml);
    setAnalysisResult(resultHtml);
    
  } catch (error) {
    console.error('[App] Analysis error:', error);
    setAnalysisResult(`
      <strong>Analysis Error</strong><br/>
      Unable to analyze routine: ${error.message}<br/>
      Please check your internet connection and try again.
    `);
  }

  setIsAnalyzing(false);
}, []);



  const updateUserProfile = useCallback((profile, isSetup = false) => {
    const updated = { ...profile, setupComplete: true };
    setUserProfile(updated);
    if (user?.uid) {
      update(ref(db, `artifacts/my-workout-tracker-app-d8d61/users/${user.uid}/profile`), updated);
    }
  }, [user]);

  // --- Main Render Logic ---
  if (isLoading || !isAuthReady) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <Loader className="animate-spin mb-4" size={48} />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  if (!userProfile || !routines) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <Loader className="animate-spin mb-4" size={48} />
        <p>Loading your data...</p>
      </div>
    );
  }
  
  const views = {
    routine: (
      <MainView
        activeRoutine={activeRoutine}
        currentDay={currentDay}
        setCurrentDay={setCurrentDay}
        getVolumeStats={getVolumeStats}
        setCurrentView={setCurrentView}
        startWorkout={startWorkout}
        setShowExerciseInfo={setShowExerciseInfo}
        error={error}
        setError={setError}
      />
    ),
    editRoutine: (
      <RoutineEditorView
        activeRoutine={activeRoutine}
        routines={routines}
        activeRoutineId={activeRoutineId}
        updateRoutines={updateRoutines}
        setCurrentView={setCurrentView}
        showNotification={showNotification}
        exerciseDatabase={exerciseDatabase}
        saveExerciseToPublicDB={saveExerciseToPublicDB}
        generateExerciseInfo={generateExerciseInfo}
        isGenerating={isGenerating}
        analyzeRoutine={analyzeRoutine}
        userProfile={userProfile}
        isAnalyzing={isAnalyzing}
        analysisResult={analysisResult}
        setAnalysisResult={setAnalysisResult}
        error={error}
        setError={setError}
      />
    ),
    workout: (
      <ActiveWorkoutView
        workoutData={workoutData}
        exerciseOrder={exerciseOrder}
        skippedExercises={skippedExercises}
        completedExercises={completedExercises}
        lastSaved={lastSaved}
        editMode={editMode}
        setEditMode={setEditMode}
        cancelWorkout={cancelWorkout}
        finishWorkout={finishWorkout}
        unskipExercise={unskipExercise}
        skipExercise={skipExercise}
        markExerciseComplete={markExerciseComplete}
        moveExercise={moveExercise}
        setShowExerciseInfo={setShowExerciseInfo}
        updateSet={updateSet}
        getExerciseHistory={getExerciseHistory}
        userProfile={userProfile}
      />
    ),
    history: (
      <HistoryView
        workoutHistory={workoutHistory}
        setCurrentView={setCurrentView}
        deleteWorkout={deleteWorkout}
      />
    ),
    analytics: (
      <AnalyticsView
        workoutHistory={workoutHistory}
        setCurrentView={setCurrentView}
      />
    ),
    profile: (
      <ProfileView
        userProfile={userProfile}
        updateUserProfile={updateUserProfile}
        showNotification={showNotification}
        setCurrentView={setCurrentView}
      />
    ),
    profileSetup: (
      <ProfileView
        userProfile={userProfile}
        updateUserProfile={updateUserProfile}
        showNotification={showNotification}
        setCurrentView={setCurrentView}
        isSetup
      />
    ),
    routineManager: (
      <RoutineManagerView
        routines={routines}
        activeRoutineId={activeRoutineId}
        updateRoutines={updateRoutines}
        setCurrentView={setCurrentView}
        showNotification={showNotification}
        setError={setError}
      />
    ),
    exerciseDatabase: (
      <ExerciseDatabaseView
        exerciseDatabase={exerciseDatabase}
        setCurrentView={setCurrentView}
        setShowExerciseInfo={setShowExerciseInfo}
      />
    ),
  };

  return (
    <div className="font-sans relative">
      <NotificationBanner message={notification} />
      {currentView !== 'profileSetup' && user && <UserDisplay user={user} setCurrentView={setCurrentView} />}
      {showExerciseInfo && <ExerciseInfoModal exercise={showExerciseInfo} onClose={() => setShowExerciseInfo(null)} exerciseDatabase={exerciseDatabase} />}
      {views[currentView]}
    </div>
  );
}

export default App;
