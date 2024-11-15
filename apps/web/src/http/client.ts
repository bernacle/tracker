import { env } from '@tracker/env';
import axios from 'axios';
import { getCookie, type CookiesFn } from 'cookies-next';

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  let cookieStore: CookiesFn | undefined;

  if (typeof window === 'undefined') {
    const { cookies: serverCookies } = await import('next/headers');
    cookieStore = serverCookies;
  }

  const token = getCookie('token', { cookies: cookieStore });

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});