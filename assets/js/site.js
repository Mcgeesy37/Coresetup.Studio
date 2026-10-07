// CoreSetup Studio – Scroll-Film: Das Scrollen spielt den Clip ab und wechselt die Kapiteltexte.
(function () {
  var film = document.querySelector(".film");
  if (!film) return;

  var vid = film.querySelector("video");
  var caps = Array.prototype.slice.call(film.querySelectorAll(".cap"));
  var bar = film.querySelector(".bar i");
  var num = film.querySelector("[data-num]");
  var n = caps.length;
  var raf = 0;
  var cur = 0;

  function draw() {
    raf = 0;
    var total = film.offsetHeight - window.innerHeight;
    var p = Math.min(1, Math.max(0, -film.getBoundingClientRect().top / total));

    if (vid && vid.duration > 0) {
      var target = p * (vid.duration - 0.05);
      cur += (target - cur) * 0.35;
      if (Math.abs(target - cur) < 0.01) cur = target;
      if (Math.abs(vid.currentTime - cur) > 0.01) vid.currentTime = cur;
      if (cur !== target) raf = requestAnimationFrame(draw);
    }

    var on = Math.min(n - 1, Math.floor(p * n));
    caps.forEach(function (c, i) {
      c.setAttribute("data-on", i === on ? "1" : "0");
    });
    if (bar) bar.style.transform = "scaleX(" + Math.max(0.02, p) + ")";
    if (num) num.textContent = "0" + (on + 1) + " / 0" + n;
  }

  function onScroll() {
    if (!raf) raf = requestAnimationFrame(draw);
  }

  if (vid) {
    // Kleine Fassung fürs Handy, große für Desktop
    var mobile = window.innerWidth < 820;
    if (mobile && vid.dataset.posterMobile) vid.poster = vid.dataset.posterMobile;
    vid.src = mobile ? vid.dataset.srcMobile : vid.dataset.src;
    vid.addEventListener("loadedmetadata", onScroll);
    vid.load();
  }

  draw();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
})();

// Arbeiten: Projektvideos nur abspielen, solange sie im Bild sind.
(function () {
  var vids = document.querySelectorAll(".shot video");
  if (!vids.length || !("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        v.muted = true;
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.25 });
  Array.prototype.forEach.call(vids, function (v) { io.observe(v); });
})();
