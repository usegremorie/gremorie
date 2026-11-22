import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  QrCode,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';

// Pairing link the code carries.
const PAIRING_URL = 'https://pocketbook.example/link/K7Q2-M9XD';

/**
 * Showcase card: pairing a phone with a personal-finance account by
 * scanning a short-lived code.
 */
export function ScanToConnect() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-6 text-center">
        <QrCode aria-label="Pairing code" size="md" value={PAIRING_URL} />
        <div className="flex flex-col gap-2">
          <CardTitle>Scan to connect your mobile device</CardTitle>
          <CardDescription className="text-balance">
            Open the Pocketbook app on your phone and scan this code to link
            your device. The code expires in 10 minutes.
          </CardDescription>
        </div>
        <Button className="w-full" variant="secondary">
          Got it
        </Button>
      </CardContent>
    </Card>
  );
}
