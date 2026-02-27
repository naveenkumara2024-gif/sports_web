import { z } from 'zod';

// Constant MATCH_STATUS with key-value pairs for SCHEDULED, LIVE, and FINISHED in lowercase
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

// Validates an optional limit as a coerced positive integer with a maximum of 100
export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

// Validates a required id as a coerced positive integer
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Validates a match creation object
export const createMatchSchema = z.object({
  sport: z.string().min(1),
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),
  homeScore: z.coerce.number().int().nonnegative().optional(),
  awayScore: z.coerce.number().int().nonnegative().optional(),
}).superRefine((data, ctx) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  if (end <= start) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'endTime must be chronologically after startTime',
      path: ['endTime'],
    });
  }
});

// Requires homeScore and awayScore as coerced non-negative integers
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
