import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CityBackgroundComponent } from './city-background';

type Contact = {
  label: string;
  value: string;
  href?: string;
};

@Component({
  selector: 'app-home',
  imports: [CityBackgroundComponent],
  host: { '(window:scroll)': 'onScroll()' },
  template: `
    <section class="min-h-[100dvh] w-full text-white relative overflow-hidden">
      <app-city-background />

      <!-- HERO -->
      <div class="relative z-10 flex flex-col items-center px-4 pt-14 sm:pt-20">
        <!-- Foto de perfil -->
        <div class="mb-8">
          <img 
            src="/cv.jpg" 
            alt="Saúl Sánchez"
            class="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white/20"
          />
        </div>
        
        <h1 class="text-center tracking-tight leading-none text-4xl sm:text-5xl md:text-6xl" style="font-family: 'Press Start 2P', system-ui, sans-serif">
          Saúl Sánchez
        </h1>
        <p class="mt-3 text-center text-[oklch(85%_0.02_260)]/90 text-sm sm:text-base">
          Técnico Universitario en Desarrollo de Software · Torreón, Coahuila, México
        </p>

        <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
          <a class="pill neon" href="tel:+528712602834" rel="noopener" target="_blank">+52 871‑260‑2834</a>
          <a class="pill neon" href="mailto:saulsanchezlopez999@gmail.com" rel="noopener" target="_blank">Email</a>
          <a class="pill neon" href="https://github.com/thenotoriousxul" rel="noopener" target="_blank">GitHub</a>
        </div>
      </div>

      <!-- Tecnologías con iconos -->
      <div class="relative z-10 px-4 mt-10 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        @for (category of techCategories(); track category.title) {
          <div class="bg-[oklch(24%_0.02_260)]/80 backdrop-blur rounded-md border border-white/10 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
            <h2 class="font-semibold tracking-tight" style="font-family: 'Press Start 2P', system-ui, sans-serif">{{ category.title }}</h2>
            <div class="mt-3 flex flex-wrap gap-2">
              @for (item of category.items; track item.name) {
                <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-black/30 border border-white/10">
                  <i class="text-base" [class]="item.icon"></i>
                  {{ item.name }}
                </span>
              }
            </div>
          </div>
        }
      </div>

      <!-- Sobre mí -->
      <section class="relative z-10 px-4 mt-12 max-w-3xl mx-auto">
        <h2 class="text-xl font-bold" style="font-family: 'Press Start 2P', system-ui, sans-serif">About Me</h2>
        <p class="mt-3 text-white/80 leading-7">
          I'm a Software Development student with experience in web and mobile projects using technologies like Laravel, React, Node.js, and Kotlin. I'm passionate about creating innovative solutions with great design and functionality. My goal is to keep growing as a professional in the software development field, learning from experienced mentors and contributing my passion and energy to projects that make a difference. I'm interested in internship or apprenticeship opportunities that allow me to continue developing my skills and gaining practical experience in the tech industry.
        </p>
      </section>

      <!-- Experiencia -->
      <section class="relative z-10 px-4 mt-10 max-w-4xl mx-auto grid gap-3">
        <h2 class="text-xl font-bold" style="font-family: 'Press Start 2P', system-ui, sans-serif">Experience</h2>
        <div class="grid sm:grid-cols-2 gap-3">
          @for (exp of experience(); track exp.role) {
            <article class="rounded-md border border-white/10 bg-white/5 p-4">
              <h3 class="font-semibold">{{ exp.role }}</h3>
              <p class="text-white/70 text-sm">{{ exp.company }} · {{ exp.period }}</p>
              <p class="mt-2 text-sm text-white/80">{{ exp.summary }}</p>
            </article>
          }
        </div>
      </section>

      <!-- Proyectos (tarjetas pixel-art) -->
      <section class="relative z-10 px-4 mt-12 max-w-6xl mx-auto pb-12">
        <h2 class="text-xl font-bold" style="font-family: 'Press Start 2P', system-ui, sans-serif">Projects</h2>
        <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          @for (p of projects(); track p.title) {
            <a [href]="p.url" target="_blank" rel="noopener noreferrer" 
               class="group relative rounded-md border border-white/10 bg-[oklch(22%_.03_260)]/80 overflow-hidden block transition-all hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <!-- Preview -->
              <div class="aspect-video relative overflow-hidden bg-black/50">
                @if (p.isImage) {
                  <img 
                    [src]="p.preview" 
                    [alt]="p.title + ' preview'"
                    class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                } @else {
                  <iframe 
                    [src]="getSafeUrl(p.preview)" 
                    class="w-full h-full pointer-events-none"
                    loading="lazy"
                    title="Project preview"
                    style="transform: translateZ(0); backface-visibility: hidden; -webkit-backface-visibility: hidden;"
                  ></iframe>
                }
                <div class="absolute inset-0 bg-gradient-to-t from-[oklch(22%_.03_260)] via-transparent to-transparent pointer-events-none"></div>
              </div>
              
              <div class="p-6">
                <div class="flex items-center justify-between">
                  <h3 class="font-semibold text-lg">{{ p.title }}</h3>
                  <svg class="w-5 h-5 text-white/50 group-hover:text-white/90 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </div>
                <p class="mt-2 text-white/75 text-sm">{{ p.description }}</p>
                <div class="mt-4 flex flex-wrap gap-2">
                  @for (t of p.tech; track t) {
                    <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-black/30 border border-white/10">
                      <i class="text-base" [class]="iconMap()[t] || 'devicon-angular-plain'"></i>
                      {{ t }}
                    </span>
                  }
                </div>
              </div>
            </a>
          }
        </div>
      </section>
    </section>
  `,
  styles: `
    :host { display: block; }
    .pixel { image-rendering: pixelated; text-shadow: 0 0 8px oklch(80% 0.2 300 / 0.35); }
    .pill { display: inline-flex; align-items: center; gap: .4rem; border-radius: 9999px; padding: .5rem .9rem; font-weight: 600; border: 1px solid rgba(255,255,255,.15); background: rgba(255,255,255,.06); transition: transform .1s ease, box-shadow .2s ease; }
    .pill:hover { transform: translateY(-1px); }
    .neon { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
    .neon:hover { box-shadow: 0 0 12px oklch(65% .2 300 / .35), 0 0 32px oklch(65% .2 300 / .25) inset; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  constructor(private sanitizer: DomSanitizer) {}
  
  protected readonly name = signal('Saúl Sánchez');
  protected readonly iconMap = signal<Record<string, string>>({
    JavaScript: 'devicon-javascript-plain colored',
    TypeScript: 'devicon-typescript-plain colored',
    PHP: 'devicon-php-plain colored',
    'C#': 'devicon-csharp-plain colored',
    Python: 'devicon-python-plain colored',
    Kotlin: 'devicon-kotlin-plain colored',
    Swift: 'devicon-swift-plain colored',
    Laravel: 'devicon-laravel-plain colored',
    React: 'devicon-react-original colored',
    'Vue.js': 'devicon-vuejs-plain colored',
    'Node.js': 'devicon-nodejs-plain colored',
    AdonisJS: 'devicon-adonisjs-original colored',
    'Android Studio': 'devicon-androidstudio-plain colored',
    'Swift/Xcode': 'devicon-xcode-plain colored',
    'AWS EC2': 'devicon-amazonwebservices-original colored',
    'AWS S3': 'devicon-amazonwebservices-original colored',
    MySQL: 'devicon-mysql-plain colored',
    'SQL Server': 'devicon-microsoftsqlserver-plain colored',
    Git: 'devicon-git-plain colored',
    GitHub: 'devicon-github-original',
    Postman: 'devicon-postman-plain colored',
    Angular: 'devicon-angular-plain colored'
  });

  protected readonly techCategories = signal([
    { title: 'Languages', items: [
      { name: 'JavaScript', icon: this.iconMap()['JavaScript'] },
      { name: 'TypeScript', icon: this.iconMap()['TypeScript'] },
      { name: 'PHP', icon: this.iconMap()['PHP'] },
      { name: 'C#', icon: this.iconMap()['C#'] },
      { name: 'Python', icon: this.iconMap()['Python'] },
      { name: 'Kotlin', icon: this.iconMap()['Kotlin'] },
      { name: 'Swift', icon: this.iconMap()['Swift'] },
    ]},
    { title: 'Frameworks', items: [
      { name: 'Laravel', icon: this.iconMap()['Laravel'] },
      { name: 'React', icon: this.iconMap()['React'] },
      { name: 'Vue.js', icon: this.iconMap()['Vue.js'] },
      { name: 'Node.js', icon: this.iconMap()['Node.js'] },
      { name: 'AdonisJS', icon: this.iconMap()['AdonisJS'] },
    ]},
    { title: 'Mobile', items: [
      { name: 'Android Studio', icon: this.iconMap()['Android Studio'] },
      { name: 'Swift/Xcode', icon: this.iconMap()['Swift/Xcode'] },
    ]},
    { title: 'Cloud', items: [
      { name: 'AWS EC2', icon: this.iconMap()['AWS EC2'] },
      { name: 'AWS S3', icon: this.iconMap()['AWS S3'] },
    ]},
    { title: 'Databases', items: [
      { name: 'MySQL', icon: this.iconMap()['MySQL'] },
      { name: 'SQL Server', icon: this.iconMap()['SQL Server'] },
    ]},
    { title: 'Tools', items: [
      { name: 'Git', icon: this.iconMap()['Git'] },
      { name: 'GitHub', icon: this.iconMap()['GitHub'] },
      { name: 'Postman', icon: this.iconMap()['Postman'] },
    ]},
  ]);

  protected readonly experience = signal([
    { role: 'Full-Stack Developer', company: 'MINERIQ 2.0 - Universidad Tecnológica de Torreón', period: '2024', summary: 'IoT platform with Angular frontend, AdonisJS API, and Swift/Xcode iOS. Sensor visualization and mining safety monitoring.' },
    { role: 'Android Developer', company: 'MINERIQ - Universidad Tecnológica de Torreón', period: '2024', summary: 'Android app in Kotlin for mining IoT monitoring. Security and data collection in mines.' },
    { role: 'Web Developer', company: 'OZEZ TRC - Universidad Tecnológica de Torreón', period: '2024', summary: 'Website development in Laravel with Blade. Improved digital presence and product promotion.' }
  ]);

  protected readonly projects = signal([
    { 
      title: 'SINE - Sistema Integral No Escolarizado', 
      description: 'Comprehensive platform for managing non-traditional education programs, student enrollment, courses, and administrative tasks at IESIZ.', 
      tech: ['Angular', 'TypeScript', 'Laravel'], 
      url: 'https://sine.iesiz.mx/inicio',
      preview: '/sine.PNG',
      isImage: true
    },
    { 
      title: 'Zona IESIZ - English Learning Platform', 
      description: 'Interactive English learning platform with quizzes, exams, activities, and progress tracking for IESIZ students.', 
      tech: ['PHP', 'Laravel', 'MySQL'], 
      url: 'https://lince.iesiz.mx/welcome/user',
      preview: '/zonaiesiz.PNG',
      isImage: true
    }
  ]);

  // Posiciones de bandas de ciudad para simular scroll infinito
  protected readonly bandPositions = signal<number[]>(Array.from({ length: 18 }, (_, i) => i * 180));

  protected readonly title = computed(() => this.name());

  // Parallax sutil basado en scroll (vía host listeners)
  onScroll(): void {
    const y = typeof window !== 'undefined' ? (window.scrollY || 0) : 0;
    const root = document.documentElement;
    root.style.setProperty('--parallax-1', `${y * -0.02}px`);
    root.style.setProperty('--parallax-2', `${y * -0.04}px`);
    root.style.setProperty('--parallax-3', `${y * -0.06}px`);
    root.style.setProperty('--px-back', `${y * -0.03}px`);
    root.style.setProperty('--px-mid', `${y * -0.06}px`);
    root.style.setProperty('--px-front', `${y * -0.1}px`);
  }
  
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}


