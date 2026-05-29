import { clamp, randomBetween, rectsOverlap } from "@/game/collision";
import { EMPTY_INPUT, getInputVector } from "@/game/controls";

const PLAYER_WIDTH = 42;
const PLAYER_HEIGHT = 48;
const PLAYER_SPEED = 330;
const POINTER_SPEED = 620;
const BULLET_SPEED = 620;
const BULLET_COOLDOWN = 170;
const MAX_HEALTH = 3;

export class SpaceShooterEngine {
  constructor(canvas, { levelConfig, playground, sound, onHudChange, onFinish }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.levelConfig = levelConfig;
    this.playground = playground;
    this.sound = sound;
    this.onHudChange = onHudChange;
    this.onFinish = onFinish;
    this.frameId = null;
    this.running = false;
    this.lastTime = 0;
    this.lastHudTime = 0;
    this.dpr = 1;
    this.width = 360;
    this.height = 540;
    this.stars = [];
    this.input = { ...EMPTY_INPUT };
    this.shootingSources = new Set();
    this.state = this.createInitialState();
    this.loop = this.loop.bind(this);
  }

  createInitialState() {
    return {
      score: 0,
      health: MAX_HEALTH,
      maxHealth: MAX_HEALTH,
      paused: false,
      finished: false,
      elapsed: 0,
      spawnTimer: 0,
      lastShotAt: 0,
      bullets: [],
      enemies: [],
      particles: [],
      bossSpawned: false,
      bossDefeated: false,
      player: {
        x: this.width / 2 - PLAYER_WIDTH / 2,
        y: this.height - PLAYER_HEIGHT - 28,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT
      }
    };
  }

  start() {
    this.resize();
    this.resetState();
    this.running = true;
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(this.loop);
    this.publishHud(true);
  }

  dispose() {
    this.running = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }

  restart() {
    this.resetState();
    this.running = true;
    this.lastTime = performance.now();
    this.publishHud(true);
  }

  resetState() {
    this.input = { ...EMPTY_INPUT };
    this.shootingSources.clear();
    this.state = this.createInitialState();
    this.generateStars();
  }

  resize() {
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    const width = Math.max(280, Math.floor(rect?.width || this.canvas.clientWidth || 360));
    const height = Math.max(320, Math.floor(rect?.height || this.canvas.clientHeight || 540));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (this.state?.player) {
      this.state.player.x = clamp(this.state.player.x, 12, this.width - this.state.player.width - 12);
      this.state.player.y = clamp(this.state.player.y, 12, this.height - this.state.player.height - 12);
    }

    this.generateStars();
  }

  setDirection(direction, active) {
    if (!Object.prototype.hasOwnProperty.call(this.input, direction)) return;
    this.input[direction] = active;
  }

  setShooting(active, source = "primary") {
    if (active) {
      this.shootingSources.add(source);
    } else {
      this.shootingSources.delete(source);
    }

    this.input.shooting = this.shootingSources.size > 0;
  }

  setPointerTarget(point) {
    if (!point) {
      this.input.pointerTarget = null;
      return;
    }

    this.input.pointerTarget = {
      x: clamp(point.x, 0, this.width),
      y: clamp(point.y, 0, this.height)
    };
  }

  isPointOnPlayer(point, padding = 18) {
    if (!point || !this.state?.player) return false;
    const player = this.state.player;

    return (
      point.x >= player.x - padding &&
      point.x <= player.x + player.width + padding &&
      point.y >= player.y - padding &&
      point.y <= player.y + player.height + padding
    );
  }

  primeAudio() {
    this.sound?.prime?.();
  }

  togglePause() {
    if (this.state.finished) return;
    this.state.paused = !this.state.paused;
    this.lastTime = performance.now();
    this.sound?.pause?.();
    this.publishHud(true);
  }

