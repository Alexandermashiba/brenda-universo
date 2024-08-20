var poeira = 1500;
var base_poeira = 0.5;
var FL = 500;
var velocidade_poeira = 0.5;
var nitro = 100;
var brilho_poeira = "rgba(173, 216, 230, 1)";

var canvas;
var canvasWidth, canvasHeight;
var context;
var centerX, centerY;
var mouseX, mouseY;
var vrumm = velocidade_poeira;
var velocidade_alvo = velocidade_poeira;
var poeiras = [];

window.addEventListener(
    "load",
    function () {
        canvas = document.getElementById("Brenda");

        var resize = function () {
            canvasWidth = canvas.width = window.innerWidth;
            canvasHeight = canvas.height = window.innerHeight;
            centerX = canvasWidth * 0.5;
            centerY = canvasHeight * 0.5;
            context = canvas.getContext("2d");
            context.fillStyle = "rgb(255, 255, 255)";
        };

        document.addEventListener("resize", resize);
        resize();

        mouseX = centerX;
        mouseY = centerY;

        for (var i = 0, p; i < poeira; i++) {
            poeiras[i] = randomizeParticle(new Particle());
            poeiras[i].z -= 500 * Math.random();
        }

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, false);

        document.addEventListener(
            "mousedown",
            function (e) {
                velocidade_alvo = nitro;
            },
            false
        );

        document.addEventListener(
            "mouseup",
            function (d) {
                velocidade_alvo = velocidade_poeira;
            },
            false
        );

        setInterval(loop, 1000 / 60);
    },
    false
);

function loop() {
    context.save();
    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.restore();

    vrumm += (velocidade_alvo - vrumm) * 0.01;

    var p;
    var cx, cy;
    var rx, ry;
    var f, x, y, r;
    var pf, px, py, pr;
    var a, a1, a2;

    var halfPi = Math.PI * 0.5;
    var atan2 = Math.atan2;
    var cos = Math.cos;
    var sin = Math.sin;

    context.beginPath();
    for (var i = 0; i < poeira; i++) {
        p = poeiras[i];

        p.pastZ = p.z;
        p.z -= vrumm;

        if (p.z <= 0) {
            randomizeParticle(p);
            continue;
        }

        cx = centerX - (mouseX - centerX) * 1.25;
        cy = centerY - (mouseY - centerY) * 1.25;

        rx = p.x - cx;
        ry = p.y - cy;

        f = FL / p.z;
        x = cx + rx * f;
        y = cy + ry * f;
        r = base_poeira * f;

        pf = FL / p.pastZ;
        px = cx + rx * pf;
        py = cy + ry * pf;
        pr = base_poeira * pf;

        a = atan2(py - y, px - x);
        a1 = a + halfPi;
        a2 = a - halfPi;

        var gradient = context.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, brilho_poeira);
        gradient.addColorStop(1, brilho_poeira);
        context.fillStyle = gradient;

        context.moveTo(px + pr * cos(a1), py + pr * sin(a1));
        context.arc(px, py, pr, a1, a2, true);
        context.lineTo(x + r * cos(a2), y + r * sin(a2));
        context.arc(x, y, r, a2, a1, true);
        context.closePath();
    }
    context.fill();
}

function randomizeParticle(p) {
    p.x = Math.random() * canvasWidth;
    p.y = Math.random() * canvasHeight;
    p.z = Math.random() * 1500 + 500;

    return p;
}

function Particle(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.pastZ = 0;
}