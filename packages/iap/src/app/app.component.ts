import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Sidebar } from './shared/sidebar/sidebar.component';
import { TopBar } from './shared/top-bar/top-bar.component';
import { ChatShell } from './shared/chat/chat-shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Sidebar, TopBar, ChatShell],
  template: `
    <div class="flex h-screen overflow-hidden bg-background text-foreground">
      <iap-sidebar />
      <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
        <iap-top-bar />
        <iap-chat-shell class="flex-1 overflow-hidden" />
      </div>
    </div>
  `,
})
export class AppComponent {}
