/**
 * NoiseTexture — DESIGN.md §3.5
 * Subtle starfield/grain layered over the page background. The single decorative
 * element that runs site-wide. Inline SVG so we don't need an additional asset
 * fetch; tiled via CSS background.
 */

export function NoiseTexture() {
  // Inline SVG noise pattern — ~300 bytes, base64-encoded for use as a CSS url().
  // A turbulence filter produces high-frequency grain; the second layer adds a
  // sparse star pattern via tiny circles at random-ish positions.
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
      <feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#n)' opacity='0.55'/>
    <g fill='#fff' opacity='0.7'>
      <circle cx='40' cy='60' r='0.8'/>
      <circle cx='110' cy='180' r='0.6'/>
      <circle cx='220' cy='90' r='0.9'/>
      <circle cx='290' cy='250' r='0.7'/>
      <circle cx='75' cy='280' r='0.6'/>
      <circle cx='180' cy='210' r='0.8'/>
      <circle cx='250' cy='40' r='0.6'/>
      <circle cx='30' cy='200' r='0.7'/>
      <circle cx='160' cy='130' r='0.5'/>
      <circle cx='200' cy='300' r='0.6'/>
    </g>
  </svg>`;

  const encoded = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
      style={{
        backgroundImage: `url("${encoded}")`,
        backgroundSize: "320px 320px",
        backgroundRepeat: "repeat",
      }}
    />
  );
}
