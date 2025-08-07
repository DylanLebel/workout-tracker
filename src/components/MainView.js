// src/components/MainView.js
import React from 'react'
import {
  Calendar,
  Target,
  Clock,
  Zap,
  List,
  Edit3,
  BarChart3,
  Dumbbell,
  Info,
  TrendingUp,
  X
} from 'lucide-react'
import PropTypes from 'prop-types'

// Utility to extract the primary muscle from a string like "Chest, Triceps"
const extractPrimaryMuscle = muscleField => {
  if (!muscleField) return 'full body'
  return muscleField.toLowerCase().split(',')[0].trim()
}

// A simple badge component for muscle groups
function MuscleGroupBadge({ muscle, size = 'sm' }) {
  const primary = extractPrimaryMuscle(muscle)
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base'
  }
  // pick a color based on the muscle
  const colorMap = {
    chest: 'bg-red-600',
    back: 'bg-blue-600',
    shoulders: 'bg-yellow-600',
    arms: 'bg-purple-600',
    legs: 'bg-green-600',
    abs: 'bg-orange-600',
    'full body': 'bg-gray-600'
  }
  const bg = colorMap[primary] || colorMap['full body']
  return (
    <span className={`${bg} ${sizeClasses[size]} rounded-full text-white font-medium`}>
      {primary.charAt(0).toUpperCase() + primary.slice(1)}
    </span>
  )
}

MuscleGroupBadge.propTypes = {
  muscle: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md'])
}

export default function MainView({
  activeRoutine,
  currentDay,
  setCurrentDay,
  getVolumeStats,
  setCurrentView,
  startWorkout,
  setShowExerciseInfo,
  error,
  setError
}) {
  if (!activeRoutine) return null

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4 pt-20">
        {error && (
          <div className="mb-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg flex justify-between">
            <p className="text-red-200">{error}</p>
            <button onClick={() => setError(null)} className="text-red-300 hover:text-red-100">
              <X size={20} />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{activeRoutine.name}</h1>
            <p className="text-gray-400">
              Next: Day {currentDay} • {activeRoutine.days[currentDay]?.name}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('exerciseDatabase')}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              title="Exercise Database"
            >
              <Dumbbell size={20} />
            </button>
            <button
              onClick={() => setCurrentView('routineManager')}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              title="Manage Routines"
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setCurrentView('editRoutine')}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              title="Edit Routine"
            >
              <Edit3 size={20} />
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              title="Analytics"
            >
              <BarChart3 size={20} />
            </button>
          </div>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-400" size={24} />
              <div>
                <p className="text-gray-400 text-sm">Last 4 Weeks</p>
                <p className="text-2xl font-bold">{getVolumeStats.workouts} workouts</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Target className="text-green-400" size={24} />
              <div>
                <p className="text-gray-400 text-sm">Total Sets</p>
                <p className="text-2xl font-bold">{getVolumeStats.sets}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="text-purple-400" size={24} />
              <div>
                <p className="text-gray-400 text-sm">Avg Duration</p>
                <p className="text-2xl font-bold">{getVolumeStats.avgDuration} min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Day picker + exercises list */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {Object.keys(activeRoutine.days).map(d => (
              <button
                key={d}
                onClick={() => setCurrentDay(Number(d))}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium ${
                  currentDay === Number(d)
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Day {d}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-3 gap-4">
              <h3 className="text-xl font-semibold">
                {activeRoutine.days[currentDay]?.name}
              </h3>
              <button
                onClick={() => startWorkout(currentDay)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <Zap size={18} /> Start Day {currentDay}
              </button>
            </div>

            <div className="space-y-2">
              {activeRoutine.days[currentDay]?.exercises.map((ex, idx) => (
                <div
                  key={ex.id}
                  className={`flex items-center justify-between p-3 bg-gray-700 rounded-lg border-l-4 ${extractPrimaryMuscle(
                    ex.muscle || ex.name
                  ) === 'full body'
                    ? 'border-gray-500'
                    : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm w-6">{idx + 1}.</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{ex.name}</p>
                        <MuscleGroupBadge muscle={ex.muscle || ex.name} size="xs" />
                      </div>
                      <p className="text-sm text-gray-400">
                        {ex.sets}× {ex.targetReps} • {ex.restTime}s
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowExerciseInfo(ex)}
                    className="p-2 hover:bg-gray-600 rounded-full"
                    title="Exercise Info"
                  >
                    <Info size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setCurrentView('history')}
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg flex items-center gap-3"
          >
            <Calendar className="text-blue-400" size={24} />
            <div className="text-left">
              <p className="font-medium">Workout History</p>
              <p className="text-sm text-gray-400">{getVolumeStats.workouts} completed</p>
            </div>
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg flex items-center gap-3"
          >
            <TrendingUp className="text-green-400" size={24} />
            <div className="text-left">
              <p className="font-medium">Progress Analytics</p>
              <p className="text-sm text-gray-400">Track your gains</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

MainView.propTypes = {
  activeRoutine: PropTypes.shape({
    name: PropTypes.string,
    days: PropTypes.objectOf(
      PropTypes.shape({
        name: PropTypes.string,
        exercises: PropTypes.array
      })
    )
  }),
  currentDay: PropTypes.number.isRequired,
  setCurrentDay: PropTypes.func.isRequired,
  getVolumeStats: PropTypes.shape({
    workouts: PropTypes.number,
    sets: PropTypes.number,
    avgDuration: PropTypes.number
  }).isRequired,
  setCurrentView: PropTypes.func.isRequired,
  startWorkout: PropTypes.func.isRequired,
  setShowExerciseInfo: PropTypes.func.isRequired,
  error: PropTypes.string,
  setError: PropTypes.func.isRequired
}
