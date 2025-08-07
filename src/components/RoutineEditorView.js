// src/components/RoutineEditorView.js
import React, { useState } from 'react'
import { Loader, X, Plus, Trash2, Sparkles, Save, Brain } from 'lucide-react'
import AnalysisModal from './AnalysisModal'

export default function RoutineEditorView({
  activeRoutine,
  routines,
  activeRoutineId,
  updateRoutines,
  setCurrentView,
  showNotification,
  exerciseDatabase,
  saveExerciseToPublicDB,
  generateExerciseInfo,
  isGenerating,
  analyzeRoutine,
  userProfile,
  isAnalyzing,
  analysisResult,
  setAnalysisResult,
  error,
  setError
}) {
  const [editingRoutine, setEditingRoutine] = useState(JSON.parse(JSON.stringify(activeRoutine)))
  const [selectedDay, setSelectedDay] = useState(1)
  const [showExerciseDB, setShowExerciseDB] = useState(false)
  const [showAddExercise, setShowAddExercise] = useState(false)
  const [newExerciseName, setNewExerciseName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const saveRoutine = () => {
    const all = { ...routines, [activeRoutineId]: editingRoutine }
    updateRoutines(all)
    setCurrentView('routine')
    showNotification('Routine saved!')
  }

  const addExerciseToDay = (name) => {
    const newEx = {
      id: Date.now(),
      name,
      sets: 3,
      targetReps: '8-12',
      restTime: 120
    }
    setEditingRoutine((p) => ({
      ...p,
      days: {
        ...p.days,
        [selectedDay]: {
          ...p.days[selectedDay],
          exercises: [...p.days[selectedDay].exercises, newEx]
        }
      }
    }))
    setShowExerciseDB(false)
    setSearchTerm('')
  }

  const removeExerciseFromDay = (id) => {
    setEditingRoutine((p) => ({
      ...p,
      days: {
        ...p.days,
        [selectedDay]: {
          ...p.days[selectedDay],
          exercises: p.days[selectedDay].exercises.filter((ex) => ex.id !== id)
        }
      }
    }))
  }

  const updateExercise = (id, field, val) => {
    setEditingRoutine((p) => ({
      ...p,
      days: {
        ...p.days,
        [selectedDay]: {
          ...p.days[selectedDay],
          exercises: p.days[selectedDay].exercises.map((ex) =>
            ex.id === id ? { ...ex, [field]: val } : ex
          )
        }
      }
    }))
  }

  const addNewDay = () => {
    const num = Object.keys(editingRoutine.days).length + 1
    setEditingRoutine((p) => ({
      ...p,
      days: {
        ...p.days,
        [num]: { name: `New Day ${num}`, exercises: [] }
      }
    }))
    setSelectedDay(num)
  }

  const deleteDay = (dayNum) => {
    const d = { ...editingRoutine.days }
    delete d[dayNum]
    const renum = {}
    Object.values(d).forEach((day, i) => {
      renum[i + 1] = day
    })
    setEditingRoutine((p) => ({ ...p, days: renum }))
    setSelectedDay(1)
  }

  const addNewExerciseToDatabase = async () => {
    const name = newExerciseName.trim()
    if (!name || exerciseDatabase[name]) return
    const placeholder = {
      muscle: '...',
      difficulty: '...',
      equipment: '...',
      form: '...',
      tips: '...',
      progression: '...',
      mistakes: '...'
    }
    await saveExerciseToPublicDB(name, placeholder)
    await generateExerciseInfo(name)
    setShowAddExercise(false)
    setNewExerciseName('')
  }

  const filteredExercises = Object.keys(exerciseDatabase).filter((ex) =>
    ex.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit: {editingRoutine.name}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => analyzeRoutine(editingRoutine, userProfile)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? <Loader className="animate-spin" size={16} /> : <Sparkles size={16} />}
              Analyze Full Routine
            </button>
            <button
              onClick={saveRoutine}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2"
            >
              <Save size={16} /> Save
            </button>
            <button
              onClick={() => setCurrentView('routine')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Day Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {Object.keys(editingRoutine.days).map((d) => (
            <div key={d} className="relative group">
              <button
                onClick={() => setSelectedDay(parseInt(d, 10))}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium ${
                  selectedDay === parseInt(d, 10)
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Day {d}
              </button>
              <button
                onClick={() => deleteDay(d)}
                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button onClick={addNewDay} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full">
            <Plus size={16} />
          </button>
        </div>

        {/* Day Name + Analyze Day */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-lg font-semibold">Day {selectedDay} Name</label>
            <button
              onClick={() =>
                analyzeRoutine(null, userProfile, true, editingRoutine.days[selectedDay])
              }
              className="px-3 py-1 bg-purple-600/70 hover:bg-purple-700 rounded-lg text-sm flex items-center gap-2"
              disabled={isAnalyzing}
            >
              <Sparkles size={14} /> Analyze Day
            </button>
          </div>
          <input
            type="text"
            value={editingRoutine.days[selectedDay]?.name || ''}
            onChange={(e) =>
              setEditingRoutine((p) => ({
                ...p,
                days: {
                  ...p.days,
                  [selectedDay]: { ...p.days[selectedDay], name: e.target.value }
                }
              }))
            }
            className="w-full bg-gray-700 rounded-lg p-3 text-white"
            placeholder="e.g. Push Day"
          />
        </div>

        {/* Exercises List for that day */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Exercises for Day {selectedDay}</h3>
            <button
              onClick={() => setShowExerciseDB(true)}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm flex items-center gap-1"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="space-y-4">
            {editingRoutine.days[selectedDay]?.exercises.map((ex) => (
              <div key={ex.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{ex.name}</h4>
                    {/* show muscle if you have it */}
                    <p className="text-sm text-gray-400">
                      {typeof exerciseDatabase[ex.name]?.muscle === 'string'
                        ? exerciseDatabase[ex.name].muscle
                        : 'Muscle not specified'}
                    </p>
                  </div>
                  <button
                    onClick={() => removeExerciseFromDay(ex.id)}
                    className="ml-3 p-2 text-red-400 hover:bg-red-900/50 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Sets</label>
                    <input
                      type="number"
                      min="1"
                      value={ex.sets}
                      onChange={(e) => updateExercise(ex.id, 'sets', parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-gray-600 rounded p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Target Reps</label>
                    <input
                      type="text"
                      value={ex.targetReps}
                      onChange={(e) => updateExercise(ex.id, 'targetReps', e.target.value)}
                      className="w-full bg-gray-600 rounded p-2 text-sm"
                      placeholder="e.g. 8-12"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Rest Time (s)</label>
                    <input
                      type="number"
                      min="30"
                      step="15"
                      value={ex.restTime}
                      onChange={(e) =>
                        updateExercise(ex.id, 'restTime', parseInt(e.target.value, 10) || 60)
                      }
                      className="w-full bg-gray-600 rounded p-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            {!editingRoutine.days[selectedDay]?.exercises.length && (
              <p className="text-center text-gray-500 py-4">No exercises. Add some!</p>
            )}
          </div>
        </div>

        {/* Exercise DB Modal */}
        {showExerciseDB && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-700">
              {/* ... same as before for search/add UI ... */}
            </div>
          </div>
        )}

        {/* Add-New-Exercise Modal */}
        {showAddExercise && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-[60]">
            {/* ... same as before for adding new exercise ... */}
          </div>
        )}

        {/* AI Analysis Modal */}
        {(isAnalyzing || analysisResult) && (
          <AnalysisModal
            isLoading={isAnalyzing}
            result={analysisResult}
            onClose={() => setAnalysisResult(null)}
          />
        )}
      </div>
    </div>
  )
}
