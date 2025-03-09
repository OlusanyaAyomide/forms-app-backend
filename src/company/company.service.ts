import { Injectable } from '@nestjs/common';

import { Company, Prisma } from '@prisma/client';
import { PrismaService } from 'src/global/prisma.service';
import { hashPassword } from 'src/global/services/hash.service';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async getCompany(
    CompanyWhereUniqueInput: Prisma.CompanyWhereUniqueInput,
  ): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: CompanyWhereUniqueInput,
    });
  }

  async getAllCompanies(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CompanyWhereUniqueInput;
    where?: Prisma.CompanyWhereInput;
    orderBy?: Prisma.CompanyOrderByWithRelationInput;
  }): Promise<Partial<Company[]>> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.company.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createCompany(data: Prisma.CompanyCreateInput): Promise<Partial<Company>> {
    const { password, ...CompanyData } = data
    const hashedPassword = await hashPassword(password)
    return this.prisma.company.create({
      data: {
        ...CompanyData, password: hashedPassword
      },
      select: {
        id: true,
        email: true,

      }
    });
  }

}