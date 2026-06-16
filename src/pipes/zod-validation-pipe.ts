import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { ZodError, ZodObject } from "zod";
import { fromZodError} from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema:ZodObject<any>){}

  transform(value: unknown) {
    try {
      this.schema.parse(value)
    } catch (error) {
      if(error instanceof ZodError) {
        throw new BadRequestException({
          messsage: 'Validation failed', 
          statusCode: 400,
          errors: fromZodError(error).toString()
        });
      }
      throw new BadRequestException('validation failed');
    }

    return value
  }
}