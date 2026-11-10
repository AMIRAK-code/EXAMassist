import { md, type Lesson } from '../../types';

export const argumentsLesson: Lesson = {
  slug: 'arguments-assumptions-and-evidence',
  title: 'Arguments, assumptions and evidence',
  summary: 'Separate a conclusion from its support, expose a missing link, and assess how new evidence changes the strength of an argument.',
  minutes: 20,
  objectives: ['Identify evidence and the conclusion it is offered to support.', 'Test a necessary assumption by denying it.', 'Explain why evidence strengthens or weakens a particular inference.'],
  teachMd: md`
### Identify what needs support

An argument offers a reason for accepting a claim. The claim being defended is its conclusion; the supporting statements are its premises. A passage can contain several facts without making an argument at all. “The office opens at nine and closes at five” simply reports a schedule. “The office should open earlier because many visitors arrive before nine” uses an observation to support a recommendation. Before judging either statement, ask what the writer wants you to accept on the basis of something else.

Words such as “therefore”, “so” and “because” can reveal the relationship, but do not let their position replace reading. A conclusion can come first, last or between its reasons. Restate it in a short sentence without changing its strength. “The service may reduce waiting” is a possibility claim; “the service will eliminate waiting” is a much stronger prediction. Evidence adequate for one may be inadequate for the other. Keep recommendations distinct from observations too: what happened and what should be done require different kinds of support.

### Find the missing bridge

Suppose a shop owner says that extending opening hours will increase profit because more people will be able to visit. The observation concerns possible visitors; the conclusion concerns money remaining after costs. The reasoning needs a bridge between them. Extra visits might produce too little revenue to cover extra staffing and electricity. An assumption is a proposition taken for granted in making that move. It need not be stated, and it need not be something the author consciously considered.

For a necessary-assumption question, deny the proposed assumption and ask whether the argument can still work on its own terms. If the plan depends on extra sales covering its extra costs, the denial removes that financial bridge. By contrast, “all visitors will buy something” is stronger than necessary: some visitors could buy nothing while enough others buy to make the plan profitable. Necessary does not mean helpful, and it does not mean the most ambitious version of an unstated claim. Test how much the reasoning actually needs.

### Strengthen a link rather than a topic

New evidence strengthens an argument when it makes the conclusion better supported by its premises. It need not prove the conclusion. If a centre predicts that an earlier opening time will bring more visitors, a survey showing many nearby workers can attend only before their shifts supports the proposed link. A fact about the centre's attractive paint colour concerns the same place but may do nothing for that inference. Topic overlap is weaker than logical relevance.

Likewise, weakening evidence makes the inferential step less secure without needing to establish the opposite conclusion. If the survey counted expressions of interest but most respondents cannot reach the centre before work, the prediction loses support. That does not prove attendance will fall. Read the requested task carefully: “weakens” asks for a direction of change in support, whereas “disproves” would demand more. Avoid rejecting relevant evidence merely because it leaves some uncertainty.

### Check comparisons and causal claims

A common argument observes that one group has a better outcome and attributes the difference to one feature. Suppose stores using a booking system have shorter queues. Perhaps the system helps. But perhaps those stores also have more staff or attract fewer customers. A useful comparison keeps competing explanations as similar as possible. Evidence that staffing, customer volume and measurement conditions were comparable strengthens the claim about the booking system. Evidence that one group had far fewer visitors weakens that particular causal inference.

Time order alone is also insufficient. A fall in complaints after a new policy is compatible with the policy helping, but another change might have occurred at the same time. Ask what would have happened without the policy. A comparison with otherwise similar sites that did not adopt it can be useful. Do not insist that every short argument must settle every imaginable alternative; focus on the evidence actually offered and the specific gap named in the answer choices.

### Evaluate before you choose

An evaluation question asks which missing information would help assess an argument. Try giving the proposed question opposite answers. If one answer would strengthen the reasoning and the other would weaken it, the issue is diagnostically useful. For a claim that a cheaper supplier will reduce total costs, ask whether delivery and defect costs remain comparable. A low purchase price may be outweighed by those other costs. Asking whether the supplier has a long name is unlikely to change the inference in either direction.

Finally, explain your selection using a complete chain: the new fact changes this premise or missing link, which changes support for this conclusion. If you can say only that an option is “relevant”, return to the gap. A precise account helps distinguish a targeted answer from a broadly plausible statement. It also keeps your own views about the policy, product or institution from substituting for the reasoning presented.
`,
  examples: [
    { id: 'profit', title: 'Visitors are not profit', problemMd: 'A gallery director argues: “Evening opening will increase profit because it will attract additional paying visitors.” Name the financial link still needed.', steps: ['The premise concerns additional paid entries, while the conclusion concerns revenue after costs.', 'Additional admission revenue must exceed the additional operating costs for the proposed change to increase profit.'], answerMd: 'The argument needs the extra revenue to outweigh the extra costs. It does not require every visitor to buy a souvenir.' },
    { id: 'queues', title: 'A rival explanation', problemMd: 'Four branches introduced appointment reminders and later had fewer missed visits. During the same period, missed visits also fell equally at four similar branches without reminders. How does that comparison affect the causal claim?', steps: ['The decline is observed both with and without the reminders.', 'An equal decline in the comparison branches makes a shared background cause more plausible, weakening the claim that reminders explain the observed fall.'], answerMd: 'It weakens the attribution to reminders. It does not prove reminders can never have an effect.' },
    { id: 'delivery', title: 'A useful evaluation', problemMd: 'A manager predicts savings from a supplier with lower item prices. Why ask whether the new supplier charges more for delivery?', steps: ['The conclusion concerns total spending, not item prices alone.', 'A large delivery increase could cancel the purchase-price saving; no increase would leave that particular objection absent.'], answerMd: 'Delivery charges help evaluate the missing link between lower item prices and lower total cost.' },
  ],
  traps: [
    { title: 'Selecting a useful but unnecessary assumption', md: 'An assumption that guarantees success may be stronger than the argument requires. Deny it and see whether the reasoning can still survive.' },
    { title: 'Demanding proof from strengthening evidence', md: 'Strengthening is an improvement in support. Evidence can help without settling the conclusion beyond doubt.' },
    { title: 'Confusing a shared topic with a logical link', md: 'An option can mention the same shop or policy while leaving the inference unchanged. State exactly which link the option affects.' },
  ],
  check: [
    { id: 'check-1', title: 'Find the conclusion', topic: 'Logic', stemMd: 'A notice says: “The reading room should open on Sunday, since a survey found that many students cannot attend on weekdays.” What is the conclusion?', options: [
      { id: 'A', text: 'A survey was conducted.', note: 'This is part of the evidence offered, not the recommendation it supports.' },
      { id: 'B', text: 'Many students cannot attend on weekdays.', note: 'This is the stated reason for the proposed change.' },
      { id: 'C', text: 'Every student will attend on Sunday.', note: 'The notice makes no universal prediction of attendance.' },
      { id: 'D', text: 'The reading room should open on Sunday.', note: '' },
      { id: 'E', text: 'The reading room is currently closed all week.', note: 'Weekday access difficulties do not state that the room is closed all week.' },
    ], answer: 'D', workingMd: 'The recommendation is supported by the survey finding. The word “since” introduces the reason; the claim being defended is Sunday opening.', lesson: 'Identify the claim the evidence is intended to support.' },
    { id: 'check-2', title: 'A needed bridge', topic: 'Logic', stemMd: 'A firm predicts that replacing a machine will reduce its total annual operating cost because the replacement uses less electricity. Which assumption is needed for that cost argument?', options: [
      { id: 'A', text: 'The replacement uses no electricity.', note: 'Using less does not require using none; a smaller saving could suffice.' },
      { id: 'B', text: 'Increases in other annual operating costs will not outweigh the electricity saving.', note: '' },
      { id: 'C', text: 'Every other firm will buy the replacement.', note: 'Other firms’ purchasing decisions do not determine this firm’s total cost.' },
      { id: 'D', text: 'The old machine has never been repaired.', note: 'The old repair history alone is not required for a future operating-cost saving.' },
      { id: 'E', text: 'The replacement is smaller in every dimension.', note: 'Physical size is not connected to the annual cost comparison by any premise.' },
    ], answer: 'B', workingMd: 'Lower electricity spending reduces total annual operating cost only if changes elsewhere do not cancel or exceed that saving. Denying the assumption allows a larger maintenance or other cost increase, defeating the proposed cost inference.', lesson: 'A conclusion about a total needs attention to every changing component.' },
    { id: 'check-3', title: 'A weaker causal inference', topic: 'Logic', stemMd: 'A shop reports that sales increased after it changed its window display and concludes the display caused the increase. Which new fact most weakens that attribution?', options: [
      { id: 'A', text: 'The display uses three colours.', note: 'The number of colours does not explain the observed sales change.' },
      { id: 'B', text: 'The manager likes the new display.', note: 'The manager’s preference provides no competing explanation of customer purchases.' },
      { id: 'C', text: 'The display was completed before the sales increase.', note: 'This preserves the required time order rather than challenging the causal attribution.' },
      { id: 'D', text: 'Some customers saw the display.', note: 'Exposure is compatible with the display causing additional purchases.' },
      { id: 'E', text: 'At the same time, the shop began a large discount campaign.', note: '' },
    ], answer: 'E', workingMd: 'The simultaneous discount campaign provides a competing explanation for the increase in sales. The observed before-and-after change therefore gives less isolated support to the display explanation.', lesson: 'Look for another change that could produce the same outcome.' },
  ],
  takeaways: ['Preserve the strength of the conclusion when paraphrasing.', 'A necessary assumption survives a careful denial test.', 'Strengthening and weakening change support without requiring proof.', 'Check rival explanations before accepting a causal claim.'],
  practice: { examKey: 'tolc-e', domain: 'tolce-logic', skill: 'tolce-logic-arguments' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
