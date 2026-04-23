const canvas = document.getElementById('spiderCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let spiders = [];
let spiderBots = [];
let webs = [];
let webStrands = [];
let buildings = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    generateWebs();
    generateWebStrands();
    generateCity();
}

function generateWebs() {
    webs = [];
    for (let i = 0; i < 6; i++) {
        webs.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 150 + 100,
            opacity: Math.random() * 0.15 + 0.1
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
    const count = Math.ceil(width / 40) + 1;
    for (let i = 0; i < count; i++) {
        const bWidth = Math.random() * 60 + 40;
        const bHeight = Math.random() * height * 0.4 + 100;
        buildings.push({
            x: i * 45 - 20,
            width: bWidth,
            height: bHeight,
            color: '#05070a'
        });
    }
}

window.addEventListener('resize', resize);

class WebStrand {
    constructor() {
        this.reset();
        this.y = Math.random() * height;
    }

    reset() {
        this.x = Math.random() * width;
        this.y = -Math.random() * 200;
        this.length = Math.random() * 150 + 100;
        this.speed = Math.random() * 3 + 2;
        this.opacity = Math.random() * 0.2 + 0.1;
    }

    update() {
        this.y += this.speed;
        if (this.y > height) {
            this.reset();
        }
    }

    draw() {
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 1;
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
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 1.2 + 0.8;
        this.turnSpeed = (Math.random() - 0.5) * 0.05;
        this.legPhase = 0;
        this.bodyColor = '#E23636';
        this.detailColor = '#005BEA';
    }

    update() {
        this.angle += this.turnSpeed;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < -100 || this.x > width + 100 || this.y < -100 || this.y > height + 100) {
            this.reset();
        }

        this.legPhase += 0.2;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = this.bodyColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 1.4, this.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.detailColor;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.bodyColor;
        ctx.beginPath();
        ctx.arc(this.size * 1.2, 0, this.size * 0.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(this.size * 1.4, this.size * 0.3, this.size * 0.4, this.size * 0.2, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.size * 1.4, -this.size * 0.3, this.size * 0.4, this.size * 0.2, -0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = this.bodyColor;
        ctx.lineWidth = 3;
        for (let i = 0; i < 4; i++) {
            const sideAngle = (i - 1.5) * 0.6;
            this.drawLeg(1, sideAngle, i);
            this.drawLeg(-1, sideAngle, i);
        }

        ctx.restore();
    }

    drawLeg(side, sideAngle, index) {
        const movement = Math.sin(this.legPhase + index) * 0.4;
        const baseAngle = (side > 0 ? -Math.PI / 2 : Math.PI / 2) + sideAngle + movement;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const segment1Len = this.size * 3.5;
        const x1 = Math.cos(baseAngle) * segment1Len;
        const y1 = Math.sin(baseAngle) * segment1Len;
        const segment2Len = this.size * 3;
        const x2 = x1 + Math.cos(baseAngle + (side > 0 ? -1.2 : 1.2)) * segment2Len;
        const y2 = y1 + Math.sin(baseAngle + (side > 0 ? -1.2 : 1.2)) * segment2Len;
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
        this.size = Math.random() * 5 + 8;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 1.0 + 0.6;
        this.turnSpeed = (Math.random() - 0.5) * 0.06;
        this.legPhase = 0;
        this.bodyColor = '#005BEA';
        this.eyeColor = '#ff0000';
    }

    update() {
        this.angle += this.turnSpeed;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < -100 || this.x > width + 100 || this.y < -100 || this.y > height + 100) {
            this.reset();
        }

        this.legPhase += 0.25;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.strokeStyle = this.bodyColor;
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 3; i++) {
            const sideAngle = (i - 1) * 0.8;
            this.drawLeg(1, sideAngle, i);
            this.drawLeg(-1, sideAngle, i);
        }

        ctx.fillStyle = this.bodyColor;
        ctx.fillRect(-this.size, -this.size * 0.7, this.size * 2, this.size * 1.4);

        ctx.strokeStyle = '#E23636';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.7, -this.size * 0.4);
        ctx.lineTo(0, this.size * 0.3);
        ctx.lineTo(this.size * 0.7, -this.size * 0.4);
        ctx.stroke();

        ctx.fillStyle = this.eyeColor;
        ctx.beginPath();
        ctx.arc(this.size * 0.7, -this.size * 0.3, 2.5, 0, Math.PI * 2);
        ctx.arc(this.size * 0.7, this.size * 0.3, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawLeg(side, sideAngle, index) {
        const movement = Math.sin(this.legPhase + index) * 0.35;
        const baseAngle = (side > 0 ? -Math.PI / 2 : Math.PI / 2) + sideAngle + movement;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const legLen = this.size * 2.5;
        const x1 = Math.cos(baseAngle) * legLen;
        const y1 = Math.sin(baseAngle) * legLen;
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }
}

for (let i = 0; i < 15; i++) {
    spiders.push(new Spider());
}

for (let i = 0; i < 10; i++) {
    spiderBots.push(new SpiderBot());
}

resize();

function drawWeb(web) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${web.opacity})`;
    ctx.lineWidth = 1.2;

    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(web.x, web.y);
        ctx.lineTo(web.x + Math.cos(angle) * web.radius, web.y + Math.sin(angle) * web.radius);
        ctx.stroke();
    }

    for (let j = 1; j <= 6; j++) {
        const r = (j / 6) * web.radius;
        ctx.beginPath();
        for (let i = 0; i <= 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
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

        ctx.fillStyle = 'rgba(255, 255, 200, 0.4)';
        const wRows = Math.floor(b.height / 20);
        const wCols = Math.floor(b.width / 12);
        for (let r = 1; r < wRows - 1; r++) {
            for (let c = 1; c < wCols - 1; c++) {
                if (Math.random() > 0.4) {
                    ctx.fillRect(b.x + c * 12, height - b.height + r * 20, 5, 8);
                }
            }
        }
    });
}

function animate() {
    ctx.fillStyle = 'rgba(10, 14, 20, 0.4)';
    ctx.fillRect(0, 0, width, height);

    drawCity();
    webs.forEach(drawWeb);

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
