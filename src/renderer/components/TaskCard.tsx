import React from 'react'
import { TaskCardData } from '../types'

interface TaskCardProps extends TaskCardData {
  onClick: (taskName: string) => void
}

export const TaskCard: React.FC<TaskCardProps> = ({
  icon,
  title,
  description,
  taskName,
  onClick,
}) => {
  return (
    <button className="task-card" onClick={() => onClick(taskName)}>
      <div className="task-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </button>
  )
}
