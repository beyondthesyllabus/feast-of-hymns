const { useState, useEffect, useRef, useCallback } = React;
const A = window.A, WX = 290, WY = 566, WW = 500, WH = 440;
const fit = i => Math.max(WW / i.width, WH / i.height);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Floating ambient music particles for sacred hymn atmosphere
function MusicParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const notes = ['♩', '♪', '♫', '♬', '𝄞', '✦', '✧', '•'];
    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 11 + Math.random() * 16,
      char: notes[Math.floor(Math.random() * notes.length)],
      speedY: 0.35 + Math.random() * 0.7,
      speedX: (Math.random() - 0.5) * 0.45,
      opacity: 0.15 + Math.random() * 0.45,
      fadeSpeed: 0.003 + Math.random() * 0.005,
      growing: Math.random() > 0.5
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.growing) {
          p.opacity += p.fadeSpeed;
          if (p.opacity >= 0.65) p.growing = false;
        } else {
          p.opacity -= p.fadeSpeed;
          if (p.opacity <= 0.1) p.growing = true;
        }

        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.x > width + 20) p.x = -10;

        ctx.font = `${p.size}px Poppins, sans-serif`;
        ctx.fillStyle = `rgba(255, 200, 40, ${p.opacity})`;
        ctx.fillText(p.char, p.x, p.y);
      });
      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-particles" />;
}

// Live Countdown to Sunday 25th October 2026, 5:00pm prompt
function Countdown() {
  const targetDate = new Date('2026-10-25T17:00:00+01:00').getTime();
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  function getTimeRemaining() {
    const now = new Date().getTime();
    const diff = Math.max(0, targetDate - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-container">
      <div className="countdown-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Countdown to Worship
      </div>
      <div className="countdown-grid">
        <div className="countdown-card">
          <span className="countdown-num">{String(timeLeft.days).padStart(2, '0')}</span>
          <span className="countdown-unit">Days</span>
        </div>
        <div className="countdown-card">
          <span className="countdown-num">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="countdown-unit">Hours</span>
        </div>
        <div className="countdown-card">
          <span className="countdown-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="countdown-unit">Mins</span>
        </div>
        <div className="countdown-card">
          <span className="countdown-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="countdown-unit">Secs</span>
        </div>
      </div>
    </div>
  );
}

// Sound wave equalizer bars animation
function SoundBars() {
  return (
    <div className="sound-bars" title="Harmonic praise">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

// Navigation Bar
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navRef = useRef(null);
  const [navH, setNavH] = useState(58);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress((window.scrollY / total) * 100);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="scroll-bar" style={{ width: `${scrollProgress}%` }} />
      <nav ref={navRef} className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a className="brand" href="#top">
          <img src={A.logo} alt="God's House of Refuge" />
          <span>
            <b>GOD'S HOUSE OF REFUGE</b>
          </span>
        </a>
        <div className="links">
          <a href="#details">Details</a>
          <a href="#how">How it works</a>
          <a className="cta sm" href="#create">Create flyer</a>
        </div>
        <button
          className={`nav-toggle ${mobileOpen ? 'open' : ''}`}
          onClick={() => {
            if (navRef.current) setNavH(navRef.current.offsetHeight);
            setMobileOpen(!mobileOpen);
          }}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {mobileOpen && (
        <div className="mobile-menu" style={{ top: `${navH}px` }} onClick={() => setMobileOpen(false)}>
          <a href="#details">Event Details</a>
          <a href="#how">How It Works</a>
          <a className="cta" href="#create" style={{ marginTop: '8px' }}>Create My Flyer</a>
        </div>
      )}
    </>
  );
}

// Hero Section
function Hero() {
  return (
    <header
      id="top"
      className="hero"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(5, 22, 95, 0.82) 0%, rgba(10, 52, 175, 0.88) 55%, #030f45 100%), url(${A.choir})`
      }}
    >
      <MusicParticles />
      <div className="wrap c">
        <p className="eyebrow"> HOUSE OF PRAISE PRESENTS</p>
        <div className="title-wrap">
          <img className="title" src={A.title} alt="Feast of Hymns 2026" />
        </div>
        <div className="ribbon-wrap">
          <span className="ribbon">
            <SoundBars />
            THEME: PRAISE THAT PREVAILS
            <SoundBars />
          </span>
        </div>
        <p className="lead">
          An evening of worship through timeless hymns. Join us for a glorious celestial gathering, and let your friends and family know you will be there.
        </p>
        <div className="btns">
          <a className="cta" href="#create">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Create my “I Will Be Attending” flyer
          </a>
          <a className="ghost" href="#details">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Event details
          </a>
        </div>
        <Countdown />
        <div className="chips">
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Sun. 25th Oct. 2026
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            5:00pm prompt
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            8 Ikot Ebido Street, Uyo
          </span>
        </div>
      </div>
    </header>
  );
}

