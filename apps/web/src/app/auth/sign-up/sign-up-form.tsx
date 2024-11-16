'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signUpAction } from './actions'

export function SignUpForm() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState<boolean | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsPending(true)
    setMessage('')
    setSuccess(null)

    const formData = new FormData(e.target)

    try {
      const response = await signUpAction(formData)

      if (response.success) {
        setSuccess(true)
        router.push('/auth/sign-in')
      } else {
        toast({
          title: 'Error',
          description: 'Invalid input',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md space-y-6"
        noValidate
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">sign up</h1>
        </div>
        <div>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="type your email"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="type your password"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password_confirmation">confirm Password</Label>
              <Input
                type="password"
                name="password_confirmation"
                id="password_confirmation"
                placeholder="confirm your password"
                required
              />
            </div>
            <Button
              type="submit"
              variant="ghost"
              className="to-bg-[#1a1b1e] w-full bg-gradient-to-r from-indigo-500 shadow-sm shadow-zinc-950"
              disabled={isPending}
            >
              {isPending ? 'signing up...' : 'sign up'}
            </Button>

            <Button className="w-full" variant="link" size="sm" asChild>
              <Link href="/auth/sign-in">already have an account? sign in</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
