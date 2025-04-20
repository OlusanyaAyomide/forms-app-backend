import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export enum Role {
  Company = 'Company',
  Member = 'Member',
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
export const RoleOnly = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const Company = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.company;
  },
);

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return value instanceof Date && value.getTime() > Date.now();
        },
        defaultMessage(): string {
          return `${propertyName} must be a future date`;
        },
      },
    });
  };
}
