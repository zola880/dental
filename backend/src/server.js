const app = require('./app');
const connectDatabase = require('./config/database');
const env = require('./config/env');
const logger = require('./utils/logger');

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

const startServer = async () => {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`App running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();