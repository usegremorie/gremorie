import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useProject } from './state/store';
import { TopBar } from './components/TopBar';
import { Layout } from './components/Layout';
import { RawColumn } from './columns/RawColumn';
import { SemanticColumn } from './columns/SemanticColumn';
import { Showcase } from './showcase/Showcase';
import { useTokenHotkeys } from './hotkeys/useHotkeys';
import { CheatSheet } from './components/CheatSheet';

export default function App() {
  const { load, loading, error, selectedMode, selectedTheme } = useProject();
  useEffect(() => {
    load();
  }, [load]);

  const [cheatOpen, setCheatOpen] = useState(false);
  useTokenHotkeys(() => setCheatOpen((v) => !v));
  useHotkeys('esc', () => setCheatOpen(false));

  return (
    <div
      data-theme={selectedTheme}
      className={`min-h-screen bg-background text-foreground ${selectedMode === 'dark' ? 'dark' : ''}`}
    >
      <TopBar />
      {loading && <p className="px-6 py-4">Loading project…</p>}
      {error && <p className="px-6 py-4 text-destructive">Error: {error}</p>}
      {!loading && !error && (
        <Layout
          editor={
            <div className="grid grid-cols-2 gap-4">
              <RawColumn />
              <SemanticColumn />
            </div>
          }
          showcase={<Showcase />}
        />
      )}
      <CheatSheet open={cheatOpen} onClose={() => setCheatOpen(false)} />
    </div>
  );
}
