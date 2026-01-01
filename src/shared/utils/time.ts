export const toDateTime = (date: string, time: string): Date => {
  return new Date(`${date}T${time}:00`);
};
