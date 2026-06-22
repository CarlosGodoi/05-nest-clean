import 'dotenv/config'
import { Pool } from 'pg'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'

const schemaId = randomUUID()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)
  process.env.DATABASE_URL = databaseURL

  execSync('pnpm prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: databaseURL },
    stdio: 'inherit',
  })
}, 20000)

afterAll(async () => {
  const baseUrl = new URL(process.env.DATABASE_URL!)
  baseUrl.searchParams.delete('schema')

  const pool = new Pool({ connectionString: baseUrl.toString() })

  try {
    // DROP direto, sem queries de diagnóstico que podem falhar
    await pool.query(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  } finally {
    await pool.end()
  }
}, 20000)
