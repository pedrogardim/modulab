export const drawADSR = (
  canvas: HTMLCanvasElement,
  attackDuration: number,
  decayDuration: number,
  sustainLevel: number,
  sustainDuration: number,
  releaseDuration: number,
  peakLevel: number = 1
): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.strokeStyle = "#3f51b5";

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate the total duration and scale factor
  const totalDuration =
    attackDuration + decayDuration + sustainDuration + releaseDuration;
  const scaleFactor = canvas.width / totalDuration;

  // Define coordinates for ADSR
  const attackEndX = attackDuration * scaleFactor;
  const decayEndX = attackEndX + decayDuration * scaleFactor;
  const sustainEndX = decayEndX + sustainDuration * scaleFactor;

  const attackEndY = peakLevel * canvas.height;
  const decayEndY = sustainLevel * canvas.height;

  // Draw ADSR
  ctx.beginPath();
  ctx.moveTo(0, canvas.height); // Start

  ctx.lineTo(attackEndX, canvas.height - attackEndY); // Attack
  ctx.lineTo(decayEndX, canvas.height - decayEndY); // Decay
  ctx.lineTo(sustainEndX, canvas.height - decayEndY); // Sustain
  ctx.lineTo(canvas.width, canvas.height); // Release

  ctx.stroke();
};
