'use client';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
  RadioGroup,
  RadioGroupItem,
} from '@gremorie/rx-forms';

export function FieldChoiceCardPreview() {
  return (
    <div className="mx-auto w-full max-w-md">
      <FieldGroup>
        <FieldSet>
          <FieldLabel htmlFor="field-compute">Compute environment</FieldLabel>
          <FieldDescription>
            Select the compute environment for your cluster.
          </FieldDescription>
          <RadioGroup defaultValue="kubernetes" id="field-compute">
            <FieldLabel htmlFor="field-kubernetes">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Kubernetes</FieldTitle>
                  <FieldDescription>
                    Run GPU workloads on a K8s configured cluster.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="kubernetes" id="field-kubernetes" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="field-vm">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Virtual machine</FieldTitle>
                  <FieldDescription>
                    Access a VM configured cluster to run GPU workloads.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="vm" id="field-vm" />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  );
}
