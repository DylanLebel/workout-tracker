// src/components/HistoryView.js
import React from 'react'
import { Calendar, Trash2, X } from 'lucide-react'
import PropTypes from 'prop-types'

// Helper to format timestamps
const formatDate = timestamp =>
  new Date(timestamp).toLocaleDateString()

export default function HistoryView({
  workoutHistory,
  setCurrentView,
  deleteWorkout
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Workout History</h1>
          <button
            onClick={() => setCurrentView('routine')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            Back
          </button>
        </div>

        <div className="space-y-4">
          {workoutHistory.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <Calendar
                className="mx-auto mb-4 text-gray-600"
                size={48}
              />
              <p className="text-gray-400">No workouts yet</p>
              <p className="text-gray-500 text-sm">
                Start your first workout to see it here!
              </p>
            </div>
          ) : (
            workoutHistory.map(w => (
              <div
                key={w.id}
                className="bg-gray-800 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{w.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {formatDate(w.completedAt)} •{' '}
                      {w.duration || 0} minutes
                    </p>
                  </div>
                  <button
                    onClick={() => deleteWorkout(w.id)}
                    className="p-2 text-red-400 hover:bg-red-900/50 rounded-full"
                    title="Delete Workout"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-2 border-t border-gray-700 pt-3">
                  {w.exercises.map(ex => {
                    const completedSets = ex.sets.filter(
                      s => s.weight && s.reps
                    )
                    if (completedSets.length === 0) return null

                    return (
                      <div key={ex.id} className="text-sm">
                        <span className="text-gray-300 font-medium">
                          {ex.name}:
                        </span>{' '}
                        {completedSets.map((s, idx) => (
                          <span key={idx} className="text-gray-400">
                            {s.weight}lbs × {s.reps}
                            {s.rpe && ` (RPE ${s.rpe})`}
                            {idx < completedSets.length - 1
                              ? ' / '
                              : ''}
                          </span>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

HistoryView.propTypes = {
  workoutHistory: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      name: PropTypes.string.isRequired,
      completedAt: PropTypes.number.isRequired,
      duration: PropTypes.number,
      exercises: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
          ]).isRequired,
          name: PropTypes.string.isRequired,
          sets: PropTypes.arrayOf(
            PropTypes.shape({
              weight: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
              ]),
              reps: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
              ]),
              rpe: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
              ])
            })
          )
        })
      )
    })
  ).isRequired,
  setCurrentView: PropTypes.func.isRequired,
  deleteWorkout: PropTypes.func.isRequired
}
