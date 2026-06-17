import { PipeTransform, BadRequestException } from "@nestjs/common";
import { ZodError } from "zod";
import { fromZodError } from 'zod-validation-error'

export class ZodQueryValidationPipe<T> implements PipeTransform {
  constructor(private schema: { parse: (value: unknown) => T }) {}

  transform(value: unknown): T {
    try {
      return this.schema.parse(value) // ✅ retorna valor já transformado
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: fromZodError(error).toString()
        });
      }
      throw new BadRequestException('validation failed');
    }
  }
}