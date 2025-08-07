// src/hooks/useProgressionSuggestion.js
import { useState, useEffect } from 'react'
import { httpsCallable } from 'firebase/functions'
import { functions }   from '../firebase'

/**
 * Custom hook to fetch AI progression suggestions for a given exercise.
 *
 * @param {string} exerciseName – Name of the exercise to analyze.
 * @param {Array}  history      – Array of past workout entries for this exercise.
 * @param {string} goal         – User’s primary fitness goal (e.g. 'Bodybuilding', 'Powerlifting').
 * @param {string} experience   – User’s experience level ('Beginner', 'Intermediate', 'Advanced').
 * @returns {{ message: string, suggestion: string, color: string }}
 */
export function useProgressionSuggestion(exerciseName, history, goal, experience) {
  const [result, setResult] = useState({
    message:    '',
    suggestion: '',
    color:      ''
  })

  useEffect(() => {
    if (!exerciseName) return

    async function fetchSuggestion() {
      try {
        // call your backend Cloud Function
        const fn       = httpsCallable(functions, 'progressionSuggestion')
        const response = await fn({ exerciseName, history, goal, experience })
        const data     = response.data || {}

        setResult({
          message:    data.message    || '',
          suggestion: data.suggestion || '',
          color:      data.color      || 'text-gray-200'
        })
      } catch (err) {
        console.error('Progression suggestion error:', err)
        setResult({ message: 'Unable to fetch suggestion.', suggestion: '', color: 'text-red-400' })
      }
    }

    fetchSuggestion()
  }, [exerciseName, history, goal, experience])

  return result
}
