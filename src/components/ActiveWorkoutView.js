import React from 'react'
import ExerciseCard from './ExerciseCard' // adjust path if needed

/**
 * ActiveWorkoutView
 * Renders the active workout screen with AI-powered suggestions.
 */
function ActiveWorkoutView({
  workoutData,
  exerciseOrder,
  skippedExercises,
  completedExercises,
  lastSaved,
  editMode,
  setEditMode,
  cancelWorkout,
  finishWorkout,
  unskipExercise,
  skipExercise,
  markExerciseComplete,
  moveExercise,
  setShowExerciseInfo,
  updateSet,
  getExerciseHistory,
  userProfile
}) {
  if (!workoutData.exercises) return null

  // Order and filter out skipped exercises
  const ordered = exerciseOrder.map(i => ({
    ...workoutData.exercises[i],
    originalIndex: i
  }))
  const activeExs = ordered.filter((_, idx) => !skippedExercises.has(exerciseOrder[idx]))

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      <div className="container mx-auto p-4 pt-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{workoutData.name}</h1>
            <p className="text-gray-400">Day {workoutData.dayNumber}</p>
            {lastSaved && (
              <p className="text-xs text-green-400">Auto-saved at {lastSaved}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-3 py-2 rounded-lg min-h-[44px] ${
                editMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {editMode ? 'Done' : 'Edit'}
            </button>
            <button
              onClick={cancelWorkout}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg min-h-[44px]"
            >
              Pause
            </button>
            <button
              onClick={finishWorkout}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold min-h-[44px]"
            >
              Finish
            </button>
          </div>
        </div>

        {/* Skipped Exercises Banner */}
        {skippedExercises.size > 0 && (
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-6">
            <h3 className="text-yellow-400 font-semibold mb-2">Skipped Exercises</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(skippedExercises).map(idx => (
                <button
                  key={idx}
                  onClick={() => unskipExercise(idx)}
                  className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-full text-sm"
                >
                  {workoutData.exercises[idx].name} – Add Back
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Exercise Cards List */}
        <div className="space-y-6">
          {activeExs.map((ex, dispIdx) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              displayIndex={dispIdx}
              isCompleted={completedExercises.has(ex.originalIndex)}
              onSkip={() => skipExercise(ex.originalIndex)}
              onComplete={() => markExerciseComplete(ex.originalIndex)}
              onMoveUp={dispIdx > 0 ? () => moveExercise(dispIdx, dispIdx - 1) : null}
              onMoveDown={
                dispIdx < activeExs.length - 1
                  ? () => moveExercise(dispIdx, dispIdx + 1)
                  : null
              }
              editMode={editMode}
              setShowExerciseInfo={setShowExerciseInfo}
              updateSet={updateSet}
              getExerciseHistory={getExerciseHistory}
              // Pass AI context into each card:
              goal={userProfile.goal}
              experience={userProfile.experience}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ActiveWorkoutView
