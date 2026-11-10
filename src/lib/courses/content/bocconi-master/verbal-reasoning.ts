import type { Unit } from '../../types';
import { readingPassagesForStructureLesson } from './vr-reading-passages-for-structure';
import { mainIdeaAndAuthorPurposeLesson } from './vr-main-idea-and-author-purpose';
import { detailAndInferenceQuestionsLesson } from './vr-detail-and-inference-questions';
import { dataAndStatementsLesson } from './vr-data-and-statements';
import { argumentStructureLesson } from './vr-argument-structure';
import { assumptionsLesson } from './vr-assumptions';
import { strengthenAndWeakenLesson } from './vr-strengthen-and-weaken';
import { flawsAndEvaluationLesson } from './vr-flaws-and-evaluation';

export const verbalReasoningUnit: Unit = {
  slug: 'verbal-reasoning',
  title: 'Verbal reasoning',
  summary: 'The largest area of the test, 24 of 50 questions. Bocconi describes three item types: reading comprehension on passages, data and statements to judge true or false, and verbal critical reasoning on short arguments. These lessons cover reading for structure, main idea, detail and inference, data and statements, then argument structure, assumptions, strengthening and weakening, and flaws.',
  lessons: [
    readingPassagesForStructureLesson,
    mainIdeaAndAuthorPurposeLesson,
    detailAndInferenceQuestionsLesson,
    dataAndStatementsLesson,
    argumentStructureLesson,
    assumptionsLesson,
    strengthenAndWeakenLesson,
    flawsAndEvaluationLesson,
  ],
};
