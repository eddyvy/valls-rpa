import React from 'react'
import { TaskCardData } from '../types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

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
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
      onClick={() => onClick(taskName)}
    >
      <CardHeader className="text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
