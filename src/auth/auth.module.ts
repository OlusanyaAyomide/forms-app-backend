import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/global/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVariable } from 'src/config/EnvVariables';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<EnvVariable>) => ({
        global: true,
        secret: configService.get('auth_secret', { infer: true }),
        signOptions: {
          expiresIn: configService.get('expiry', { infer: true }),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [AuthService],
})
export class CompanyModule {}
