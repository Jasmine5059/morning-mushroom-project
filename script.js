const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const initForestScene = () => {
  const body = document.querySelector(".home-forest");
  if (!body) return;

  const world = document.querySelector(".forest-world");
  const field = document.querySelector(".mushroom-field");
  const mushrooms = [...document.querySelectorAll(".mushroom-link")];
  const poemScroll = document.querySelector(".poem-scroll");
  const treeBack = document.querySelector(".tree-band-back");
  const treeMid = document.querySelector(".tree-band-mid");
  const treeFront = document.querySelector(".tree-band-front");

  let progress = 0.02;
  let targetProgress = 0.02;
  let pointerX = 0;
  let pointerY = 0;
  let easedX = 0;
  let easedY = 0;

  const updateMushrooms = () => {
    mushrooms.forEach((mushroom) => {
      const depth = Number(mushroom.dataset.depth);
      const reveal = clamp((progress - depth + 0.06) / 0.12, 0, 1);
      const sizeBias = 1 - depth;
      const scale = 0.5 + reveal * (0.5 + sizeBias * 0.2);
      const lift = (1 - reveal) * 34 - progress * 18;

      mushroom.style.opacity = reveal.toFixed(3);
      mushroom.style.pointerEvents = reveal > 0.16 ? "auto" : "none";
      mushroom.style.transform = `translate3d(-50%, ${lift.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    });
  };

  const render = () => {
    progress += (targetProgress - progress) * 0.055;
    easedX += (pointerX - easedX) * 0.06;
    easedY += (pointerY - easedY) * 0.06;

    document.documentElement.style.setProperty("--journey-progress", progress.toFixed(3));

    world.style.transform = `
      translate3d(${(easedX * 26).toFixed(2)}px, ${(easedY * 12 - progress * 34).toFixed(2)}px, 0)
      rotateY(${(easedX * 6).toFixed(2)}deg)
      rotateX(${(-easedY * 3.2).toFixed(2)}deg)
      scale(${(1 + progress * 0.12).toFixed(3)})
    `;

    field.style.transform = `
      translate3d(${(easedX * 16).toFixed(2)}px, ${(easedY * 8 - progress * 16).toFixed(2)}px, 0)
      scale(${(1 + progress * 0.05).toFixed(3)})
    `;

    if (treeBack) {
      treeBack.style.filter = `blur(${(1 + progress * 1.2).toFixed(2)}px)`;
    }

    if (treeMid) {
      treeMid.style.filter = `blur(${(0.4 + progress * 0.9).toFixed(2)}px)`;
    }

    if (treeFront) {
      treeFront.style.filter = `blur(${(progress * 0.35).toFixed(2)}px)`;
    }

    updateMushrooms();
    requestAnimationFrame(render);
  };

  window.addEventListener("mousemove", (event) => {
    pointerX = event.clientX / window.innerWidth - 0.5;
    pointerY = event.clientY / window.innerHeight - 0.5;
  });

  window.addEventListener(
    "wheel",
    (event) => {
      if (poemScroll && event.target.closest(".poem-scroll")) return;

      event.preventDefault();
      targetProgress = clamp(targetProgress + event.deltaY * 0.00052, 0.02, 1);
    },
    { passive: false },
  );

  render();
};

initForestScene();
