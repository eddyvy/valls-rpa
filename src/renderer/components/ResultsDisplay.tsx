import React from 'react'

interface ResultsDisplayProps {
  results: string[] | null
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results || results.length === 0) return null

  return (
    <div className="results active">
      <h3>📊 Resultados:</h3>
      <ul>
        {results.map((item, i) => (
          <li key={i}>
            <strong>{i + 1}.</strong> {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
