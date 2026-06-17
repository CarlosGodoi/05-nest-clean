import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthGuard } from "@nestjs/passport";
import { ZodQueryValidationPipe } from "../pipes/zod-query-validation-pipe";
import z from "zod";

const pageQueryParamsSchema = z
.string()
.optional()
.default('1')
.transform(Number)
.pipe(z.number().min(1))

const queryValidationPipe = new ZodQueryValidationPipe(pageQueryParamsSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService){}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const perPage = 1
    
   const questions = await this.prisma.question.findMany({
    take: 1,
    skip: (page - 1) * perPage,
    orderBy: {
      createdAt: 'desc'
    }
   })

   return { questions }
  }
}