import { PrismaClient } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PrismaUtils {
  constructor(private readonly prisma: PrismaClient) { }

  async ensureExists<T extends keyof PrismaClient, W extends object>(
    model: T,
    where: W,
    errorMessage?: string
  ): Promise<any> {
    // Ensure the model exists in Prisma
    const delegate = this.prisma[model] as any;
    if (!delegate || typeof delegate.findFirst !== 'function') {
      throw new Error(`Model ${String(model)} does not exist in PrismaClient`);
    }

    // Query the database
    const record = await delegate.findFirst({
      where,
      select: { id: true },
    });

    if (!record) {
      const defaultMessage = `${String(model).charAt(0).toUpperCase() + String(model).slice(1)} not found`;
      throw new NotFoundException(errorMessage || defaultMessage);
    }

    return record;
  }

  async ensureCompanyExists(id: string | undefined, errorMessage?: string): Promise<any> {
    return this.ensureExists('company' as keyof PrismaClient, { id }, errorMessage || `Company with ID ${id} not found`);
  }

  async ensureMemberExists(id: string | undefined, errorMessage?: string): Promise<any> {
    return this.ensureExists('member' as keyof PrismaClient, { id }, errorMessage || `Member with ID ${id} not found`);
  }

  async ensureCompanyMemberExists(company_id: string | undefined, member_id: string | undefined, errorMessage?: string): Promise<any> {
    return this.ensureExists('companyMember' as keyof PrismaClient, { company_id, member_id }, errorMessage || `CompanyMember not found`);
  }

  async ensureQuizExists(id: string | undefined, errorMessage?: string): Promise<any> {
    return this.ensureExists('quiz' as keyof PrismaClient, { id }, errorMessage || `Quiz with ID ${id} not found`);
  }

  async ensureQuizAttemptsExists(id: string | undefined, errorMessage?: string): Promise<any> {
    return this.ensureExists('quizAttempts' as keyof PrismaClient, { id }, errorMessage || `QuizAttempts with ID ${id} not found`);
  }

  async ensureQuizSectionExists(id: string | undefined, errorMessage?: string): Promise<any> {
    return this.ensureExists('quizSection' as keyof PrismaClient, { id }, errorMessage || `QuizSection with ID ${id} not found`);
  }

  async ensureQuizQuestionExists(id: string | undefined, errorMessage?: string): Promise<any> {
    return this.ensureExists('quizQuestion' as keyof PrismaClient, { id }, errorMessage || `QuizQuestion with ID ${id} not found`);
  }

  async ensureQuizOptionExists(id: string | undefined, errorMessage?: string): Promise<any> {
    return this.ensureExists('quizOption' as keyof PrismaClient, { id }, errorMessage || `QuizOption with ID ${id} not found`);
  }

  async ensureAuthOtpExists(id: string | undefined, errorMessage?: string): Promise<any> {
    return this.ensureExists('authOtp' as keyof PrismaClient, { id }, errorMessage || `AuthOtp with ID ${id} not found`);
  }
}
