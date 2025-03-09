import { Injectable } from '@nestjs/common';

import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/global/prisma.service';
import { hashPassword } from 'src/global/services/hash.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async getAllUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<Partial<User>> {
    const { password, ...userData } = data
    const hashedPassword = await hashPassword(password)
    return this.prisma.user.create({
      data: {
        ...userData, password: hashedPassword
      },
      select: {
        id: true,
        email: true,

      }
    });
  }

}