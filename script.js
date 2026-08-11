(() => {
  const stage = document.querySelector("[data-demo]");
  const island = document.querySelector("[data-island]");
  if (!stage || !island) return;

  const open = () => island.classList.add("is-open");
  const close = () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      island.classList.remove("is-open");
    }
  };

  island.addEventListener("mouseenter", open);
  stage.addEventListener("mouseleave", close);

  island.addEventListener("click", (event) => {
    if (event.target.closest(".mod")) return;
    island.classList.toggle("is-open");
  });

  const mods = stage.querySelectorAll("[data-mod]");
  const panes = stage.querySelectorAll("[data-pane]");

  mods.forEach((mod) => {
    mod.addEventListener("click", () => {
      const id = mod.getAttribute("data-mod");
      mods.forEach((m) => m.classList.toggle("active", m === mod));
      panes.forEach((pane) => {
        pane.classList.toggle("is-active", pane.getAttribute("data-pane") === id);
      });
      open();
    });
  });
})();
