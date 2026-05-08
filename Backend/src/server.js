const { app } = require('./app');
const { env } = require('./config/env');
const { prisma } = require('./prisma/client');

const start = async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('Database connected successfully');

    app.listen(env.PORT, () => {
      console.log(`Nexus API running on port ${env.PORT} [${env.NODE_ENV}]`);
      console.log(`Health check: http://localhost:${env.PORT}/api/health`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);


start();
