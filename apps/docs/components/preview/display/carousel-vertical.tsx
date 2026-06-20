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

export function CarouselVerticalPreview() {
  return (
    <Carousel
      orientation="vertical"
      opts={{ align: 'start' }}
      className="w-full max-w-xs"
    >
      <CarouselContent className="-mt-2 h-[300px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <CarouselItem key={i} className="basis-1/3 pt-2">
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <span className="text-2xl font-semibold">{i + 1}</span>
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
