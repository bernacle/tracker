'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NavbarClientProps {
  hasToken: boolean
}

export function NavbarClient({ hasToken }: NavbarClientProps) {
  const router = useRouter()

  const handleSignOut = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/')
  }

  return (
    <nav className="flex w-full items-center justify-between border-b border-border/40 bg-[#1a1b1e] p-4">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-heading text-xl font-bold">
          COVID-19 Dashboard
        </span>
      </Link>

      <div className="flex items-center space-x-4">
        {hasToken && (
          <div className="hidden md:block">
            <Button variant="outline" onClick={handleSignOut} className="px-4">
              Sign out
            </Button>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 focus:outline-none md:hidden">
            <Menu className="h-6 w-6 text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-48 space-y-2 rounded-lg bg-[#1a1b1e] p-2 text-white"
          >
            {hasToken && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleSignOut}
              >
                <Button variant="outline" className="w-full">
                  Sign out
                </Button>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
