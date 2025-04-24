import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaUtils } from './prisma.utils'; // Adjust the import path as needed

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  utils: PrismaUtils;

  constructor() {
    super({
      omit: {
        company: {
          password: true,
        },
      },
    });

    // Initialize PrismaUtils and pass the current PrismaService instance
    this.utils = new PrismaUtils(this);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
