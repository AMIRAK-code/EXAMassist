import { Alert } from '@/components/ui';

/** Outcomes of the results and notebook forms, shown after their redirect. */
const NOTICES: Record<string, { tone: 'positive' | 'caution' | 'info'; text: string }> = {
  'labels-saved': { tone: 'positive', text: 'Labels saved. They are private and do not change your result.' },
  'nothing-to-retry': {
    tone: 'caution',
    text: 'There was nothing to retry: those questions are being revised, or they were not ones you missed.',
  },
  'rate-limited': { tone: 'caution', text: 'Too many sessions were started in a short time. Try again in a few minutes.' },
  'insufficient-content': {
    tone: 'caution',
    text: 'Not enough new questions are left for that session. The options on this page show what is available now.',
  },
  'not-a-mistake': { tone: 'info', text: 'Only a question you got wrong or left blank can be labelled.' },
  'not-found': { tone: 'caution', text: 'That question is not in one of your finished sessions.' },
};

export function LearningNotice({ code, className }: { code: string | string[] | undefined; className?: string }) {
  const key = Array.isArray(code) ? code[0] : code;
  const notice = key ? NOTICES[key] : undefined;
  if (!notice) return null;
  return (
    <Alert tone={notice.tone} role="status" className={className}>
      <p>{notice.text}</p>
    </Alert>
  );
}
