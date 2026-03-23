var background = document.createElement("canvas");
var ctx = background.getContext("2d");
background.id = "background";
background.height = parseInt(window.getComputedStyle(document.querySelector("body")).height);
background.width = parseInt(window.getComputedStyle(document.querySelector("body")).width);
document.querySelector("body").appendChild(background);

var numBubbles = 60;
var FPS = 60;
var interval = 1000 / FPS;

// 3D perspective settings
var FOCAL = 500;   // focal length (distance from camera to projection plane)
var Z_NEAR = 150;  // closest z-depth (bubbles appear largest here)
var Z_FAR = 1200;  // farthest z-depth (bubbles appear smallest here)

var bubbles = [];

var COLORS = [
    { r: 47,  g: 37,  b: 4   },
    { r: 75,  g: 92,  b: 96  },
    { r: 165, g: 174, b: 158 }
];

// Return a random velocity with minimum absolute speed enforced
function randomVelocity(range, minSpeed) {
    var v = Math.floor(Math.random() * (range * 2 + 1)) - range;
    while (Math.abs(v) < minSpeed) {
        v = Math.floor(Math.random() * (range * 2 + 1)) - range;
    }
    return v;
}

function defineBubbles() {
    bubbles = [];
    var W = background.width;
    var H = background.height;

    for (var i = 0; i < numBubbles; i++) {
        // Base radius in world space; perspective will scale it on screen
        var baseRadius = Math.floor(Math.random() * 50) + 20;
        var z = Math.random() * (Z_FAR - Z_NEAR) + Z_NEAR;

        // Maximum world-space x/y so the projected bubble starts fully on screen.
        // Derivation: sx + sr = W/2 + (x + r)*FOCAL/z <= W  =>  x <= W/2*z/FOCAL - r
        var maxX = Math.max(0, W / 2 * z / FOCAL - baseRadius);
        var maxY = Math.max(0, H / 2 * z / FOCAL - baseRadius);

        var x = (Math.random() * 2 - 1) * maxX;
        var y = (Math.random() * 2 - 1) * maxY;

        var color = COLORS[Math.floor(Math.random() * COLORS.length)];

        bubbles.push({
            x: x, y: y, z: z,
            vX: randomVelocity(40, 5),
            vY: randomVelocity(40, 5),
            vZ: randomVelocity(30, 5),
            baseRadius: baseRadius,
            color: color
        });
    }
}

// Project a 3D bubble onto the 2D canvas using perspective division
function projectBubble(bubble) {
    var W = background.width;
    var H = background.height;
    var scale = FOCAL / bubble.z;
    return {
        sx: W / 2 + bubble.x * scale,
        sy: H / 2 + bubble.y * scale,
        sr: bubble.baseRadius * scale
    };
}

// Draw a 3D-shaded sphere using a radial gradient with a specular highlight
function drawBubble(bubble) {
    var proj = projectBubble(bubble);
    var sx = proj.sx, sy = proj.sy, sr = proj.sr;
    var r = bubble.color.r, g = bubble.color.g, b = bubble.color.b;

    if (sr < 1) { return; }

    // Radial gradient: offset highlight simulates a light source from the top-left.
    // Inner circle offset (0.3 x, 0.38 y) places the specular highlight near the top-left
    // of the sphere; inner radius (0.05) keeps the bright spot small and sharp.
    var gradient = ctx.createRadialGradient(
        sx - sr * 0.3, sy - sr * 0.38, sr * 0.05,  // specular highlight (inner circle)
        sx,            sy,             sr             // full sphere silhouette (outer circle)
    );
    gradient.addColorStop(0,    'rgba(255,255,255,0.92)');        // bright specular spot
    gradient.addColorStop(0.2,  'rgba(' + r + ',' + g + ',' + b + ',0.70)');  // base colour
    gradient.addColorStop(0.65, 'rgba(' + Math.floor(r * 0.7) + ',' + Math.floor(g * 0.7) + ',' + Math.floor(b * 0.7) + ',0.82)');  // shadow side
    gradient.addColorStop(1,    'rgba(' + Math.floor(r * 0.3) + ',' + Math.floor(g * 0.3) + ',' + Math.floor(b * 0.3) + ',0.55)');  // dark rim

    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Thin rim highlight to reinforce the spherical silhouette
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = Math.max(1, sr * 0.04);
    ctx.stroke();
}

