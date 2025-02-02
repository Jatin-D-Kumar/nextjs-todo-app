import type React from "react"
import { useRouter } from "next/navigation"

interface Task {
  _id: string
  name: string
  status: boolean
}

interface TaskTileProps {
  task: Task
  onToggleStatus: (taskId: string) => void
}

const TaskTile: React.FC<TaskTileProps> = ({ task, onToggleStatus }) => {
  const router = useRouter()

  const handleTitleClick = () => {
    router.push(`/tasks/${task._id}`)
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={task.status}
          onChange={() => onToggleStatus(task._id)}
          className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
        />
        <span
          onClick={handleTitleClick}
          className={`text-lg cursor-pointer ${
            task.status ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {task.name}
        </span>
      </div>
    </div>
  )
}

export default TaskTile

