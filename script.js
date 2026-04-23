const canvas = document.getElementById('spiderCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let spiders = [];
let spiderBots = [];
let webs = [];
let webStrands = [];
let buildings = [];
let pulses = [];
let glitchTimer = 0;

const SPIDEY_VARIANTS = [
    { name: 'Peter', body: '#ff0000', detail: '#0000ff', eye: '#ffffff', leg: '#ff0000' },
    { name: 'Miles', body: '#050505', detail: '#ff0000', eye: '#ffffff', leg: '#050505' },
    { name: 'Gwen', body: '#ffffff', detail: '#ff4081', eye: '#00bcd4', leg: '#ffffff' },
    { name: '2099', body: '#001a3d', detail: '#ff0000', eye: '#ff0000', leg: '#001a3d' },
    { name: 'Noir', body: '#000000', detail: '#222222', eye: '#ffffff', leg: '#000000' },
    { name: 'Ham', body: '#ff80ab', detail: '#ff0000', eye: '#ffffff', leg: '#ff80ab' },
    { name: 'Symbiote', body: '#000000', detail: '#ffffff', eye: '#ffffff', leg: '#000000' },
    { name: 'Superior', body: '#ff0000', detail: '#000000', eye: '#ffffff', leg: '#000000' },
    { name: 'IronSpider', body: '#d4af37', detail: '#ff0000', eye: '#ffffff', leg: '#d4af37' },
    { name: 'Scarlet', body: '#ff0000', detail: '#0066ff', eye: '#ffffff', leg: '#ff0000' },
    { name: 'Punk', body: '#ff0000', detail: '#333333', eye: '#ffffff', leg: '#ff0000' }
];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    generateWebs();
    generateWebStrands();
    generateCity();
}

function generateWebs() {
    webs = [];
    for (let i = 0; i < 10; i++) {
        webs.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 250 + 150,
            opacity: Math.random() * 0.12 + 0.05
        });
    }
}

function generateWebStrands() {
    webStrands = [];
    const count = Math.floor(width / 15);
    for (let i = 0; i < count; i++) {
        webStrands.push(new WebStrand());
    }
}

function generateCity() {
    buildings = [];
    const count = Math.ceil(width / 45) + 2;
    for (let i = 0; i < count; i++) {
        const bWidth = Math.random() * 90 + 50;
        const bHeight = Math.random() * height * 0.6 + 100;
        buildings.push({
            x: i * 55 - 40,
            width: bWidth,
            height: bHeight,
            color: '#010204',
            windows: generateWindows(bWidth, bHeight)
        });
    }
}

function generateWindows(w, h) {
    const windows = [];
    const rows = Math.floor(h / 20);
    const cols = Math.floor(w / 12);
    for (let r = 1; r < rows - 1; r++) {
        for (let c = 1; c < cols - 1; c++) {
            if (Math.random() > 0.65) {
                windows.push({
                    x: c * 12,
                    y: r * 20,
                    on: Math.random() > 0.4
                });
            }
        }
    }
    return windows;
}

window.addEventListener('resize', resize);

class WebStrand {
    constructor() {
        this.reset();
        this.y = Math.random() * height;
    }

    reset() {
        this.x = Math.random() * width;
        this.y = -Math.random() * 1000;
        this.length = Math.random() * 400 + 200;
        this.speed = Math.random() * 8 + 5;
        this.opacity = Math.random() * 0.2 + 0.05;
    }

    update() {
        this.y += this.speed;
        if (this.y > height) {
            this.reset();
        }
    }

    draw() {
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
    }
}

