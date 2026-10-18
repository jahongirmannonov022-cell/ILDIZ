import confetti from 'canvas-confetti';

/** Celebration burst used when a goal / lesson / badge is completed */
export function celebrate(big = true) {
  try {
    const colors = ['#6C47FF', '#C026D3', '#10B981', '#F59E0B', '#38BDF8'];
    confetti({ particleCount: big ? 140 : 60, spread: big ? 90 : 60, origin: { y: 0.65 }, colors, disableForReducedMotion: true });
    if (big) {
      window.setTimeout(() => confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0 }, colors, disableForReducedMotion: true }), 200);
      window.setTimeout(() => confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1 }, colors, disableForReducedMotion: true }), 350);
    }
  } catch {
    /* canvas unavailable — ignore */
  }
}