defineBubbles();

window.setInterval(function() {
    background.height = parseInt(window.getComputedStyle(document.querySelector("body")).height);
    background.width  = parseInt(window.getComputedStyle(document.querySelector("body")).width);

    var W  = background.width;
    var H  = background.height;
    var dt = interval / 1000;

    ctx.clearRect(0, 0, W, H);

    // Update each bubble's 3D position and bounce off boundaries
    for (var i = 0; i < bubbles.length; i++) {
        var b = bubbles[i];

        b.x += b.vX * dt;
        b.y += b.vY * dt;
        b.z += b.vZ * dt;

        // Z-axis boundary: bounce between NEAR and FAR planes
        if (b.z <= Z_NEAR) { b.z = Z_NEAR; b.vZ =  Math.abs(b.vZ); }
        if (b.z >= Z_FAR)  { b.z = Z_FAR;  b.vZ = -Math.abs(b.vZ); }

        // Screen-edge boundary: use projected position and push bubble back
        // inside the valid world-space range to prevent repeated boundary triggers.
        // World-space limit: x_max = W/2 * z/FOCAL - baseRadius (derived from projection)
        var xLimit = W / 2 * b.z / FOCAL - b.baseRadius;
        var yLimit = H / 2 * b.z / FOCAL - b.baseRadius;
        if (b.x > xLimit)  { b.x =  xLimit; b.vX = -Math.abs(b.vX); }
        if (b.x < -xLimit) { b.x = -xLimit; b.vX =  Math.abs(b.vX); }
        if (b.y > yLimit)  { b.y =  yLimit; b.vY = -Math.abs(b.vY); }
        if (b.y < -yLimit) { b.y = -yLimit; b.vY =  Math.abs(b.vY); }
    }

    // Painter's algorithm: draw farthest (largest z) bubbles first
    bubbles.sort(function(a, b) { return b.z - a.z; });
    for (var i = 0; i < bubbles.length; i++) {
        drawBubble(bubbles[i]);
    }

    // Pop: check front-to-back (smallest z = closest = on top) for the click
    if (mouseclickX !== null) {
        for (var i = bubbles.length - 1; i >= 0; i--) {
            var proj = projectBubble(bubbles[i]);
            var dx = mouseclickX - proj.sx;
            var dy = mouseclickY - proj.sy;
            if (Math.sqrt(dx * dx + dy * dy) <= proj.sr) {
                bubbles.splice(i, 1);
                break;
            }
        }
        mouseclickX = null;
        mouseclickY = null;
    }

    if (bubbles.length === 0) {
        mouseclickX = null;
        mouseclickY = null;
        window.alert("Congratulations! You Popped All The Bubbles!");
        defineBubbles();
    }
}, interval);


window.addEventListener("resize", function() {
    document.querySelector("body").removeChild(background);
    background.height = parseInt(window.getComputedStyle(document.querySelector("body")).height);
    background.width  = parseInt(window.getComputedStyle(document.querySelector("body")).width);
    document.querySelector("body").appendChild(background);
});


var mouseclickX = null;
var mouseclickY = null;

document.addEventListener("touchstart", function(event) {
    mouseclickX = event.touches[0].pageX;
    mouseclickY = event.touches[0].pageY;
    event.preventDefault();
});

document.addEventListener("click", function(event) {
    mouseclickX = event.pageX;
    mouseclickY = event.pageY;
});

document.addEventListener("mousedown", function(event) {
    event.preventDefault();
});

document.addEventListener("mousemove", function(event) {
    event.preventDefault();
});

