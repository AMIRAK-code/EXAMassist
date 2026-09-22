/**
 * Deterministically renders docs/research/<examKey>.md from the verified
 * specification drafts in content/exam-specs/_raw/.
 *
 * This is a pure transformation on purpose: the documentation can never assert
 * anything the research record does not already contain.
 *
 *   node scripts/build-research-docs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const RAW_DIR = path.resolve('content/exam-specs/_raw');
const OUT_DIR = path.resolve('docs/research');

const esc = (v) => String(v ?? '').replace(/\|/g, '\\|').replace(/\r?\n+/g, ' ').trim();
const para = (v) => String(v ?? '').trim();

function table(headers, rows) {
  if (rows.length === 0) return '_None recorded._\n';
  const head = `| ${headers.join(' | ')} |`;
  const rule = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.map(esc).join(' | ')} |`).join('\n');
  return `${head}\n${rule}\n${body}\n`;
}

function renderExam(spec) {
  const out = [];
  const sourceIndex = new Map();
  (spec.sources ?? []).forEach((s, i) => sourceIndex.set(s.url, i + 1));
  const cite = (url) => (sourceIndex.has(url) ? `[${sourceIndex.get(url)}]` : url ? `(${url})` : '');

  out.push(`# ${spec.examName} — verified specification\n`);
  out.push(
    `**Version covered:** ${para(spec.versionLabel)}  \n` +
      `**Verified on:** ${para(spec.verificationDate)}  \n` +
      `**Admissions cycle:** ${para(spec.admissionsCycle)}  \n` +
      `**Region / delivery:** ${para(spec.region)} — ${para(spec.deliveryMode)}\n`,
  );
  out.push(
    `> This record is compiled from the official test maker's own published pages. ` +
      `Every factual row below carries a numbered source. Where the test maker does not ` +
      `publish something, this document says so rather than estimating it.\n`,
  );

  out.push(`\n## Summary\n\n${para(spec.summary)}\n`);

  out.push(`\n## Structure\n`);
  out.push(
    `**Total:** ${para(spec.totalQuestions) || 'not specified'} — ${para(spec.totalTimeMinutes) || 'not specified'}\n`,
  );
  out.push(
    table(
      ['#', 'Section', 'Questions', 'Minutes', 'Calculator', 'Navigation', 'Adaptive', 'Sources'],
      (spec.sections ?? []).map((s) => [
        s.order,
        s.name,
        s.questionCount,
        s.timeMinutes,
        s.calculatorPolicy,
        s.navigationRules,
        s.adaptiveBehavior,
        (s.sourceUrls ?? []).map(cite).join(' '),
      ]),
    ),
  );

  out.push(`\n### Timing and breaks\n\n${para(spec.timingAndBreaks)}\n`);
  out.push(`\n### Navigation and review\n\n${para(spec.navigationAndReview)}\n`);
  out.push(`\n### Calculator\n\n${para(spec.calculatorRules)}\n`);
  out.push(`\n### Adaptive behaviour\n\n${para(spec.adaptiveBehavior)}\n`);

  out.push(`\n## Scoring\n`);
  out.push(`### Raw scoring\n\n${para(spec.scoringRawRules)}\n`);
  if (para(spec.scoringScaleRules)) out.push(`\n### Reported scale\n\n${para(spec.scoringScaleRules)}\n`);
  out.push(`\n### Not publicly documented — we do not reproduce these\n`);
  const notPublic = spec.scoringNotPubliclyDocumented ?? [];
  out.push(
    notPublic.length ? notPublic.map((n) => `- ${para(n)}`).join('\n') + '\n' : '_None recorded._\n',
  );

  out.push(`\n## Official taxonomy used to tag our question bank\n`);
  out.push(
    table(
      ['Section', 'Domain', 'Slug', 'Skills', 'Source'],
      (spec.taxonomy ?? []).map((t) => [
        t.section,
        t.domain,
        `\`${t.domainSlug}\``,
        (t.skills ?? []).join('; '),
        cite(t.sourceUrl),
      ]),
    ),
  );
  out.push(
    `\n**Response types required:** ${(spec.responseTypesNeeded ?? []).map((r) => `\`${r}\``).join(', ') || 'none recorded'}\n`,
  );

  out.push(`\n## What we could NOT verify\n`);
  out.push(
    `Each item below disables a dependent "exam-accurate" behaviour in the product. ` +
      `We would rather offer less than assert something false.\n`,
  );
  const unver = spec.unverifiable ?? [];
  out.push(unver.length ? unver.map((u) => `- ${para(u)}`).join('\n') + '\n' : '_Nothing outstanding._\n');

  out.push(`\n## Discrepancies with the supplied brief\n`);
  out.push(
    table(
      ['Claim in the brief', 'Verified finding', 'Source', 'Consequence for the build'],
      (spec.briefDiscrepancies ?? []).map((d) => [
        d.briefClaim,
        d.verifiedFinding,
        cite(d.sourceUrl),
        d.implementationConsequence,
      ]),
    ),
  );

  out.push(`\n## Implementation notes\n`);
  const notes = spec.implementationNotes ?? [];
  out.push(notes.length ? notes.map((n) => `- ${para(n)}`).join('\n') + '\n' : '_None recorded._\n');

  out.push(`\n## Verified claims\n`);
  out.push(
    table(
      ['ID', 'Topic', 'Statement', 'Confidence', 'Sources'],
      (spec.claims ?? []).map((c) => [
        `\`${c.id}\``,
        c.topic,
        c.statement,
        c.confidence,
        (c.sources ?? []).map((s) => cite(s.url)).join(' '),
      ]),
    ),
  );

  out.push(`\n## Sources\n`);
  const srcRows = (spec.sources ?? []).map((s, i) => [
    i + 1,
    s.publisher,
    s.isOfficial ? 'official' : 'secondary',
    s.fetchedOk ? 'fetched' : 'NOT FETCHED',
    `<${s.url}>`,
    s.quote ? `"${s.quote}"` : '',
  ]);
  out.push(table(['#', 'Publisher', 'Type', 'Status', 'URL', 'Quote used'], srcRows));

  out.push(
    `\n---\n_Generated by \`scripts/build-research-docs.mjs\` from ` +
      `\`content/exam-specs/_raw/${spec.examKey}.draft.json\`. Re-run the script after editing the record._\n`,
  );

  return out.join('\n');
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const files = fs
  .readdirSync(RAW_DIR)
  .filter((f) => f.endsWith('.draft.json') && !f.startsWith('seo'))
  .sort();

let count = 0;
for (const file of files) {
  const spec = JSON.parse(fs.readFileSync(path.join(RAW_DIR, file), 'utf8'));
  const target = path.join(OUT_DIR, `${spec.examKey}.md`);
  fs.writeFileSync(target, renderExam(spec));
  console.log(`wrote ${path.relative(process.cwd(), target)}`);
  count += 1;
}
console.log(`\n${count} research documents generated.`);
