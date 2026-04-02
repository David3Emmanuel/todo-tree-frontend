import { createFileRoute } from '@tanstack/react-router'
import { TodoTreePage } from '../components/todo-tree/TodoTreePage'

export const Route = createFileRoute('/$')({ component: BreadcrumbRoute })

function BreadcrumbRoute() {
  const { _splat } = Route.useParams()
  const pathSegments = _splat
    ? _splat
        .split('/')
        .filter(Boolean)
        .map((segment) => decodeURIComponent(segment))
    : []

  return <TodoTreePage pathSegments={pathSegments} />
}
