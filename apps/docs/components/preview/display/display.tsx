"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Separator,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gremorie/rx-display";
import { Button } from "@gremorie/rx-forms";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

// ---------- Accordion ----------

export function AccordionPreview() {
  return (
    <Accordion type="single" collapsible defaultValue="reg" className="w-full">
      <AccordionItem value="reg">
        <AccordionTrigger>What is the registry?</AccordionTrigger>
        <AccordionContent>
          The registry is the single source of truth for Gremorie primitives.
          Each item lists its files, dependencies, and peers so an agent can
          install it deterministically.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="mcp">
        <AccordionTrigger>What does the MCP server do?</AccordionTrigger>
        <AccordionContent>
          It exposes the registry as MCP tools so any compatible client can
          search, read, and apply Gremorie items.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="rx">
        <AccordionTrigger>What is rx-?</AccordionTrigger>
        <AccordionContent>
          rx- is the React edition prefix. ng- is the Angular edition prefix.
          Both ship side by side.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// ---------- Avatar ----------

export function AvatarPreview() {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src="https://avatars.githubusercontent.com/u/41934312?v=4" alt="@kalvner" />
        <AvatarFallback>KA</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>KA</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>NG</AvatarFallback>
      </Avatar>
    </div>
  );
}

// ---------- Badge ----------

export function BadgePreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  );
}

// ---------- Card ----------

export function CardPreview() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Welcome to Gremorie</CardTitle>
        <CardDescription>
          AI-native design system, registry first.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Compose primitives directly. Skip the lock-in.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Get started</Button>
      </CardFooter>
    </Card>
  );
}

// ---------- Carousel ----------

export function CarouselPreview() {
  return (
    <Carousel className="w-full max-w-sm">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, i) => (
          <CarouselItem key={i}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <span className="text-4xl font-semibold">{i + 1}</span>
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

// ---------- Collapsible ----------

export function CollapsiblePreview() {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-md">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          What's inside Gremorie?
          <ChevronDown
            className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 rounded-md border p-4 text-sm">
        100 primitives across 9 React packages and 4 Angular packages, plus the
        token engine, registry, and MCP handler.
      </CollapsibleContent>
    </Collapsible>
  );
}

// ---------- Separator ----------

export function SeparatorPreview() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">Gremorie</p>
      <p className="text-xs text-muted-foreground">AI-native design system</p>
      <Separator className="my-2" />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Docs</span>
        <Separator orientation="vertical" className="h-4" />
        <span>Registry</span>
        <Separator orientation="vertical" className="h-4" />
        <span>MCP</span>
      </div>
    </div>
  );
}

// ---------- Table ----------

const REGISTRY_ITEMS = [
  { id: "rx-message", category: "AI", deps: 4 },
  { id: "rx-button", category: "Forms", deps: 1 },
  { id: "rx-card", category: "Display", deps: 0 },
  { id: "rx-area-chart", category: "Data", deps: 2 },
  { id: "rx-alert", category: "Feedback", deps: 1 },
];

export function TablePreview() {
  return (
    <Table>
      <TableCaption>A sample of registry items.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Deps</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {REGISTRY_ITEMS.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-mono">{item.id}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell className="text-right">{item.deps}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
