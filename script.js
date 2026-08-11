(() => {
  const stage = document.querySelector("[data-demo]");
  const island = document.querySelector("[data-island]");
  if (!stage || !island) return;

  const shape = island.querySelector(".island-shape");
  const fill = island.querySelector("[data-island-fill]");
  const stroke = island.querySelector("[data-island-stroke]");
  const shell = island.querySelector(".island-shell");

  /** GlancePanel NotchDropShape — concave top ears + rounded bottom. */
  function notchDropPath(w, h, topR, bottomR) {
    const tr = Math.min(topR, w / 2, h / 2);
    const br = Math.min(bottomR, (w - 2 * tr) / 2, h - tr);
    return [
      `M 0 0`,
      `Q ${tr} 0 ${tr} ${tr}`,
      `L ${tr} ${h - br}`,
      `Q ${tr} ${h} ${tr + br} ${h}`,
      `L ${w - tr - br} ${h}`,
      `Q ${w - tr} ${h} ${w - tr} ${h - br}`,
      `L ${w - tr} ${tr}`,
      `Q ${w - tr} 0 ${w} 0`,
      `Z`,
    ].join(" ");
  }

  function isOpen() {
    return (
      island.classList.contains("is-open") ||
      stage.matches(":hover") ||
      stage.matches(":focus-within")
    );
  }

  function syncShape() {
    const w = island.clientWidth;
    const h = island.clientHeight;
    if (w < 2 || h < 2) return;

    const open = isOpen();
    // Radii match NotchView topRadius / bottomRadius
    const topR = open ? 16 : 6;
    const bottomR = open ? 18 : 14;
    const d = notchDropPath(w, h, topR, bottomR);

    shape.setAttribute("viewBox", `0 0 ${w} ${h}`);
    fill.setAttribute("d", d);
    stroke.setAttribute("d", d);
    stroke.style.opacity = open ? "1" : "0";
    shell.style.clipPath = `path('${d}')`;
  }

  let animating = false;
  function tickShape(ms = 420) {
    if (animating) return;
    animating = true;
    const start = performance.now();
    const step = (now) => {
      syncShape();
      if (now - start < ms) {
        requestAnimationFrame(step);
      } else {
        animating = false;
        syncShape();
      }
    };
    requestAnimationFrame(step);
  }

  const open = () => {
    island.classList.add("is-open");
    tickShape();
  };
  const close = () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      island.classList.remove("is-open");
      tickShape();
    }
  };

  island.addEventListener("mouseenter", open);
  stage.addEventListener("mouseleave", close);

  island.addEventListener("click", (event) => {
    if (event.target.closest(".gp-mod, .gp-plus, .gp-controls button")) return;
    island.classList.toggle("is-open");
    tickShape();
  });

  const mods = stage.querySelectorAll("[data-mod]");
  const panes = stage.querySelectorAll("[data-pane]");

  mods.forEach((mod) => {
    mod.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = mod.getAttribute("data-mod");
      mods.forEach((m) => m.classList.toggle("is-active", m === mod));
      panes.forEach((pane) => {
        pane.classList.toggle("is-active", pane.getAttribute("data-pane") === id);
      });
      open();
    });
  });

  const ro = new ResizeObserver(() => syncShape());
  ro.observe(island);
  syncShape();
})();
