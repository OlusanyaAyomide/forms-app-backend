import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Company, Prisma } from '@prisma/client';

import { PrismaService } from 'src/global/prisma.service';
import {
  comparePassword,
  hashPassword,
} from 'src/global/services/hash.service';
import { PayloadMetaData } from './auth.types';
import { ConfigService } from '@nestjs/config';
import { EnvVariable } from 'src/config/EnvVariables';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly configService: ConfigService<EnvVariable>,
  ) {}

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

  async createCompany(
    data: Prisma.CompanyCreateInput,
  ): Promise<Partial<Company>> {
    const { password, ...CompanyData } = data;
    const hashedPassword = await hashPassword(password);
    return this.prisma.company.create({
      data: {
        ...CompanyData,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  async findCompanyById(companyId: string) {
    return this.prisma.company.findFirst({
      where: { id: companyId },
    });
  }

  async findCompany(
    filter: Prisma.CompanyWhereInput,
    options?: Prisma.CompanyFindFirstArgs,
  ) {
    return this.prisma.company.findFirst({
      where: filter,
      ...options,
    });
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<Record<string, string>> {
    const company = await this.findCompany(
      { email },
      { select: { email: true, password: true, id: true } },
    );

    if (!company) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, company.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload: PayloadMetaData = {
      id: company.id,
      email: company.email,
      type: 'Company',
    };
    return {
      message: 'sign In successful',
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async memberPasswordLessSignIn({
    email,
    memberId,
  }: {
    email: string;
    memberId: string;
  }): Promise<Record<string, string>> {
    const payload: PayloadMetaData = { id: memberId, email, type: 'Member' };
    return {
      message: 'sign In successful',
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('auth_secret'),
      }),
    };
  }
}
