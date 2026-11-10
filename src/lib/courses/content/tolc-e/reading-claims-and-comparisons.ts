import { md, type Lesson } from '../../types';

export const claimsLesson: Lesson = {
  slug: 'reading-claims-and-comparisons',
  title: 'Reading claims and comparisons',
  summary: 'Preserve groups, periods and comparison bases when interpreting a passage, and distinguish a supported inference from a plausible extension.',
  minutes: 19,
  objectives: ['Identify the group and period covered by a numerical claim.', 'Distinguish totals from rates and reported responses from population facts.', 'Test an inference against what the passage leaves open.'],
  teachMd: md`
### Carry the boundary with the claim

A passage can report a precise figure while supporting only a limited conclusion. “Twenty of the eighty returned forms mentioned noise” describes returned forms, not all residents and not all forms distributed. Keep the reference group attached to the number when you paraphrase. Replacing “respondents” with “residents” expands the claim, even if the new sentence sounds natural. The same discipline applies to a time period, location or eligibility condition. Those boundaries tell you what the evidence measures.

Start by identifying four parts of a comparison: what is measured, among whom, during which period, and against which baseline. A claim that morning deliveries became faster may concern a different set of parcels from a claim about all deliveries. If the passage does not connect those groups, do not silently merge them. This is a reading task before it is an arithmetic task. A perfectly calculated percentage can still answer the wrong question if its denominator comes from the wrong population.

### Separate a count from a share

An absolute number and a proportion can move in different directions. Suppose one centre receives 12 complaints among 120 visits, while another receives 15 among 300 visits. The second has more complaints but a smaller complaint share: 5% rather than 10%. A passage comparing counts alone cannot establish which has the higher rate without the visit totals. Conversely, a passage giving rates alone need not establish which has more cases without the group sizes.

Notice also what the rate counts. “Complaints per visit” is different from “visitors who complained” when one visitor can make several visits or complaints. Do not replace one measure with another unless the text equates them. A small phrase such as “at least once” can change the counting unit. If a question asks what must be true, an answer depending on every visitor making exactly one visit requires an extra assumption that may not be available.

### Read changes with their starting point

“A higher number than last month” is not the same as “a faster increase than last month”. The first compares levels; the second compares changes. Imagine membership moves from 100 to 130 and then to 150. The level rises in both steps, but the absolute increase falls from 30 to 20. A claim that membership growth accelerated would misdescribe those numbers. Before selecting an option, decide whether its words refer to the level, the difference or the percentage change.

The baseline matters for percentage language too. An increase from 40 to 50 is 10 additional units, which is 25% of the original 40. A decrease from 50 to 40 is 20% of 50. The same numerical difference can have a different percentage when the reference value changes. If the passage says only that a share rose from 20% to 25%, the rise is five percentage points. Calling it five per cent confuses the difference in shares with a relative change.

### Distinguish observation from explanation

A passage may report that satisfaction rose after a new reception desk opened. That is an observation about timing. It does not by itself establish that the desk caused the increase. If staffing levels or the visitor mix also changed, they may matter. For a reading inference, preserve any uncertainty the writer expresses. “May explain” cannot become “fully explains”; “associated with” cannot become “caused by”. You need not reject the proposed explanation, only avoid making it more certain than the text permits.

Reported views are observations of what people said. If a survey finds that most respondents expect shorter queues, the supported conclusion concerns expectations, not necessarily future queues. Predictions can be sincere and still wrong. Similarly, a proposed plan is not a completed action. Carry the verb's status along with its subject: considered, authorised, begun and completed describe different stages. An answer may match every noun in a passage while changing its central claim through one verb.

### Try to defeat an inference

To test whether an answer must follow, imagine a situation where the passage is true but the answer is false. If only returned forms are described, perhaps non-respondents have very different views. If an average rises, perhaps some individual values fall. If one branch improves, perhaps another worsens. These possibilities do not prove that the answer is false in reality; they show that the passage does not require it. That is enough to reject it as a necessary inference.

Finally, distinguish absence of evidence from evidence of absence. If no passage sentence mentions evening visitors, you cannot conclude that there were none. You can say only that their number is not established. Good reading answers are often restrained: they retain the measured group, comparison and uncertainty. Before accepting a dramatic statement, underline every word that expands its scope, then find the passage language that authorises that expansion.
`,
  examples: [
    { id: 'forms', title: 'The respondents are the reference group', problemMd: 'A council distributes 200 forms. Of the 80 returned forms, 20 request more benches. What share of returned forms makes that request, and what population claim remains unsettled?', steps: ['Use the returned-form denominator: $20/80=1/4=0.25$, or 25%.', 'The other 120 forms provide no recorded response, so their holders’ preferences are not established.'], answerMd: '25% of returned forms request benches. The passage does not establish that 25% of all 200 recipients want them.' },
    { id: 'rates', title: 'More cases, a lower rate', problemMd: 'Branch P records 6 delays among 60 deliveries; Q records 8 among 200. Which branch has more delays, and which has the higher delay share?', steps: ['Compare counts directly: 8 is greater than 6, so Q has more delays.', 'Compare rates: P has $6/60=0.1$, or 10%, and Q has $8/200=0.04$, or 4%.'], answerMd: 'Q has more delays, while P has the higher delay share. A higher count does not establish a higher rate.' },
    { id: 'growth', title: 'Level and increase', problemMd: 'A club’s membership at three successive year ends is 80, 100 and 110. Does membership rise, and does the absolute annual increase grow?', steps: ['The membership levels rise from 80 to 100 to 110.', 'The successive absolute increases are 20 and 10; the second increase is smaller.'], answerMd: 'Membership rises, but its absolute annual increase falls. Saying growth accelerated would confuse the rising level with the size of the increase.' },
  ],
  traps: [
    { title: 'Substituting the whole population for respondents', md: 'A response count describes the responding group. Keep non-respondents outside the conclusion unless the passage supplies additional evidence.' },
    { title: 'Equating a higher count with a higher rate', md: 'Compare the denominators before drawing a rate conclusion. Different group sizes can reverse the ranking.' },
    { title: 'Turning an unmentioned fact into a negative fact', md: 'Silence about a group does not establish that it is absent. Mark the claim as unsettled rather than filling the gap.' },
  ],
  check: [
    { id: 'check-1', title: 'Keep the denominator', topic: 'Verbal comprehension', stimulusMd: 'Of 90 returned questionnaires, 30 named longer opening hours as the most useful improvement. A further 110 questionnaires were not returned.', stemMd: 'Which statement is supported?', options: [
      { id: 'A', text: 'One third of the returned questionnaires named longer opening hours.', note: '' },
      { id: 'B', text: 'One third of all recipients prefer longer opening hours.', note: 'The fraction uses only respondents, and non-respondents’ preferences are unknown.' },
      { id: 'C', text: 'None of the non-respondents wants longer opening hours.', note: 'Not returning a questionnaire does not reveal that preference.' },
      { id: 'D', text: 'Longer opening hours have already been introduced.', note: 'Naming an improvement does not state that it has been implemented.' },
      { id: 'E', text: 'Every returned questionnaire named longer opening hours.', note: 'Only 30 of the 90 returned questionnaires named that improvement.' },
    ], answer: 'A', workingMd: 'The measured group is the 90 returned questionnaires. Of those, $30/90=1/3$ named longer hours. Nothing establishes the preferences of the 110 non-respondents or an implemented policy.', lesson: 'Retain the responding group when interpreting a survey fraction.' },
    { id: 'check-2', title: 'The comparison base', topic: 'Verbal comprehension', stimulusMd: 'Last month, centre R received 9 complaints during 300 visits. Centre S received 6 complaints during 100 visits. Each complaint is counted separately.', stemMd: 'Which comparison follows from the passage?', options: [
      { id: 'A', text: 'R had both fewer complaints and a lower complaint-per-visit rate.', note: 'R had more complaints in total, although its rate was lower.' },
      { id: 'B', text: 'R had more complaints and a higher complaint-per-visit rate.', note: 'The rate for R was 3%, below S’s 6%.' },
      { id: 'C', text: 'Both centres had the same complaint-per-visit rate.', note: 'Nine per 300 and six per 100 are different proportions.' },
      { id: 'D', text: 'R had more complaints but a lower complaint-per-visit rate.', note: '' },
      { id: 'E', text: 'Exactly 3% of R’s distinct visitors complained.', note: 'Complaints per visit do not establish a share of distinct visitors.' },
    ], answer: 'D', workingMd: 'R has 9 complaints rather than 6, but its complaint-per-visit rate is $9/300=0.03$, or 3%. S’s rate is $6/100=0.06$, or 6%. Distinct visitors are not counted in the passage.', lesson: 'A count and a rate answer different comparison questions.' },
    { id: 'check-3', title: 'Prediction or outcome', topic: 'Verbal comprehension', stimulusMd: 'Most interviewed shopkeepers expect the new footbridge to bring more customers. Construction is scheduled to begin next spring. The report contains no measurement of future customer numbers.', stemMd: 'What can be concluded?', options: [
      { id: 'A', text: 'The bridge has already increased customer numbers.', note: 'Construction has not yet begun, and no such outcome is measured.' },
      { id: 'B', text: 'The report establishes that the bridge will double customer numbers.', note: 'No numerical forecast or guaranteed outcome is given.' },
      { id: 'C', text: 'Most interviewed shopkeepers predict an increase in customers.', note: '' },
      { id: 'D', text: 'Every shopkeeper was interviewed.', note: 'The passage identifies interviewees without describing complete coverage.' },
      { id: 'E', text: 'No customers will use the bridge.', note: 'Absence of future measurement does not establish zero future use.' },
    ], answer: 'C', workingMd: 'The report states an expectation held by most interviewed shopkeepers. That supports a conclusion about their prediction, while leaving the actual future effect unmeasured.', lesson: 'Preserve the distinction between an expectation and an observed result.' },
  ],
  takeaways: ['Attach every count to its group and period.', 'Compare rates only after identifying their denominators.', 'Separate a rising level from a growing increase.', 'A supported inference preserves the passage’s uncertainty.'],
  practice: { examKey: 'tolc-e', domain: 'tolce-verbal', skill: 'tolce-verbal-inferred' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
