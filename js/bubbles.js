(function () {
    'use strict';

    /* ── Bubble definitions ───────────────────────────────── */
    var BUBBLE_DEFS = [
        {
            type: 'profile', count: 3, baseSize: 140,
            html: '<img src="./images/profile.jpg" alt="Ryan McPherson">'
        },
        {
            type: 'name', count: 4, baseSize: 130,
            html: '<span class="b-text">Ryan<br>Andrew<br>McPherson</span>'
        },
        {
            type: 'email', count: 2, baseSize: 125,
            html: '<a href="mailto:ryanmcphersondev@gmail.com" class="bubble-link">' +
                  '<img src="./images/gmail.png" alt="Email">' +
                  '<span class="b-label">ryanmcphersondev<br>@gmail.com</span></a>'
        },
        {
            type: 'phone', count: 2, baseSize: 120,
            html: '<a href="tel:+16149813265" class="bubble-link">' +
                  '<img src="./images/iphone.png" alt="Phone">' +
                  '<span class="b-label">614-981-3265</span></a>'
        },
        {
            type: 'github', count: 3, baseSize: 120,
            html: '<a href="http://www.github.com/ryanandrewmcpherson" target="_blank" rel="noopener" class="bubble-link">' +
                  '<img src="./images/github.png" alt="GitHub">' +
                  '<span class="b-label">GitHub</span></a>'
        },
        {
            type: 'linkedin', count: 3, baseSize: 120,
            html: '<a href="http://linkedin.com/in/ryanandrewmcpherson" target="_blank" rel="noopener" class="bubble-link">' +
                  '<img src="./images/linkedin.png" alt="LinkedIn">' +
                  '<span class="b-label">LinkedIn</span></a>'
        },
        {
            type: 'ohio', count: 4, baseSize: 100,
            html: '<img src="./images/ohio.png" alt="Ohio">'
        }
    ];

    /* Site colour palette (mirrors root.css) */
    var PALETTE = [
        { r: 47,  g: 37,  b: 4   },
        { r: 75,  g: 92,  b: 96  },
        { r: 165, g: 174, b: 158 }
    ];

    /* ── DOM references ───────────────────────────────────── */
    var stage      = document.getElementById('bubble-stage');
    var backdrop   = document.getElementById('backdrop');
    var congrats   = document.getElementById('congrats');
    var replayBtn  = document.getElementById('replay-btn');

    /* ── State ────────────────────────────────────────────── */
    var bubbles = [];
    var focused = null;  /* currently expanded bubble data object */
    var lastTs  = 0;

    /* ── Helpers ──────────────────────────────────────────── */
    function randVel(range, min) {
        var v;
        do { v = (Math.random() * 2 - 1) * range; } while (Math.abs(v) < min);
        return v;
    }

    function sphereGradient(c) {
        var r = c.r, g = c.g, b = c.b;
        return 'radial-gradient(circle at 35% 30%,' +
               'rgba(255,255,255,0.92) 0%,' +
               'rgba(' + r + ',' + g + ',' + b + ',0.70) 22%,' +
               'rgba(' + Math.round(r * 0.70) + ',' + Math.round(g * 0.70) + ',' + Math.round(b * 0.70) + ',0.82) 65%,' +
               'rgba(' + Math.round(r * 0.30) + ',' + Math.round(g * 0.30) + ',' + Math.round(b * 0.30) + ',0.55) 100%)';
    }

    /* ── Build one bubble element ─────────────────────────── */
    function makeBubble(def, colorIdx) {
        var W    = window.innerWidth;
        var H    = window.innerHeight;
        var size = def.baseSize + Math.floor(Math.random() * 30) - 15;
        var color = PALETTE[colorIdx % PALETTE.length];

        /* Outer wrapper – overflow:visible so × can sit above the circle */
        var el = document.createElement('div');
        el.className = 'bubble bubble-' + def.type;
        el.style.width  = size + 'px';
        el.style.height = size + 'px';

        /* Circular face (clips & carries the sphere gradient) */
        var face = document.createElement('div');
        face.className = 'bubble-face';
        face.style.background = sphereGradient(color);

        /* Content */
        var inner = document.createElement('div');
        inner.className = 'bubble-inner';
        inner.innerHTML = def.html;
        face.appendChild(inner);

        /* Specular sheen overlay */
        var sheen = document.createElement('div');
        sheen.className = 'bubble-sheen';
        face.appendChild(sheen);

        el.appendChild(face);

        /* × close button – hidden until expanded */
        var closeBtn = document.createElement('button');
        closeBtn.className = 'bubble-close';
        closeBtn.setAttribute('aria-label', 'Pop bubble');
        closeBtn.textContent = '\u00D7';   /* × */
        el.appendChild(closeBtn);

        /* Random starting position (fully on-screen) */
        var x = Math.random() * Math.max(1, W - size);
        var y = Math.random() * Math.max(1, H - size);
        el.style.left = x + 'px';
        el.style.top  = y + 'px';

        var data = {
            el:       el,
            x:        x,
            y:        y,
            size:     size,
            vx:       randVel(80, 20),
            vy:       randVel(80, 20),
            type:     def.type,
            expanded: false
        };

        /* Click on bubble → centre it */
        el.addEventListener('click', function (e) {
            if (data.expanded || focused) return;
            e.stopPropagation();
            e.preventDefault();   /* prevent any link navigation while floating */
            expand(data);
        });

        /* Click on × → pop */
        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            pop(data);
        });

        bubbles.push(data);
        stage.appendChild(el);
        return data;
    }

    /* ── Initialise all bubbles ───────────────────────────── */
    function init() {
        bubbles.forEach(function (d) {
            if (d.el.parentNode) { d.el.parentNode.removeChild(d.el); }
        });
        bubbles  = [];
        focused  = null;
        backdrop.classList.remove('visible');
        congrats.classList.add('hidden');

        var ci = 0;
        BUBBLE_DEFS.forEach(function (def) {
            for (var i = 0; i < def.count; i++) { makeBubble(def, ci++); }
        });
    }

    /* ── Expand bubble to screen centre ──────────────────── */
    function expand(data) {
        focused       = data;
        data.expanded = true;

        var el   = data.el;
        var rect = el.getBoundingClientRect();

        backdrop.classList.add('visible');

        var expandSize = Math.max(240, Math.round(data.size * 1.8));
        var tx = Math.round(window.innerWidth  / 2 - expandSize / 2);
        var ty = Math.round(window.innerHeight / 2 - expandSize / 2);

        /*
         * Move el to <body> so its z-index is in the root stacking context,
         * above #backdrop (z-index 50).  #bubble-stage (position:fixed) forms
         * its own stacking context, making in-stage z-indexes incomparable with
         * #backdrop's z-index.
         */
        stage.removeChild(el);
        document.body.appendChild(el);

        /* Place at current visual position before animating */
        el.style.transition = 'none';
        el.style.position   = 'fixed';
        el.style.left       = rect.left + 'px';
        el.style.top        = rect.top  + 'px';
        el.style.zIndex     = '100';

        void el.offsetWidth;   /* flush reflow */

        el.style.transition = [
            'left   0.45s cubic-bezier(0.34,1.40,0.64,1)',
            'top    0.45s cubic-bezier(0.34,1.40,0.64,1)',
            'width  0.40s ease',
            'height 0.40s ease'
        ].join(',');

        el.style.left   = tx + 'px';
        el.style.top    = ty + 'px';
        el.style.width  = expandSize + 'px';
        el.style.height = expandSize + 'px';

        el.classList.add('expanded');
    }

    /* ── Collapse back to floating (backdrop click) ───────── */
    function collapse(data) {
        if (!data || !data.expanded) { return; }
        focused       = null;
        data.expanded = false;

        var el = data.el;
        el.classList.remove('expanded');

        /* Move el back into the stage and restore absolute positioning */
        if (el.parentNode === document.body) {
            document.body.removeChild(el);
            stage.appendChild(el);
        }

        el.style.transition = 'none';
        el.style.position   = 'absolute';
        el.style.left       = data.x + 'px';
        el.style.top        = data.y + 'px';
        el.style.width      = data.size + 'px';
        el.style.height     = data.size + 'px';
        el.style.zIndex     = '';

        backdrop.classList.remove('visible');
    }

    /* ── Pop animation + removal ─────────────────────────── */
    function pop(data) {
        if (data.expanded) {
            focused       = null;
            data.expanded = false;
            backdrop.classList.remove('visible');
        }

        var el = data.el;
        el.classList.remove('expanded');
        el.classList.add('popping');

        setTimeout(function () {
            if (el.parentNode) { el.parentNode.removeChild(el); }

            var idx = bubbles.indexOf(data);
            if (idx !== -1) { bubbles.splice(idx, 1); }

            if (bubbles.length === 0) {
                setTimeout(function () {
                    congrats.classList.remove('hidden');
                }, 300);
            }
        }, 350);
    }

    /* Backdrop click → collapse the centred bubble */
    backdrop.addEventListener('click', function () {
        if (focused) { collapse(focused); }
    });

    /* Play Again button */
    replayBtn.addEventListener('click', function () {
        init();
    });

    /* ── Animation loop ──────────────────────────────────── */
    function tick(ts) {
        var dt = Math.min((ts - lastTs) / 1000, 0.033);
        lastTs = ts;

        var W = window.innerWidth;
        var H = window.innerHeight;

        for (var i = 0; i < bubbles.length; i++) {
            var d = bubbles[i];
            if (d.expanded) { continue; }

            d.x += d.vx * dt;
            d.y += d.vy * dt;

            if (d.x < 0)           { d.x = 0;           d.vx =  Math.abs(d.vx); }
            if (d.x + d.size > W)  { d.x = W - d.size;  d.vx = -Math.abs(d.vx); }
            if (d.y < 0)           { d.y = 0;            d.vy =  Math.abs(d.vy); }
            if (d.y + d.size > H)  { d.y = H - d.size;  d.vy = -Math.abs(d.vy); }

            d.el.style.left = d.x + 'px';
            d.el.style.top  = d.y + 'px';
        }

        requestAnimationFrame(tick);
    }

    /* ── Resize: nudge bubbles back on-screen ────────────── */
    window.addEventListener('resize', function () {
        var W = window.innerWidth;
        var H = window.innerHeight;
        bubbles.forEach(function (d) {
            if (d.expanded) { return; }
            if (d.x + d.size > W) { d.x = Math.max(0, W - d.size); }
            if (d.y + d.size > H) { d.y = Math.max(0, H - d.size); }
        });
    });

    /* ── Go ───────────────────────────────────────────────── */
    init();
    requestAnimationFrame(function (ts) { lastTs = ts; requestAnimationFrame(tick); });
}());
