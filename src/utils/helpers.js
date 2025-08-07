// src/utils/helpers.js
import React from 'react'

export const MUSCLE_COLORS = {
  chest:    { bg: 'bg-red-600',    text: 'text-red-400',    border: 'border-red-500' },
  back:     { bg: 'bg-blue-600',   text: 'text-blue-400',   border: 'border-blue-500' },
  shoulders:{ bg: 'bg-yellow-600', text: 'text-yellow-400', border: 'border-yellow-500' },
  arms:     { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500' },
  biceps:   { bg: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500' },
  triceps:  { bg: 'bg-indigo-600', text: 'text-indigo-400', border: 'border-indigo-500' },
  legs:     { bg: 'bg-green-600',  text: 'text-green-400',  border: 'border-green-500' },
  quads:    { bg: 'bg-green-600',  text: 'text-green-400',  border: 'border-green-500' },
  hamstrings:{bg: 'bg-emerald-600',text: 'text-emerald-400',border: 'border-emerald-500'},
  calves:   { bg: 'bg-teal-600',   text: 'text-teal-400',   border: 'border-teal-500' },
  abs:      { bg: 'bg-orange-600', text: 'text-orange-400', border: 'border-orange-500' },
  core:     { bg: 'bg-orange-600', text: 'text-orange-400', border: 'border-orange-500' },
  'full body':{bg:'bg-gray-600',  text:'text-gray-400',    border:'border-gray-500'}
}

export function getMuscleColor(muscleField) {
  if (!muscleField) return MUSCLE_COLORS['full body']
  const primary = String(muscleField).toLowerCase().split(',')[0].trim()
  return MUSCLE_COLORS[primary] || MUSCLE_COLORS['full body']
}

export function MuscleGroupBadge({ muscle, size = 'sm' }) {
  const colors = getMuscleColor(muscle)
  const primary = String(muscle).toLowerCase().split(',')[0].trim()
  const sizeClasses = { xs: 'px-2 py-0.5 text-xs', sm: 'px-3 py-1 text-sm', md: 'px-4 py-2 text-base' }
  return (
    <span className={`${colors.bg} ${sizeClasses[size]} rounded-full text-white font-medium`}>
      {primary.charAt(0).toUpperCase() + primary.slice(1)}
    </span>
  )
}
