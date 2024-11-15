'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signInAction } from './actions'

export function SignInWithForm() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState<boolean | null>(false)
  const [isPending, setIsPending] = useState<boolean>(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsPending(true)
    setMessage('')
    setSuccess(null)

    const formData = new FormData(e.target)

    try {
      const response = await signInAction(formData)

      if (response.success) {
        setSuccess(true)
        router.push('/')
      } else {
        setSuccess(false)
        setMessage(response.message || 'Invalid input')
      }
    } catch (error) {
      console.error('Sign-in error:', error)
      setSuccess(false)
      setMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div style={{ minWidth: '320px' }}>
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md space-y-6"
        noValidate
      >
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign in failed!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">sign in with</h1>
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
                placeholder="type your password"
                id="password"
                type="password"
                name="password"
                required
              />
            </div>
            <Button
              type="submit"
              variant="ghost"
              className="to-bg-[#1a1b1e] w-full bg-gradient-to-r from-indigo-500 shadow-sm shadow-zinc-950"
              disabled={isPending}
            >
              {isPending ? 'signing in...' : 'sign in'}
            </Button>

            <Button className="w-full" variant="link" size="sm" asChild>
              <Link href="/auth/sign-up">create new account</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
