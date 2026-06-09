/**
 * Grand Fleet - Side Scrolling Naval Battle Game
 * A browser-based HTML5 Canvas game
 */

(function () {
    'use strict';

    // --- DOM Elements ---
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const startScreen = document.getElementById('start-screen');
    const gameoverScreen = document.getElementById('gameover-screen');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const hpBar = document.getElementById('hp-bar');
    const shieldBar = document.getElementById('shield-bar');
    const hpText = document.getElementById('hp-text');
    const shieldText = document.getElementById('shield-text');
    const scoreEl = document.getElementById('score');
    const waveEl = document.getElementById('wave');
    const finalScoreEl = document.getElementById('final-score');
    const finalWaveEl = document.getElementById('final-wave');

    // --- Selection State ---
    let selectedShip = 'destroyer';
    let selectedDifficulty = 'normal';

    // --- Ship Configurations ---
    const SHIP_CONFIGS = {
        destroyer: {
            name: 'Destroyer',
            speed: 340,
            hp: 80,
            shield: 30,
            fireRate: 130,
            bulletDamage: 1,
            specialCooldown: 4000,
            color: '#f97316',
            accentColor: '#ea580c',
            engineColor: '#fbbf24',
            width: 50,
            height: 20
        },
        cruiser: {
            name: 'Cruiser',
            speed: 280,
            hp: 120,
            shield: 60,
            fireRate: 200,
            bulletDamage: 2,
            specialCooldown: 5000,
            color: '#f59e0b',
            accentColor: '#d97706',
            engineColor: '#fbbf24',
            width: 58,
            height: 24
        },
        battleship: {
            name: 'Battleship',
            speed: 200,
            hp: 200,
            shield: 100,
            fireRate: 350,
            bulletDamage: 4,
            specialCooldown: 6000,
            color: '#dc2626',
            accentColor: '#991b1b',
            engineColor: '#f87171',
            width: 70,
            height: 32
        },
        carrier: {
            name: 'Carrier',
            speed: 250,
            hp: 130,
            shield: 50,
            fireRate: 250,
            bulletDamage: 1,
            specialCooldown: 3500,
            color: '#8b5cf6',
            accentColor: '#6d28d9',
            engineColor: '#a78bfa',
            width: 65,
            height: 28
        }
    };

    // --- Difficulty Configurations ---
    const DIFFICULTY_CONFIGS = {
        easy: {
            spawnMultiplier: 0.6,
            enemySpeedMultiplier: 0.75,
            enemyHpMultiplier: 0.8,
            enemyFireRateMultiplier: 1.5,
            scoreMultiplier: 0.5,
            waveScaling: 0.06,
            bossWave: 7
        },
        normal: {
            spawnMultiplier: 1.0,
            enemySpeedMultiplier: 1.0,
            enemyHpMultiplier: 1.0,
            enemyFireRateMultiplier: 1.0,
            scoreMultiplier: 1.0,
            waveScaling: 0.12,
            bossWave: 5
        },
        hard: {
            spawnMultiplier: 1.4,
            enemySpeedMultiplier: 1.3,
            enemyHpMultiplier: 1.5,
            enemyFireRateMultiplier: 0.7,
            scoreMultiplier: 1.5,
            waveScaling: 0.18,
            bossWave: 3
        },
        nightmare: {
            spawnMultiplier: 2.0,
            enemySpeedMultiplier: 1.6,
            enemyHpMultiplier: 2.0,
            enemyFireRateMultiplier: 0.5,
            scoreMultiplier: 2.5,
            waveScaling: 0.25,
            bossWave: 2
        }
    };

    // --- Game State ---
    let gameRunning = false;
    let animFrame = null;
    let score = 0;
    let wave = 1;
    let waveTimer = 0;
    let spawnTimer = 0;
    let lastTime = 0;
    let difficulty = 1;
    let diffConfig = DIFFICULTY_CONFIGS.normal;
    let shipConfig = SHIP_CONFIGS.destroyer;

    // --- Config ---
    const BULLET_SPEED = 600;
    const ENEMY_BASE_SPEED = 120;
    const SPECIAL_COOLDOWN = 5000;

    // --- Input ---
    const keys = {};
    let mobileInput = { up: false, down: false, left: false, right: false, fire: false, special: false };

    // --- Entities ---
    let player = null;
    let bullets = [];
    let enemies = [];
    let particles = [];
    let powerups = [];
    let enemyBullets = [];
    let drones = [];
    let bgLayers = [];

    // --- Canvas Resize ---
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // --- Selection UI ---
    function initSelectionUI() {
        // Ship selection
        document.querySelectorAll('.ship-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.ship-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedShip = btn.dataset.ship;
            });
        });

        // Difficulty selection
        document.querySelectorAll('.diff-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.diff-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedDifficulty = btn.dataset.diff;
            });
        });

        // Draw ship previews
        drawShipPreviews();
    }

    function drawShipPreviews() {
        document.querySelectorAll('.ship-preview-canvas').forEach(cvs => {
            const pctx = cvs.getContext('2d');
            const type = cvs.dataset.shipType;
            const cfg = SHIP_CONFIGS[type];
            const cx = cvs.width / 2;
            const cy = cvs.height / 2;

            pctx.clearRect(0, 0, cvs.width, cvs.height);
            pctx.save();
            pctx.translate(cx, cy);

            drawShipShape(pctx, type, cfg, cfg.width * 0.7, cfg.height * 0.7);

            pctx.restore();
        });
    }

    function drawShipShape(c, type, cfg, w, h) {
        const hw = w / 2;
        const hh = h / 2;

        // Engine glow
        c.fillStyle = cfg.engineColor + '88';
        c.beginPath();
        c.ellipse(-hw - 3, 0, 4, 3, 0, 0, Math.PI * 2);
        c.fill();

        if (type === 'destroyer') {
            // Sleek pointed shape
            c.fillStyle = cfg.color;
            c.beginPath();
            c.moveTo(hw, 0);
            c.lineTo(-hw, -hh);
            c.lineTo(-hw * 0.6, 0);
            c.lineTo(-hw, hh);
            c.closePath();
            c.fill();
            c.fillStyle = cfg.accentColor;
            c.beginPath();
            c.moveTo(hw * 0.5, 0);
            c.lineTo(-hw * 0.3, -hh * 0.6);
            c.lineTo(-hw * 0.2, 0);
            c.lineTo(-hw * 0.3, hh * 0.6);
            c.closePath();
            c.fill();
        } else if (type === 'cruiser') {
            // Balanced shape
            c.fillStyle = cfg.color;
            c.beginPath();
            c.moveTo(hw, 0);
            c.lineTo(hw * 0.3, -hh);
            c.lineTo(-hw, -hh * 0.7);
            c.lineTo(-hw, hh * 0.7);
            c.lineTo(hw * 0.3, hh);
            c.closePath();
            c.fill();
            c.fillStyle = cfg.accentColor;
            c.fillRect(-hw * 0.3, -hh * 0.4, hw * 0.8, hh * 0.8);
        } else if (type === 'battleship') {
            // Chunky armored shape
            c.fillStyle = cfg.color;
            c.beginPath();
            c.moveTo(hw, -hh * 0.3);
            c.lineTo(hw, hh * 0.3);
            c.lineTo(-hw * 0.2, hh);
            c.lineTo(-hw, hh * 0.8);
            c.lineTo(-hw, -hh * 0.8);
            c.lineTo(-hw * 0.2, -hh);
            c.closePath();
            c.fill();
            // Turret
            c.fillStyle = cfg.accentColor;
            c.beginPath();
            c.arc(hw * 0.1, 0, hh * 0.45, 0, Math.PI * 2);
            c.fill();
            // Cannon
            c.fillStyle = '#1c1917';
            c.fillRect(hw * 0.1, -2, hw * 0.5, 4);
        } else if (type === 'carrier') {
            // Flat top carrier shape
            c.fillStyle = cfg.color;
            c.beginPath();
            c.moveTo(hw, -hh * 0.4);
            c.lineTo(hw, hh * 0.4);
            c.lineTo(-hw * 0.7, hh);
            c.lineTo(-hw, hh * 0.6);
            c.lineTo(-hw, -hh * 0.6);
            c.lineTo(-hw * 0.7, -hh);
            c.closePath();
            c.fill();
            // Flight deck lines
            c.strokeStyle = cfg.accentColor;
            c.lineWidth = 1.5;
            c.beginPath();
            c.moveTo(-hw * 0.5, -hh * 0.3);
            c.lineTo(hw * 0.7, -hh * 0.3);
            c.moveTo(-hw * 0.5, hh * 0.3);
            c.lineTo(hw * 0.7, hh * 0.3);
            c.stroke();
            // Tower
            c.fillStyle = cfg.accentColor;
            c.fillRect(-hw * 0.1, -hh * 0.9, hw * 0.25, hh * 0.5);
        }
    }

    // --- Player ---
    function createPlayer() {
        shipConfig = SHIP_CONFIGS[selectedShip];
        diffConfig = DIFFICULTY_CONFIGS[selectedDifficulty];

        return {
            x: 120,
            y: canvas.height / 2,
            width: shipConfig.width,
            height: shipConfig.height,
            hp: shipConfig.hp,
            maxHp: shipConfig.hp,
            shield: shipConfig.shield,
            maxShield: shipConfig.shield,
            speed: shipConfig.speed,
            fireRate: shipConfig.fireRate,
            bulletDamage: shipConfig.bulletDamage,
            lastFire: 0,
            specialCooldown: 0,
            invincible: 0,
            shipType: selectedShip
        };
    }

    // --- Background Layers (Parallax) ---
    let waterTime = 0;
    let waterRipples = [];

    function createBgLayers() {
        bgLayers = [
            { speed: 15, elements: generateClouds(8, 0.4) },
            { speed: 30, elements: generateClouds(5, 0.6) }
        ];
        // Generate water ripple data
        waterRipples = [];
        for (let i = 0; i < 20; i++) {
            waterRipples.push({
                x: Math.random() * canvas.width * 1.5,
                y: canvas.height * 0.55 + Math.random() * (canvas.height * 0.45),
                length: 40 + Math.random() * 100,
                speed: 30 + Math.random() * 50,
                opacity: 0.1 + Math.random() * 0.25,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    function generateClouds(count, opacity) {
        const clouds = [];
        for (let i = 0; i < count; i++) {
            clouds.push({
                x: Math.random() * canvas.width * 2,
                y: 20 + Math.random() * canvas.height * 0.25,
                w: 80 + Math.random() * 140,
                h: 25 + Math.random() * 35,
                opacity: opacity
            });
        }
        return clouds;
    }

    // --- Draw Functions ---
    function drawBackground(dt) {
        waterTime += dt;

        // Sky gradient - top portion
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGrad.addColorStop(0, '#7ec8e3');
        skyGrad.addColorStop(0.15, '#57b0d4');
        skyGrad.addColorStop(0.35, '#3498c8');
        skyGrad.addColorStop(0.5, '#1a6bb5');
        skyGrad.addColorStop(0.65, '#135a96');
        skyGrad.addColorStop(0.85, '#0d4a7a');
        skyGrad.addColorStop(1, '#083556');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Clouds
        bgLayers.forEach(layer => {
            layer.elements.forEach(el => {
                el.x -= layer.speed * dt;
                if (el.x + el.w < 0) {
                    el.x = canvas.width + Math.random() * 300;
                    el.y = 20 + Math.random() * canvas.height * 0.25;
                }
                ctx.fillStyle = `rgba(255, 255, 255, ${el.opacity})`;
                ctx.beginPath();
                ctx.ellipse(el.x + el.w / 2, el.y + el.h / 2, el.w / 2, el.h / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                // Sub-cloud
                ctx.beginPath();
                ctx.ellipse(el.x + el.w * 0.3, el.y + el.h * 0.6, el.w * 0.35, el.h * 0.4, 0, 0, Math.PI * 2);
                ctx.fill();
            });
        });

        // Ocean surface - animated sine waves
        const waterStart = canvas.height * 0.48;
        const waterGrad = ctx.createLinearGradient(0, waterStart, 0, canvas.height);
        waterGrad.addColorStop(0, 'rgba(20, 100, 160, 0.3)');
        waterGrad.addColorStop(0.3, 'rgba(15, 75, 130, 0.5)');
        waterGrad.addColorStop(1, 'rgba(8, 50, 86, 0.7)');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(0, waterStart, canvas.width, canvas.height - waterStart);

        // Animated wave lines (multiple sine layers)
        for (let w = 0; w < 5; w++) {
            const yBase = waterStart + w * (canvas.height - waterStart) * 0.18;
            const amplitude = 3 + w * 1.5;
            const frequency = 0.008 - w * 0.001;
            const speed = (2 + w * 0.5);
            const alpha = 0.25 - w * 0.03;

            ctx.beginPath();
            ctx.moveTo(0, yBase);
            for (let x = 0; x <= canvas.width; x += 4) {
                const y = yBase + Math.sin(x * frequency + waterTime * speed + w) * amplitude
                              + Math.sin(x * frequency * 1.5 + waterTime * speed * 0.7) * amplitude * 0.5;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            ctx.fillStyle = `rgba(180, 230, 255, ${alpha})`;
            ctx.fill();
        }

        // Specular highlights / sun reflections on water
        for (let i = 0; i < 8; i++) {
            const rx = (canvas.width * 0.3 + i * 90 + waterTime * 15) % (canvas.width + 100) - 50;
            const ry = waterStart + 20 + Math.sin(waterTime * 1.5 + i) * 15 + i * 30;
            const rw = 20 + Math.sin(waterTime * 2 + i * 0.7) * 8;
            const alpha = 0.08 + Math.sin(waterTime * 3 + i) * 0.04;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.ellipse(rx, ry, rw, 2, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Moving ripple lines
        waterRipples.forEach(r => {
            r.x -= r.speed * dt;
            if (r.x + r.length < 0) {
                r.x = canvas.width + Math.random() * 200;
                r.y = canvas.height * 0.55 + Math.random() * (canvas.height * 0.4);
            }
            const waveY = r.y + Math.sin(waterTime * 2 + r.phase) * 3;
            ctx.strokeStyle = `rgba(150, 220, 255, ${r.opacity})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(r.x, waveY);
            // Curved ripple
            ctx.quadraticCurveTo(r.x + r.length * 0.5, waveY - 2, r.x + r.length, waveY);
            ctx.stroke();
        });

        // Light caustics effect underwater (subtle moving patterns)
        ctx.globalAlpha = 0.04;
        for (let i = 0; i < 6; i++) {
            const cx = (i * 250 + waterTime * 20) % (canvas.width + 200) - 100;
            const cy = waterStart + 60 + i * 50 + Math.sin(waterTime + i) * 20;
            ctx.fillStyle = '#67e8f9';
            ctx.beginPath();
            ctx.ellipse(cx, cy, 30 + Math.sin(waterTime * 1.5 + i) * 10, 15, waterTime * 0.3 + i, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function drawPlayer() {
        if (!player) return;
        const p = player;
        const blink = p.invincible > 0 && Math.floor(Date.now() / 80) % 2;
        if (blink) return;

        ctx.save();
        ctx.translate(p.x, p.y);
        drawShipShape(ctx, p.shipType, shipConfig, p.width, p.height);
        ctx.restore();
    }

    function drawBullet(b) {
        ctx.save();
        // Trail effect
        const trailLen = b.isSpecial ? 20 : (b.isMega ? 30 : 12);
        const trailGrad = ctx.createLinearGradient(b.x - trailLen, b.y, b.x, b.y);
        const baseColor = b.isSpecial ? '56, 189, 248' : (b.isMega ? '251, 191, 36' : '14, 165, 233');
        trailGrad.addColorStop(0, `rgba(${baseColor}, 0)`);
        trailGrad.addColorStop(1, `rgba(${baseColor}, 0.6)`);
        ctx.fillStyle = trailGrad;
        ctx.beginPath();
        if (b.isMega) {
            ctx.ellipse(b.x - trailLen / 2, b.y, trailLen, 8, 0, 0, Math.PI * 2);
        } else {
            ctx.ellipse(b.x - trailLen / 2, b.y, trailLen, b.isSpecial ? 5 : 3, 0, 0, Math.PI * 2);
        }
        ctx.fill();

        // Main bullet body
        if (b.isMega) {
            // Big cannon shot with glow
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 20;
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.ellipse(b.x, b.y, 14, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            // Inner bright core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(b.x + 2, b.y, 6, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (b.isSpecial) {
            // Special bullet - bright cyan with white core
            ctx.shadowColor = '#67e8f9';
            ctx.shadowBlur = 15;
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.ellipse(b.x, b.y, 10, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#e0f2fe';
            ctx.beginPath();
            ctx.ellipse(b.x + 2, b.y, 5, 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (b.isDrone) {
            // Small drone bullets
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#22d3ee';
            ctx.beginPath();
            ctx.ellipse(b.x, b.y, 5, 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        } else {
            // Normal bullet - distinct shape with glow
            ctx.shadowColor = '#0ea5e9';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.ellipse(b.x, b.y, 8, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            // White hot center
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.ellipse(b.x + 2, b.y, 4, 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    function drawEnemyBullet(b) {
        ctx.save();
        // Red trail
        const trailGrad = ctx.createLinearGradient(b.x - 10, b.y, b.x, b.y);
        trailGrad.addColorStop(0, 'rgba(239, 68, 68, 0)');
        trailGrad.addColorStop(1, 'rgba(239, 68, 68, 0.5)');
        ctx.fillStyle = trailGrad;
        ctx.beginPath();
        ctx.ellipse(b.x - 5, b.y, 10, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Main bullet
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#f87171';
        ctx.beginPath();
        ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        // Hot core
        ctx.fillStyle = '#fef2f2';
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawEnemy(e) {
        ctx.save();
        ctx.translate(e.x, e.y);

        if (e.type === 'basic') {
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.moveTo(-e.width / 2, 0);
            ctx.lineTo(e.width / 4, -e.height / 2);
            ctx.lineTo(e.width / 2, 0);
            ctx.lineTo(e.width / 4, e.height / 2);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#475569';
            ctx.fillRect(-e.width / 4, -e.height / 4, e.width / 2, e.height / 2);
        } else if (e.type === 'fast') {
            ctx.fillStyle = '#a855f7';
            ctx.beginPath();
            ctx.moveTo(-e.width / 2, 0);
            ctx.lineTo(0, -e.height / 2);
            ctx.lineTo(e.width / 2, 0);
            ctx.lineTo(0, e.height / 2);
            ctx.closePath();
            ctx.fill();
        } else if (e.type === 'tank') {
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(-e.width / 2, -e.height / 2, e.width, e.height);
            ctx.fillStyle = '#991b1b';
            ctx.fillRect(-e.width / 2 + 4, -e.height / 2 + 4, e.width - 8, e.height - 8);
            ctx.fillStyle = '#7f1d1d';
            ctx.fillRect(-e.width / 2 - 10, -3, 14, 6);
        } else if (e.type === 'boss') {
            ctx.fillStyle = '#b91c1c';
            ctx.beginPath();
            ctx.moveTo(-e.width / 2, 0);
            ctx.lineTo(-e.width / 4, -e.height / 2);
            ctx.lineTo(e.width / 2, -e.height / 3);
            ctx.lineTo(e.width / 2, e.height / 3);
            ctx.lineTo(-e.width / 4, e.height / 2);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#991b1b';
            ctx.beginPath();
            ctx.ellipse(0, 0, e.width / 4, e.height / 4, 0, 0, Math.PI * 2);
            ctx.fill();
            // HP bar
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(-e.width / 2, -e.height / 2 - 12, e.width, 6);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(-e.width / 2, -e.height / 2 - 12, e.width * (e.hp / e.maxHp), 6);
        }

        ctx.restore();
    }

    function drawDrone(d) {
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.fillStyle = shipConfig.accentColor;
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-5, -5);
        ctx.lineTo(-3, 0);
        ctx.lineTo(-5, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawParticle(p) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    function drawPowerup(pu) {
        ctx.save();
        ctx.translate(pu.x, pu.y);
        const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.15;
        ctx.scale(pulse, pulse);

        ctx.fillStyle = pu.type === 'health' ? '#22c55e' : '#3b82f6';
        ctx.shadowColor = pu.type === 'health' ? '#22c55e' : '#3b82f6';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pu.type === 'health' ? '+' : 'S', 0, 0);

        ctx.restore();
    }

    // --- Spawn ---
    function spawnEnemy() {
        const types = ['basic', 'basic', 'fast'];
        if (wave >= 3) types.push('tank');
        if (wave >= diffConfig.bossWave && Math.random() < 0.1) types.push('boss');

        const type = types[Math.floor(Math.random() * types.length)];
        let e = {
            x: canvas.width + 50,
            y: 80 + Math.random() * (canvas.height - 160),
            type: type,
            vx: 0,
            vy: 0,
            fireTimer: 0,
            fireRate: 2000
        };

        const spdMul = diffConfig.enemySpeedMultiplier;
        const hpMul = diffConfig.enemyHpMultiplier;

        switch (type) {
            case 'basic':
                e.width = 40; e.height = 20;
                e.hp = Math.ceil(1 * hpMul); e.maxHp = e.hp;
                e.speed = ENEMY_BASE_SPEED * difficulty * spdMul;
                e.score = Math.round(10 * diffConfig.scoreMultiplier);
                break;
            case 'fast':
                e.width = 30; e.height = 16;
                e.hp = Math.ceil(1 * hpMul); e.maxHp = e.hp;
                e.speed = ENEMY_BASE_SPEED * 1.8 * difficulty * spdMul;
                e.score = Math.round(15 * diffConfig.scoreMultiplier);
                break;
            case 'tank':
                e.width = 55; e.height = 35;
                e.hp = Math.ceil(5 * hpMul); e.maxHp = e.hp;
                e.speed = ENEMY_BASE_SPEED * 0.6 * difficulty * spdMul;
                e.score = Math.round(30 * diffConfig.scoreMultiplier);
                e.fireRate = Math.round(1500 * diffConfig.enemyFireRateMultiplier);
                break;
            case 'boss':
                e.width = 90; e.height = 60;
                e.hp = Math.ceil((20 + wave * 5) * hpMul); e.maxHp = e.hp;
                e.speed = ENEMY_BASE_SPEED * 0.4 * spdMul;
                e.score = Math.round(100 * diffConfig.scoreMultiplier);
                e.fireRate = Math.round(800 * diffConfig.enemyFireRateMultiplier);
                break;
        }

        e.vx = -e.speed;
        e.vy = (Math.random() - 0.5) * 40;
        enemies.push(e);
    }

    function spawnPowerup(x, y) {
        if (Math.random() > 0.2) return;
        powerups.push({
            x: x,
            y: y,
            type: Math.random() < 0.5 ? 'health' : 'shield',
            vx: -30
        });
    }

    function createExplosion(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 200;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 4,
                life: 1,
                decay: 1.5 + Math.random(),
                color: color
            });
        }
    }

    // --- Shooting ---
    function playerShoot() {
        const now = Date.now();
        if (now - player.lastFire < player.fireRate) return;
        player.lastFire = now;

        if (player.shipType === 'battleship') {
            // Double cannon
            bullets.push(
                { x: player.x + player.width / 2, y: player.y - 6, vx: BULLET_SPEED, vy: 0, damage: player.bulletDamage, isSpecial: false },
                { x: player.x + player.width / 2, y: player.y + 6, vx: BULLET_SPEED, vy: 0, damage: player.bulletDamage, isSpecial: false }
            );
        } else if (player.shipType === 'carrier') {
            // Normal shot + drone support
            bullets.push({ x: player.x + player.width / 2, y: player.y, vx: BULLET_SPEED, vy: 0, damage: player.bulletDamage, isSpecial: false });
            // Drones auto-fire handled in update
        } else {
            bullets.push({
                x: player.x + player.width / 2,
                y: player.y,
                vx: BULLET_SPEED,
                vy: 0,
                damage: player.bulletDamage,
                isSpecial: false
            });
        }
    }

    function playerSpecial() {
        if (player.specialCooldown > 0) return;
        player.specialCooldown = shipConfig.specialCooldown;

        if (player.shipType === 'destroyer') {
            // Rapid burst
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    if (!gameRunning) return;
                    bullets.push({
                        x: player.x + player.width / 2,
                        y: player.y + (Math.random() - 0.5) * 10,
                        vx: BULLET_SPEED * 1.2,
                        vy: (Math.random() - 0.5) * 40,
                        damage: 1,
                        isSpecial: true
                    });
                }, i * 60);
            }
        } else if (player.shipType === 'cruiser') {
            // Fan spread
            for (let i = -3; i <= 3; i++) {
                bullets.push({
                    x: player.x + player.width / 2,
                    y: player.y,
                    vx: BULLET_SPEED * 0.9,
                    vy: i * 70,
                    damage: 2,
                    isSpecial: true
                });
            }
        } else if (player.shipType === 'battleship') {
            // Massive cannon blast
            bullets.push({
                x: player.x + player.width / 2,
                y: player.y,
                vx: BULLET_SPEED * 0.7,
                vy: 0,
                damage: 15,
                isSpecial: true,
                isMega: true
            });
            createExplosion(player.x + player.width / 2, player.y, '#f97316', 12);
        } else if (player.shipType === 'carrier') {
            // Launch drone swarm
            for (let i = 0; i < 4; i++) {
                drones.push({
                    x: player.x,
                    y: player.y + (i - 1.5) * 30,
                    targetY: player.y + (i - 1.5) * 60,
                    fireTimer: 0,
                    life: 6000
                });
            }
        }

        createExplosion(player.x, player.y, shipConfig.engineColor, 8);
    }

    function enemyShoot(e) {
        if (e.type === 'basic' || e.type === 'fast') return;
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return;
        const speed = 250;
        enemyBullets.push({
            x: e.x - e.width / 2,
            y: e.y,
            vx: (dx / dist) * speed,
            vy: (dy / dist) * speed,
            damage: 10
        });
    }

    // --- Collision ---
    function rectCollision(a, b) {
        return a.x - a.w < b.x + b.w &&
               a.x + a.w > b.x - b.w &&
               a.y - a.h < b.y + b.h &&
               a.y + a.h > b.y - b.h;
    }

    // --- Update ---
    function update(dt) {
        if (!gameRunning) return;

        // Player movement
        let dx = 0, dy = 0;
        if (keys['ArrowUp'] || keys['KeyW'] || mobileInput.up) dy -= 1;
        if (keys['ArrowDown'] || keys['KeyS'] || mobileInput.down) dy += 1;
        if (keys['ArrowLeft'] || keys['KeyA'] || mobileInput.left) dx -= 1;
        if (keys['ArrowRight'] || keys['KeyD'] || mobileInput.right) dx += 1;

        if (dx || dy) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len; dy /= len;
        }

        player.x += dx * player.speed * dt;
        player.y += dy * player.speed * dt;

        // Clamp player
        player.x = Math.max(player.width / 2, Math.min(canvas.width * 0.6, player.x));
        player.y = Math.max(player.height + 50, Math.min(canvas.height - player.height - 20, player.y));

        // Shooting
        if (keys['Space'] || mobileInput.fire) playerShoot();
        if (keys['KeyE'] || mobileInput.special) { playerSpecial(); mobileInput.special = false; }

        // Cooldowns
        if (player.specialCooldown > 0) player.specialCooldown -= dt * 1000;
        if (player.invincible > 0) player.invincible -= dt * 1000;

        // Shield regen
        if (player.shield < player.maxShield) {
            player.shield += 2 * dt;
            player.shield = Math.min(player.shield, player.maxShield);
        }

        // Drones update (carrier)
        drones = drones.filter(d => {
            d.life -= dt * 1000;
            // Follow player loosely
            d.x += (player.x + 30 - d.x) * 2 * dt;
            d.y += (d.targetY - d.y) * 3 * dt;
            d.targetY = player.y + (d.targetY - player.y) * 0.99;

            // Auto fire
            d.fireTimer += dt * 1000;
            if (d.fireTimer >= 400) {
                d.fireTimer = 0;
                bullets.push({
                    x: d.x + 10,
                    y: d.y,
                    vx: BULLET_SPEED * 0.8,
                    vy: (Math.random() - 0.5) * 20,
                    damage: 1,
                    isSpecial: false,
                    isDrone: true
                });
            }

            return d.life > 0;
        });

        // Bullets
        bullets = bullets.filter(b => {
            b.x += b.vx * dt;
            b.y += b.vy * dt;
            return b.x < canvas.width + 20 && b.x > -20 && b.y > -20 && b.y < canvas.height + 20;
        });

        // Enemy bullets
        enemyBullets = enemyBullets.filter(b => {
            b.x += b.vx * dt;
            b.y += b.vy * dt;

            if (player.invincible <= 0) {
                const hit = rectCollision(
                    { x: b.x, y: b.y, w: 5, h: 5 },
                    { x: player.x, y: player.y, w: player.width / 2, h: player.height / 2 }
                );
                if (hit) {
                    takeDamage(b.damage);
                    createExplosion(b.x, b.y, '#ef4444', 5);
                    return false;
                }
            }

            return b.x > -20 && b.x < canvas.width + 20 && b.y > -20 && b.y < canvas.height + 20;
        });

        // Enemies
        enemies = enemies.filter(e => {
            e.x += e.vx * dt;
            e.y += e.vy * dt;

            if (e.y < 80 || e.y > canvas.height - 80) e.vy *= -1;

            e.fireTimer += dt * 1000;
            if (e.fireTimer >= e.fireRate) {
                e.fireTimer = 0;
                enemyShoot(e);
            }

            // Bullet collision
            for (let i = bullets.length - 1; i >= 0; i--) {
                const b = bullets[i];
                const bw = b.isMega ? 20 : 8;
                const bh = b.isMega ? 12 : 4;
                const hit = rectCollision(
                    { x: b.x, y: b.y, w: bw, h: bh },
                    { x: e.x, y: e.y, w: e.width / 2, h: e.height / 2 }
                );
                if (hit) {
                    e.hp -= b.damage;
                    if (!b.isMega) bullets.splice(i, 1);
                    createExplosion(b.x, b.y, shipConfig.color, 4);
                    if (e.hp <= 0) {
                        score += e.score;
                        createExplosion(e.x, e.y, '#fbbf24', 15);
                        spawnPowerup(e.x, e.y);
                        updateHUD();
                        return false;
                    }
                    break;
                }
            }

            // Collide with player
            if (player.invincible <= 0) {
                const hit = rectCollision(
                    { x: e.x, y: e.y, w: e.width / 2, h: e.height / 2 },
                    { x: player.x, y: player.y, w: player.width / 2, h: player.height / 2 }
                );
                if (hit) {
                    takeDamage(20);
                    createExplosion(e.x, e.y, '#ef4444', 10);
                    return false;
                }
            }

            return e.x > -100;
        });

        // Powerups
        powerups = powerups.filter(pu => {
            pu.x += pu.vx * dt;
            const hit = rectCollision(
                { x: pu.x, y: pu.y, w: 14, h: 14 },
                { x: player.x, y: player.y, w: player.width / 2, h: player.height / 2 }
            );
            if (hit) {
                if (pu.type === 'health') {
                    player.hp = Math.min(player.hp + 25, player.maxHp);
                } else {
                    player.shield = Math.min(player.shield + 25, player.maxShield);
                }
                createExplosion(pu.x, pu.y, pu.type === 'health' ? '#22c55e' : '#3b82f6', 8);
                updateHUD();
                return false;
            }
            return pu.x > -20;
        });

        // Particles
        particles = particles.filter(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= p.decay * dt;
            return p.life > 0;
        });

        // Wave & spawn
        waveTimer += dt;
        spawnTimer += dt;

        const spawnInterval = Math.max(0.3, (1.5 / diffConfig.spawnMultiplier) - wave * 0.05);
        if (spawnTimer >= spawnInterval) {
            spawnTimer = 0;
            spawnEnemy();
        }

        if (waveTimer >= 15) {
            waveTimer = 0;
            wave++;
            difficulty = 1 + wave * diffConfig.waveScaling;
            updateHUD();
        }
    }

    function takeDamage(amount) {
        if (player.shield > 0) {
            const shieldDmg = Math.min(player.shield, amount * 0.6);
            player.shield -= shieldDmg;
            amount -= shieldDmg;
        }
        player.hp -= amount;
        player.invincible = 1000;
        updateHUD();

        if (player.hp <= 0) {
            gameOver();
        }
    }

    // --- Render ---
    function render(dt) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground(dt);

        powerups.forEach(drawPowerup);
        bullets.forEach(drawBullet);
        enemyBullets.forEach(drawEnemyBullet);
        enemies.forEach(drawEnemy);
        drones.forEach(drawDrone);
        drawPlayer();
        particles.forEach(drawParticle);
    }

    // --- HUD ---
    function updateHUD() {
        if (!player) return;
        const hpPct = Math.max(0, player.hp / player.maxHp * 100);
        const shieldPct = Math.max(0, player.shield / player.maxShield * 100);
        hpBar.style.width = hpPct + '%';
        shieldBar.style.width = shieldPct + '%';
        hpText.textContent = Math.round(Math.max(0, player.hp));
        shieldText.textContent = Math.round(Math.max(0, player.shield));
        scoreEl.textContent = score;
        waveEl.textContent = wave;
    }

    // --- Game Loop ---
    function gameLoop(timestamp) {
        if (!gameRunning) return;
        const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
        lastTime = timestamp;

        update(dt);
        render(dt);
        animFrame = requestAnimationFrame(gameLoop);
    }

    // --- Start / End ---
    function startGame() {
        score = 0;
        wave = 1;
        waveTimer = 0;
        spawnTimer = 0;
        difficulty = 1;
        player = createPlayer();
        bullets = [];
        enemies = [];
        particles = [];
        powerups = [];
        enemyBullets = [];
        drones = [];
        createBgLayers();
        updateHUD();

        startScreen.classList.add('overlay--hidden');
        gameoverScreen.classList.add('overlay--hidden');
        gameRunning = true;
        lastTime = performance.now();
        animFrame = requestAnimationFrame(gameLoop);
    }

    function gameOver() {
        gameRunning = false;
        if (animFrame) cancelAnimationFrame(animFrame);
        finalScoreEl.textContent = score;
        finalWaveEl.textContent = wave;
        gameoverScreen.classList.remove('overlay--hidden');
    }

    // --- Input Handlers ---
    window.addEventListener('keydown', e => { keys[e.code] = true; });
    window.addEventListener('keyup', e => { keys[e.code] = false; });

    // Mobile controls
    document.querySelectorAll('.mobile-btn[data-dir]').forEach(btn => {
        const dir = btn.dataset.dir;
        btn.addEventListener('touchstart', e => { e.preventDefault(); mobileInput[dir] = true; });
        btn.addEventListener('touchend', e => { e.preventDefault(); mobileInput[dir] = false; });
        btn.addEventListener('mousedown', () => mobileInput[dir] = true);
        btn.addEventListener('mouseup', () => mobileInput[dir] = false);
    });

    const fireBtn = document.getElementById('mobile-fire');
    fireBtn.addEventListener('touchstart', e => { e.preventDefault(); mobileInput.fire = true; });
    fireBtn.addEventListener('touchend', e => { e.preventDefault(); mobileInput.fire = false; });
    fireBtn.addEventListener('mousedown', () => mobileInput.fire = true);
    fireBtn.addEventListener('mouseup', () => mobileInput.fire = false);

    const specialBtn = document.getElementById('mobile-special');
    specialBtn.addEventListener('touchstart', e => { e.preventDefault(); mobileInput.special = true; });
    specialBtn.addEventListener('touchend', e => { e.preventDefault(); mobileInput.special = false; });

    // Buttons
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    // Init selection UI
    initSelectionUI();
})();
