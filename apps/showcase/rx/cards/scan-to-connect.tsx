import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';

// A real, scannable code for the pairing link
// https://pocketbook.example/link/K7Q2-M9XD (29x29 modules, ECC level M),
// stored as rows of dark (1) and light (0) modules.
const QR_ROWS = [
  '11111110000011000111101111111',
  '10000010010000110000101000001',
  '10111010100110100000001011101',
  '10111010110000111100001011101',
  '10111010110111000001101011101',
  '10000010100100111010001000001',
  '11111110101010101010101111111',
  '00000000111000110010000000000',
  '10111110000011011101101111100',
  '10001000100101111111111110001',
  '00010111001110011000100100000',
  '01000000011110101010100001010',
  '01111011101000111100000001100',
  '10011101001111100011101110001',
  '10110010000100011000000101100',
  '00111101010110000001110010010',
  '01000010101000100111000001100',
  '11010101101010011111011110101',
  '10001011110000111100110100100',
  '10110100010000001001011100010',
  '10011110010110000101111110111',
  '00000000110001000110100011111',
  '11111110010111111001101011100',
  '10000010111001000011100010000',
  '10111010110100100100111110111',
  '10111010100101001111100001111',
  '10111010110001010011111111110',
  '10000010001011101000101011010',
  '11111110110010100101001011100',
];

const QR_SIZE = QR_ROWS.length;

// One square subpath per dark module.
const QR_PATH = QR_ROWS.flatMap((row, y) =>
  [...row].flatMap((bit, x) => (bit === '1' ? [`M${x} ${y}h1v1h-1z`] : [])),
).join('');

/**
 * Showcase card: pairing a phone with a personal-finance account by
 * scanning a short-lived code.
 */
export function ScanToConnect() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-6 text-center">
        {/* Scanners need dark modules on a light quiet zone in either theme,
            so the code keeps fixed black-on-white instead of theme tokens. */}
        <div className="rounded-xl bg-white p-4">
          <svg
            aria-label="Pairing code"
            className="size-40 text-black"
            role="img"
            shapeRendering="crispEdges"
            viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
          >
            <path d={QR_PATH} fill="currentColor" />
          </svg>
        </div>
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
