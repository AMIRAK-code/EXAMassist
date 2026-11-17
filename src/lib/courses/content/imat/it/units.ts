import type { Unit } from '../../../types';
import { howTheImatWorksLessonIt, scoringGuessingAndPacingLessonIt } from './getting-started';
import { readingShortScientificPassagesLessonIt, inferenceAndAssumptionsInTextsLessonIt, generalKnowledgeHistoryAndInstitutionsLessonIt } from './reading-and-knowledge';
import { argumentsConclusionsAndAssumptionsLessonIt, strengtheningWeakeningAndFlawsLessonIt, numericalProblemSolvingLessonIt, sequencesAndLogicalPuzzlesLessonIt } from './logic';
import {
  biologicalMoleculesLessonIt,
  cellStructureAndOrganellesLessonIt,
  membranesAndTransportLessonIt,
  enzymesAndMetabolismLessonIt,
  cellularRespirationAndPhotosynthesisLessonIt,
  cellCycleMitosisAndMeiosisLessonIt,
  dnaReplicationAndProteinSynthesisLessonIt,
} from './biology-1';
import {
  mendelianGeneticsAndPedigreesLessonIt,
  biotechnologyAndGeneticEngineeringLessonIt,
  mutationsEvolutionAndClassificationLessonIt,
  tissuesCirculationAndRespirationLessonIt,
  nervousEndocrineAndImmuneSystemsLessonIt,
  digestiveAndExcretorySystemsLessonIt,
  humanReproductionAndDevelopmentLessonIt,
} from './biology-2';
import {
  atomicStructureAndElectronConfigurationLessonIt,
  periodicTableTrendsLessonIt,
  chemicalBondingAndMolecularShapeLessonIt,
  intermolecularForcesAndStatesOfMatterLessonIt,
  inorganicNomenclatureLessonIt,
  molesAndStoichiometryLessonIt,
} from './chemistry-1';
import {
  solutionsAndConcentrationLessonIt,
  kineticsAndChemicalEquilibriumLessonIt,
  acidsBasesAndPhLessonIt,
  redoxReactionsLessonIt,
  organicCompoundsAndFunctionalGroupsLessonIt,
  isomerismAndOrganicReactionsLessonIt,
} from './chemistry-2';
import {
  unitsVectorsAndKinematicsLessonIt,
  forcesAndNewtonsLawsLessonIt,
  workEnergyAndMomentumLessonIt,
  fluidsPressureAndBuoyancyLessonIt,
  heatGasLawsAndThermodynamicsLessonIt,
  electricChargeFieldsAndCircuitsLessonIt,
  magnetismAndElectromagneticInductionLessonIt,
} from './physics';
import { algebraEquationsAndInequalitiesLessonIt, exponentialsLogarithmsAndFunctionsLessonIt, geometryAndTrigonometryLessonIt, probabilityAndStatisticsLessonIt } from './mathematics';

/** Le unità del corso IMAT in italiano: stessi slug e stesso ordine della versione inglese (../units.ts). */
export const imatUnitsIt: Unit[] = [
  {
    slug: 'getting-started',
    title: 'Per iniziare',
    summary: 'Come è costruito e come si calcola il punteggio dell’IMAT, e come trasformare la regola di punteggio in scelte su risposte incerte e gestione dei 100 minuti.',
    lessons: [howTheImatWorksLessonIt, scoringGuessingAndPacingLessonIt],
  },
  {
    slug: 'reading-and-knowledge',
    title: 'Comprensione del testo e conoscenze',
    summary: 'Le quattro domande di competenze di lettura e conoscenze acquisite negli studi: leggere con precisione testi brevi, trarre inferenze e prepararsi sulla cultura generale.',
    lessons: [readingShortScientificPassagesLessonIt, inferenceAndAssumptionsInTextsLessonIt, generalKnowledgeHistoryAndInstitutionsLessonIt],
  },
  {
    slug: 'logic',
    title: 'Ragionamento logico e problemi',
    summary: 'Le cinque domande di logica: la struttura degli argomenti, ciò che li rafforza o li indebolisce, e problemi numerici e di sequenze risolti ragionando.',
    lessons: [argumentsConclusionsAndAssumptionsLessonIt, strengtheningWeakeningAndFlawsLessonIt, numericalProblemSolvingLessonIt, sequencesAndLogicalPuzzlesLessonIt],
  },
  {
    slug: 'biology',
    title: 'Biologia',
    summary: 'L’area più ampia, 23 domande su 60: biomolecole e cellula, bioenergetica, divisione cellulare, genetica e biotecnologie, evoluzione, anatomia e fisiologia umana.',
    lessons: [
      biologicalMoleculesLessonIt,
      cellStructureAndOrganellesLessonIt,
      membranesAndTransportLessonIt,
      enzymesAndMetabolismLessonIt,
      cellularRespirationAndPhotosynthesisLessonIt,
      cellCycleMitosisAndMeiosisLessonIt,
      dnaReplicationAndProteinSynthesisLessonIt,
      mendelianGeneticsAndPedigreesLessonIt,
      biotechnologyAndGeneticEngineeringLessonIt,
      mutationsEvolutionAndClassificationLessonIt,
      tissuesCirculationAndRespirationLessonIt,
      nervousEndocrineAndImmuneSystemsLessonIt,
      digestiveAndExcretorySystemsLessonIt,
      humanReproductionAndDevelopmentLessonIt,
    ],
  },
  {
    slug: 'chemistry',
    title: 'Chimica',
    summary: 'Le 15 domande di chimica: atomo e tavola periodica, legami, nomenclatura, stechiometria e soluzioni, equilibrio, acidi e basi, ossidoriduzioni e chimica organica.',
    lessons: [
      atomicStructureAndElectronConfigurationLessonIt,
      periodicTableTrendsLessonIt,
      chemicalBondingAndMolecularShapeLessonIt,
      intermolecularForcesAndStatesOfMatterLessonIt,
      inorganicNomenclatureLessonIt,
      molesAndStoichiometryLessonIt,
      solutionsAndConcentrationLessonIt,
      kineticsAndChemicalEquilibriumLessonIt,
      acidsBasesAndPhLessonIt,
      redoxReactionsLessonIt,
      organicCompoundsAndFunctionalGroupsLessonIt,
      isomerismAndOrganicReactionsLessonIt,
    ],
  },
  {
    slug: 'physics',
    title: 'Fisica',
    summary: 'La parte di fisica delle 13 domande di fisica e matematica: cinematica, dinamica, energia, fluidi, termodinamica, elettricità e magnetismo, tutto senza calcolatrice.',
    lessons: [
      unitsVectorsAndKinematicsLessonIt,
      forcesAndNewtonsLawsLessonIt,
      workEnergyAndMomentumLessonIt,
      fluidsPressureAndBuoyancyLessonIt,
      heatGasLawsAndThermodynamicsLessonIt,
      electricChargeFieldsAndCircuitsLessonIt,
      magnetismAndElectromagneticInductionLessonIt,
    ],
  },
  {
    slug: 'mathematics',
    title: 'Matematica',
    summary: 'La matematica dell’area di fisica e matematica: algebra, funzioni, esponenziali e logaritmi, geometria e trigonometria, probabilità e statistica.',
    lessons: [algebraEquationsAndInequalitiesLessonIt, exponentialsLogarithmsAndFunctionsLessonIt, geometryAndTrigonometryLessonIt, probabilityAndStatisticsLessonIt],
  },
];
