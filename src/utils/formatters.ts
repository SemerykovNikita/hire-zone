export const formatSalary = (salaryRange: {
  min: number;
  max: number;
}): string => {
  return `$${salaryRange.min.toLocaleString()} - $${salaryRange.max.toLocaleString()} / year`;
};

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
