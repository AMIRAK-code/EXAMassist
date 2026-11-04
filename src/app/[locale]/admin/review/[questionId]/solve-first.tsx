'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { Alert, Button, Card } from '@/components/ui';

/**
 * Solve it before reading the key.
 *
 * The guide asks reviewers to work each question out themselves first
 * (docs/EXPERT-REVIEW.md). A page that shows the key in green from the start
 * makes that hard, so the key, the explanation, the notes on each wrong choice
 * and the AI's working stay hidden until the reviewer picks an answer or
 * chooses to see it. Their pick is compared with the key, and a disagreement
 * is said plainly: that is the question to look at hardest.
 *
 * Nothing here is recorded or enforced on the server. It is a reading aid.
 */

interface SolveState {
  revealed: boolean;
  choice: string | null;
  reveal: (choice: string | null) => void;
}

const SolveContext = createContext<SolveState | null>(null);

/** Whether the answer is showing. Outside a provider it always is. */
export function useAnswerRevealed(): boolean {
  return useContext(SolveContext)?.revealed ?? true;
}

export function SolveFirstProvider({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  return (
    <SolveContext.Provider
      value={{
        revealed,
        choice,
        reveal: (picked) => {
          setChoice(picked);
          setRevealed(true);
        },
      }}
    >
      {children}
    </SolveContext.Provider>
  );
}

export interface SolveOption {
  id: string;
  label: string;
  content: ReactNode;
}

/**
 * The choices as buttons until the reviewer answers; then `answered`, the
 * full server-rendered list with the key and the notes on each wrong choice.
 */
export function SolveChoices({
  options,
  keyIds,
  keyDescription,
  answered,
}: {
  options: SolveOption[];
  keyIds: string[];
  keyDescription: string;
  answered: ReactNode;
}) {
  const state = useContext(SolveContext);
  if (!state || state.revealed) {
    const picked = state?.choice ? options.find((option) => option.id === state.choice) : null;
    return (
      <>
        {picked ? (
          keyIds.includes(picked.id) ? (
            <Alert tone="positive" className="mb-4" role="status">
              <p>You chose {picked.label}, which is the keyed answer.</p>
            </Alert>
          ) : (
            <Alert tone="negative" className="mb-4" role="status" title="Your answer differs from the key">
              <p>
                You chose {picked.label}; the key says {keyDescription}. Either the key is wrong, the question allows
                more than one defensible answer, or the wording led you astray. Each of those is a reason to request
                changes, unless on a second look you agree with the key.
              </p>
            </Alert>
          )
        ) : null}
        {answered}
      </>
    );
  }

  return (
    <div>
      {options.length > 0 ? (
        <>
          <p className="mb-3 text-sm text-ink-muted">Solve it first: choose the answer you would give. The key appears after.</p>
          <ul className="space-y-2 text-sm">
            {options.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  onClick={() => state.reveal(option.id)}
                  className="flex w-full gap-3 rounded-card border border-line p-3 text-start hover:border-ink focus-visible:border-ink"
                >
                  <span className="font-semibold">{option.label}</span>
                  <span className="question-text min-w-0 flex-1">{option.content}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mb-3 text-sm text-ink-muted">Work out the answer yourself first, then show the key.</p>
      )}
      <Button type="button" variant="quiet" size="sm" className="mt-3" onClick={() => state.reveal(null)}>
        Show the answer without choosing
      </Button>
    </div>
  );
}

/** Content that gives the answer away: hidden, with a placeholder, until the reviewer has answered. */
export function WhenAnswered({ children, title }: { children: ReactNode; title: string }) {
  const revealed = useAnswerRevealed();
  if (revealed) return <>{children}</>;
  return (
    <Card className="mt-4" padding="lg">
      <p className="text-sm text-ink-muted">{title} appears once you have answered the question above.</p>
    </Card>
  );
}
