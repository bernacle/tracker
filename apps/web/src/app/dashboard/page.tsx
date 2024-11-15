import CovidTracking from '@/components/views/covid-tracking'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <CovidTracking />
    </Suspense>
  )
}
