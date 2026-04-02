import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { Route as BreadcrumbRouteImport } from './routes/$'

const BreadcrumbRoute = BreadcrumbRouteImport.update({
  id: '/$',
  path: '/$',
  getParentRoute: () => routeTree,
} as any)

const runtimeRouteTree = routeTree._addFileChildren({
  BreadcrumbRoute,
} as any)

export function getRouter() {
  const router = createTanStackRouter({
    routeTree: runtimeRouteTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
