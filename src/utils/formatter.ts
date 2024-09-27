import slugify from "slugify";

export const formatSlug = (param?: string): string => {
  if (!param) return "";

  const result = slugify(param, {
    lower: true,
    strict: true,
    trim: true,
  });

  return result;
};
