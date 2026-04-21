import { z } from 'zod';

export type StorageResult<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

export const storage = {
  get: <T>(key: string, schema: z.ZodType<T>): StorageResult<T> | null => {
    if (typeof window === 'undefined') return null;
    
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      const parsed = JSON.parse(item);
      const result = schema.safeParse(parsed);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error(String(error)) 
      };
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};