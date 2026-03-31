export const runtime = 'edge';

export async function GET() {
  const now = Date.now();

  // Deterministic random number generator based on a seed
  function sfc32(a, b, c, d) {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
      var t = (a + b | 0) + d | 0;
      d = d + 1 | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
  }

  // We want continuous back-to-back cycles.
  // Pick a fixed point in the past
  const epoch = new Date('2024-01-01T00:00:00Z').getTime();

  let currentStart = epoch;
  let targetDate = epoch;
  let seed = 1;

  while (targetDate <= now) {
      currentStart = targetDate;
      // Generate a random duration between 1 and 5 days
      // 1 day = 86400000 ms, 5 days = 432000000 ms
      const rand = sfc32(seed++, 0x9E3779B9, 0x243F6A88, 0xB7E15162);
      const duration = 86400000 + Math.floor(rand * (432000000 - 86400000));
      targetDate = currentStart + duration;
  }

  return new Response(JSON.stringify({ targetDate }), {
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
    },
  });
}
