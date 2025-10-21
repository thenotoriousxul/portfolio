import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SplashComponent } from './splash.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SplashComponent],
  template: `
    @if (showSplash()) {
      <app-splash (splashClosed)="onSplashClosed()" />
    }
    @if (!showSplash()) {
      <div class="app-content" [class.fade-in]="contentVisible()">
        <router-outlet />
      </div>
    }
  `,
  styles: [`
    .app-content {
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .app-content.fade-in {
      opacity: 1;
      transform: scale(1);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected showSplash = signal(true);
  protected contentVisible = signal(false);
  
  onSplashClosed(): void {
    this.showSplash.set(false);
    // Pequeño delay para activar la animación de fade-in
    setTimeout(() => {
      this.contentVisible.set(true);
    }, 50);
  }
}
