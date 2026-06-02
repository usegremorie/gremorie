import { useHotkeys } from 'react-hotkeys-hook';
import { useProject } from '../state/store';

export function useTokenHotkeys(onShowCheatsheet: () => void) {
  const toggleMode = useProject((s) => s.toggleMode);
  const apply = useProject((s) => s.apply);

  useHotkeys(
    'mod+shift+l',
    (e) => {
      e.preventDefault();
      toggleMode();
    },
    [toggleMode],
  );
  useHotkeys(
    'mod+s',
    (e) => {
      e.preventDefault();
      apply();
    },
    [apply],
  );
  useHotkeys(
    'shift+/',
    (e) => {
      e.preventDefault();
      onShowCheatsheet();
    },
    [onShowCheatsheet],
  );
}
