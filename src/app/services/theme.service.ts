import { Injectable, Signal, computed, effect, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_THEME } from '../constants/storage.service.constants';

type Theme = 'bingo-light' | 'bingo-dark';
type IconState = 'dark_mode' | 'light_mode';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageService = inject(StorageService);

  // Usando Angular Signals para reatividade
  private readonly _theme = signal<Theme>('bingo-light');
  private readonly _iconState = signal<IconState>('dark_mode');

  // Signals públicos somente leitura
  public readonly theme: Signal<Theme> = this._theme.asReadonly();
  public readonly iconState: Signal<IconState> = this._iconState.asReadonly();

  // Computed para verificar se está no modo escuro
  public readonly isDarkMode = computed(() => this._theme() === 'bingo-dark');

  constructor() {
    this.initializeTheme();
    this.setupThemeEffect();
  }

  private initializeTheme(): void {
    const savedTheme = this.storageService.getItem(STORAGE_THEME) as Theme;

    if (savedTheme && this.isValidTheme(savedTheme)) {
      this._theme.set(savedTheme);
      this._iconState.set(savedTheme === 'bingo-dark' ? 'light_mode' : 'dark_mode');
    }
  }

  private setupThemeEffect(): void {
    // Effect para aplicar o tema automaticamente quando mudado
    effect(() => {
      const currentTheme = this._theme();
      this.applyThemeToDocument(currentTheme);
    });
  }

  private applyThemeToDocument(theme: Theme): void {
    // Remove todos os temas possíveis
    document.body.classList.remove('bingo-light', 'bingo-dark');
    // Adiciona o tema atual
    document.body.classList.add(theme);
  }

  private isValidTheme(theme: string): theme is Theme {
    return theme === 'bingo-light' || theme === 'bingo-dark';
  }

  public toggleTheme(): void {
    const newTheme: Theme = this._theme() === 'bingo-dark' ? 'bingo-light' : 'bingo-dark';
    const newIconState: IconState = newTheme === 'bingo-dark' ? 'light_mode' : 'dark_mode';

    this._theme.set(newTheme);
    this._iconState.set(newIconState);

    // Salva no storage
    this.storageService.setItem(STORAGE_THEME, newTheme);
  }

  public setTheme(theme: Theme): void {
    if (this.isValidTheme(theme)) {
      const newIconState: IconState = theme === 'bingo-dark' ? 'light_mode' : 'dark_mode';

      this._theme.set(theme);
      this._iconState.set(newIconState);

      this.storageService.setItem(STORAGE_THEME, theme);
    }
  }

  // Método para obter o tema atual como string (para compatibilidade)
  public getCurrentTheme(): Theme {
    return this._theme();
  }

  // Método para obter o estado do ícone atual como string (para compatibilidade)
  public getCurrentIconState(): IconState {
    return this._iconState();
  }
}
