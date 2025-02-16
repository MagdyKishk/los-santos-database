export function formatTime(milliseconds: number): string {
  // Convert milliseconds to total seconds (rounded down)
  const totalSeconds = Math.floor(milliseconds / 1000);
  
  // Compute hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  // Format time as "HH:MM:SS" with each unit padded to 2 digits
  return (
    String(hours).padStart(2, '0') + ':' +
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0')
  );
}
