"use client";

import {
  Checkpoint,
  CheckpointTrigger,
  Confirmation,
  ConfirmationAccepted,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
  Context,
  ContextContent,
  ContextContentBody,
  ContextContentHeader,
  ContextTrigger,
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationText,
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorTrigger,
  Queue,
  QueueItem,
  QueueItemContent,
  QueueItemDescription,
  QueueItemIndicator,
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@gremorie/rx-ai";
import { TooltipProvider } from "@gremorie/rx-overlays";
import { Button } from "@gremorie/rx-forms";
import { GitBranch } from "lucide-react";

// ---------- Tool ----------

export function ToolRunningPreview() {
  return (
    <Tool defaultOpen>
      <ToolHeader type="tool-search" state="input-available" />
      <ToolContent>
        <ToolInput input={{ query: "gremorie registry" }} />
      </ToolContent>
    </Tool>
  );
}

export function ToolCompletedPreview() {
  return (
    <Tool defaultOpen>
      <ToolHeader type="tool-search" state="output-available" />
      <ToolContent>
        <ToolInput input={{ query: "gremorie registry" }} />
        <ToolOutput
          output={
            <pre className="text-xs">
              {JSON.stringify(
                { found: 100, hits: ["rx-message", "rx-conversation"] },
                null,
                2
              )}
            </pre>
          }
          errorText={undefined}
        />
      </ToolContent>
    </Tool>
  );
}

export function ToolErrorPreview() {
  return (
    <Tool defaultOpen>
      <ToolHeader type="tool-search" state="output-error" />
      <ToolContent>
        <ToolInput input={{ query: "missing-item" }} />
        <ToolOutput
          output={undefined}
          errorText="Registry returned 404. Item does not exist."
        />
      </ToolContent>
    </Tool>
  );
}

export function ToolApprovalPreview() {
  return (
    <Tool defaultOpen>
      <ToolHeader type="tool-delete-file" state="approval-requested" />
      <ToolContent>
        <ToolInput input={{ path: "src/old-component.tsx" }} />
      </ToolContent>
    </Tool>
  );
}

// ---------- InlineCitation ----------

export function InlineCitationPreview() {
  return (
    <p className="text-sm leading-relaxed">
      Gremorie ships 100 primitives across 9 packages
      <InlineCitation>
        <InlineCitationText> [1]</InlineCitationText>
        <InlineCitationCard>
          <InlineCitationCardTrigger sources={["https://gremorie.com"]} />
          <InlineCitationCardBody>
            <p className="text-sm font-semibold">Phase 5k release notes</p>
            <p className="text-xs text-muted-foreground">
              gremorie.com/changelog
            </p>
          </InlineCitationCardBody>
        </InlineCitationCard>
      </InlineCitation>
      , with React and Angular editions in parity.
    </p>
  );
}

// ---------- ModelSelector ----------

export function ModelSelectorPreview() {
  return (
    <ModelSelector>
      <ModelSelectorTrigger asChild>
        <Button variant="outline">Select model</Button>
      </ModelSelectorTrigger>
      <ModelSelectorContent>
        <div className="p-4 text-sm">
          <p className="font-medium">Pick a model</p>
          <p className="mt-1 text-muted-foreground">
            Models would be listed here.
          </p>
        </div>
      </ModelSelectorContent>
    </ModelSelector>
  );
}

// ---------- Context ----------

export function ContextPreview() {
  return (
    <Context usedTokens={4321} maxTokens={8000}>
      <ContextTrigger>
        <Button variant="outline" size="sm">
          4.3k / 8k tokens
        </Button>
      </ContextTrigger>
      <ContextContent>
        <ContextContentHeader>
          <p className="text-sm font-medium">Context window</p>
        </ContextContentHeader>
        <ContextContentBody>
          <p className="text-xs text-muted-foreground">
            54 percent used. Detail token breakdown would render here.
          </p>
        </ContextContentBody>
      </ContextContent>
    </Context>
  );
}

// ---------- Checkpoint ----------

export function CheckpointPreview() {
  return (
    <TooltipProvider>
      <Checkpoint className="my-4">
        <CheckpointTrigger tooltip="Branch from here">
          <GitBranch className="size-4" />
        </CheckpointTrigger>
      </Checkpoint>
    </TooltipProvider>
  );
}

export function CheckpointTooltipPreview() {
  return (
    <TooltipProvider>
      <Checkpoint className="my-4">
        <CheckpointTrigger tooltip="Restore this state">
          <GitBranch className="size-4" />
          Checkpoint
        </CheckpointTrigger>
      </Checkpoint>
    </TooltipProvider>
  );
}

// ---------- Confirmation ----------

export function ConfirmationRequestPreview() {
  return (
    <Confirmation
      approval={{ id: "1" }}
      state="approval-requested"
      className="border"
    >
      <ConfirmationTitle>Approve file write to /tmp/output.txt?</ConfirmationTitle>
      <ConfirmationRequest>
        <div className="mt-2 flex gap-2">
          <Button size="sm">Approve</Button>
          <Button size="sm" variant="outline">
            Reject
          </Button>
        </div>
      </ConfirmationRequest>
    </Confirmation>
  );
}

export function ConfirmationApprovedPreview() {
  return (
    <Confirmation
      approval={{ id: "1", approved: true }}
      state="approval-responded"
      className="border"
    >
      <ConfirmationTitle>File written</ConfirmationTitle>
      <ConfirmationAccepted>Approved by user.</ConfirmationAccepted>
    </Confirmation>
  );
}

export function ConfirmationRejectedPreview() {
  return (
    <Confirmation
      approval={{ id: "1", approved: false, reason: "Path outside workspace" }}
      state="approval-responded"
      className="border"
    >
      <ConfirmationTitle>File write rejected</ConfirmationTitle>
      <ConfirmationRejected>
        Reason: Path outside workspace
      </ConfirmationRejected>
    </Confirmation>
  );
}

// ---------- Queue ----------

export function QueuePreview() {
  return (
    <Queue>
      <QueueItem>
        <QueueItemIndicator completed />
        <QueueItemContent>Generate component scaffold</QueueItemContent>
        <QueueItemDescription>Done</QueueItemDescription>
      </QueueItem>
      <QueueItem>
        <QueueItemIndicator completed />
        <QueueItemContent>Wire MDX preview</QueueItemContent>
        <QueueItemDescription>Done</QueueItemDescription>
      </QueueItem>
      <QueueItem>
        <QueueItemIndicator />
        <QueueItemContent>Run smoke tests</QueueItemContent>
        <QueueItemDescription>Pending</QueueItemDescription>
      </QueueItem>
    </Queue>
  );
}

export function QueueSectionedPreview() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium">Backend</p>
        <Queue>
          <QueueItem>
            <QueueItemIndicator completed />
            <QueueItemContent>Migrate schema</QueueItemContent>
          </QueueItem>
          <QueueItem>
            <QueueItemIndicator />
            <QueueItemContent>Seed test data</QueueItemContent>
          </QueueItem>
        </Queue>
      </div>
      <div>
        <p className="text-sm font-medium">Frontend</p>
        <Queue>
          <QueueItem>
            <QueueItemIndicator />
            <QueueItemContent>Update routing</QueueItemContent>
          </QueueItem>
        </Queue>
      </div>
    </div>
  );
}
