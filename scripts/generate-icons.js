const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

// SVG do ícone — checkbox estilizado com fundo escuro
const svg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Fundo -->
  <rect width="512" height="512" rx="96" fill="#0a0a0a"/>
  <!-- Superficie do card -->
  <rect x="60" y="60" width="392" height="392" rx="64" fill="#111111"/>

  <!-- Checkbox superior (concluído) -->
  <rect x="110" y="130" width="120" height="120" rx="24" fill="#6366f1"/>
  <path d="M140 190 L168 222 L228 158" stroke="white" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

  <!-- Linhas de texto ao lado do checkbox superior -->
  <rect x="258" y="160" width="140" height="18" rx="9" fill="#6366f1" opacity="0.7"/>
  <rect x="258" y="192" width="96" height="14" rx="7" fill="#2a2a2a"/>

  <!-- Divisor -->
  <rect x="110" y="280" width="292" height="2" rx="1" fill="#1c1c1c"/>

  <!-- Checkbox inferior (pendente) -->
  <rect x="110" y="310" width="120" height="120" rx="24" fill="none" stroke="#3f3f46" stroke-width="14"/>

  <!-- Linhas de texto ao lado do checkbox inferior -->
  <rect x="258" y="340" width="140" height="18" rx="9" fill="#2a2a2a"/>
  <rect x="258" y="372" width="96" height="14" rx="7" fill="#1c1c1c"/>
</svg>
`)

async function run() {
  const dir = path.join(__dirname, '../public/icons')
  fs.mkdirSync(dir, { recursive: true })

  await sharp(svg).resize(192, 192).png().toFile(path.join(dir, 'icon-192.png'))
  console.log('✓ icon-192.png')

  await sharp(svg).resize(512, 512).png().toFile(path.join(dir, 'icon-512.png'))
  console.log('✓ icon-512.png')

  // Apple touch icon
  await sharp(svg).resize(180, 180).png().toFile(path.join(dir, 'apple-icon.png'))
  console.log('✓ apple-icon.png')

  console.log('\nÍcones gerados em public/icons/')
}

run().catch(err => { console.error(err); process.exit(1) })
