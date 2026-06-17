import { Body, ConflictException, Controller, HttpCode, Post, UnauthorizedException, UseGuards, UsePipes } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { z } from 'zod'
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { AuthGuard } from "@nestjs/passport";


@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
  constructor(
    private prisma: PrismaService,
  ){}

  @Post()
  async handle() {
    return 'ok'
  }
}