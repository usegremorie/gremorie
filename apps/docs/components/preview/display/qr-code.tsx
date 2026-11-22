'use client';

import { QrCode } from '@gremorie/rx-display';
import { SparklesIcon } from 'lucide-react';

const PAIRING_URL = 'https://pocketbook.example/link/K7Q2-M9XD';

export function QrCodePreview() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">size</span>
        <div className="flex flex-wrap items-end gap-4">
          <QrCode aria-label="Pairing code" size="sm" value={PAIRING_URL} />
          <QrCode aria-label="Pairing code" size="md" value={PAIRING_URL} />
          <QrCode aria-label="Pairing code" size="lg" value={PAIRING_URL} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground text-xs">
          error correction and center icon
        </span>
        <div className="flex flex-wrap items-end gap-4">
          <QrCode
            aria-label="Pairing code"
            ecc="L"
            size="sm"
            value={PAIRING_URL}
          />
          <QrCode
            aria-label="Pairing code"
            ecc="H"
            icon={<SparklesIcon aria-hidden="true" className="text-primary" />}
            size="sm"
            value={PAIRING_URL}
          />
        </div>
      </div>
    </div>
  );
}