// Event Details with Interactive Calendar / Map actions
function Details() {
  const addToCalendar = () => {
    const title = encodeURIComponent("Feast of Hymns 2026 - God's House of Refuge");
    const details = encodeURIComponent("Theme: Praise That Prevails. Ministering choirs, hymns, and glorious worship at God's House of Refuge, 8 Ikot Ebido Street, Uyo.");
    const location = encodeURIComponent("8 Ikot Ebido Street, Uyo, Akwa Ibom State, Nigeria");
    const dates = "20261025T160000Z/20261025T210000Z";
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`, '_blank');
  };

  const openMap = () => {
    window.open("https://maps.google.com/?q=8+Ikot+Ebido+Street+Uyo+Akwa+Ibom", '_blank');
  };

  return (
    <section id="details" className="sec light">
      <div className="wrap">
        <h2 className="h" data-reveal="up">Event <em>details</em></h2>
        <p className="mut c" data-reveal="up" style={{ '--rd': '.1s' }}>Everything you need to know for this unforgettable evening.</p>
        <div className="grid3">
          <div className="tile" onClick={addToCalendar} data-reveal="zoom" style={{ cursor: 'pointer', '--rd': '.15s' }}>
            <div className="tile-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <small>DATE</small>
            <strong>Sunday, 25th October 2026</strong>
            <span>Mark your calendar &amp; invite your loved ones</span>
            <span className="tile-action">Add to Google Calendar &rarr;</span>
          </div>

          <div className="tile" data-reveal="zoom" style={{ '--rd': '.27s' }}>
            <div className="tile-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <small>TIME</small>
            <strong>5:00pm prompt</strong>
            <span>Red Carpet II opens gracefully at 4:30pm</span>
            <span className="tile-action" style={{ border: 'none' }}>Early arrival recommended</span>
          </div>

          <div className="tile" onClick={openMap} data-reveal="zoom" style={{ cursor: 'pointer', '--rd': '.39s' }}>
            <div className="tile-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <small>VENUE</small>
            <strong>God's House of Refuge</strong>
            <span>8 Ikot Ebido Street, Uyo, Akwa Ibom State</span>
            <span className="tile-action">Get directions in Google Maps &rarr;</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// How it Works Section
function How() {
  const steps = [
    ["Enter your name", "Your full name appears beautifully framed on your custom flyer."],
    ["Upload your photo", "Choose a clear portrait photo from your phone or computer."],
    ["Adjust and fit", "Drag, zoom, rotate, and enhance colors to make it look perfect."],
    ["Confirm & download", "Save your high-resolution flyer and share it on WhatsApp & socials."]
  ];

  return (
    <section id="how" className="sec alt">
      <div className="wrap">
        <h2 className="h" data-reveal="up">How it <em>works</em></h2>
        <p className="mut c" data-reveal="up" style={{ '--rd': '.1s' }}>Get your personalized attendance flyer ready in under 30 seconds.</p>
        <div className="grid4">
          {steps.map(([title, desc], i) => (
            <div className="step" key={title} data-reveal="up" style={{ '--rd': `${0.18 + i * 0.12}s` }}>
              <span className="n">{i + 1}</span>
              <strong>{title}</strong>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Flyer Creator Studio
function Creator() {
  const cv = useRef(null), off = useRef(null), fi = useRef(null), tpl = useRef(null);
  const pts = useRef(new Map()), dr = useRef({ last: null, pd: 0, moved: 0 });
  const [s, setS] = useState({ name: "", img: null, x: 0, y: 0, rot: 0, flip: 1, z: 1, b: 0, c: 0, s: 0 });
  const [ok, setOk] = useState(false);
  const [msg, setMsg] = useState("");
  const [ready, setReady] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const sr = useRef(s);
  sr.current = s;
  const up = p => setS(o => ({ ...o, ...p }));

  useEffect(() => {
    off.current = document.createElement("canvas");
    off.current.width = WW;
    off.current.height = WH;
    const img = new Image();
    img.onload = () => {
      tpl.current = img;
      setReady(r => r + 1);
    };
    img.src = A.tpl;
    document.fonts.load("700 24px Poppins").then(() => setReady(r => r + 1));
  }, []);

  // Canvas drawing
  useEffect(() => {
    const c = cv.current, t = tpl.current;
    if (!c || !t) return;
    const x = c.getContext("2d");
    const oc = off.current.getContext("2d", { willReadFrequently: true });

    x.clearRect(0, 0, 1080, 1350);
    x.drawImage(t, 0, 0, 1080, 1350);
    oc.fillStyle = "#fff";
    oc.fillRect(0, 0, WW, WH);

    if (s.img) {
      const k = fit(s.img) * s.z;
      oc.save();
      oc.translate(WW / 2 + s.x, WH / 2 + s.y);
      oc.rotate((s.rot * Math.PI) / 180);
      oc.scale(s.flip * k, k);
      oc.drawImage(s.img, -s.img.width / 2, -s.img.height / 2);
      oc.restore();

      if (s.b || s.c || s.s) {
        const d = oc.getImageData(0, 0, WW, WH);
        const a = d.data;
        const br = s.b * 2.55;
        const q = s.c * 2.55;
        const cf = (259 * (q + 255)) / (255 * (259 - q));
        const sf = 1 + s.s / 100;
        for (let i = 0; i < a.length; i += 4) {
          let r = cf * (a[i] + br - 128) + 128;
          let g = cf * (a[i + 1] + br - 128) + 128;
          let b = cf * (a[i + 2] + br - 128) + 128;
          const l = 0.299 * r + 0.587 * g + 0.114 * b;
          a[i] = clamp(l + (r - l) * sf, 0, 255);
          a[i + 1] = clamp(l + (g - l) * sf, 0, 255);
          a[i + 2] = clamp(l + (b - l) * sf, 0, 255);
        }
        oc.putImageData(d, 0, 0);
      }
    }

    x.drawImage(off.current, WX, WY);

    if (!s.img) {
      x.fillStyle = "#eaf0ff";
      x.fillRect(WX, WY, WW, WH);
      x.strokeStyle = "#0a34af";
      x.lineWidth = 3;
      x.setLineDash([12, 10]);
      x.strokeRect(WX + 16, WY + 16, WW - 32, WH - 32);
      x.setLineDash([]);
      x.textAlign = "center";
      x.fillStyle = "#0a34af";
      x.font = "700 26px Poppins";
      x.fillText("Upload your photo", WX + WW / 2, WY + WH / 2 - 4);
      x.font = "500 17px Poppins";
      x.fillStyle = "#4a62b8";
      x.fillText("Tap here to choose", WX + WW / 2, WY + WH / 2 + 28);
    }

    // Name banner on flyer
    const n = s.name.trim().toUpperCase() || "YOUR NAME";
    const h = 60;
    const y = WY + WH - h;
    const g = x.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, "rgba(8,30,120,.94)");
    g.addColorStop(1, "rgba(3,15,69,.97)");
    x.fillStyle = g;
    x.fillRect(WX, y, WW, h);
    x.fillStyle = "#ffc828";
    x.fillRect(WX, y, WW, 4);

    let f = 30;
    x.textAlign = "center";
    x.textBaseline = "middle";
    do {
      x.font = `700 ${f}px Poppins`;
      f--;
    } while (x.measureText(n).width > WW - 32 && f > 12);

    x.fillStyle = s.name.trim() ? "#fff" : "#8fa4e6";
    x.fillText(n, WX + WW / 2, y + h / 2 + 3);
    x.textBaseline = "alphabetic";
  }, [s, ready]);

  const k = () => 1080 / cv.current.getBoundingClientRect().width;
  const inWin = e => {
    const r = cv.current.getBoundingClientRect();
    const q = k();
    const x = (e.clientX - r.left) * q;
    const y = (e.clientY - r.top) * q;
    return x >= WX && x <= WX + WW && y >= WY && y <= WY + WH;
  };

  const handleImageFile = file => {
    if (!file || !file.type.startsWith('image/')) return;
    const i = new Image();
    i.onload = () => up({ img: i, x: 0, y: 0, rot: 0, flip: 1, z: 1, b: 0, c: 0, s: 0 });
    i.src = URL.createObjectURL(file);
    showToast("Photo uploaded successfully! Adjust position as needed.");
  };

  const pick = e => {
    const f = e.target.files[0];
    if (f) handleImageFile(f);
    e.target.value = "";
  };

  const onDragOver = e => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = e => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const down = e => {
    cv.current.setPointerCapture(e.pointerId);
    pts.current.set(e.pointerId, e);
    const d = dr.current;
    d.moved = 0;
    d.last = { x: e.clientX, y: e.clientY };
    if (pts.current.size === 2) {
      const [a, b] = [...pts.current.values()];
      d.pd = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    }
  };

  const move = e => {
    if (!pts.current.has(e.pointerId)) return;
    pts.current.set(e.pointerId, e);
    const c = sr.current, d = dr.current;
    if (!c.img) return;

    if (pts.current.size === 2) {
      const [a, b] = [...pts.current.values()];
      const n = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      up({ z: clamp((c.z * n) / d.pd, 1, 4) });
      d.pd = n;
    } else if (d.last) {
      const q = k();
      up({ x: c.x + (e.clientX - d.last.x) * q, y: c.y + (e.clientY - d.last.y) * q });
      d.moved += Math.abs(e.clientX - d.last.x) + Math.abs(e.clientY - d.last.y);
      d.last = { x: e.clientX, y: e.clientY };
    }
  };

  const end = e => {
    pts.current.delete(e.pointerId);
    if (dr.current.moved < 6 && !sr.current.img && inWin(e)) {
      fi.current.click();
    }
  };

  useEffect(() => {
    const c = cv.current;
    const w = e => {
      if (!sr.current.img || !inWin(e)) return;
      e.preventDefault();
      up({ z: clamp(sr.current.z * (e.deltaY < 0 ? 1.06 : 0.94), 1, 4) });
    };
    c.addEventListener("wheel", w, { passive: false });
    return () => c.removeEventListener("wheel", w);
  }, []);

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const can = ok && s.name.trim() && s.img;

  // Trigger celebration confetti
  const triggerConfetti = () => {
    const colors = ['#ffc828', '#ffa51e', '#ffffff', '#0a34af', '#cd1c1c'];
    for (let i = 0; i < 45; i++) {
      const el = document.createElement('div');
      el.style.position = 'fixed';
      el.style.left = `${Math.random() * 85 + 5}vw`;
      el.style.top = '-20px';
      el.style.width = `${Math.random() * 8 + 6}px`;
      el.style.height = `${Math.random() * 14 + 8}px`;
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = '2px';
      el.style.zIndex = '9999';
      el.style.pointerEvents = 'none';
      el.style.transition = `all ${Math.random() * 2 + 1.5}s cubic-bezier(0.25, 1, 0.5, 1)`;
      document.body.appendChild(el);

      requestAnimationFrame(() => {
        el.style.transform = `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`;
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), 3500);
    }
  };

  const dl = async () => {
    if (!can) return;
    setIsDownloading(true);
    setMsg("Crafting your high-resolution flyer…");

    try {
      const b = await new Promise(r => cv.current.toBlob(r, "image/png"));
      const sanitized = s.name.trim().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "Flyer";
      const fn = `I-Will-Be-Attending-Feast-of-Hymns-2026-${sanitized}.png`;

      const d = window.claude && (await claude.use("downloads"));
      if (d) {
        await d.save({ filename: fn, data: b });
        setMsg("Saved! Share your flyer with friends and family.");
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = fn;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setMsg("Your flyer has downloaded! Share it on WhatsApp and Instagram.");
      }
      triggerConfetti();
      showToast("Flyer downloaded successfully! See you at Feast of Hymns!");
    } catch (e) {
      setMsg(e && e.code === "declined" ? "Download cancelled." : "Press and hold the flyer image to save it.");
    } finally {
      setIsDownloading(false);
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`I will be attending Feast of Hymns 2026 at God's House of Refuge, Uyo on Sunday, 25th Oct 2026! Join me for an evening of prevailing praise. Create your own flyer here: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Link copied to clipboard! Share it with friends.");
  };

  const R = (l, key, min, max, fmt) => (
    <div className="rg">
      <div>
        <span>{l}</span>
        <output>{fmt ? fmt(s[key]) : s[key]}</output>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={key === "z" ? s.z * 100 : s[key]}
        disabled={!s.img}
        onChange={e => up({ [key]: key === "z" ? e.target.value / 100 : +e.target.value })}
      />
    </div>
  );

  return (
    <section id="create" className="sec light">
      <div className="wrap">
        <h2 className="h" data-reveal="up">Create your <em>flyer</em></h2>
        <p className="mut c" data-reveal="up" style={{ '--rd': '.1s' }}>Personalize your attendance flyer in seconds, download high-res, and share your excitement.</p>
        
        <div className="cr">
          <div className="stage" data-reveal="left">
            <div className="stage-header">
              <div className="live-pill"><span className="dot"></span> Live Preview</div>
              <span className="live-dimensions">1080 &times; 1350 High-Res</span>
            </div>
            <div
              className={`frame ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <canvas
                ref={cv}
                width="1080"
                height="1350"
                onPointerDown={down}
                onPointerMove={move}
                onPointerUp={end}
                onPointerCancel={e => pts.current.delete(e.pointerId)}
              />
            </div>
            <p className="hint">
              {s.img ? "Drag photo to reposition · pinch or scroll to zoom" : "Tap the photo box or drop an image to upload"}
            </p>
          </div>

          <div className="panel" data-reveal="right">
            <div className="card">
              <h3><span className="n">1</span>Your Name</h3>
              <input
                className="tx"
                maxLength="30"
                placeholder="Enter your full name (e.g. John Doe)"
                value={s.name}
                onChange={e => up({ name: e.target.value })}
              />
              <div style={{ fontSize: '11px', color: '#8b98c4', marginTop: '6px', textAlign: 'right' }}>
                {s.name.length}/30 characters
              </div>
            </div>

            <div className="card">
              <h3><span className="n">2</span>Your Photo</h3>
              <button className={`btn ${s.img ? 'btn-secondary' : ''}`} onClick={() => fi.current.click()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                {s.img ? "Change photo" : "Choose photo from device"}
              </button>
              {s.img && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>
                  <span>✓ Photo loaded</span>
                  <button
                    style={{ background: 'none', border: 'none', color: '#ffa51e', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}
                    onClick={() => up({ img: null, x: 0, y: 0, rot: 0, flip: 1, z: 1, b: 0, c: 0, s: 0 })}
                  >
                    Remove photo
                  </button>
                </div>
              )}
              <input ref={fi} type="file" accept="image/*" hidden onChange={pick} />
            </div>

            <div className="card">
              <h3><span className="n">3</span>Adjust &amp; Enhance</h3>
              {R("Zoom", "z", 100, 400, v => Math.round(v * 100) + "%")}
              {R("Rotate", "rot", -45, 45, v => Math.round(v) + "°")}
              {R("Brightness", "b", -60, 60)}
              {R("Contrast", "c", -50, 50)}
              {R("Saturation / Colour", "s", -100, 100)}
              
              <div className="tools">
                <button className="btn btn-secondary" disabled={!s.img} onClick={() => up({ rot: ((s.rot - 90 + 540) % 360) - 180 })}>
                  ⟲ -90°
                </button>
                <button className="btn btn-secondary" disabled={!s.img} onClick={() => up({ rot: ((s.rot + 90 + 540) % 360) - 180 })}>
                  ⟳ +90°
                </button>
                <button className="btn btn-secondary" disabled={!s.img} onClick={() => up({ flip: -s.flip })}>
                  ⇋ Flip
                </button>
                <button className="btn btn-secondary" disabled={!s.img} onClick={() => up({ x: 0, y: 0, rot: 0, flip: 1, z: 1, b: 0, c: 0, s: 0 })}>
                  Reset
                </button>
              </div>
            </div>

            <div className="card">
              <h3><span className="n">4</span>Confirm &amp; Download</h3>
              <label className="chk">
                <input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} />
                <span>I confirm that <b>I will be attending</b> Feast of Hymns 2026.</span>
              </label>

              <button className={`cta wide ${can ? 'glowing' : ''}`} disabled={!can || isDownloading} onClick={dl}>
                {isDownloading ? (
                  <>
                    <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                    Generating flyer…
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download my flyer
                  </>
                )}
              </button>

              <div className="msg">
                {msg || (can ? "Ready to download! Click the button above." : "Add your name, photo, and tick the confirmation box.")}
              </div>

              {can && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px' }}>
                  <button className="btn btn-secondary" onClick={shareWhatsApp}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.3-.778.98-.954 1.18-.176.2-.351.226-.653.075-.301-.15-1.272-.469-2.424-1.496-.897-.799-1.503-1.786-1.68-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.634-.929-2.237-.245-.588-.494-.508-.678-.518-.176-.01-.376-.01-.577-.01s-.527.075-.803.376c-.276.3-1.054 1.03-1.054 2.511s1.08 2.912 1.231 3.113c.15.2 2.124 3.243 5.145 4.549.719.311 1.281.497 1.719.636.723.23 1.381.197 1.902.12.58-.086 1.78-.728 2.03-1.431.251-.703.251-1.305.176-1.431-.075-.125-.276-.201-.577-.351z"/></svg>
                    WhatsApp
                  </button>
                  <button className="btn btn-secondary" onClick={copyPageLink}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {toast && <div className="toast"><span>✓</span> {toast}</div>}
    </section>
  );
}

// Footer
function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="foot">
        <img src={A.logo} alt="God's House of Refuge" data-reveal="zoom" />
        <b data-reveal="up" style={{ '--rd': '.1s' }}>GOD'S HOUSE OF REFUGE · HOUSE OF PRAISE</b>
        <span data-reveal="up" style={{ '--rd': '.18s' }}>
          Feast of Hymns 2026 · Theme: Praise That Prevails · Sun. 25th October 2026 · 5:00pm prompt · 8 Ikot Ebido Street, Uyo, Akwa Ibom State
        </span>
        <div className="foot-copyright" data-reveal="up" style={{ '--rd': '.24s' }}>
          &copy; 2026 God's House of Refuge. All rights reserved.
        </div>
      </footer>

      <button
        className={`back-to-top ${showTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Back to top"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
      </button>
    </>
  );
}

// Scroll-triggered reveal animations for every section
function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('revealed'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// App Root
function App() {
  useScrollReveal();
  return (
    <>
      <Nav />
      <Hero />
      <Details />
      <How />
      <Creator />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
