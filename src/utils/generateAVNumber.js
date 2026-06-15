/**
 * Generate AV Booking Reference Number
 * Format: AV + Day + Month + Sequential Job Number
 * Example: AV1251 (12th day, 5th month (May), 1st job that day)
 */

let jobCountByDate = {};

export const generateAVNumber = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const dateKey = `${day}${month}`;

  // Get sequential job number for today
  if (!jobCountByDate[dateKey]) {
    jobCountByDate[dateKey] = 1;
  } else {
    jobCountByDate[dateKey]++;
  }

  const jobNumber = jobCountByDate[dateKey];

  return `AV${day}${month}${jobNumber}`;
};

/**
 * Reset job count (for testing or daily reset)
 */
export const resetJobCount = () => {
  jobCountByDate = {};
};

/**
 * Simulate persistence by storing in localStorage
 * This allows the counter to persist across page refreshes
 */
export const initializeJobCount = () => {
  try {
    const stored = localStorage.getItem('khanmoves_jobcount');
    if (stored) {
      jobCountByDate = JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Could not restore job count from localStorage', e);
  }
};

/**
 * Persist job count to localStorage
 */
export const persistJobCount = () => {
  try {
    localStorage.setItem('khanmoves_jobcount', JSON.stringify(jobCountByDate));
  } catch (e) {
    console.warn('Could not persist job count to localStorage', e);
  }
};

// Initialize on import
initializeJobCount();
