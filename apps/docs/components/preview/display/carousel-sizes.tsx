'use client';

import {
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@gremorie/rx-display';

export function CarouselSizesPreview() {
  return (
    <Carousel className="w-full max-w-sm" opts={{ align: 'start' }}>
      <CarouselContent className="-ml-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <CarouselItem key={i} className="basis-1/3 pl-2">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-3">
                <span className="text-xl font-semibold">{i + 1}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