class Spider {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 8 + 6;
        this.variant = SPIDEY_VARIANTS[Math.floor(Math.random() * SPIDEY_VARIANTS.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 2.5 + 1.5;
        this.turnSpeed = (Math.random() - 0.5) * 0.06;
        this.legPhase = 0;
        this.isSwinging = Math.random() > 0.75;
        this.swingAnchor = { x: this.x + (Math.random() - 0.5) * 600, y: -200 };
        this.swingPhase = Math.random() * Math.PI * 2;
    }

    update() {
        if (this.isSwinging) {
            this.swingPhase += 0.03;
            this.x = this.swingAnchor.x + Math.sin(this.swingPhase) * 400;
            this.y = this.swingAnchor.y + Math.cos(this.swingPhase) * 100 + 500;
            this.angle = Math.atan2(Math.cos(this.swingPhase) * 100, Math.cos(this.swingPhase) * 400) + Math.PI / 2;
        } else {
            this.angle += this.turnSpeed;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
        }

        if (this.x < -300 || this.x > width + 300 || this.y < -300 || this.y > height + 300) {
            this.reset();
        }

        this.legPhase += 0.35;
    }

    draw() {
        if (this.isSwinging) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(this.swingAnchor.x, this.swingAnchor.y);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Chromatic aberration glitch effect
        if (glitchTimer > 0 && Math.random() > 0.8) {
            ctx.translate((Math.random()-0.5)*10, (Math.random()-0.5)*10);
        }

        // Legs
        ctx.strokeStyle = this.variant.leg;
        ctx.lineWidth = 3.5;
        for (let i = 0; i < 4; i++) {
            const sideAngle = (i - 1.5) * 0.65;
            this.drawLeg(1, sideAngle, i);
            this.drawLeg(-1, sideAngle, i);
        }

        // Body
        ctx.fillStyle = this.variant.body;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 1.6, this.size, 0, 0, Math.PI * 2);
        ctx.fill();

        // Icon/Detail
        ctx.fillStyle = this.variant.detail;
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.6, -this.size * 0.6);
        ctx.lineTo(this.size * 0.6, this.size * 0.6);
        ctx.lineTo(-this.size * 0.6, this.size * 0.6);
        ctx.lineTo(this.size * 0.6, -this.size * 0.6);
        ctx.fill();

