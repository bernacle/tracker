import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  if (!token) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">COVID-19 Data Dashboard</h1>
          {/* Add user menu/logout here later if needed */}
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}
