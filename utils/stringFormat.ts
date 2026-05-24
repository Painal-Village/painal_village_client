/**
 * Capitalizes the first letter of each word in a string.
 * Example: "mohit kumar" -> "Mohit Kumar"
 */
export const toTitleCase = (str: string | undefined | null): string => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};
