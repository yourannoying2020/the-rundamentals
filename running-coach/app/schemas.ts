import { z } from 'zod';

export const TimeSchema = z.object({
  hrs: z.string().default('0'),
  min: z.string(),
  sec: z.string(),
});

export const DayOfWeekSchema = z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
export type DayOfWeekSchema = z.infer<typeof DayOfWeekSchema>;

export const PlanConfigSchema = z.object({
  currentTime: TimeSchema.default({ hrs: '0', min: '25', sec: '00' }),
  targetTime: TimeSchema.default({ hrs: '0', min: '22', sec: '30' }),
  duration: z.string().default('7'),
  customDays: z.string().default('10'),
  difficulty: z.number().default(5),
  startDay: DayOfWeekSchema.default('Monday'),
  longRunDay: DayOfWeekSchema.default('Sunday'),
  raceDistance: z.string().default('5'),
  customRaceDistance: z.string().default('5'),
  goalRaceDate: z.string().optional(),
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
  viewMode: z.enum(['vertical', 'horizontal', 'calendar']).default('vertical'),
  isAdvancedExpanded: z.boolean().default(false),
});