  generateStars() {
    const starCount = clamp(Math.round((this.width * this.height) / 5200), 55, 130);
    this.stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: randomBetween(0.6, 1.7),
      speed: randomBetween(14, 48),
      alpha: randomBetween(0.32, 0.9)
    }));
  }

  loop(time) {
    if (!this.running) return;

    const delta = Math.min((time - this.lastTime) / 1000, 0.034);
    this.lastTime = time;

    if (!this.state.paused && !this.state.finished) {
      this.update(delta, time);
    }

    this.draw();

    if (time - this.lastHudTime > 90) {
      this.publishHud();
      this.lastHudTime = time;
    }

    this.frameId = requestAnimationFrame(this.loop);
  }

  update(delta, time) {
    this.state.elapsed += delta;
    this.updateStars(delta);
    this.updatePlayer(delta);

    if (this.input.shooting) {
      this.shoot(time);
    }

    this.updateBullets(delta);
    this.spawnEnemies(delta);
    this.updateEnemies(delta);
    this.updateParticles(delta);
    this.resolveCollisions();
    this.checkWinCondition();
  }

  updateStars(delta) {
    for (const star of this.stars) {
      star.y += star.speed * delta;
      if (star.y > this.height + 4) {
        star.y = -4;
        star.x = Math.random() * this.width;
      }
    }
  }

  updatePlayer(delta) {
    const vector = getInputVector(this.input);
    const player = this.state.player;
    const hasKeyboardInput = vector.x !== 0 || vector.y !== 0;

    if (hasKeyboardInput) {
      player.x = clamp(player.x + vector.x * PLAYER_SPEED * delta, 10, this.width - player.width - 10);
      player.y = clamp(player.y + vector.y * PLAYER_SPEED * delta, 10, this.height - player.height - 10);
      return;
    }

    if (this.input.pointerTarget) {
      const targetX = this.input.pointerTarget.x - player.width / 2;
      const targetY = this.input.pointerTarget.y - player.height / 2;
      const deltaX = targetX - player.x;
      const deltaY = targetY - player.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance > 1) {
        const step = Math.min(distance, POINTER_SPEED * delta);
        player.x = clamp(player.x + (deltaX / distance) * step, 10, this.width - player.width - 10);
        player.y = clamp(player.y + (deltaY / distance) * step, 10, this.height - player.height - 10);
      }
    }
  }

  shoot(time) {
    if (time - this.state.lastShotAt < BULLET_COOLDOWN) return;

    const player = this.state.player;
    this.state.bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y - 12,
      width: 4,
      height: 18,
      speed: BULLET_SPEED
    });
    this.state.lastShotAt = time;
    this.sound?.shoot?.();
  }

  updateBullets(delta) {
    this.state.bullets = this.state.bullets
      .map((bullet) => ({ ...bullet, y: bullet.y - bullet.speed * delta }))
      .filter((bullet) => bullet.y + bullet.height > -20);
  }

  spawnEnemies(delta) {
    const config = this.levelConfig;
    this.state.spawnTimer += delta * 1000;

    if (config.boss && !this.state.bossSpawned && (this.state.score >= config.targetScore * 0.45 || this.state.elapsed > 16)) {
      this.spawnBoss();
      return;
    }

    if (this.state.spawnTimer < config.enemySpawnRate) return;

    this.state.spawnTimer = 0;
    this.spawnEnemy();
  }

  spawnEnemy() {
    const size = randomBetween(28, 44);
    const health = this.levelConfig.enemyHealth;
    const speed = this.levelConfig.enemySpeed * randomBetween(42, 58);

    this.state.enemies.push({
      type: "enemy",
      x: randomBetween(12, this.width - size - 12),
      y: -size - 10,
      width: size,
      height: size,
      health,
      maxHealth: health,
      speed,
      drift: randomBetween(-18, 18),
      points: 100 + health * 35,
      rotation: randomBetween(0, Math.PI)
    });
  }

  spawnBoss() {
    const width = Math.min(190, this.width * 0.62);
    const health = 28 + this.levelConfig.enemyHealth * 7;

    this.state.bossSpawned = true;
    this.state.spawnTimer = 0;
    this.state.enemies.push({
      type: "boss",
      x: this.width / 2 - width / 2,
      y: 26,
      width,
      height: width * 0.42,
      health,
      maxHealth: health,
      speed: 18,
      drift: 36,
      points: 1200,
      rotation: 0
    });
  }

  updateEnemies(delta) {
    for (const enemy of this.state.enemies) {
      if (enemy.type === "boss") {
        enemy.x += Math.sin(this.state.elapsed * 1.5) * enemy.drift * delta;
        enemy.x = clamp(enemy.x, 12, this.width - enemy.width - 12);
        continue;
      }

      enemy.y += enemy.speed * delta;
      enemy.x += enemy.drift * delta;
      enemy.rotation += delta * 1.5;

      if (enemy.x < 8 || enemy.x + enemy.width > this.width - 8) {
        enemy.drift *= -1;
      }
    }

    this.state.enemies = this.state.enemies.filter((enemy) => enemy.type === "boss" || enemy.y < this.height + 60);
  }

  updateParticles(delta) {
    this.state.particles = this.state.particles
      .map((particle) => ({
        ...particle,
        x: particle.x + particle.vx * delta,
        y: particle.y + particle.vy * delta,
        life: particle.life - delta
      }))
      .filter((particle) => particle.life > 0);
  }

  resolveCollisions() {
    const bulletsToRemove = new Set();
    const enemiesToRemove = new Set();

    this.state.bullets.forEach((bullet, bulletIndex) => {
      this.state.enemies.forEach((enemy, enemyIndex) => {
        if (bulletsToRemove.has(bulletIndex) || enemiesToRemove.has(enemyIndex)) return;
        if (!rectsOverlap(bullet, enemy)) return;

        bulletsToRemove.add(bulletIndex);
        enemy.health -= 1;
        this.sound?.hit?.();
        this.createBurst(bullet.x, bullet.y, this.playground.colors.bullet, 5);

        if (enemy.health <= 0) {
          enemiesToRemove.add(enemyIndex);
          this.state.score += enemy.points;
          this.sound?.destroy?.();
          this.createBurst(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, this.playground.colors.enemyAlt, enemy.type === "boss" ? 34 : 14);

          if (enemy.type === "boss") {
            this.state.bossDefeated = true;
          }
        }
      });
    });

    this.state.bullets = this.state.bullets.filter((_, index) => !bulletsToRemove.has(index));
    this.state.enemies = this.state.enemies.filter((_, index) => !enemiesToRemove.has(index));

    const player = this.state.player;
    const collidedEnemies = new Set();

    this.state.enemies.forEach((enemy, index) => {
      if (!rectsOverlap(player, enemy)) return;
      collidedEnemies.add(index);
      this.state.health -= enemy.type === "boss" ? 2 : 1;
      this.sound?.damage?.();
      this.createBurst(player.x + player.width / 2, player.y + player.height / 2, "#fb7185", 18);
    });

    this.state.enemies = this.state.enemies.filter((enemy, index) => enemy.type === "boss" || !collidedEnemies.has(index));

    if (this.state.health <= 0) {
      this.finish("Game Over");
    }
  }

  checkWinCondition() {
    if (this.state.score >= this.levelConfig.targetScore || this.state.bossDefeated) {
      this.finish("Win");
    }
  }

  createBurst(x, y, color, amount) {
    for (let index = 0; index < amount; index += 1) {
      this.state.particles.push({
        x,
        y,
        vx: randomBetween(-90, 90),
        vy: randomBetween(-90, 90),
        radius: randomBetween(1.2, 3),
        color,
        life: randomBetween(0.25, 0.65)
      });
    }
  }

  finish(result) {
    if (this.state.finished) return;
    this.state.finished = true;
    this.state.paused = false;
    if (result === "Win") {
      this.sound?.win?.();
    } else {
      this.sound?.gameOver?.();
    }
    this.publishHud(true);
    this.onFinish?.({
      result,
      won: result === "Win",
      score: this.state.score,
      health: Math.max(0, this.state.health),
      level: this.levelConfig.level
    });
  }

  publishHud(force = false) {
    if (!force && !this.onHudChange) return;
    this.onHudChange?.({
      score: this.state.score,
      health: Math.max(0, this.state.health),
      maxHealth: this.state.maxHealth,
      paused: this.state.paused,
      finished: this.state.finished,
      bossHealth: this.getBossHealth()
    });
  }

  getBossHealth() {
    const boss = this.state.enemies.find((enemy) => enemy.type === "boss");
    if (!boss) return null;
    return {
      current: boss.health,
      max: boss.maxHealth
    };
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    this.drawBackground(ctx);
    this.drawBullets(ctx);
    this.drawEnemies(ctx);
    this.drawPlayer(ctx);
    this.drawParticles(ctx);

    if (this.state.paused) {
      this.drawOverlay(ctx, "PAUSED");
    }
  }

  drawBackground(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, this.playground.colors.backgroundStart);
    gradient.addColorStop(1, this.playground.colors.backgroundEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.save();
    for (const star of this.stars) {
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = this.playground.colors.star;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawPlayer(ctx) {
    const player = this.state.player;
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.fillStyle = "#67e8f9";
    ctx.strokeStyle = "#ecfeff";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#22d3ee";
    ctx.beginPath();
    ctx.moveTo(0, -player.height / 2);
    ctx.lineTo(player.width / 2, player.height / 2);
    ctx.lineTo(0, player.height / 3);
    ctx.lineTo(-player.width / 2, player.height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 10;
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(-5, player.height / 2 - 3, 10, 10);
    ctx.restore();
  }

  drawBullets(ctx) {
    ctx.save();
    ctx.fillStyle = this.playground.colors.bullet;
    ctx.shadowBlur = 16;
    ctx.shadowColor = this.playground.colors.bullet;
    for (const bullet of this.state.bullets) {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
    ctx.restore();
  }

  drawEnemies(ctx) {
    for (const enemy of this.state.enemies) {
      if (enemy.type === "boss") {
        this.drawBoss(ctx, enemy);
      } else {
        this.drawEnemy(ctx, enemy);
      }
    }
  }

  drawEnemy(ctx, enemy) {
    const centerX = enemy.x + enemy.width / 2;
    const centerY = enemy.y + enemy.height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(enemy.rotation);
    ctx.fillStyle = this.playground.colors.enemy;
    ctx.strokeStyle = this.playground.colors.enemyAlt;
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.playground.colors.enemy;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -enemy.height / 2);
    ctx.lineTo(enemy.width / 2, 0);
    ctx.lineTo(0, enemy.height / 2);
    ctx.lineTo(-enemy.width / 2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawBoss(ctx, boss) {
    ctx.save();
    ctx.fillStyle = this.playground.colors.enemy;
    ctx.strokeStyle = this.playground.colors.enemyAlt;
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.playground.colors.enemyAlt;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(boss.x, boss.y, boss.width, boss.height, 16);
    ctx.fill();
    ctx.stroke();

    const healthRatio = clamp(boss.health / boss.maxHealth, 0, 1);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
    ctx.fillRect(boss.x, boss.y - 14, boss.width, 6);
    ctx.fillStyle = "#86efac";
    ctx.fillRect(boss.x, boss.y - 14, boss.width * healthRatio, 6);
    ctx.restore();
  }

  drawParticles(ctx) {
    ctx.save();
    for (const particle of this.state.particles) {
      ctx.globalAlpha = clamp(particle.life * 2, 0, 1);
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawOverlay(ctx, label) {
    ctx.save();
    ctx.fillStyle = "rgba(2, 6, 23, 0.45)";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = "#e0f2fe";
    ctx.font = "800 34px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, this.width / 2, this.height / 2);
    ctx.restore();
  }
}
