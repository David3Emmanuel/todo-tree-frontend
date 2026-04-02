import { createFileRoute } from '@tanstack/react-router'
import { TodoTreePage } from '../components/todo-tree/TodoTreePage'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return <TodoTreePage pathSegments={[]} />
}
