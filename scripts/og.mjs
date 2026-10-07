// Generates the social preview and PNG app icon from SVG. Run: node scripts/og.mjs
import sharp from 'sharp';

const font = "'Schibsted Grotesk', 'Helvetica Neue', Arial, sans-serif";

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="core" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#FFF4D6"/>
      <stop offset=".18" stop-color="#FFF4D6" stop-opacity=".9"/>
      <stop offset=".42" stop-color="#E8C46A" stop-opacity=".38"/>
      <stop offset="1" stop-color="#E8C46A" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#050607"/>
  <g stroke="#E8C46A" stroke-opacity=".14">
    <line x1="900" y1="315" x2="1060" y2="190"/><line x1="900" y1="315" x2="1090" y2="380"/>
    <line x1="900" y1="315" x2="780" y2="170"/><line x1="900" y1="315" x2="760" y2="440"/>
    <line x1="900" y1="315" x2="960" y2="500"/><line x1="900" y1="315" x2="930" y2="130"/>
  </g>
  <g fill="#E9E7E2" fill-opacity=".6">
    <circle cx="1060" cy="190" r="4"/><circle cx="1090" cy="380" r="3"/><circle cx="780" cy="170" r="3"/>
    <circle cx="760" cy="440" r="4"/><circle cx="960" cy="500" r="3"/><circle cx="930" cy="130" r="3"/>
  </g>
  <circle cx="900" cy="315" r="150" fill="url(#core)"/>
  <circle cx="900" cy="315" r="190" fill="none" stroke="#E8C46A" stroke-opacity=".16"/>
  <text x="80" y="140" fill="#E9E7E2" font-family="${font}" font-size="26" font-weight="500" letter-spacing="12">SALEM</text>
  <text x="80" y="300" fill="#E9E7E2" font-family="${font}" font-size="68" font-weight="600" letter-spacing="-2">One intelligence.</text>
  <text x="80" y="380" fill="#E9E7E2" font-family="${font}" font-size="68" font-weight="600" letter-spacing="-2">Everywhere you are.</text>
  <text x="80" y="500" fill="#8E9196" font-family="${font}" font-size="28">Personal Intelligence Infrastructure</text>
</svg>`;

await sharp(Buffer.from(og)).png().toFile('public/og.png');
await sharp('public/favicon.svg', { density: 600 }).resize(512, 512).png().toFile('public/icon-512.png');
console.log('ok');
