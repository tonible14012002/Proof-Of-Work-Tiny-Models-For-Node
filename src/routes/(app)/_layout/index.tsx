import { createFileRoute } from '@tanstack/react-router'
import { EmptyModelSelectedV2 } from '@/components/common/EmptyModelSelectedV2'

export const Route = createFileRoute('/(app)/_layout/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EmptyModelSelectedV2 />
}
