import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScratchHelperService {

  getLastPlayed(): string[] {
    try {
      const raw = sessionStorage.getItem('scratchLastPlayed');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  saveLastPlayed(gameId: string | number): void {
    try {
      const ids = this.getLastPlayed();
      const updated = [String(gameId), ...ids.filter(id => id !== String(gameId))].slice(0, 12);
      sessionStorage.setItem('scratchLastPlayed', JSON.stringify(updated));
    } catch {}
  }

  saveFilters(search: string): void {
    sessionStorage.setItem('scratchFilters', JSON.stringify({ search }));
  }

  restoreFilters(): { search: string } {
    try {
      const raw = sessionStorage.getItem('scratchFilters');
      if (!raw) return { search: '' };
      return JSON.parse(raw);
    } catch {
      return { search: '' };
    }
  }

  clearFilters(): void {
    sessionStorage.removeItem('scratchFilters');
  }
}
