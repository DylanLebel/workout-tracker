import React from 'react'
import { Loader, Info, ChevronUp, ChevronDown, Brain } from 'lucide-react'
import { useProgressionSuggestion } from '../hooks/useProgressionSuggestion'
//import { getMuscleColor, MuscleGroupBadge } from '../yourHelpersFile' // adjust path as needed
import { getMuscleColor, MuscleGroupBadge } from '../utils/helpers'

export default function ExerciseCard({
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
  goal,
  experience
}) {
  const colors = getMuscleColor(exercise.muscle || exercise.name)
  const history = getExerciseHistory(exercise.name)
  const { message, suggestion, color: suggestionColor, loading } =
    useProgressionSuggestion(exercise.name, history, goal, experience)

  const handleFocus = e => {
    e.target.style.fontSize = '16px'
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 100)
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${colors.border} border-l-4 ${isCompleted ? 'opacity-75 bg-green-900/30 border-green-500' : ''}`}>
      {/* Header */}
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
          {editMode && onMoveUp && <button onClick={onMoveUp} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full"><ChevronUp size={18} /></button>}
          {editMode && onMoveDown && <button onClick={onMoveDown} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full"><ChevronDown size={18} /></button>}
          <button onClick={() => setShowExerciseInfo(exercise)} className="p-2 hover:bg-gray-700 rounded-full"><Info size={18} /></button>
          {!isCompleted && (
            <>
              <button onClick={onSkip} className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-full text-xs">Skip</button>
              <button onClick={onComplete} className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-full text-xs">Done</button>
            </>
          )}
        </div>
      </div>

      {/* Sets */}
      <div className="space-y-3">
        <div className="hidden sm:grid grid-cols-4 gap-2 text-sm font-medium text-gray-400 mb-2 px-2">
          <span>Set</span><span>Weight (lbs)</span><span>Reps</span><span>RPE</span>
        </div>
        {exercise.sets.map((s, i) => (
          <div key={i} className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-4 sm:gap-2">
            <div className="flex items-center justify-center font-bold text-lg sm:text-base">
              <span className="sm:hidden mr-2 text-gray-400 text-xs">SET</span>{i + 1}
            </div>
            {['weight', 'reps', 'rpe'].map((field, idx) => (
              <div key={field}>
                <label className="text-xs text-gray-400 block sm:hidden">
                  {field === 'rpe' ? 'RPE (1-10)' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="number"
                  step={field === 'rpe' ? 0.5 : 1}
                  min={field === 'rpe' ? 1 : undefined}
                  max={field === 'rpe' ? 10 : undefined}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={s[field]}
                  onFocus={handleFocus}
                  onChange={e => updateSet(exercise.id, i, field, e.target.value)}
                  className="bg-gray-700 rounded p-3 text-center w-full text-lg sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            ))}
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
          {loading
            ? <Loader className="animate-spin text-blue-400" size={20} />
            : <>
                <p className="text-sm text-gray-300">{message}</p>
                <p className={`text-sm font-bold ${suggestionColor}`}>{suggestion}</p>
              </>
          }
        </div>
      )}
    </div>
  )
}