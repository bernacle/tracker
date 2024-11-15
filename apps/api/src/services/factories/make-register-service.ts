import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterService } from '../register-user-service'

export function makeRegisterService() {
  return new RegisterService(new PrismaUsersRepository())
}
