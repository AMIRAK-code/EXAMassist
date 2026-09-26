'use client';

import type { ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui';

/**
 * A form's submit button that shows it is working while the form posts, and
 * cannot be pressed twice. Without JavaScript it is a plain submit button.
 */
export function SubmitButton({
  pendingLabel,
  children,
  ...props
}: Omit<ComponentProps<typeof Button>, 'type' | 'loading'> & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} {...props}>
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
}
