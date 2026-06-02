import {
  SourceFile,
  SyntaxKind,
  type CallExpression,
  type ObjectLiteralExpression,
  type PropertyAssignment,
} from 'ts-morph';
import type { ComponentInfo } from '../../graph/types.js';

function unquote(s: string): string {
  return s.replace(/^["'`](.*)["'`]$/s, '$1');
}

function getStringLiteral(node: any): string | null {
  if (!node) return null;
  const kind = node.getKind();
  if (
    kind === SyntaxKind.StringLiteral ||
    kind === SyntaxKind.NoSubstitutionTemplateLiteral
  ) {
    return unquote(node.getText());
  }
  return null;
}

function findCvaCall(file: SourceFile): CallExpression | null {
  let found: CallExpression | null = null;
  file.forEachDescendant((node) => {
    if (found) return;
    if (node.getKind() !== SyntaxKind.CallExpression) return;
    const call = node as CallExpression;
    const expr = call.getExpression();
    if (expr.getText() === 'cva') found = call;
  });
  return found;
}

function objectToRecord(obj: ObjectLiteralExpression): Record<string, string> {
  const result: Record<string, string> = {};
  for (const prop of obj.getProperties()) {
    if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const pa = prop as PropertyAssignment;
    const name = pa.getName().replace(/^["']|["']$/g, '');
    const value = getStringLiteral(pa.getInitializer());
    if (value !== null) result[name] = value;
  }
  return result;
}

export function extractCvaFromFile(
  file: SourceFile,
  componentName: string,
): ComponentInfo | null {
  const call = findCvaCall(file);
  if (!call) return null;

  const args = call.getArguments();
  const baseClasses = getStringLiteral(args[0]) ?? '';

  const variants: Record<string, string[]> = {};
  const classesByVariant: Record<string, Record<string, string>> = {};
  let defaultVariants: Record<string, string> = {};

  if (args[1] && args[1].getKind() === SyntaxKind.ObjectLiteralExpression) {
    const configObj = args[1] as ObjectLiteralExpression;
    for (const prop of configObj.getProperties()) {
      if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;
      const pa = prop as PropertyAssignment;
      const key = pa.getName();
      const init = pa.getInitializer();
      if (!init || init.getKind() !== SyntaxKind.ObjectLiteralExpression)
        continue;
      const obj = init as ObjectLiteralExpression;

      if (key === 'variants') {
        for (const group of obj.getProperties()) {
          if (group.getKind() !== SyntaxKind.PropertyAssignment) continue;
          const ga = group as PropertyAssignment;
          const groupName = ga.getName();
          const inner = ga.getInitializer();
          if (!inner || inner.getKind() !== SyntaxKind.ObjectLiteralExpression)
            continue;
          const classes = objectToRecord(inner as ObjectLiteralExpression);
          classesByVariant[groupName] = classes;
          variants[groupName] = Object.keys(classes);
        }
      } else if (key === 'defaultVariants') {
        defaultVariants = objectToRecord(obj);
      }
    }
  }

  return {
    name: componentName,
    sourceFile: file.getFilePath(),
    variants,
    defaultVariants,
    classesByVariant,
    baseClasses,
  };
}
