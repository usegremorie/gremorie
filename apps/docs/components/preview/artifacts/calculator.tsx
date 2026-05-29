"use client";

import { useState } from "react";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gremorie/rx-display";
import { Button, Input, Label } from "@gremorie/rx-forms";
import { RotateCcw } from "lucide-react";

type Op = "+" | "-" | "*" | "/";

function compute(a: number, b: number, op: Op): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? NaN : a / b;
  }
}

export function Calculator() {
  const [a, setA] = useState(48);
  const [b, setB] = useState(12);
  const [op, setOp] = useState<Op>("+");
  const result = compute(a, b, op);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Quick calculator</CardTitle>
            <CardDescription>
              Interactive widget generated from a tool call.
            </CardDescription>
          </div>
          <Badge variant="outline">Tool widget</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="calc-a">A</Label>
            <Input
              id="calc-a"
              type="number"
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="calc-op">Operator</Label>
            <div id="calc-op" className="flex gap-1">
              {(["+", "-", "*", "/"] as Op[]).map((o) => (
                <Button
                  key={o}
                  size="sm"
                  variant={op === o ? "default" : "outline"}
                  onClick={() => setOp(o)}
                  className="flex-1 font-mono"
                  type="button"
                  aria-pressed={op === o}
                  aria-label={`Operator ${o}`}
                >
                  {o}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="calc-b">B</Label>
            <Input
              id="calc-b"
              type="number"
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-4 py-3">
          <span className="text-sm text-muted-foreground">Result</span>
          <span className="text-2xl font-mono font-semibold">
            {Number.isNaN(result) ? "-" : result}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setA(0);
            setB(0);
            setOp("+");
          }}
          className="self-start"
        >
          <RotateCcw aria-hidden="true" />
          Reset
        </Button>
      </CardContent>
    </Card>
  );
}
