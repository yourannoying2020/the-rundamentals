import { z } from 'zod';

export const TimeSchema = z.object({
  min: z.string(),
  sec: z.string(),
});

export const PlanConfigSchema = z.object({
  currentTime: TimeSchema,
  targetTime: TimeSchema,
  duration: z.string(),
  customDays: z.string(),
  difficulty: z.number(),
});

export type PlanConfig = z.infer<typeof PlanConfigSchema>;

export const TrainingDaySchema = z.object({
  day: z.string(),
  title: z.string(),
  workout: z.string(),
  pace: z.string(),
  distance: z.string(),
  type: z.enum(['rest', 'easy', 'hard']),
});

export const SavedPlansSchema = z.record(
  z.string(),
  z.object({
    name: z.string(),
    config: PlanConfigSchema,
    plan: z.array(TrainingDaySchema),
    timestamp: z.number(),
  })
);

export const SettingsSchema = PlanConfigSchema.extend({
  viewMode: z.enum(['vertical', 'horizontal', 'calendar']),
  isDurationExpanded: z.boolean(),
  isLayoutExpanded: z.boolean(),
}).partial();