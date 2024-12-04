const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Characters for the Matrix effect
const chars = '01';
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);

// Create an array to store the y-coordinates for each column
const drops = Array(columns).fill(1);

function drawMatrix() {
  // Orange background with slight transparency for trail effect
  ctx.fillStyle = 'rgba(255, 165, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw characters
  ctx.fillStyle = 'white';
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    // Reset drop position randomly or move down
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

// Run the drawMatrix function at intervals
setInterval(drawMatrix, 50);

// Adjust canvas size dynamically on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drops.length = Math.floor(canvas.width / fontSize);
  drops.fill(1);
});