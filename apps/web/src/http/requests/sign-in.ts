import { api } from "../client";

type SignInRequest = {
  email: string;
  password: string;
};

type SignInResponse = {
  token: string;
};

export async function signIn({
  email,
  password,
}: SignInRequest): Promise<SignInResponse> {
  const response = await api.post<SignInResponse>("sessions", {
    email,
    password,
  });

  return response.data;
}