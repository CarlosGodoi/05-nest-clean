import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../../../generated/prisma'
import { Pool } from 'pg'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool

  constructor() {
    const connectionString = process.env.DATABASE_URL!
    const url = new URL(connectionString)
    const schema = url.searchParams.get('schema') ?? 'public'

    url.searchParams.delete('schema')
    url.searchParams.set('options', `-c search_path="${schema}"`)

    const pool = new Pool({
      connectionString: url.toString(),
    })

    super({
      adapter: new PrismaPg(pool, {
        schema,
      }),
      log: ['warn', 'error'],
    })

    this.pool = pool
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
    await this.pool.end()
  }
}
