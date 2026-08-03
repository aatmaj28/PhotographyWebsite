/* ============================================================
   Cinematic Darkroom — gallery engine
   ============================================================ */

(() => {
    'use strict';

    const state = {
        photos: [],
        lightboxIndex: -1,
        heroIndex: 0,
        heroTimer: null,
    };

    const $ = (sel, root = document) => root.querySelector(sel);
    const pad = (n) => String(n).padStart(2, '0');

    const fullSrc = (p) => `images/full/${p.id}.jpg`;
    const thumbSrc = (p) => `images/thumbs/${p.id}.jpg`;

    /* ---------- Header ---------- */

    const header = $('#site-header');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile menu ---------- */

    const navToggle = $('.nav-toggle');
    const mobileMenu = $('#mobile-menu');

    const setMenu = (open) => {
        navToggle.classList.toggle('open', open);
        mobileMenu.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    };

    navToggle.addEventListener('click', () =>
        setMenu(!mobileMenu.classList.contains('open')));

    mobileMenu.querySelectorAll('a').forEach((a) =>
        a.addEventListener('click', () => setMenu(false)));

    /* ---------- Reveal on scroll ---------- */

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    /* ---------- Gallery ---------- */

    const grid = $('#gallery-grid');

    function layoutItem(item) {
        // True masonry: translate the photo's aspect ratio into a grid row span
        const styles = getComputedStyle(grid);
        const rowH = parseFloat(styles.gridAutoRows);
        const gap = parseFloat(styles.rowGap);
        const width = item.getBoundingClientRect().width;
        const ratio = parseFloat(item.dataset.ratio); // height / width
        const span = Math.max(8, Math.round((width * ratio + gap) / (rowH + gap)));
        item.style.gridRowEnd = `span ${span}`;
    }

    function layoutAll() {
        grid.querySelectorAll('.g-item').forEach(layoutItem);
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(layoutAll, 120);
    });

    function renderGallery() {
        grid.innerHTML = '';
        const count = $('#gallery-count');
        count.textContent = `${state.photos.length} photographs`;

        state.photos.forEach((photo, i) => {
            const item = document.createElement('figure');
            item.className = 'g-item';
            item.tabIndex = 0;
            item.dataset.ratio = (photo.height / photo.width).toFixed(4);
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', photo.title || `Photograph ${i + 1}`);

            const img = document.createElement('img');
            img.src = thumbSrc(photo);
            img.alt = photo.title || `Photograph ${i + 1}`;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.width = photo.width;
            img.height = photo.height;

            const overlay = document.createElement('div');
            overlay.className = 'g-overlay';

            const num = document.createElement('span');
            num.className = 'g-num';
            num.textContent = `№ ${pad(i + 1)}`;
            overlay.appendChild(num);

            if (photo.title) {
                const title = document.createElement('span');
                title.className = 'g-title';
                title.textContent = photo.title;
                overlay.appendChild(title);
            }

            item.appendChild(img);
            item.appendChild(overlay);

            const open = () => openLightbox(i);
            item.addEventListener('click', open);
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
            });

            grid.appendChild(item);
            layoutItem(item);

            // Staggered fade-in as items scroll into view
            item.style.transitionDelay = `${(i % 6) * 70}ms`;
            revealItemObserver.observe(item);
        });
    }

    const revealItemObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealItemObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.06, rootMargin: '60px 0px' });

    function showGalleryStatus(msg) {
        grid.innerHTML = `<p class="gallery-status">${msg}</p>`;
    }

    /* ---------- Hero slideshow ---------- */

    const slidesWrap = $('#hero-slides');
    const HERO_INTERVAL = 6500;

    function startHero() {
        let featured = state.photos.filter((p) => p.featured);
        if (!featured.length) featured = state.photos.slice(0, 5);
        if (!featured.length) return;

        const slides = featured.map((p) => {
            const slide = document.createElement('div');
            slide.className = 'hero-slide';
            slide.style.backgroundImage = `url("${fullSrc(p)}")`;
            slidesWrap.appendChild(slide);
            return slide;
        });

        // Show the first slide as soon as its image has decoded
        const first = new Image();
        first.src = fullSrc(featured[0]);
        const activateFirst = () => slides[0].classList.add('active');
        first.decode ? first.decode().then(activateFirst).catch(activateFirst)
                     : (first.onload = activateFirst);

        if (slides.length < 2) return;

        state.heroTimer = setInterval(() => {
            const prev = state.heroIndex;
            state.heroIndex = (state.heroIndex + 1) % slides.length;
            // Preload the upcoming slide, then crossfade
            const upcoming = new Image();
            upcoming.src = fullSrc(featured[state.heroIndex]);
            slides[prev].classList.remove('active');
            slides[state.heroIndex].classList.add('active');
        }, HERO_INTERVAL);
    }

    /* ---------- Lightbox ---------- */

    const lightbox = $('#lightbox');
    const lbImg = $('.lightbox-stage img');
    const lbTitle = $('.lb-title');
    const lbCaption = $('.lb-caption');
    const lbCounter = $('.lb-counter');

    function renderLightbox() {
        const photo = state.photos[state.lightboxIndex];
        lbImg.src = fullSrc(photo);
        lbImg.alt = photo.title || `Photograph ${state.lightboxIndex + 1}`;
        lbTitle.textContent = photo.title || '';
        lbCaption.textContent = photo.caption || '';
        lbCounter.textContent = `${pad(state.lightboxIndex + 1)} / ${pad(state.photos.length)}`;

        // Preload neighbours for instant paging
        [-1, 1].forEach((d) => {
            const n = state.lightboxIndex + d;
            if (n >= 0 && n < state.photos.length) {
                new Image().src = fullSrc(state.photos[n]);
            }
        });
    }

    function openLightbox(index) {
        state.lightboxIndex = index;
        renderLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        state.lightboxIndex = -1;
    }

    function step(delta) {
        const n = state.photos.length;
        state.lightboxIndex = (state.lightboxIndex + delta + n) % n;
        renderLightbox();
    }

    $('.lightbox-close').addEventListener('click', closeLightbox);
    $('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
    $('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); step(1); });

    lightbox.addEventListener('click', (e) => {
        // Close when clicking the dark backdrop (not the image/caption/buttons)
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') step(-1);
        else if (e.key === 'ArrowRight') step(1);
    });

    // Touch swipe
    let touchX = null;
    lightbox.addEventListener('touchstart', (e) => {
        touchX = e.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 48) step(dx > 0 ? -1 : 1);
        touchX = null;
    }, { passive: true });

    /* ---------- Boot ---------- */

    async function boot() {
        showGalleryStatus('Loading…');
        try {
            const res = await fetch(`gallery.json?v=${Date.now()}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const manifest = await res.json();
            state.photos = manifest.photos || [];
        } catch (err) {
            console.error('Failed to load gallery.json', err);
            showGalleryStatus('The gallery could not be loaded.');
            return;
        }

        if (!state.photos.length) {
            showGalleryStatus('No photographs yet — check back soon.');
            return;
        }

        renderGallery();
        startHero();
    }

    boot();
})();
