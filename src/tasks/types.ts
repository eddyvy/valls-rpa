export interface TaskParams {
  [key: string]: any
}

export interface TaskResult {
  success: boolean
  data?: any
  error?: string
}

export interface Task {
  execute(params: TaskParams): Promise<any>
}

export interface GoogleSearchParams extends TaskParams {
  searchTerm: string
}
