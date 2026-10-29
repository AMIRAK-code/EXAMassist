'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Alert, Button, Card, fieldClass } from '@/components/ui';

/**
 * Recording, or correcting, a result from an official practice test. Each
 * field takes the score exactly as the test maker's tool reported it, on that
 * test version's own scale; a section left blank stays blank. The server
 * checks everything again (src/lib/learning/official-scores.ts).
 */

interface Scale {
  min: number;
  max: number;
  step: number;
}

export interface FormVersion {
  key: string;
  label: string;
  overall: { label: string; scale: Scale } | null;
  sections: Array<{ key: string; label: string; scale: Scale }>;
}

export interface FormRecord {
  id: string;
  scaleKey: string;
  providerKey: string;
  testName: string;
  takenOn: string;
  overallScore: number | null;
  sectionScores: Record<string, number>;
  notes: string | null;
}

type ErrorState = { code: string | null; field: string | null; min?: number; max?: number; step?: number; expected?: number };

export function OfficialScoreForm({
  examKey,
  versions,
  providers,
  initial,
  today,
}: {
  examKey: string;
  versions: FormVersion[];
  providers: Array<{ key: string; name: string; note: string }>;
  initial: FormRecord | null;
  today: string;
}) {
  const t = useTranslations('learning.officialScores');
  const router = useRouter();
  const id = useId();
  const [scaleKey, setScaleKey] = useState(initial?.scaleKey ?? versions[0].key);
  const [providerKey, setProviderKey] = useState(initial?.providerKey ?? providers[0].key);
  const [testName, setTestName] = useState(initial?.testName ?? '');
  const [takenOn, setTakenOn] = useState(initial?.takenOn ?? '');
  const [overall, setOverall] = useState(initial?.overallScore === null || !initial ? '' : String(initial.overallScore));
  const [sections, setSections] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(initial?.sectionScores ?? {}).map(([k, v]) => [k, String(v)])),
  );
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState<ErrorState | null>(null);

  const version = versions.find((v) => v.key === scaleKey) ?? versions[0];
  const provider = providers.find((p) => p.key === providerKey) ?? providers[0];
  const back = `/study-plan/scores?exam=${encodeURIComponent(examKey)}`;

  const labelFor = (field: string | null): string => {
    if (field === 'overallScore') return version.overall?.label ?? t('form.overall');
    if (field?.startsWith('section:')) return version.sections.find((s) => `section:${s.key}` === field)?.label ?? '';
    return '';
  };

  const errorText = (problem: ErrorState): string => {
    switch (problem.code) {
      case 'off-scale':
        return t('errors.offScale', {
          field: labelFor(problem.field),
          min: String(problem.min),
          max: String(problem.max),
          step: String(problem.step),
        });
      case 'total-mismatch':
        return t('errors.totalMismatch', { expected: String(problem.expected) });
      case 'no-score':
        return t('errors.noScore');
      case 'future-date':
        return t('errors.futureDate');
      case 'invalid-date':
        return t('errors.invalidDate');
      case 'not-found':
        return t('errors.notFound');
      default:
        return t('errors.generic');
    }
  };

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setState('saving');
    setError(null);
    const sectionScores = Object.fromEntries(
      version.sections
        .filter((s) => (sections[s.key] ?? '').trim() !== '')
        .map((s) => [s.key, Number(sections[s.key].replace(',', '.'))]),
    );
    const body = {
      examKey,
      scaleKey,
      providerKey,
      testName,
      takenOn,
      overallScore: version.overall && overall.trim() !== '' ? Number(overall.replace(',', '.')) : null,
      sectionScores,
      notes,
    };
    const response = await fetch(initial ? `/api/official-scores/${encodeURIComponent(initial.id)}` : '/api/official-scores', {
      method: initial ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify(body),
    }).catch(() => null);
    const data = await response?.json().catch(() => null);
    if (!response?.ok) {
      setState('idle');
      const detail = (data?.error?.detail ?? {}) as Partial<Omit<ErrorState, 'code'>>;
      setError({ ...detail, code: data?.error?.code ?? null, field: detail.field ?? null });
      return;
    }
    setState(initial ? 'idle' : 'saved');
    if (initial) router.push(back);
    else {
      setTestName('');
      setTakenOn('');
      setOverall('');
      setSections({});
      setNotes('');
      router.refresh();
    }
  }

  const errorId = `${id}-error`;
  const invalid = (field: string) => error?.field === field || undefined;
  const describedBy = (hint: string, field: string) => (error && (error.field === field || error.field === null) ? `${errorId} ${hint}` : hint);

  return (
    <Card padding="lg">
      <h2 id="score-form" className="text-xl">
        {initial ? t('form.editTitle') : t('form.addTitle')}
      </h2>
      <p className="mt-1.5 text-sm text-ink-muted">{t('label')}</p>

      <form onSubmit={save} className="mt-5 space-y-5" noValidate>
        {error ? (
          <Alert tone="negative" role="alert" title={t('errors.title')}>
            <p id={errorId}>{errorText(error)}</p>
          </Alert>
        ) : null}

        {versions.length > 1 ? (
          <div>
            <label htmlFor={`${id}-version`} className="mb-1.5 block text-sm font-medium">
              {t('form.version')}
            </label>
            <select
              id={`${id}-version`}
              value={scaleKey}
              onChange={(event) => {
                setScaleKey(event.target.value);
                setSections({});
              }}
              aria-describedby={`${id}-version-hint`}
              className={fieldClass('max-w-xl')}
            >
              {versions.map((v) => (
                <option key={v.key} value={v.key}>
                  {v.label}
                </option>
              ))}
            </select>
            <p id={`${id}-version-hint`} className="mt-1.5 text-sm text-ink-muted">
              {t('form.versionHint')}
            </p>
          </div>
        ) : null}

        <div>
          <label htmlFor={`${id}-provider`} className="mb-1.5 block text-sm font-medium">
            {t('form.provider')}
          </label>
          <select
            id={`${id}-provider`}
            value={providerKey}
            onChange={(event) => setProviderKey(event.target.value)}
            aria-describedby={`${id}-provider-hint`}
            className={fieldClass('max-w-xl')}
          >
            {providers.map((p) => (
              <option key={p.key} value={p.key}>
                {p.name}
              </option>
            ))}
          </select>
          <p id={`${id}-provider-hint`} className="mt-1.5 text-sm text-ink-muted">
            {provider.note}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-test`} className="mb-1.5 block text-sm font-medium">
              {t('form.testName')}
            </label>
            <input
              id={`${id}-test`}
              required
              maxLength={120}
              value={testName}
              onChange={(event) => setTestName(event.target.value)}
              aria-describedby={`${id}-test-hint`}
              className={fieldClass('w-full')}
            />
            <p id={`${id}-test-hint`} className="mt-1.5 text-sm text-ink-muted">
              {t('form.testNameHint')}
            </p>
          </div>
          <div>
            <label htmlFor={`${id}-date`} className="mb-1.5 block text-sm font-medium">
              {t('form.takenOn')}
            </label>
            <input
              id={`${id}-date`}
              type="date"
              required
              max={today}
              value={takenOn}
              onChange={(event) => setTakenOn(event.target.value)}
              aria-invalid={invalid('takenOn')}
              aria-describedby={error?.field === 'takenOn' ? errorId : undefined}
              className={fieldClass('max-w-56')}
            />
          </div>
        </div>

        {version.overall ? (
          <div>
            <label htmlFor={`${id}-overall`} className="mb-1.5 block text-sm font-medium">
              {version.overall.label}
            </label>
            <input
              id={`${id}-overall`}
              type="number"
              inputMode="decimal"
              min={version.overall.scale.min}
              max={version.overall.scale.max}
              step={version.overall.scale.step}
              value={overall}
              onChange={(event) => setOverall(event.target.value)}
              aria-invalid={invalid('overallScore')}
              aria-describedby={describedBy(`${id}-overall-hint`, 'overallScore')}
              className={fieldClass('max-w-48 tabular-nums')}
            />
            <p id={`${id}-overall-hint`} className="mt-1.5 text-sm text-ink-muted">
              {t('form.overallHint', {
                min: String(version.overall.scale.min),
                max: String(version.overall.scale.max),
                step: String(version.overall.scale.step),
              })}
            </p>
          </div>
        ) : (
          <p className="text-sm text-ink-muted">{t('form.noOverall')}</p>
        )}

        {version.sections.length > 0 ? (
          <fieldset>
            <legend className="text-sm font-medium">
              {t('form.sections')} <span className="font-normal text-ink-muted">{t('form.optional')}</span>
            </legend>
            <p className="mt-1 text-sm text-ink-muted">{t('form.sectionsHint')}</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {version.sections.map((section) => {
                const field = `section:${section.key}`;
                const inputId = `${id}-section-${section.key}`;
                return (
                  <div key={section.key}>
                    <label htmlFor={inputId} className="mb-1.5 block text-sm">
                      {section.label}
                    </label>
                    <input
                      id={inputId}
                      type="number"
                      inputMode="decimal"
                      min={section.scale.min}
                      max={section.scale.max}
                      step={section.scale.step}
                      value={sections[section.key] ?? ''}
                      onChange={(event) => setSections((current) => ({ ...current, [section.key]: event.target.value }))}
                      aria-invalid={invalid(field)}
                      aria-describedby={describedBy(`${inputId}-hint`, field)}
                      className={fieldClass('max-w-40 tabular-nums')}
                    />
                    <p id={`${inputId}-hint`} className="mt-1 text-xs text-ink-muted">
                      {t('form.rangeHint', { min: String(section.scale.min), max: String(section.scale.max), step: String(section.scale.step) })}
                    </p>
                  </div>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        <div>
          <label htmlFor={`${id}-notes`} className="mb-1.5 block text-sm font-medium">
            {t('form.notes')} <span className="font-normal text-ink-muted">{t('form.optional')}</span>
          </label>
          <textarea
            id={`${id}-notes`}
            rows={3}
            maxLength={1000}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            aria-describedby={`${id}-notes-hint`}
            className={fieldClass('w-full')}
          />
          <p id={`${id}-notes-hint`} className="mt-1.5 text-sm text-ink-muted">
            {t('form.notesHint')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" loading={state === 'saving'}>
            {initial ? t('form.saveChanges') : t('form.save')}
          </Button>
          {initial ? (
            <Link href={back} className="text-sm">
              {t('form.cancel')}
            </Link>
          ) : null}
          <span aria-live="polite" className="text-sm text-ink-muted">
            {state === 'saved' ? t('form.saved') : ''}
          </span>
        </div>
      </form>
    </Card>
  );
}
