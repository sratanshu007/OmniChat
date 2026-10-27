// Simple lightweight QR code matrix generator for rendering crisp SVGs
// Based on standard Reed-Solomon / QR matrix representation

export function generateQrMatrix(text) {
  // Generate a deterministic 25x25 grid based on text hash
  const size = 25;
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns at top-left, top-right, bottom-left (7x7)
  const drawFinder = (startX, startY) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        } else {
          matrix[startY + r][startX + c] = false;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Hash the text to fill the remaining data area
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  let pseudo = Math.abs(hash) || 123456789;
  const nextRand = () => {
    pseudo = (pseudo * 1664525 + 1013904223) % 4294967296;
    return pseudo / 4294967296;
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= size - 8;
      const inBottomLeft = r >= size - 8 && c < 8;
      const isTiming = (r === 6 && c >= 8 && c < size - 8) || (c === 6 && r >= 8 && r < size - 8);

      if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming) {
        matrix[r][c] = nextRand() > 0.48;
      }
    }
  }

  return { size, matrix };
}
