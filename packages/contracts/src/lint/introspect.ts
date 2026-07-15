import { Project } from 'ts-morph';

/** Prop names declared on a React `*Props` interface. */
export function extractReactProps(
  filePath: string,
  interfaceName: string,
): string[] {
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  const sf = project.addSourceFileAtPath(filePath);
  const iface = sf.getInterface(interfaceName);
  if (!iface) {
    throw new Error(
      `React interface ${interfaceName} not found in ${filePath}`,
    );
  }
  return iface.getProperties().map((p) => p.getName());
}

const IS_SIGNAL_INPUT = /^input(\.required)?\s*[<(]/;

/**
 * Input names declared on an Angular component class - both signal inputs
 * (`x = input(...)` / `input.required(...)`) and decorator inputs (`@Input()`).
 * Outputs (`output(...)`) and plain fields are excluded.
 */
export function extractAngularInputs(
  filePath: string,
  className: string,
): string[] {
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  const sf = project.addSourceFileAtPath(filePath);
  const cls = sf.getClass(className);
  if (!cls) {
    throw new Error(`Angular class ${className} not found in ${filePath}`);
  }
  return cls
    .getProperties()
    .filter((p) => {
      if (p.getDecorator('Input')) return true;
      const init = p.getInitializer();
      return init ? IS_SIGNAL_INPUT.test(init.getText().trim()) : false;
    })
    .map((p) => p.getName());
}
