import { isMonday, previousMonday } from 'date-fns';

export function getMonday(input?: Date | string): Date {
  const date = new Date(input ?? new Date());
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }
  if (isMonday(date)) {
    return date;
  } else {
    return previousMonday(date);
  }
}
