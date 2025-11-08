import React from 'react'
import { StatusType } from '../types'

interface StatusBarProps {
  status: StatusType | null
}

export const StatusBar: React.FC<StatusBarProps> = ({ status }) => {
  if (!status) return null

  return (
    <div className={`status active ${status.type}`}>
      {status.type === 'loading' && <span className="spinner"></span>}
      {status.message}
    </div>
  )
}
