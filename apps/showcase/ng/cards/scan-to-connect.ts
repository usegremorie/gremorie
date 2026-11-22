import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@gremorie/ng-core';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  QrCode,
} from '@gremorie/ng-display';

// Pairing link the code carries.
const PAIRING_URL = 'https://pocketbook.example/link/K7Q2-M9XD';

/**
 * Showcase card: pairing a phone with a personal-finance account by
 * scanning a short-lived code.
 */
@Component({
  selector: 'showcase-scan-to-connect',
  standalone: true,
  imports: [Button, Card, CardContent, CardDescription, CardTitle, QrCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-content class="flex flex-col items-center gap-6 text-center">
        <gr-qr-code aria-label="Pairing code" size="md" [value]="pairingUrl" />
        <div class="flex flex-col gap-2">
          <gr-card-title>Scan to connect your mobile device</gr-card-title>
          <gr-card-description class="text-balance">
            Open the Pocketbook app on your phone and scan this code to link
            your device. The code expires in 10 minutes.
          </gr-card-description>
        </div>
        <ai-button class="w-full" variant="secondary">Got it</ai-button>
      </gr-card-content>
    </gr-card>
  `,
})
export class ScanToConnect {
  protected readonly pairingUrl = PAIRING_URL;
}
