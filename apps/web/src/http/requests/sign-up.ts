import { api } from "../client";

type SignUpRequest = {
  email: string;
  password: string;
};

type SignUpResponse = void;

export async function signUp({
  email,
  password,
}: SignUpRequest): Promise<SignUpResponse> {
  await api.post<SignUpResponse>("users", {
    email,
    password,
  });
}