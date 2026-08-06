export interface SrtLine {
  id: number;
  startTime: number; // in milliseconds
  endTime: number; // in milliseconds
  text: string;
}

function timeToMs(timeStr: string): number {
  // 00:00:28,606
  const parts = timeStr.split(':');
  if (parts.length !== 3) return 0;
  
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  
  const secParts = parts[2].split(',');
  const seconds = parseInt(secParts[0], 10);
  const ms = secParts.length > 1 ? parseInt(secParts[1], 10) : 0;
  
  return (hours * 3600000) + (minutes * 60000) + (seconds * 1000) + ms;
}

export function parseSRT(data: string): SrtLine[] {
  const result: SrtLine[] = [];
  if (!data) return result;

  // Normalize newlines and split into blocks
  const blocks = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n\n');

  for (const block of blocks) {
    if (!block.trim()) continue;
    
    const lines = block.split('\n');
    if (lines.length >= 3) {
      const id = parseInt(lines[0], 10);
      const timeLine = lines[1];
      
      const timeMatch = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
      if (timeMatch) {
        const startTime = timeToMs(timeMatch[1]);
        const endTime = timeToMs(timeMatch[2]);
        const text = lines.slice(2).join('\n');
        
        result.push({
          id: isNaN(id) ? result.length + 1 : id,
          startTime,
          endTime,
          text
        });
      }
    }
  }

  return result;
}
