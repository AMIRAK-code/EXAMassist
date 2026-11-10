import { md, type Lesson } from '../../types';

export const normalDistributionAndHypothesisTestsLesson: Lesson = {
  slug: 'normal-distribution-and-hypothesis-tests',
  title: 'The normal distribution and hypothesis tests',
  summary: 'Optional: z-scores, the 68–95–99.7 rule, variance rules, standard errors, confidence intervals, and the logic of hypothesis tests and Type I errors.',
  minutes: 25,
  objectives: [
    'Convert values to z-scores and use the 68–95–99.7 rule to estimate normal probabilities.',
    'Find the variance of a scaled and shifted variable, and of sums and differences of independent random variables.',
    'Compute the standard error of a mean and a 95% confidence interval.',
    'Run a z-test for a mean, and say what Type I errors, Type II errors and p-values do and do not mean.',
  ],
  teachMd: md`
### Why this lesson is optional

Bocconi's current test page describes quantitative reasoning as numerical and logical problems using basic mathematics, and it publishes no topic list. A 2024 sample test on Bocconi's website, which the current page does not link to and which may not reflect today's form, included a Type I error and null-hypothesis item and asked for expected values of random variables. Nothing confirms that inferential statistics appears on the current test. Treat this lesson as extra preparation for that possibility, after the core quantitative reasoning lessons.

### Expected value and variance

A random variable $X$ takes values with given probabilities. Its **expected value** $\mu = E(X)$ is the probability-weighted average of its values, and its **variance** is the expected squared distance from that mean, $\text{Var}(X) = E\big[(X - \mu)^2\big]$. The standard deviation $\sigma$ is the square root of the variance, in the same units as $X$.

If $X$ is 0, 10 or 20 with probabilities 0.2, 0.5 and 0.3, then $E(X) = 0 + 5 + 6 = 11$ and $\text{Var}(X) = 0.2 \times 121 + 0.5 \times 1 + 0.3 \times 81 = 49$, so $\sigma = 7$.

Linear changes behave predictably:
$$E(aX + b) = aE(X) + b, \qquad \text{Var}(aX + b) = a^2\,\text{Var}(X).$$
Adding $b$ slides every value along without spreading them, so the variance is unchanged; multiplying by $a$ stretches every distance by $|a|$ and every squared distance by $a^2$.

For **independent** $X$ and $Y$, variances add, for a difference as well as a sum:
$$\text{Var}(X + Y) = \text{Var}(X - Y) = \text{Var}(X) + \text{Var}(Y).$$
The reason is that $-Y$ has variance $(-1)^2\,\text{Var}(Y) = \text{Var}(Y)$: subtracting a random quantity adds uncertainty. Standard deviations do not add. Independent variables with standard deviations 5 and 12 have a sum, or a difference, with standard deviation $\sqrt{25 + 144} = 13$, not 17. (Without independence a covariance term enters, which this lesson does not need.)

### The normal distribution and z-scores

Many measured quantities are roughly **normal**: a symmetric, bell-shaped density centred on the mean $\mu$, with its spread set by $\sigma$. Probabilities are areas under the curve. Measuring in standard deviations from the mean turns any normal distribution into the standard normal, with mean 0 and standard deviation 1:
$$z = \frac{x - \mu}{\sigma}.$$
If marks have $\mu = 70$ and $\sigma = 8$, a mark of 86 has $z = \frac{16}{8} = 2$, two standard deviations above the mean; a negative $z$ is below the mean.

### The 68–95–99.7 rule

For any normal distribution, approximately:

| Within | Share inside | Share in each tail beyond |
| --- | --- | --- |
| $\mu \pm \sigma$ | 68% | 16% |
| $\mu \pm 2\sigma$ | 95% | 2.5% |
| $\mu \pm 3\sigma$ | 99.7% | 0.15% |

The tail column comes from symmetry: if 68% lies within one standard deviation, 32% lies outside, half on each side. For a lopsided interval, add pieces measured from the mean: from $\mu - \sigma$ to $\mu$ is 34%, from $\mu$ to $\mu + 2\sigma$ is 47.5%. The more exact figure for the central 95% is $\pm 1.96\sigma$, the number used in intervals and tests.

### Sample means and the standard error

The mean $\bar{x}$ of $n$ independent observations, each with standard deviation $\sigma$, varies less from sample to sample than single observations do. By the variance rules, the sum has variance $n\sigma^2$, and dividing by $n$ multiplies the variance by $\frac{1}{n^2}$, so
$$\text{Var}(\bar{x}) = \frac{\sigma^2}{n}, \qquad \text{SE} = \frac{\sigma}{\sqrt{n}}.$$
This is the **standard error** of the mean. Because of the square root, quadrupling the sample halves the standard error, and cutting it to a third needs nine times the sample. For large samples $\bar{x}$ is close to normal even when the data are not (the central limit theorem), so the rule above applies to it.

### Confidence intervals

When $\sigma$ is known, a 95% confidence interval for the population mean is
$$\bar{x} \pm 1.96\,\frac{\sigma}{\sqrt{n}}.$$
With $n = 100$, $\sigma = 15$ and $\bar{x} = 52$, the standard error is 1.5, the margin is $1.96 \times 1.5 = 2.94$, and the interval runs from 49.06 to 54.94. The 95% describes the method: intervals built this way contain the true mean in about 95% of samples. A higher confidence level (2.58 in place of 1.96 for 99%) or a smaller sample makes the interval wider.

### The logic of a hypothesis test

A test starts from a **null hypothesis** $H_0$, the default claim (say, the mean is 500), and an **alternative** $H_1$ (the mean is not 500). Before seeing the data you fix a **significance level** $\alpha$, often 5%. Then you ask how surprising the data would be if $H_0$ were true, measuring the gap in standard errors:
$$z = \frac{\bar{x} - \mu_0}{\sigma / \sqrt{n}}.$$
In a two-sided test at 5%, reject $H_0$ when $|z| > 1.96$; at 1%, when $|z| > 2.58$. Equivalently, a two-sided test at 5% rejects $\mu_0$ exactly when $\mu_0$ lies outside the 95% confidence interval.

| Decision | $H_0$ true | $H_0$ false |
| --- | --- | --- |
| Reject $H_0$ | Type I error (probability $\alpha$) | Correct |
| Do not reject $H_0$ | Correct | Type II error |

A **Type I error** is rejecting a null hypothesis that is true, and the significance level is the probability of making one when $H_0$ is true. A **Type II error** is failing to reject a false one. For a fixed sample size, lowering $\alpha$ makes Type I errors rarer and Type II errors more common; a larger sample can reduce both.

The **p-value** is the probability, computed on the assumption that $H_0$ is true, of a result at least as extreme as the one observed. If $p < \alpha$, reject $H_0$. A p-value is not the probability that $H_0$ is true, it does not measure how large or important an effect is, and failing to reject $H_0$ does not prove it.
`,
  examples: [
    {
      id: 'example-normal-areas',
      title: 'Areas with the 68–95–99.7 rule',
      problemMd: md`Delivery times are approximately normal with mean 30 minutes and standard deviation 4 minutes. About what share of deliveries take (a) longer than 34 minutes, (b) between 22 and 34 minutes?`,
      steps: [
        md`Convert to z-scores: 34 minutes gives $z = \frac{34 - 30}{4} = 1$; 22 minutes gives $z = \frac{22 - 30}{4} = -2$.`,
        md`(a) 68% lies within one standard deviation, so 32% lies outside, half on each side: 16% above $z = 1$.`,
        md`(b) Split the interval at the mean: from $z = -2$ to 0 is half of 95%, 47.5%; from 0 to $z = 1$ is half of 68%, 34%. Together, 81.5%.`,
        md`Check (b) by subtraction: 2.5% lie below 22 minutes and 16% above 34, so $100\% - 2.5\% - 16\% = 81.5\%$.`,
      ],
      answerMd: md`About 16% take longer than 34 minutes and about 81.5% take between 22 and 34 minutes. Answering 32% for (a) counts both tails; only the upper tail is longer than 34 minutes.`,
    },
    {
      id: 'example-z-test',
      title: 'Testing a mean at two significance levels',
      problemMd: md`A producer says its bags of rice weigh 500 g on average, and the standard deviation of bag weights is known to be 10 g. An inspector weighs a random sample of 25 bags and finds a mean of 495 g. Test $H_0: \mu = 500$ against $H_1: \mu \ne 500$ at the 5% and at the 1% significance levels.`,
      steps: [
        md`Standard error of the mean: $\frac{10}{\sqrt{25}} = \frac{10}{5} = 2$ g.`,
        md`Test statistic: $z = \frac{495 - 500}{2} = -2.5$, so the sample mean is 2.5 standard errors below the claimed mean.`,
        md`At 5%: $|z| = 2.5 > 1.96$, so reject $H_0$.`,
        md`At 1%: $2.5 < 2.58$, so do not reject $H_0$.`,
        md`Check with intervals: the 95% interval is $495 \pm 1.96 \times 2 = 495 \pm 3.92$, from 491.08 to 498.92, which excludes 500; the 99% interval is $495 \pm 2.58 \times 2 = 495 \pm 5.16$, from 489.84 to 500.16, which includes 500. Same conclusions.`,
      ],
      answerMd: md`Reject $H_0$ at the 5% level but not at the 1% level, so the p-value lies between 0.01 and 0.05. The tempting error is to divide by $\sigma$ instead of the standard error: $z = \frac{-5}{10} = -0.5$ would wrongly make 495 g look unremarkable.`,
    },
    {
      id: 'example-variance-combination',
      title: 'Mean and variance of a combination',
      problemMd: md`$X$ and $Y$ are independent, with $E(X) = 10$, $\text{Var}(X) = 4$, $E(Y) = 6$ and $\text{Var}(Y) = 9$. Find the expected value, variance and standard deviation of $W = 3X - 2Y + 5$.`,
      steps: [
        md`Expected values pass straight through: $E(W) = 3 \times 10 - 2 \times 6 + 5 = 30 - 12 + 5 = 23$.`,
        md`The constant 5 moves $W$ without spreading it, so it adds nothing to the variance.`,
        md`Coefficients are squared: $\text{Var}(3X) = 9 \times 4 = 36$ and $\text{Var}(-2Y) = (-2)^2 \times 9 = 36$.`,
        md`By independence the variances add, even though $Y$ enters with a minus sign: $\text{Var}(W) = 36 + 36 = 72$, so the standard deviation is $\sqrt{72} = 6\sqrt{2} \approx 8.49$.`,
      ],
      answerMd: md`$E(W) = 23$, $\text{Var}(W) = 72$ and the standard deviation is $6\sqrt{2} \approx 8.5$. Copying the signs and coefficients into the variance, $3 \times 4 - 2 \times 9 + 5 = -1$, gives a negative variance, which is impossible and flags the error.`,
    },
  ],
  traps: [
    {
      title: 'Adding standard deviations, or subtracting variances',
      md: md`For independent variables the variances add, for sums and differences alike; standard deviations do not. Square the standard deviations, add, and take the square root at the end.`,
    },
    {
      title: 'Using σ where the standard error belongs',
      md: md`Questions about a sample mean need the spread of the mean, $\frac{\sigma}{\sqrt{n}}$, not the spread of single values, $\sigma$. Using $\sigma$ makes the test statistic far too close to zero and the interval far too wide.`,
    },
    {
      title: 'Doubling the sample to halve the error',
      md: md`The standard error falls with $\sqrt{n}$, not with $n$. Halving it needs four times the sample; cutting it to a third needs nine times.`,
    },
    {
      title: 'Reading the p-value as the chance that the null is true',
      md: md`A p-value of 0.03 says that, if $H_0$ were true, data at least this extreme would occur about 3% of the time. It is not a 3% chance that $H_0$ is true, and a large p-value does not prove $H_0$.`,
    },
    {
      title: 'Mixing up Type I and Type II',
      md: md`Type I is a false alarm: rejecting a true null hypothesis, with probability $\alpha$. Type II is a miss: keeping a false one. Tie Type I to the decision "reject" and you will not swap them.`,
    },
  ],
  check: [
    {
      id: 'check-normal-band',
      title: 'An interval away from the mean',
      topic: 'Quantitative reasoning: normal distribution',
      stemMd: md`Monthly electricity bills in a town are approximately normal with mean €80 and standard deviation €10. About what percentage of bills are between €90 and €100?`,
      options: [
        { id: 'A', text: md`13.5%`, note: '' },
        { id: 'B', text: md`16%`, note: md`This is the share of all bills above €90; it includes the 2.5% of bills above €100.` },
        { id: 'C', text: md`27%`, note: md`This is the share between one and two standard deviations from the mean on both sides; the question asks only about bills above the mean.` },
        { id: 'D', text: md`47.5%`, note: md`This is the share between the mean and €100; it also counts the bills from €80 to €90.` },
      ],
      answer: 'A',
      workingMd: md`In z-scores, €90 is $z = 1$ and €100 is $z = 2$. From the mean to $z = 2$ is half of 95%, 47.5%; from the mean to $z = 1$ is half of 68%, 34%. The band between them is $47.5\% - 34\% = 13.5\%$. Check: 16% of bills are above €90 and 2.5% above €100, and $16\% - 2.5\% = 13.5\%$.`,
      lesson: 'Convert both ends to z-scores, then build the area from pieces measured from the mean.',
    },
    {
      id: 'check-sample-size',
      title: 'Cutting the standard error',
      topic: 'Quantitative reasoning: sampling',
      stemMd: md`A survey of 100 customers estimates mean monthly spending with a standard error of €6. If the standard deviation of spending stays the same, about how many customers are needed for a standard error of €2?`,
      options: [
        { id: 'A', text: md`300`, note: md`Treats the standard error as inversely proportional to $n$; it is inversely proportional to $\sqrt{n}$, so a third of the error needs nine times the sample.` },
        { id: 'B', text: md`400`, note: md`Applies the four-times rule for halving the error, but here the error must fall to a third; quadrupling the sample only takes it to €3.` },
        { id: 'C', text: md`900`, note: '' },
        { id: 'D', text: md`3,600`, note: md`Multiplies the sample by $6^2 = 36$, squaring the old standard error instead of the ratio $\frac{6}{2} = 3$.` },
      ],
      answer: 'C',
      workingMd: md`$\text{SE} = \frac{\sigma}{\sqrt{n}}$, so $6 = \frac{\sigma}{\sqrt{100}} = \frac{\sigma}{10}$ and $\sigma = 60$. For $\text{SE} = 2$: $\frac{60}{\sqrt{n}} = 2$, so $\sqrt{n} = 30$ and $n = 900$. Check by ratio: the standard error must fall by a factor of 3, so the sample must grow by $3^2 = 9$, and $100 \times 9 = 900$.`,
      lesson: 'The standard error falls with the square root of the sample size, so divide it by k by multiplying n by k squared.',
    },
    {
      id: 'check-variance-combination',
      title: 'Spread of a combination',
      topic: 'Quantitative reasoning: random variables',
      stemMd: md`$X$ and $Y$ are independent random variables with $\text{Var}(X) = 1$ and $\text{Var}(Y) = 4$. What is the standard deviation of $3X - 2Y + 10$?`,
      options: [
        { id: 'A', text: md`1`, note: md`Subtracts the scaled standard deviations, $2 \times 2 - 3 \times 1$; the minus sign in front of $Y$ does not reduce the spread, and standard deviations do not combine by adding or subtracting.` },
        { id: 'B', text: md`5`, note: '' },
        { id: 'C', text: md`7`, note: md`Adds the scaled standard deviations, $3 \times 1 + 2 \times 2$; for independent variables it is the variances that add.` },
        { id: 'D', text: md`25`, note: md`This is the variance; the standard deviation is its square root.` },
      ],
      answer: 'B',
      workingMd: md`$\text{Var}(3X - 2Y + 10) = 3^2 \times 1 + (-2)^2 \times 4 = 9 + 16 = 25$; the constant 10 adds nothing. The standard deviation is $\sqrt{25} = 5$. Check: $3X$ has standard deviation 3 and $2Y$ has standard deviation 4, and for independent variables these combine as $\sqrt{3^2 + 4^2} = 5$.`,
      lesson: 'Square the coefficients, add the variances whatever the signs, ignore constants, and take the square root last.',
    },
    {
      id: 'check-type-one-error',
      title: 'Reading a test result',
      topic: 'Quantitative reasoning: hypothesis tests',
      stemMd: md`A food producer tests $H_0$: the mean weight of its packs is 250 g, against $H_1$: the mean is not 250 g, at the 5% significance level. The test gives a p-value of 0.03. Which statement is correct?`,
      options: [
        { id: 'A', text: md`There is a 3% probability that $H_0$ is true.`, note: md`A p-value is computed on the assumption that $H_0$ is true: it is the probability of data at least this extreme under $H_0$, not the probability of $H_0$ itself.` },
        { id: 'B', text: md`$H_0$ is not rejected, because the p-value is below 5%.`, note: md`Reverses the rule: a p-value below the significance level is the signal to reject $H_0$.` },
        { id: 'C', text: md`$H_0$ is rejected; if $H_0$ is in fact false, this decision is a Type II error.`, note: md`Rejecting a false null hypothesis is the right decision; a Type II error is failing to reject a false one.` },
        { id: 'D', text: md`$H_0$ is rejected; if $H_0$ is in fact true, this decision is a Type I error.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Since $0.03 < 0.05$, $H_0$ is rejected at the 5% level. A Type I error is rejecting a true null hypothesis, so if the mean really is 250 g, this rejection is a Type I error. The p-value says that, if $H_0$ were true, results at least this far from 250 g would turn up about 3% of the time; it does not give the probability that $H_0$ is true. Rejecting a false $H_0$ is correct, and a Type II error can only happen when $H_0$ is not rejected.`,
      lesson: 'Reject when p is below the significance level; a Type I error rejects a true null, a Type II error keeps a false one.',
    },
  ],
  takeaways: [
    md`$z = \frac{x - \mu}{\sigma}$; about 68%, 95% and 99.7% of a normal distribution lie within 1, 2 and 3 standard deviations of the mean.`,
    md`$\text{Var}(aX + b) = a^2\,\text{Var}(X)$, and for independent variables the variances add, for sums and differences alike.`,
    md`The standard error of a mean is $\frac{\sigma}{\sqrt{n}}$: quadrupling the sample halves it.`,
    md`A 95% confidence interval is $\bar{x} \pm 1.96\frac{\sigma}{\sqrt{n}}$; a two-sided test at 5% rejects $\mu_0$ exactly when it lies outside that interval.`,
    md`Reject $H_0$ when $p < \alpha$; a Type I error rejects a true null hypothesis and has probability $\alpha$.`,
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-quantitative-reasoning', skill: 'grad-quant-algebra-problem-solving' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
