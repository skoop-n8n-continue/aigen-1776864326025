const canvas = document.getElementById('spiderCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let spiders = [];
let webs = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    generateWebs();
}

function generateWebs() {
    webs = [];
    for (let i = 0; i < 5; i++) {
        webs.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 100 + 100,
            opacity: Math.random() * 0.1 + 0.05
        });
    }
}

window.addEventListener('resize', resize);
resize();

class Spider {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 5 + 3;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.5 + 0.2;
        this.turnSpeed = (Math.random() - 0.5) * 0.02;
        this.legPhase = 0;
        this.color = '#00b7af';
    }

    update() {
        this.angle += this.turnSpeed;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
            this.reset();
        }

        this.legPhase += 0.1;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 1.2, this.size, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(this.size * 1, 0, this.size * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) {
            const sideAngle = (i - 1.5) * 0.5;
            this.drawLeg(1, sideAngle, i);
            this.drawLeg(-1, sideAngle, i);
        }

        ctx.restore();
    }

    drawLeg(side, sideAngle, index) {
        const movement = Math.sin(this.legPhase + index) * 0.3;
        const baseAngle = (side > 0 ? -Math.PI / 2 : Math.PI / 2) + sideAngle + movement;

        ctx.beginPath();
        ctx.moveTo(0, 0);

        const segment1Len = this.size * 2.5;
        const x1 = Math.cos(baseAngle) * segment1Len;
        const y1 = Math.sin(baseAngle) * segment1Len;

        const segment2Len = this.size * 2;
        const x2 = x1 + Math.cos(baseAngle + (side > 0 ? -0.8 : 0.8)) * segment2Len;
        const y2 = y1 + Math.sin(baseAngle + (side > 0 ? -0.8 : 0.8)) * segment2Len;

        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

// Initialize spiders
for (let i = 0; i < 15; i++) {
    spiders.push(new Spider());
}

function drawWeb(web) {
    ctx.strokeStyle = `rgba(106, 112, 113, ${web.opacity})`;
    ctx.lineWidth = 1;

    // Radial lines
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(web.x, web.y);
        ctx.lineTo(web.x + Math.cos(angle) * web.radius, web.y + Math.sin(angle) * web.radius);
        ctx.stroke();
    }

    // Spiral lines
    for (let j = 1; j <= 5; j++) {
        const r = (j / 5) * web.radius;
        ctx.beginPath();
        for (let i = 0; i <= 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = web.x + Math.cos(angle) * r;
            const y = web.y + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

function animate() {
    ctx.fillStyle = '#10181f';
    ctx.fillRect(0, 0, width, height);

    webs.forEach(drawWeb);

    spiders.forEach(spider => {
        spider.update();
        spider.draw();
    });

    requestAnimationFrame(animate);
}

animate();
