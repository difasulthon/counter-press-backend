export const formatSlug = (param: string): string => {
  const result = param.trim().toLowerCase().replace(" ", "-");

  return result;
};
