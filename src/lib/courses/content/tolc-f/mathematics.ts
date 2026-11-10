import type { Unit } from '../../types';
import { mathematicsUnit as source } from '../tolc-i/mathematics';
import { reviewedAdapt as adapt } from './shared';
import { countingLesson } from './counting';

const skills = ['numbers', 'numbers', 'algebra', 'algebra', 'algebra', 'algebra', 'algebra', 'geometry', 'geometry', 'geometry', 'geometry', 'functions-trig', 'functions-trig', 'functions-trig', 'functions-trig', 'probability'];

export const mathematicsUnit: Unit = {
  ...source,
  summary: 'Build number fluency, solve equations and inequalities, read functions and geometry, and connect counting with probability and statistics.',
  lessons: [...source.lessons.map((lesson, index) => adapt(lesson, 'tolcf-mathematics', `tolcf-math-${skills[index]}`)), countingLesson],
};
