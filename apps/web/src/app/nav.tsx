import { cookies } from 'next/headers'
import { NavbarClient } from './nav-client'

export default async function CovidNavbar() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  return <NavbarClient hasToken={!!token} />
}
