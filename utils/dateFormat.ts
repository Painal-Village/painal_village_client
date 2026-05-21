export const formatDateToHindi = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    return isoString;
  }
};

export const formatDateToEnglish = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    return isoString;
  }
};

/**
 * Formats a birth date string from various formats into "12 March 2006".
 * Handles: DD/MM/YYYY, YYYY-MM-DD (ISO), plain year "2006", or fallback text like "Unavailable".
 */
export const formatBirthDate = (value: string | null | undefined): string => {
  if (!value || value.trim() === '' || value === 'Unavailable' || value === 'N/A') {
    return 'N/A';
  }

  const trimmed = value.trim();

  // Handle DD/MM/YYYY format (e.g., "12/03/2006")
  const slashParts = trimmed.split('/');
  if (slashParts.length === 3) {
    const [day, month, year] = slashParts.map(Number);
    const date = new Date(year, month - 1, day);
    if (!isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    }
  }

  // Handle ISO format (e.g., "2006-03-12")
  const dashParts = trimmed.split('-');
  if (dashParts.length === 3) {
    const date = new Date(trimmed);
    if (!isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);
    }
  }

  // Handle plain year (e.g., "2006")
  if (/^\d{4}$/.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
};
