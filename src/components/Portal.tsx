import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

/** Renders dialogs/panels on <body> so page transforms never trap position:fixed */
export function Portal({ children }: { children: ReactNode }) {
  return createPortal(children, document.body);
}
