
// Format a date string to a more readable format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get the current date in YYYY-MM-DD format for date inputs
export const getCurrentDate = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Get the date X days ago in YYYY-MM-DD format
export const getDateDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};
