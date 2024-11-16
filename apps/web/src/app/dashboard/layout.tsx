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
        <main>{children}</main>
      </div>
    </div>
  )
}
