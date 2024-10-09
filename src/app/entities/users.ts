import bcrypt from 'bcrypt'
import {
  type loginProps,
  loginSchema,
  type userProps,
  userSchema,
} from '@/types/users'
import { prisma } from '@/utils/prisma'

export class Users {
  async create(data: userProps) {
    const { name, email, password } = userSchema.parse(data)

    const verifyUser = await prisma.users.findUnique({
      where: {
        email,
      },
    })

    if (verifyUser) {
      return {
        error: 'Usuário já existe.',
      }
    }

    const hashPassword = await new Promise<string>((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          reject(err)
        }

        resolve(hash)
      })
    })

    if (!hashPassword) {
      return {
        error: 'Erro ao criptografar senha.',
      }
    }

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    })

    if (!user) {
      return {
        error: 'Erro ao criar usuário.',
      }
    }

    return {
      user,
    }
  }

  async login(data: loginProps) {
    const { email, password } = loginSchema.parse(data)

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return {
        error: 'Usuário não encontrado.',
      }
    }

    const comparePassword = await new Promise<boolean>((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          reject(err)
        }

        resolve(result)
      })
    })

    if (!comparePassword) {
      return {
        error: 'Senha inválida.',
      }
    }

    return {
      user: {
        name: user.name,
        email: user.email,
      },
    }
  }
}
