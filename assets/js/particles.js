/* ═══════════════════════════════════════════════════
   particles.js — Canvas particle background
   ═══════════════════════════════════════════════════ */
const Particles = (() => {
  function init() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = Math.random() * 1.4 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.12;
        this.vy = (Math.random() - 0.5) * 0.12;
        this.a  = Math.random() * 0.45 + 0.08;
        this.da = (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1);
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        this.a += this.da;
        if (this.a > 0.55 || this.a < 0.05) this.da *= -1;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(176,110,240,${this.a})`;
        ctx.fill();
      }
    }

    resize();
    for (let i = 0; i < 55; i++) particles.push(new Particle());
    window.addEventListener('resize', resize, { passive: true });

    (function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    })();
  }

  return { init };
})();
