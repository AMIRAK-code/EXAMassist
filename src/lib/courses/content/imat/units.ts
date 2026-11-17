import type { Unit } from '../../types';
import { howTheImatWorksLesson, scoringGuessingAndPacingLesson } from './getting-started';
import { readingShortScientificPassagesLesson, inferenceAndAssumptionsInTextsLesson, generalKnowledgeHistoryAndInstitutionsLesson } from './reading-and-knowledge';
import { argumentsConclusionsAndAssumptionsLesson, strengtheningWeakeningAndFlawsLesson, numericalProblemSolvingLesson, sequencesAndLogicalPuzzlesLesson } from './logic';
import {
  biologicalMoleculesLesson,
  cellStructureAndOrganellesLesson,
  membranesAndTransportLesson,
  enzymesAndMetabolismLesson,
  cellularRespirationAndPhotosynthesisLesson,
  cellCycleMitosisAndMeiosisLesson,
  dnaReplicationAndProteinSynthesisLesson,
} from './biology-1';
import {
  mendelianGeneticsAndPedigreesLesson,
  biotechnologyAndGeneticEngineeringLesson,
  mutationsEvolutionAndClassificationLesson,
  tissuesCirculationAndRespirationLesson,
  nervousEndocrineAndImmuneSystemsLesson,
  digestiveAndExcretorySystemsLesson,
  humanReproductionAndDevelopmentLesson,
} from './biology-2';
import {
  atomicStructureAndElectronConfigurationLesson,
  periodicTableTrendsLesson,
  chemicalBondingAndMolecularShapeLesson,
  intermolecularForcesAndStatesOfMatterLesson,
  inorganicNomenclatureLesson,
  molesAndStoichiometryLesson,
} from './chemistry-1';
import {
  solutionsAndConcentrationLesson,
  kineticsAndChemicalEquilibriumLesson,
  acidsBasesAndPhLesson,
  redoxReactionsLesson,
  organicCompoundsAndFunctionalGroupsLesson,
  isomerismAndOrganicReactionsLesson,
} from './chemistry-2';
import {
  unitsVectorsAndKinematicsLesson,
  forcesAndNewtonsLawsLesson,
  workEnergyAndMomentumLesson,
  fluidsPressureAndBuoyancyLesson,
  heatGasLawsAndThermodynamicsLesson,
  electricChargeFieldsAndCircuitsLesson,
  magnetismAndElectromagneticInductionLesson,
} from './physics';
import { algebraEquationsAndInequalitiesLesson, exponentialsLogarithmsAndFunctionsLesson, geometryAndTrigonometryLesson, probabilityAndStatisticsLesson } from './mathematics';

/** The IMAT course's units, in English. The Italian version (it/units.ts) has the same slugs in the same order. */
export const imatUnits: Unit[] = [
  {
    slug: 'getting-started',
    title: 'Getting started',
    summary: 'How the IMAT is built and scored, and how to turn the scoring rule into decisions about guessing and pacing over 100 minutes.',
    lessons: [howTheImatWorksLesson, scoringGuessingAndPacingLesson],
  },
  {
    slug: 'reading-and-knowledge',
    title: 'Reading skills and knowledge',
    summary: 'The four questions on reading skills and knowledge acquired in studies: reading short texts precisely, drawing inferences, and preparing for general knowledge.',
    lessons: [readingShortScientificPassagesLesson, inferenceAndAssumptionsInTextsLesson, generalKnowledgeHistoryAndInstitutionsLesson],
  },
  {
    slug: 'logic',
    title: 'Logical reasoning and problems',
    summary: 'The five logic questions: the structure of arguments, what strengthens or weakens them, and numerical and pattern problems solved by reasoning.',
    lessons: [argumentsConclusionsAndAssumptionsLesson, strengtheningWeakeningAndFlawsLesson, numericalProblemSolvingLesson, sequencesAndLogicalPuzzlesLesson],
  },
  {
    slug: 'biology',
    title: 'Biology',
    summary: 'The largest area, 23 of the 60 questions: biomolecules and cells, bioenergetics, cell division, genetics and biotechnology, evolution, and human anatomy and physiology.',
    lessons: [
      biologicalMoleculesLesson,
      cellStructureAndOrganellesLesson,
      membranesAndTransportLesson,
      enzymesAndMetabolismLesson,
      cellularRespirationAndPhotosynthesisLesson,
      cellCycleMitosisAndMeiosisLesson,
      dnaReplicationAndProteinSynthesisLesson,
      mendelianGeneticsAndPedigreesLesson,
      biotechnologyAndGeneticEngineeringLesson,
      mutationsEvolutionAndClassificationLesson,
      tissuesCirculationAndRespirationLesson,
      nervousEndocrineAndImmuneSystemsLesson,
      digestiveAndExcretorySystemsLesson,
      humanReproductionAndDevelopmentLesson,
    ],
  },
  {
    slug: 'chemistry',
    title: 'Chemistry',
    summary: 'The 15 chemistry questions: atoms and the periodic table, bonding, nomenclature, stoichiometry and solutions, equilibrium, acids and bases, redox and organic chemistry.',
    lessons: [
      atomicStructureAndElectronConfigurationLesson,
      periodicTableTrendsLesson,
      chemicalBondingAndMolecularShapeLesson,
      intermolecularForcesAndStatesOfMatterLesson,
      inorganicNomenclatureLesson,
      molesAndStoichiometryLesson,
      solutionsAndConcentrationLesson,
      kineticsAndChemicalEquilibriumLesson,
      acidsBasesAndPhLesson,
      redoxReactionsLesson,
      organicCompoundsAndFunctionalGroupsLesson,
      isomerismAndOrganicReactionsLesson,
    ],
  },
  {
    slug: 'physics',
    title: 'Physics',
    summary: 'The physics half of the 13 physics and mathematics questions: kinematics, dynamics, energy, fluids, thermodynamics, electricity and magnetism, all without a calculator.',
    lessons: [
      unitsVectorsAndKinematicsLesson,
      forcesAndNewtonsLawsLesson,
      workEnergyAndMomentumLesson,
      fluidsPressureAndBuoyancyLesson,
      heatGasLawsAndThermodynamicsLesson,
      electricChargeFieldsAndCircuitsLesson,
      magnetismAndElectromagneticInductionLesson,
    ],
  },
  {
    slug: 'mathematics',
    title: 'Mathematics',
    summary: 'The mathematics in the physics and mathematics area: algebra, functions, exponentials and logarithms, geometry and trigonometry, probability and statistics.',
    lessons: [algebraEquationsAndInequalitiesLesson, exponentialsLogarithmsAndFunctionsLesson, geometryAndTrigonometryLesson, probabilityAndStatisticsLesson],
  },
];
