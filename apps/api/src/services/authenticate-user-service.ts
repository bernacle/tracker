import type { UsersRepository } from "@/repositories/users-repositories"
import type { User } from "@prisma/client"
import { compare } from "bcryptjs"
import { InvalidCredentialsError } from "./errors/invalid-credentials-error"

type AuthenticateServiceRequest = {
  email: string
  password: string
}
type AuthenticateServiceResponse = {
  user: User
}

export class AuthenticateService {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) throw new InvalidCredentialsError()

    const doesPasswordMatches = await compare(password, user.passwordHash)

    if (!doesPasswordMatches) throw new InvalidCredentialsError()

    return { user }
  }
}
