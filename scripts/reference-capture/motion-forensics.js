(() => {
  const F = { listeners: {}, raf: { calls: 0, stacks: {} }, io: [], waapi: { calls: 0, stacks: {} }, scrollTo: 0 };
  window.__forensics = F;
  const top3 = (e) => (e.stack || '').split('\n').slice(1, 4).map(s => s.trim().replace(/^at\s+/, '')).join(' <- ');

  const ael = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    try {
      if (/scroll|wheel|mousemove|pointermove|touchmove|resize/.test(type)) {
        const t = this === window ? 'window' : this === document ? 'document'
          : (this.tagName ? this.tagName.toLowerCase() + (this.className && typeof this.className === 'string' ? '.' + this.className.trim().split(/\s+/)[0] : '') : String(this));
        const passive = !!(opts && typeof opts === 'object' && opts.passive);
        const k = type + ' @' + t + (passive ? ' [passive]' : ' [NOT passive]');
        (F.listeners[k] = F.listeners[k] || { n: 0, stack: '' }).n++;
        if (!F.listeners[k].stack) F.listeners[k].stack = top3(new Error());
      }
    } catch (e) {}
    return ael.call(this, type, fn, opts);
  };

  const raf = window.requestAnimationFrame;
  window.requestAnimationFrame = function (cb) {
    F.raf.calls++;
    if (F.raf.calls < 400 && Object.keys(F.raf.stacks).length < 12) {
      const s = top3(new Error());
      F.raf.stacks[s] = (F.raf.stacks[s] || 0) + 1;
    }
    return raf.call(window, cb);
  };

  const IO = window.IntersectionObserver;
  if (IO) {
    window.IntersectionObserver = function (cb, opts) {
      try { if (F.io.length < 20) F.io.push({ threshold: (opts && opts.threshold) ?? null, rootMargin: (opts && opts.rootMargin) || null, stack: top3(new Error()) }); } catch (e) {}
      return new IO(cb, opts);
    };
    window.IntersectionObserver.prototype = IO.prototype;
  }

  const anim = Element.prototype.animate;
  if (anim) {
    Element.prototype.animate = function (kf, o) {
      F.waapi.calls++;
      if (Object.keys(F.waapi.stacks).length < 10) { const s = top3(new Error()); F.waapi.stacks[s] = (F.waapi.stacks[s] || 0) + 1; }
      return anim.call(this, kf, o);
    };
  }

  const st = window.scrollTo;
  window.scrollTo = function () { F.scrollTo++; return st.apply(window, arguments); };
})();
