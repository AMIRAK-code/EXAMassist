/**
 * Writes the review package for the public worked samples: every sample on
 * the Bocconi guides and Master’s hub, the TOLC hub (English and Italian) and
 * the IMAT guide, with its
 * key, working, wrong-option notes and fingerprint, and a form for the
 * reviewer's decisions. The procedure is in docs/review/README.md.
 *
 *   npx tsx scripts/sample-review-package.ts            # docs/review/packages/<today>-samples.md
 *   npx tsx scripts/sample-review-package.ts --out=FILE
 *
 * The package is regenerated from the content, so a fingerprint in it always
 * matches the text printed beside it. Send the reviewer the file; record their
 * answers in content/reviews/editorial-samples.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { currentApproval, listPublishedSamples, sampleFingerprint, sampleReviewLedger } from '../src/lib/content/sample-review';

const today = new Date().toISOString().slice(0, 10);
const outArg = process.argv.find((a) => a.startsWith('--out='));
const out = path.resolve(outArg ? outArg.slice('--out='.length) : `docs/review/packages/${today}-samples.md`);
const SITE = 'https://uniexamer.com';

const ledger = sampleReviewLedger();
const samples = listPublishedSamples().filter((s) => /^(guide:bocconi-|guide:imat-|hub:cisia-tolc|hub:bocconi-master)/.test(s.page));

const pageTitle: Record<string, string> = {
  'guide:bocconi-admission-test-sample-questions': 'Bocconi admission test: sample questions (English)',
  'hub:cisia-tolc': 'CISIA TOLC hub: worked samples (English)',
  'hub:cisia-tolc:it': 'CISIA TOLC hub: worked samples (Italian translation)',
  'hub:bocconi-master': 'Bocconi Master’s hub: worked samples (English)',
  'guide:imat-sample-questions': 'IMAT sample questions (English)',
};

const lines: string[] = [];
const push = (...l: string[]) => lines.push(...l);

push(
  `# Review package: public worked samples (Bocconi, TOLC and IMAT)`,
  '',
  `Generated ${today} from the content in this repository (\`npx tsx scripts/sample-review-package.ts\`). ${samples.length} samples on ${new Set(samples.map((s) => s.page)).size} pages.`,
  '',
  'Thank you for reviewing. These are original, AI-assisted practice questions published free on uniexamer.com. They are **not** questions from Bocconi, CISIA or the IMAT, and UniExamer is not affiliated with any of them. Nothing you write here is published unless you agree to it below.',
  '',
  '## 1. Before you start: the reviewer declaration',
  '',
  'Please fill this in and return it with your decisions. We publish only what you agree to, exactly as you write it, and you can withdraw your consent at any time by writing to support@uniexamer.com; withdrawing removes your name from the site.',
  '',
  '```text',
  'Name to show publicly (or "do not publish my name"):',
  'One line of credentials to show, in your words (e.g. "Mathematics teacher, liceo scientifico, 12 years"):',
  'Subjects you are reviewing: [ ] Mathematics  [ ] Logic  [ ] Verbal / reading  [ ] Physics  [ ] Chemistry  [ ] Biology',
  'Languages you are reviewing in:  [ ] English  [ ] Italian (native or fluent)',
  'Have you written, edited or been paid per item for any of these questions?  [ ] No  [ ] Yes (please say which)',
  'Any relationship with UniExamer (paid review, friend of the team, none):',
  'I agree that the name and line above may be shown beside the samples I approve, with the date of my review:  [ ] Yes  [ ] No',
  'Date:',
  '```',
  '',
  '## 2. How to review each sample',
  '',
  '1. Read the question and solve it yourself **before** reading the key.',
  '2. Check four things, and tick only what you checked yourself:',
  '   - **Answer key**: exactly one option is defensible, and it is the keyed one.',
  '   - **Explanation**: the working is correct and teaches the method; each wrong-option note names a real mistake.',
  '   - **Wording**: clear, unambiguous, free of errors, fair to a student.',
  '   - **Syllabus**: it tests something in the published syllabus of the test named (Bocconi: the topics on Bocconi’s test page; TOLC: CISIA’s “struttura e sillabo” page for that TOLC).',
  '3. For an **Italian** sample also check **Translation**: natural Italian a student would read without stumbling, the same question and the same maths as the English one, and CISIA’s terms where CISIA uses them.',
  '4. Write **Approve** only if every box holds. Otherwise write **Changes** and say what to change; we will edit, regenerate the package and ask you to look at the new text.',
  '',
  'Your decision applies to the exact text below, identified by its fingerprint. If we change a sample later, your approval stops counting for it until it is reviewed again.',
  '',
  '## 3. Decisions form',
  '',
  'Copy this table into your reply, or fill it in here.',
  '',
  '| Page | Sample | Fingerprint (first 12) | Key | Expl. | Wording | Syllabus | Transl. (it) | Decision | Notes |',
  '| --- | --- | --- | :-: | :-: | :-: | :-: | :-: | --- | --- |',
);
for (const s of samples) {
  push(`| ${s.page} | ${s.question.id} | \`${sampleFingerprint(s.question).slice(0, 12)}\` | [ ] | [ ] | [ ] | [ ] | ${s.locale === 'en' ? 'n/a' : '[ ]'} | | |`);
}
push('', '## 4. The samples', '');

let currentPage = '';
for (const s of samples) {
  if (s.page !== currentPage) {
    currentPage = s.page;
    push(`### ${pageTitle[s.page] ?? s.page}`, '', `Live page: ${SITE}${s.path}`, '');
  }
  const q = s.question;
  const approval = currentApproval(s, ledger);
  push(
    `#### ${q.id}: ${q.title}`,
    '',
    `- Section: ${s.section}. Topic: ${q.topic}`,
    `- Fingerprint: \`${sampleFingerprint(q)}\``,
    `- Status: ${approval ? `approved by ${approval.reviewerId} on ${approval.reviewedOn}` : 'not reviewed by a human subject expert'}`,
    '',
  );
  if (q.stimulusMd) push('**Passage**', '', q.stimulusMd, '');
  push('**Question**', '', q.stemMd, '');
  for (const o of q.options) push(`- **${o.id}.** ${o.text}`);
  push('', '<details><summary>Key, working and wrong-option notes (solve it first)</summary>', '');
  push(`**Key: ${q.answer}**`, '', '**Working**', '', q.workingMd, '', '**Why the other options are wrong**', '');
  for (const o of q.options.filter((o) => o.id !== q.answer)) push(`- **${o.id}.** ${o.note}`);
  push('', `**Lesson:** ${q.lesson}`, '', '</details>', '');
}

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${lines.join('\n')}\n`);
console.log(`Wrote ${path.relative(process.cwd(), out)}: ${samples.length} samples.`);
