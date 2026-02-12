window.addEventListener("load", () => {
  const splash = document.getElementById("splash-screen");

  setTimeout(() => {
    splash.classList.add("splash-hidden");

    if (typeof reveal === "function") reveal();
  }, 2500);
});

function openNav() {
  if (window.innerWidth <= 768) {
    document.getElementById("myNav").style.height = "100%";
  } else {
    document.getElementById("myNav").style.width = "100%";
  }
}

function closeNav() {
  if (window.innerWidth <= 768) {
    document.getElementById("myNav").style.height = "0%";
  } else {
    document.getElementById("myNav").style.width = "0%";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("dynamic-header");
  let headerWidth = header.offsetWidth;
  let headerHeight = header.offsetHeight;

  window.addEventListener("resize", () => {
    headerWidth = header.offsetWidth;
    headerHeight = header.offsetHeight;
  });

  const allImages = [
    "asset/1.png",
    "asset/2.png",
    "asset/3.png",
    "asset/4.png",
    "asset/5.png",
    "asset/6.png",
    "asset/7.png",
    "asset/8.png",
    "asset/9.png",
    "asset/10.png",
  ];

  const GRAVITY = 0.6;
  const FRICTION = 0.98;
  const BOUNCE = 0.6;
  const FLOOR_OFFSET = 20;

  let physicsBodies = [];

  function init() {
    header.innerHTML = "";
    physicsBodies = [];

    allImages.forEach((src, index) => {
      let rawSize = Math.floor(Math.random() * 180) + 100;
      const size = Math.min(rawSize, headerWidth - 20);
      const radius = size / 2;

      const img = document.createElement("img");
      img.src = src;
      img.classList.add("floating-img");
      img.style.width = size + "px";
      img.style.height = size + "px";

      const startX = Math.random() * (headerWidth - size) + radius;
      const startY = -size * 2;

      const body = {
        element: img,
        x: startX,
        y: startY,
        vx: 0,
        vy: 0,
        radius: radius,
        mass: radius,
      };

      img.style.transform = `rotate(${Math.random() * 360}deg)`;

      header.appendChild(img);
      physicsBodies.push(body);
    });
  }

  function updatePhysics() {
    const floorLevel = headerHeight - FLOOR_OFFSET;

    physicsBodies.forEach((body) => {
      body.vy += GRAVITY;
      body.vx *= FRICTION;
      body.x += body.vx;
      body.y += body.vy;

      if (body.y + body.radius > floorLevel) {
        body.y = floorLevel - body.radius;
        body.vy *= -BOUNCE;
        if (Math.abs(body.vy) < GRAVITY) body.vy = 0;
      }

      if (body.x - body.radius < 0) {
        body.x = body.radius;
        body.vx *= -BOUNCE;
      }
      if (body.x + body.radius > headerWidth) {
        body.x = headerWidth - body.radius;
        body.vx *= -BOUNCE;
      }
    });

    for (let iter = 0; iter < 3; iter++) {
      for (let i = 0; i < physicsBodies.length; i++) {
        for (let j = i + 1; j < physicsBodies.length; j++) {
          const b1 = physicsBodies[i];
          const b2 = physicsBodies[j];

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = b1.radius + b2.radius;

          if (dist < minDist) {
            const angle = Math.atan2(dy, dx);
            const overlap = minDist - dist;

            const moveX = Math.cos(angle) * overlap * 0.5;
            const moveY = Math.sin(angle) * overlap * 0.5;

            b1.x -= moveX;
            b1.y -= moveY;
            b2.x += moveX;
            b2.y += moveY;

            const collisionV = 0.5;
            b1.vx -= moveX * collisionV;
            b1.vy -= moveY * collisionV;
            b2.vx += moveX * collisionV;
            b2.vy += moveY * collisionV;
          }
        }
      }
    }

    physicsBodies.forEach((body) => {
      body.element.style.left = body.x - body.radius + "px";
      body.element.style.top = body.y - body.radius + "px";
    });

    requestAnimationFrame(updatePhysics);
  }

  function triggerExplosion() {
    physicsBodies.forEach((body) => {
      body.vy = -(Math.random() * 15 + 25);
      body.vx = (Math.random() - 0.5) * 20;

      let newRawSize = Math.floor(Math.random() * 180) + 100;
      const newSize = Math.min(newRawSize, headerWidth - 20);
      const newRadius = newSize / 2;

      body.radius = newRadius;
      body.mass = newRadius;
      body.element.style.width = newSize + "px";
      body.element.style.height = newSize + "px";
      body.x = Math.random() * (headerWidth - newSize) + newRadius;
      body.y -= 50;
      body.element.style.transform = `rotate(${Math.random() * 360}deg)`;
    });
  }

  header.addEventListener("click", () => {
    triggerExplosion();
    if (navigator.vibrate) navigator.vibrate(50);
  });

  setInterval(() => {
    triggerExplosion();
  }, 5000);

  init();
  updatePhysics();
});
