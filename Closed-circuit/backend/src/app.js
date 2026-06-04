import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { config } from './config/env.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  const corsOptions =
    config.corsOrigin === '*'
      ? {}
      : {
          origin: config.corsOrigin.split(',').map((origin) => origin.trim()),
          credentials: true,
        };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use('/api', routes);

  return app;
}
