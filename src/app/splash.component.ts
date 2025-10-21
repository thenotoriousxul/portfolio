import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="splash-container" 
         [class.fade-out]="isClosing"
         (click)="handleClick()"
         role="button"
         tabindex="0"
         (keydown.enter)="handleClick()"
         (keydown.space)="handleClick()">
      <canvas #coinCanvas></canvas>
      <p class="press-text" [class.pulse]="!isClosing">
        {{ pressText }}
      </p>
    </div>
  `,
  styles: [`
    .splash-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3rem;
      cursor: pointer;
      z-index: 9999;
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    
    .splash-container.fade-out {
      opacity: 0;
      transform: scale(1.1);
    }
    
    canvas {
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
    }
    
    .press-text {
      color: #ffffff;
      font-family: 'Press Start 2P', monospace, system-ui;
      font-size: 1rem;
      text-align: center;
      margin: 0;
      padding: 0 1rem;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
    
    .press-text.pulse {
      animation: pulse 2s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.6;
        transform: scale(0.98);
      }
    }
    
    @media (max-width: 640px) {
      .press-text {
        font-size: 0.75rem;
      }
    }
  `]
})
export class SplashComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('coinCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  // Output event para notificar cuando se cierra el splash
  splashClosed = output<void>();
  
  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;
  private rotation = 0;
  private coinSize = 64; // Tamaño base de la moneda
  private pixelSize = 8; // Tamaño del pixel para efecto 8-bit
  
  protected isClosing = false;
  protected pressText = 'PRESIONA PARA CONTINUAR';
  
  ngOnInit(): void {}
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCanvas();
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
    
    // Tamaño del canvas
    canvas.width = this.coinSize * 3;
    canvas.height = this.coinSize * 3;
  }
  
  handleClick(): void {
    if (this.isClosing) return;
    
    this.isClosing = true;
    
    // Esperar a que termine la animación antes de emitir el evento
    setTimeout(() => {
      this.splashClosed.emit();
    }, 800); // Coincide con la duración del fade-out
  }
  
  private drawCoin(): void {
    const canvas = this.canvasRef.nativeElement;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Limpiar canvas
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calcular el ancho de la moneda basado en la rotación (efecto 3D)
    const scale = Math.abs(Math.cos(this.rotation));
    const coinWidth = this.coinSize * scale;
    
    // Colores de la moneda dorada
    const goldColor = '#FFD700';
    const darkGoldColor = '#DAA520';
    const highlightColor = '#FFF8DC';
    
    // Dibujar círculo exterior (pixelado)
    this.drawPixelCircle(
      centerX,
      centerY,
      this.coinSize / 2,
      coinWidth / this.coinSize,
      goldColor
    );
    
    // Dibujar círculo interior (más oscuro)
    this.drawPixelCircle(
      centerX,
      centerY,
      this.coinSize / 2 - this.pixelSize * 2,
      coinWidth / this.coinSize,
      darkGoldColor
    );
    
    // Dibujar el símbolo "$" en el centro (pixelado)
    if (scale > 0.3) {
      this.drawPixelDollarSign(centerX, centerY, coinWidth / this.coinSize, highlightColor);
    }
    
    // Brillo en el borde
    if (scale > 0.7) {
      this.drawPixelHighlight(centerX, centerY - this.coinSize / 4, coinWidth / this.coinSize, highlightColor);
    }
    
    // Incrementar rotación
    this.rotation += 0.05;
  }
  
  private drawPixelCircle(centerX: number, centerY: number, radius: number, scaleX: number, color: string): void {
    this.ctx.fillStyle = color;
    
    // Dibujar círculo usando cuadrados pixelados
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      for (let r = 0; r < radius; r += this.pixelSize / 2) {
        const x = centerX + Math.cos(angle) * r * scaleX;
        const y = centerY + Math.sin(angle) * r;
        
        const distance = Math.sqrt(
          Math.pow((x - centerX) / scaleX, 2) + 
          Math.pow(y - centerY, 2)
        );
        
        if (distance <= radius) {
          this.ctx.fillRect(
            Math.floor(x / this.pixelSize) * this.pixelSize,
            Math.floor(y / this.pixelSize) * this.pixelSize,
            this.pixelSize,
            this.pixelSize
          );
        }
      }
    }
  }
  
  private drawPixelDollarSign(centerX: number, centerY: number, scaleX: number, color: string): void {
    this.ctx.fillStyle = color;
    const ps = this.pixelSize;
    
    // Patrón del símbolo "$" en 8-bit (5x7 píxeles)
    const pattern = [
      [0, 1, 1, 1, 0],
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 1, 1],
      [0, 0, 0, 1, 1],
      [1, 1, 1, 1, 0],
    ];
    
    // Línea vertical del $
    for (let i = 0; i < 9; i++) {
      const x = centerX;
      const y = centerY - ps * 4 + i * ps;
      this.ctx.fillRect(
        Math.floor(x / ps) * ps,
        Math.floor(y / ps) * ps,
        ps * scaleX,
        ps
      );
    }
    
    // Dibujar el patrón
    for (let row = 0; row < pattern.length; row++) {
      for (let col = 0; col < pattern[row].length; col++) {
        if (pattern[row][col] === 1) {
          const x = centerX + (col - 2) * ps * scaleX;
          const y = centerY + (row - 3) * ps;
          this.ctx.fillRect(
            Math.floor(x / ps) * ps,
            Math.floor(y / ps) * ps,
            ps * scaleX,
            ps
          );
        }
      }
    }
  }
  
  private drawPixelHighlight(centerX: number, centerY: number, scaleX: number, color: string): void {
    this.ctx.fillStyle = color;
    const ps = this.pixelSize;
    
    // Pequeño brillo en la parte superior
    this.ctx.fillRect(
      Math.floor(centerX / ps) * ps - ps * scaleX,
      Math.floor(centerY / ps) * ps,
      ps * 2 * scaleX,
      ps
    );
    this.ctx.fillRect(
      Math.floor(centerX / ps) * ps,
      Math.floor(centerY / ps) * ps - ps,
      ps * scaleX,
      ps
    );
  }
  
  private animate(): void {
    this.drawCoin();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

