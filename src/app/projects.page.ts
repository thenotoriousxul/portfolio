import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects',
  imports: [RouterLink],
  template: `
    <section class="min-h-[100dvh] w-full bg-[oklch(18%_0.02_260)] text-white flex items-center justify-center p-6">
      <div class="max-w-3xl w-full text-center">
        <h1 class="text-4xl font-bold">Proyectos</h1>
        <p class="mt-2 text-white/70">Muy pronto compartiré mis proyectos destacados aquí.</p>
        <div class="mt-6">
          <a class="underline" [routerLink]="['/']">Volver al inicio</a>
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPage {}


