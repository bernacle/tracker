import { env } from '@tracker/env'
import axios from 'axios'
import type { CookiesFn } from 'cookies-next'
import { deleteCookie, getCookie } from 'cookies-next'

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use(async (config) => {
  let cookieStore: CookiesFn | undefined
  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers')
    cookieStore = serverCookies
  }
  const token = getCookie('token', { cookies: cookieStore })
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      deleteCookie('token')

      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        if (currentPath !== '/auth/sign-in') {
          window.location.href = `/auth/sign-in?callbackUrl=${encodeURIComponent(currentPath)}`
        }
      }
    }
    return Promise.reject(error)
  }
)