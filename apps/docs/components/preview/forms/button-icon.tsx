'use client';

import { Button } from '@gremorie/rx-forms';
import { Download } from 'lucide-react';

export function ButtonIconPreview() {
  return (
    <Button>
      <Download />
      Download report
    </Button>
  );
}
