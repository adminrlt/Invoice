export const formatDuration = (ms: number): string => {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  
  const seconds = Math.floor(ms / 1000);
  const remainingMs = ms % 1000;
  
  if (seconds < 60) {
    return `${seconds}s ${remainingMs}ms`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}m ${remainingSeconds}s ${remainingMs}ms`;
};