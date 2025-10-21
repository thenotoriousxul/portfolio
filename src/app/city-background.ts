import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-city-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="city-background-container">
      <canvas #cityCanvas></canvas>
    </div>
  `,
  styles: [`
    .city-background-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      overflow: hidden;
      pointer-events: none;
    }
    
    canvas {
      width: 100%;
      height: 100%;
      display: block;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
  `]
})
export class CityBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cityCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;
  private stars: Star[] = [];
  private asteroids: Asteroid[] = [];
  private satellites: Satellite[] = [];
  private galaxies: Galaxy[] = [];
  private planets: Planet[] = [];
  private pixelSize = 4;
  
  ngOnInit(): void {}
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCanvas();
      this.generateSpace();
      this.animate();
    }, 0);
  }
  
  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
  
  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }
  
  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.generateSpace();
  }
  
  private generateSpace(): void {
    this.generateStars();
    this.generateGalaxies();
    this.generatePlanets();
    this.generateAsteroids();
    this.generateSatellites();
  }
  
  private generateStars(): void {
    this.stars = [];
    const canvas = this.canvasRef.nativeElement;
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.floor(Math.random() * 3) + 1,
        twinkle: Math.random() > 0.5,
        brightness: Math.random(),
        speed: Math.random() * 0.1
      });
    }
  }
  
  private generateGalaxies(): void {
    this.galaxies = [];
    const canvas = this.canvasRef.nativeElement;
    const galaxyCount = 3;
    
    for (let i = 0; i < galaxyCount; i++) {
      this.galaxies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.floor(Math.random() * 20) + 30,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.002,
        color: this.getRandomGalaxyColor()
      });
    }
  }
  
  private generatePlanets(): void {
    this.planets = [];
    const canvas = this.canvasRef.nativeElement;
    const planetCount = 2;
    
    for (let i = 0; i < planetCount; i++) {
      this.planets.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.floor(Math.random() * 15) + 20,
        color: this.getRandomPlanetColor(),
        hasRing: Math.random() > 0.5,
        ringColor: '#8B7355'
      });
    }
  }
  
  private generateAsteroids(): void {
    this.asteroids = [];
    const canvas = this.canvasRef.nativeElement;
    const asteroidCount = 15;
    
    for (let i = 0; i < asteroidCount; i++) {
      this.asteroids.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.floor(Math.random() * 8) + 4,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        shape: Math.floor(Math.random() * 3)
      });
    }
  }
  
  private generateSatellites(): void {
    this.satellites = [];
    const canvas = this.canvasRef.nativeElement;
    const satelliteCount = 4;
    
    for (let i = 0; i < satelliteCount; i++) {
      this.satellites.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        blinkState: Math.random() > 0.5
      });
    }
  }
  
  private getRandomGalaxyColor(): string {
    const colors = ['#9D4EDD', '#7209B7', '#F72585', '#4361EE', '#3A86FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  private getRandomPlanetColor(): string {
    const colors = ['#E07A5F', '#81B29A', '#F2CC8F', '#3D5A80', '#98C1D9'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  private drawSpace(): void {
    const canvas = this.canvasRef.nativeElement;
    
    // Gradiente de espacio profundo
    const gradient = this.ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width
    );
    gradient.addColorStop(0, '#0a0a1a');
    gradient.addColorStop(0.5, '#050510');
    gradient.addColorStop(1, '#000000');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  private drawStars(): void {
    this.stars.forEach(star => {
      const opacity = star.twinkle 
        ? (Math.sin(Date.now() * 0.003 + star.brightness * 10) + 1) / 2 
        : 1;
      
      this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      this.ctx.fillRect(
        Math.floor(star.x / this.pixelSize) * this.pixelSize,
        Math.floor(star.y / this.pixelSize) * this.pixelSize,
        star.size,
        star.size
      );
      
      // Mover estrellas lentamente para efecto de profundidad
      star.x += star.speed;
      if (star.x > this.canvasRef.nativeElement.width) {
        star.x = 0;
      }
    });
  }
  
  private drawGalaxies(): void {
    this.galaxies.forEach(galaxy => {
      const centerX = galaxy.x;
      const centerY = galaxy.y;
      
      // Dibujar galaxia espiral pixelada
      for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 4 + galaxy.rotation;
        const distance = (i / 50) * galaxy.size;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        const opacity = 1 - (i / 50);
        this.ctx.fillStyle = `${galaxy.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
        
        this.ctx.fillRect(
          Math.floor(x / this.pixelSize) * this.pixelSize,
          Math.floor(y / this.pixelSize) * this.pixelSize,
          this.pixelSize * 2,
          this.pixelSize * 2
        );
      }
      
      // Núcleo brillante
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillRect(
        Math.floor(centerX / this.pixelSize) * this.pixelSize,
        Math.floor(centerY / this.pixelSize) * this.pixelSize,
        this.pixelSize * 3,
        this.pixelSize * 3
      );
      
      galaxy.rotation += galaxy.rotationSpeed;
    });
  }
  
  private drawPlanets(): void {
    this.planets.forEach(planet => {
      // Dibujar planeta pixelado (círculo)
      this.ctx.fillStyle = planet.color;
      
      for (let y = -planet.radius; y <= planet.radius; y += this.pixelSize) {
        for (let x = -planet.radius; x <= planet.radius; x += this.pixelSize) {
          const distance = Math.sqrt(x * x + y * y);
          if (distance <= planet.radius) {
            this.ctx.fillRect(
              Math.floor((planet.x + x) / this.pixelSize) * this.pixelSize,
              Math.floor((planet.y + y) / this.pixelSize) * this.pixelSize,
              this.pixelSize,
              this.pixelSize
            );
          }
        }
      }
      
      // Sombra/luz
      const shadowColor = '#00000066';
      this.ctx.fillStyle = shadowColor;
      for (let y = -planet.radius / 2; y <= planet.radius; y += this.pixelSize) {
        for (let x = planet.radius / 4; x <= planet.radius; x += this.pixelSize) {
          const distance = Math.sqrt(x * x + y * y);
          if (distance <= planet.radius) {
            this.ctx.fillRect(
              Math.floor((planet.x + x) / this.pixelSize) * this.pixelSize,
              Math.floor((planet.y + y) / this.pixelSize) * this.pixelSize,
              this.pixelSize,
              this.pixelSize
            );
          }
        }
      }
      
      // Anillo si tiene
      if (planet.hasRing) {
        this.ctx.fillStyle = planet.ringColor;
        const ringWidth = planet.radius * 1.5;
        const ringHeight = planet.radius * 0.3;
        
        for (let x = -ringWidth; x <= ringWidth; x += this.pixelSize) {
          for (let y = -ringHeight; y <= ringHeight; y += this.pixelSize) {
            const distance = Math.sqrt((x / ringWidth) ** 2 + (y / ringHeight) ** 2);
            if (distance > 0.7 && distance < 1) {
              const px = planet.x + x;
              const py = planet.y + y;
              
              // No dibujar si está detrás del planeta
              const planetDist = Math.sqrt((px - planet.x) ** 2 + (py - planet.y) ** 2);
              if (planetDist > planet.radius || py < planet.y) {
                this.ctx.fillRect(
                  Math.floor(px / this.pixelSize) * this.pixelSize,
                  Math.floor(py / this.pixelSize) * this.pixelSize,
                  this.pixelSize,
                  this.pixelSize
                );
              }
            }
          }
        }
      }
    });
  }
  
  private drawAsteroids(): void {
    const canvas = this.canvasRef.nativeElement;
    
    this.asteroids.forEach(asteroid => {
      this.ctx.fillStyle = '#8B7355';
      
      // Diferentes formas de asteroides
      if (asteroid.shape === 0) {
        // Cuadrado irregular
        this.ctx.fillRect(
          Math.floor(asteroid.x / this.pixelSize) * this.pixelSize,
          Math.floor(asteroid.y / this.pixelSize) * this.pixelSize,
          asteroid.size,
          asteroid.size
        );
      } else if (asteroid.shape === 1) {
        // Forma en L
        this.ctx.fillRect(
          Math.floor(asteroid.x / this.pixelSize) * this.pixelSize,
          Math.floor(asteroid.y / this.pixelSize) * this.pixelSize,
          asteroid.size,
          asteroid.size * 1.5
        );
        this.ctx.fillRect(
          Math.floor(asteroid.x / this.pixelSize) * this.pixelSize,
          Math.floor(asteroid.y / this.pixelSize) * this.pixelSize,
          asteroid.size * 1.5,
          asteroid.size
        );
      } else {
        // Forma irregular
        for (let i = 0; i < 4; i++) {
          const angle = (Math.PI * 2 / 4) * i + asteroid.rotation;
          const px = asteroid.x + Math.cos(angle) * asteroid.size * 0.7;
          const py = asteroid.y + Math.sin(angle) * asteroid.size * 0.7;
          this.ctx.fillRect(
            Math.floor(px / this.pixelSize) * this.pixelSize,
            Math.floor(py / this.pixelSize) * this.pixelSize,
            this.pixelSize * 2,
            this.pixelSize * 2
          );
        }
      }
      
      // Detalles (cráteres)
      this.ctx.fillStyle = '#6B5345';
      this.ctx.fillRect(
        Math.floor((asteroid.x + 2) / this.pixelSize) * this.pixelSize,
        Math.floor((asteroid.y + 2) / this.pixelSize) * this.pixelSize,
        this.pixelSize,
        this.pixelSize
      );
      
      // Mover asteroide
      asteroid.x += asteroid.speedX;
      asteroid.y += asteroid.speedY;
      asteroid.rotation += asteroid.rotationSpeed;
      
      // Wrap around
      if (asteroid.x < -asteroid.size) asteroid.x = canvas.width + asteroid.size;
      if (asteroid.x > canvas.width + asteroid.size) asteroid.x = -asteroid.size;
      if (asteroid.y < -asteroid.size) asteroid.y = canvas.height + asteroid.size;
      if (asteroid.y > canvas.height + asteroid.size) asteroid.y = -asteroid.size;
    });
  }
  
  private drawSatellites(): void {
    const canvas = this.canvasRef.nativeElement;
    
    this.satellites.forEach(satellite => {
      const ps = this.pixelSize;
      
      // Cuerpo principal del satélite
      this.ctx.fillStyle = '#C0C0C0';
      this.ctx.fillRect(
        Math.floor(satellite.x / ps) * ps,
        Math.floor(satellite.y / ps) * ps,
        ps * 4,
        ps * 3
      );
      
      // Paneles solares
      this.ctx.fillStyle = '#4169E1';
      this.ctx.fillRect(
        Math.floor((satellite.x - ps * 3) / ps) * ps,
        Math.floor((satellite.y + ps) / ps) * ps,
        ps * 2,
        ps
      );
      this.ctx.fillRect(
        Math.floor((satellite.x + ps * 5) / ps) * ps,
        Math.floor((satellite.y + ps) / ps) * ps,
        ps * 2,
        ps
      );
      
      // Antena
      this.ctx.fillStyle = '#808080';
      this.ctx.fillRect(
        Math.floor((satellite.x + ps * 2) / ps) * ps,
        Math.floor((satellite.y - ps * 2) / ps) * ps,
        ps,
        ps * 2
      );
      
      // Luz parpadeante
      if (satellite.blinkState) {
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(
          Math.floor((satellite.x + ps) / ps) * ps,
          Math.floor((satellite.y + ps) / ps) * ps,
          ps,
          ps
        );
      }
      
      // Toggle blink cada cierto tiempo
      if (Math.random() > 0.97) {
        satellite.blinkState = !satellite.blinkState;
      }
      
      // Mover satélite
      satellite.x += satellite.speedX;
      satellite.y += satellite.speedY;
      
      // Wrap around
      if (satellite.x < -ps * 10) satellite.x = canvas.width + ps * 10;
      if (satellite.x > canvas.width + ps * 10) satellite.x = -ps * 10;
      if (satellite.y < -ps * 10) satellite.y = canvas.height + ps * 10;
      if (satellite.y > canvas.height + ps * 10) satellite.y = -ps * 10;
    });
  }
  
  private animate(): void {
    this.drawSpace();
    this.drawGalaxies();
    this.drawStars();
    this.drawPlanets();
    this.drawAsteroids();
    this.drawSatellites();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

interface Star {
  x: number;
  y: number;
  size: number;
  twinkle: boolean;
  brightness: number;
  speed: number;
}

interface Galaxy {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

interface Planet {
  x: number;
  y: number;
  radius: number;
  color: string;
  hasRing: boolean;
  ringColor: string;
}

interface Asteroid {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  shape: number;
}

interface Satellite {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  blinkState: boolean;
}