        // Head
        ctx.fillStyle = this.variant.body;
        ctx.beginPath();
        ctx.arc(this.size * 1.6, 0, this.size * 1.0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = this.variant.eye;
        ctx.beginPath();
        ctx.ellipse(this.size * 2.0, this.size * 0.4, this.size * 0.6, this.size * 0.3, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.size * 2.0, -this.size * 0.4, this.size * 0.6, this.size * 0.3, -0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawLeg(side, sideAngle, index) {
        const movement = Math.sin(this.legPhase + index) * 0.6;
        const baseAngle = (side > 0 ? -Math.PI / 2 : Math.PI / 2) + sideAngle + movement;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const s1Len = this.size * 4.5;
        const x1 = Math.cos(baseAngle) * s1Len;
        const y1 = Math.sin(baseAngle) * s1Len;
        const s2Len = this.size * 4;
        const x2 = x1 + Math.cos(baseAngle + (side > 0 ? -1.4 : 1.4)) * s2Len;
        const y2 = y1 + Math.sin(baseAngle + (side > 0 ? -1.4 : 1.4)) * s2Len;
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

class SpiderBot {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 8 + 12;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 1.8 + 1.2;
        this.turnSpeed = (Math.random() - 0.5) * 0.12;
        this.legPhase = 0;
    }

    update() {
        this.angle += this.turnSpeed;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < -150 || this.x > width + 150 || this.y < -150 || this.y > height + 150) {
            this.reset();
        }

        this.legPhase += 0.4;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Legs
        ctx.strokeStyle = '#005BEA';
        ctx.lineWidth = 4;
        for (let i = 0; i < 3; i++) {
            const sideAngle = (i - 1) * 1.0;
            this.drawLeg(1, sideAngle, i);
            this.drawLeg(-1, sideAngle, i);
        }

        // Mechanical body
        ctx.fillStyle = '#005BEA';
        ctx.fillRect(-this.size, -this.size * 0.9, this.size * 2, this.size * 1.8);

        ctx.fillStyle = '#E23636';
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.6, -this.size * 0.6);
        ctx.lineTo(this.size * 0.6, 0);
        ctx.lineTo(-this.size * 0.6, this.size * 0.6);
        ctx.fill();

        // Glowing eyes
        ctx.fillStyle = '#ff0000';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0000';
        ctx.beginPath();
        ctx.arc(this.size * 0.9, -this.size * 0.5, 4, 0, Math.PI * 2);
        ctx.arc(this.size * 0.9, this.size * 0.5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
    }

    drawLeg(side, sideAngle, index) {
        const movement = Math.sin(this.legPhase + index) * 0.5;
        const baseAngle = (side > 0 ? -Math.PI / 2 : Math.PI / 2) + sideAngle + movement;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const len = this.size * 3.2;
        const x = Math.cos(baseAngle) * len;
        const y = Math.sin(baseAngle) * len;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

class Pulse {
    constructor(x, y) {
        this.x = x || Math.random() * width;
        this.y = y || Math.random() * height;
        this.radius = 0;
        this.maxRadius = Math.random() * 150 + 100;
        this.opacity = 0.6;
        this.color = Math.random() > 0.5 ? '#E23636' : '#005BEA';
    }

    update() {
        this.radius += 3;
        this.opacity -= 0.015;
        return this.opacity > 0;
    }

    draw() {
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
}

for (let i = 0; i < 25; i++) spiders.push(new Spider());
for (let i = 0; i < 15; i++) spiderBots.push(new SpiderBot());

resize();

function drawWeb(web) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${web.opacity})`;
    ctx.lineWidth = 1.5;

    for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(web.x, web.y);
        ctx.lineTo(web.x + Math.cos(angle) * web.radius, web.y + Math.sin(angle) * web.radius);
        ctx.stroke();
    }

    for (let j = 1; j <= 10; j++) {
        const r = (j / 10) * web.radius;
        ctx.beginPath();
        for (let i = 0; i <= 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const x = web.x + Math.cos(angle) * r;
            const y = web.y + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

function drawCity() {
    buildings.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, height - b.height, b.width, b.height);

        b.windows.forEach(w => {
            if (w.on && Math.random() > 0.02) {
                ctx.fillStyle = 'rgba(255, 255, 200, 0.5)';
                ctx.fillRect(b.x + w.x, height - b.height + w.y, 7, 12);
            }
        });
    });
}

function drawLogo() {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.globalAlpha = 0.05;

    // Comic-style offset for logo
    if (glitchTimer > 0) {
        ctx.fillStyle = '#ff0000';
        ctx.translate(5, 0);
        renderSpiderPath(150, 100);
        ctx.fillStyle = '#00ffff';
        ctx.translate(-10, 0);
        renderSpiderPath(150, 100);
        ctx.translate(5, 0);
    }

    ctx.fillStyle = '#ffffff';
    renderSpiderPath(150, 100);
    ctx.restore();
}

function renderSpiderPath(rw, rh) {
    ctx.beginPath();
    ctx.ellipse(0, 0, rw, rh, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 25;
    for (let i = 0; i < 4; i++) {
        const a = (i - 1.5) * 0.85;
        // Top legs
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 50, Math.sin(a) * 50);
        ctx.quadraticCurveTo(Math.cos(a) * 350, Math.sin(a) * 350, Math.cos(a) * 450, Math.sin(a) * 150);
        ctx.stroke();
        // Bottom legs
        const a2 = Math.PI + (i - 1.5) * 0.85;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a2) * 50, Math.sin(a2) * 50);
        ctx.quadraticCurveTo(Math.cos(a2) * 350, Math.sin(a2) * 350, Math.cos(a2) * 450, Math.sin(a2) * 150);
        ctx.stroke();
    }
}

function animate() {
    // Cinematic fade
    ctx.fillStyle = 'rgba(2, 4, 8, 0.25)';
    ctx.fillRect(0, 0, width, height);

    if (glitchTimer > 0) {
        glitchTimer--;
    } else if (Math.random() > 0.997) {
        glitchTimer = Math.floor(Math.random() * 15 + 5);
    }

    drawLogo();
    drawCity();
    webs.forEach(drawWeb);

    if (Math.random() > 0.97) pulses.push(new Pulse());
    pulses = pulses.filter(p => {
        const active = p.update();
        if (active) p.draw();
        return active;
    });

    webStrands.forEach(strand => {
        strand.update();
        strand.draw();
    });

    spiders.forEach(spider => {
        spider.update();
        spider.draw();
    });

    spiderBots.forEach(bot => {
        bot.update();
        bot.draw();
    });

    requestAnimationFrame(animate);
}

animate();
