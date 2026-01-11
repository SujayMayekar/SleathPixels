import { z } from 'zod';
import { insertLogSchema } from './schema';

export const api = {
  // A simple health check or logging endpoint if needed in the future
  log: {
    create: {
      method: 'POST' as const,
      path: '/api/log',
      input: insertLogSchema,
      responses: {
        201: z.object({ success: z.boolean() }),
      },
    },
  },
};
