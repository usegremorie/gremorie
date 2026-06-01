'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from '@gremorie/rx-display';
import { Button, Input, Label } from '@gremorie/rx-forms';
import { Github } from 'lucide-react';

/**
 * Sign-in block: authentication card composing Card + Label + Input +
 * Button + Separator with a GitHub provider above the email/password
 * field group.
 */
export function SignIn() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your Gremorie account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button variant="outline" className="w-full">
          <Github aria-hidden="true" />
          Continue with GitHub
        </Button>
        <div className="relative flex items-center">
          <Separator className="flex-1" />
          <span className="mx-3 text-xs uppercase tracking-wider text-muted-foreground">
            or
          </span>
          <Separator className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="signin-email">Email</Label>
          <Input
            id="signin-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="signin-password">Password</Label>
            <button
              type="button"
              className="cursor-pointer bg-transparent p-0 text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <Input
            id="signin-password"
            type="password"
            autoComplete="current-password"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button className="w-full">Sign in</Button>
        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            className="cursor-pointer bg-transparent p-0 text-foreground underline-offset-4 hover:underline"
          >
            Create one
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
