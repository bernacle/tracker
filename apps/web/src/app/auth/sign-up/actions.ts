'use server'

import { signUp } from '@/http/requests/sign-up';
import { AxiosError } from 'axios';
import { z } from 'zod';


const signUpSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'Please, provide a valid e-mail address.' }),
    password: z
      .string()
      .min(6, { message: 'Password should have at least 6 characters.' }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password confirmation does not match.',
    path: ['password_confirmation'],
  });

export async function signUpAction(data: FormData) {

  console.log(data)
  const result = signUpSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.log(errors)

    return { success: false, message: null, errors };
  }

  const { email, password } = result.data;

  try {
    await signUp({
      email,
      password,
    });
  } catch (err) {
    if (err instanceof AxiosError) {
      const { message } = err

      return { success: false, message, errors: null };
    }

    console.error(err);

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    };
  }

  return { success: true, message: null, errors: null };
}
