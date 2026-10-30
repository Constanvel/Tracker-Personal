"use client";

import { useLayoutEffect, useRef, useState, type ComponentProps } from "react";
import { useDemo, type SessionDraft } from "@/components/demo-provider";

type Props = ComponentProps<"form"> & { draftKey: string };

export function SessionDraftForm({ draftKey, onInput, onChange, onReset, children, ...props }: Props) {
  const { getDraft, saveDraft, clearDraft } = useDemo();
  const formRef = useRef<HTMLFormElement>(null);
  const [initialDraft] = useState(() => getDraft(draftKey));

  useLayoutEffect(() => {
    if (!initialDraft || !formRef.current) return;
    for (const control of Array.from(formRef.current.elements)) {
      if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement)) continue;
      const value = initialDraft[control.name];
      if (value === undefined || control instanceof HTMLInputElement && control.type === "file") continue;
      if (control instanceof HTMLInputElement && control.type === "checkbox") control.checked = Boolean(value);
      else control.value = String(value);
    }
  }, [initialDraft]);

  function capture(form: HTMLFormElement) {
    const draft: SessionDraft = {};
    for (const control of Array.from(form.elements)) {
      if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement) || !control.name) continue;
      if (control instanceof HTMLInputElement && control.type === "file") continue;
      draft[control.name] = control instanceof HTMLInputElement && control.type === "checkbox" ? control.checked : control.value;
    }
    saveDraft(draftKey, draft);
  }

  return (
    <form
      {...props}
      ref={formRef}
      onInput={(event) => { onInput?.(event); capture(event.currentTarget); }}
      onChange={(event) => { onChange?.(event); capture(event.currentTarget); }}
      onReset={(event) => { onReset?.(event); if (!event.defaultPrevented) clearDraft(draftKey); }}
    >
      {children}
    </form>
  );
}
