import app from './app/app';
import { env } from './config/env';
import { prisma } from './infrastructure/prisma';

const port = env.PORT;

async function checkDbConnection(): Promise<'postgres' | 'in-memory'> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return 'postgres';
  } catch {
    return 'in-memory';
  }
}

async function start(): Promise<void> {
  const dbMode = await checkDbConnection();

  if (dbMode === 'postgres') {
    console.log('✅ DB connected — mode: PostgreSQL');
  } else {
    console.warn('⚠️  DB unreachable — mode: in-memory fallback');
  }

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

start();
