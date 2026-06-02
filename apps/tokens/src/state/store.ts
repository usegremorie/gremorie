import { create } from 'zustand';
import type { Change } from '@gremorie/token-engine/serializer/apply-changes';
import type { GitStatus } from '@gremorie/token-engine/git/status';

type TokenGraph = any; // sourced from engine; refined later

export interface ProjectState {
  project: { root: string; globalsCss: string } | null;
  graph: TokenGraph | null;
  pendingChanges: Change[];
  selectedTheme: string;
  selectedMode: 'light' | 'dark';
  loading: boolean;
  error: string | null;
  gitStatus: GitStatus | null;
}

export interface ProjectActions {
  load: () => Promise<void>;
  setMode: (m: 'light' | 'dark') => void;
  toggleMode: () => void;
  setTheme: (t: string) => void;
  queueChange: (c: Change) => void;
  clearChanges: () => void;
  apply: () => Promise<{ ok: boolean; message: string }>;
}

export const useProject = create<ProjectState & ProjectActions>((set, get) => ({
  project: null,
  graph: null,
  pendingChanges: [],
  selectedTheme: 'default',
  selectedMode: 'light',
  loading: false,
  error: null,
  gitStatus: null,

  async load() {
    set({ loading: true, error: null });
    try {
      const [projectRes, gitRes] = await Promise.all([
        fetch('/api/project'),
        fetch('/api/git-status'),
      ]);
      if (!projectRes.ok) throw new Error(`HTTP ${projectRes.status}`);
      const data = await projectRes.json();
      const gs = gitRes.ok ? ((await gitRes.json()) as GitStatus) : null;
      set({
        project: data.project,
        graph: data.graph,
        gitStatus: gs,
        loading: false,
      });
    } catch (e: any) {
      set({ error: e.message ?? String(e), loading: false });
    }
  },

  setMode(m) {
    set({ selectedMode: m });
  },
  toggleMode() {
    set({ selectedMode: get().selectedMode === 'light' ? 'dark' : 'light' });
  },
  setTheme(t) {
    set({ selectedTheme: t });
  },

  queueChange(c) {
    set({ pendingChanges: [...get().pendingChanges, c] });
  },
  clearChanges() {
    set({ pendingChanges: [] });
  },

  async apply() {
    const changes = get().pendingChanges;
    if (changes.length === 0) return { ok: true, message: 'No changes' };
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ changes }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      set({ pendingChanges: [] });
      await get().load();
      return {
        ok: true,
        message: `Applied ${body.changeCount} change(s) to ${body.written}`,
      };
    } catch (e: any) {
      return { ok: false, message: e.message ?? String(e) };
    }
  },
}));
