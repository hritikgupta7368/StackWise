// Format date as YYYY-MM-DD
export const formatDate = (date: Date = new Date()): string => {
  return date.toISOString().slice(0, 10); // "2025-07-12"
};

// Get today's date string
export const getToday = (): string => {
  return formatDate();
};

// Get yesterday's date string
export const getYesterday = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDate(d);
};

// Check if two dates are the same (based on YYYY-MM-DD)
export const isSameDay = (d1: string, d2: string): boolean => {
  return d1 === d2;
};

// Check if a date string is today
export const isToday = (date: string): boolean => {
  return date === getToday();
};

// Add days to a date string
export const addDays = (date: string, days: number): string => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

// Subtract days from a date string
export const subtractDays = (date: string, days: number): string => {
  return addDays(date, -days);
};

// Get the difference in days between two date strings
export const getDaysDifference = (from: string, to: string): number => {
  const d1 = new Date(from);
  const d2 = new Date(to);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
};
