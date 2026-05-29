"use client";

import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gremorie/rx-display";
import { Button, Input, Label, Slider, Switch } from "@gremorie/rx-forms";

/**
 * Settings form block: profile + notifications + appearance card
 * stack with a sticky save bar. Composes Card, Avatar, Input, Label,
 * Switch, Slider, and Button.
 */
export function SettingsForm() {
  const [radius, setRadius] = useState(8);
  const [fontScale, setFontScale] = useState(1);

  const notifications: Array<{ id: string; label: string; on: boolean }> = [
    { id: "n-product", label: "Product updates", on: true },
    { id: "n-billing", label: "Billing alerts", on: true },
    { id: "n-newsletter", label: "Weekly newsletter", on: false },
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your profile and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your public information.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback>KN</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Change avatar
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-name">Name</Label>
              <Input id="settings-name" defaultValue="Kira Nerys" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-email">Email</Label>
              <Input
                id="settings-email"
                type="email"
                defaultValue="kira@gremorie.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Pick what reaches your inbox.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {notifications.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between gap-4"
            >
              <Label htmlFor={row.id} className="text-sm font-normal">
                {row.label}
              </Label>
              <Switch id={row.id} defaultChecked={row.on} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Tune the visual feel.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-normal">Border radius</Label>
              <span className="font-mono text-xs text-muted-foreground">
                {radius}px
              </span>
            </div>
            <Slider
              value={[radius]}
              min={0}
              max={24}
              step={1}
              onValueChange={(v) => setRadius(v[0] ?? 0)}
              thumbAriaLabel="Border radius"
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-normal">Font scale</Label>
              <span className="font-mono text-xs text-muted-foreground">
                {fontScale.toFixed(2)}x
              </span>
            </div>
            <Slider
              value={[fontScale]}
              min={0.9}
              max={1.1}
              step={0.01}
              onValueChange={(v) => setFontScale(v[0] ?? 1)}
              thumbAriaLabel="Font scale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t bg-background/90 px-2 py-3 backdrop-blur">
        <Button variant="ghost">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
}
