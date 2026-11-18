'use client';

import { Button } from '@gremorie/rx-forms';
import { cn } from '@gremorie/rx-core';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/rx-overlays';
import { CheckIcon, CopyIcon } from 'lucide-react';
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { type BundledLanguage, codeToHtml, type ShikiTransformer } from 'shiki';

type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  code: string;
  language: BundledLanguage;
  showLineNumbers?: boolean;
};

type CodeBlockContextType = {
  code: string;
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: '',
});

const lineNumberTransformer: ShikiTransformer = {
  name: 'line-numbers',
  line(node, line) {
    node.children.unshift({
      type: 'element',
      tagName: 'span',
      properties: {
        className: [
          'inline-block',
          'min-w-10',
          'mr-4',
          'text-right',
          'select-none',
          'text-muted-foreground',
        ],
      },
      children: [{ type: 'text', value: String(line) }],
    });
  },
};

export async function highlightCode(
  code: string,
  language: BundledLanguage,
  showLineNumbers = false,
) {
  const transformers: ShikiTransformer[] = showLineNumbers
    ? [lineNumberTransformer]
    : [];

  // Theme choice rationale:
  //   - `github-light-default` (Odo final audit upgrade) replaces
  //     `github-light`. github-light still missed AA on a handful of
  //     punctuation / operator tokens against #fff (the 15 axe-core
  //     "serious" hits). github-light-default ships GitHub's current
  //     primer-light tokens, every token clears 4.5:1.
  //   - `github-dark-default` mirrors that on the dark side for symmetry.
  return await Promise.all([
    codeToHtml(code, {
      lang: language,
      theme: 'github-light-default',
      transformers,
    }),
    codeToHtml(code, {
      lang: language,
      theme: 'github-dark-default',
      transformers,
    }),
  ]);
}

export const CodeBlock = ({
  code,
  language,
  showLineNumbers = false,
  className,
  children,
  ...props
}: CodeBlockProps) => {
  const [html, setHtml] = useState<string>('');
  const [darkHtml, setDarkHtml] = useState<string>('');
  const mounted = useRef(false);

  useEffect(() => {
    highlightCode(code, language, showLineNumbers).then(([light, dark]) => {
      if (!mounted.current) {
        setHtml(light);
        setDarkHtml(dark);
        mounted.current = true;
      }
    });

    return () => {
      mounted.current = false;
    };
  }, [code, language, showLineNumbers]);

  return (
    <CodeBlockContext.Provider value={{ code }}>
      <div
        className={cn(
          'group relative w-full overflow-hidden rounded-md border bg-background text-foreground',
          className,
        )}
        {...props}
      >
        {/* h-full so an explicit height on the root actually reaches the
            scroller: without it the wrapper stayed content-height and a tall
            CodeBlock showed its horizontal scrollbar near the top with dead
            space beneath. Against an auto-height root, height:100% resolves
            to auto, so the default sizing is unchanged. */}
        {/* Scrollbars stay hidden until the pointer is over the code (as
            Fumadocs' code blocks): the DS bar, --border thumb, on hover. */}
        <div className="relative h-full">
          <div
            className="h-full overflow-auto [scrollbar-color:transparent_transparent] hover:[scrollbar-color:var(--border)_transparent] dark:hidden [&>pre]:m-0 [&>pre]:bg-background! [&>pre]:p-4 [&>pre]:text-foreground! [&>pre]:text-sm [&_code]:font-mono [&_code]:text-sm"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: "this is needed."
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div
            className="hidden h-full overflow-auto [scrollbar-color:transparent_transparent] hover:[scrollbar-color:var(--border)_transparent] dark:block [&>pre]:m-0 [&>pre]:bg-background! [&>pre]:p-4 [&>pre]:text-foreground! [&>pre]:text-sm [&_code]:font-mono [&_code]:text-sm"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: "this is needed."
            dangerouslySetInnerHTML={{ __html: darkHtml }}
          />
          {children && (
            <div className="absolute top-2 right-2 flex items-center gap-2">
              {children}
            </div>
          )}
        </div>
      </div>
    </CodeBlockContext.Provider>
  );
};

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
  /** Tooltip naming the action; reads "Copied" while the copied state lasts. */
  tooltip?: string;
};

export const CodeBlockCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  tooltip = 'Copy code',
  children,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { code } = useContext(CodeBlockContext);

  const copyToClipboard = async (event?: MouseEvent<HTMLButtonElement>) => {
    // Keep the tooltip open so it can say "Copied" (Radix closes it on a
    // click unless the event is marked handled).
    event?.preventDefault();
    if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) {
      onError?.(new Error('Clipboard API not available'));
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const Icon = isCopied ? CheckIcon : CopyIcon;

  // Icon-only, so it always carries a tooltip naming the action (as
  // ArtifactAction does); the name follows the copied state.
  const name = isCopied ? 'Copied' : tooltip;
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label={name}
            ref={buttonRef}
            className={cn('shrink-0', className)}
            onClick={copyToClipboard}
            onPointerDown={(e) => e.preventDefault()}
            size="icon"
            variant="ghost"
            {...props}
          >
            {children ?? <Icon size={14} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          // A press on the button itself is not "outside": stay open so the
          // tooltip can say "Copied".
          onPointerDownOutside={(e) => {
            if (buttonRef.current?.contains(e.target as Node))
              e.preventDefault();
          }}
        >
          {name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
