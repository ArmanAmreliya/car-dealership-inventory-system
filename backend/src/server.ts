import app from './app/app';
import { env } from './config/env';
import { prisma } from './infrastructure/prisma';

const port = env.PORT;

async function checkDbConnection(retries = 5, delayMs = 2000): Promise<'postgres' | 'in-memory'> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return 'postgres';
    } catch (err) {
      console.warn(`⏳ DB connection attempt ${attempt}/${retries} failed. Retrying in ${delayMs}ms...`);
      if (attempt < retries) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return 'in-memory';
}

async function start(): Promise<void> {
  const dbMode = await checkDbConnection();

  if (dbMode === 'postgres') {
    console.log('✅ DB connected — mode: PostgreSQL');
  } else {
    console.warn('⚠️  DB unreachable after retries — mode: in-memory fallback (writes will fail)');
  }

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

start();
