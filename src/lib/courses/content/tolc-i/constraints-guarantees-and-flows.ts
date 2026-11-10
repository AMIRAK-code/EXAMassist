import { md, type Lesson } from '../../types';

export const lesson: Lesson = {
  slug: "constraints-guarantees-and-flows",
  title: "Constraints, guarantees and flows",
  summary: "Organise scheduling clues, find the smallest guaranteed count and combine compatible work rates using a common unit.",
  minutes: 18,
  objectives: [
    "Translate assignment clues into an exclusion grid.",
    "Prove a minimum guarantee with two neighbouring cases.",
    "Combine work rates and identify a bottleneck."
  ],
  teachMd: md`
### Decide what an entry represents

Before doing arithmetic, name the objects in the problem and what one mark on paper will mean. For a shift puzzle, a mark might pair one person with one evening. For a guarantee, a mark might be a parcel assigned to one of several lockers. For a flow, a mark could represent one litre passing a junction in a minute. The words “at least”, “exactly” and “per minute” change what operations are legitimate. Write these qualifiers alongside your sketch so that a neat arrangement on paper still answers the original question.

For a one-to-one assignment draw people down the side of a grid and time slots across its top. Cross out forbidden pairings and tick forced ones. Whenever a row has just one possible slot, tick it and cross out that slot in every other row. A column with a single possible person can be equally informative if every slot needs filling. If people can cover several slots, crossing out an entire row after one assignment would discard legal possibilities. Check the capacity rule before you use the grid.

### Recognise what a guarantee demands

“Can happen” asks for one feasible arrangement. “Must happen” asks for an argument covering them all. Suppose objects are divided among boxes and you want a guarantee that one box contains three objects. Deliberately avoid that outcome by allowing each box at most two. With four boxes you can place eight objects while still avoiding a triple. A ninth forces one box beyond two. This is the pigeonhole principle (*principio dei cassetti*). The balanced arrangement proves that eight is insufficient, and the capacity count proves that nine suffices.

A target can name a particular category instead. To guarantee a green token when drawing without replacement, a deliberately unlucky draw takes every non-green token first. Here the limiting arrangement is concentrated in the wrong categories, whereas in the box example it spreads the objects around. Describe the failure condition in words each time. Then count the largest arrangement compatible with that description. Check also that the inventory really contains enough objects for the proposed guarantee.

### Add contributions in compatible units

If two pumps fill a tank together, convert each completion time into a rate. A pump that fills one tank in six minutes contributes one sixth of a tank per minute. Express the other pump in the same unit, add the fractions and ask how long that combined rate takes to deliver one whole tank. A drain takes water away, so its contribution has a negative sign. Write the direction next to each quantity before adding. If a pump runs only during part of the interval, split the job into phases and calculate the amount moved in each.

Routes can have limits too. Two independent pipes in parallel can both carry water to the destination at the same time. Two pipes in series carry the same stream one after the other. The narrower capacity limits a steady flow through both. At a junction with no storage, inflow must match outflow. Label each link separately and make sure that two seemingly different routes do not both claim the full capacity of a shared link. A drawing with arrows is enough to check where a shared segment begins.

### Verify that your arrangement is attainable

When you have a candidate schedule, read each original clue against the completed grid. When you have a candidate maximum flow, describe an actual allocation of that many units along the routes. Showing that a limit cannot be exceeded only gives an upper bound. Showing a feasible allocation as large as that upper bound establishes the maximum. For a minimum guarantee the corresponding pair of checks is an arrangement just below your answer that fails, and a reason no arrangement at your answer can fail.
`,
  examples: [
    {
      id: "example-1",
      title: "Assign three shifts",
      problemMd: "Ada, Bea and Cal each cover one distinct shift from Monday to Wednesday. Cal works Wednesday. Ada cannot work Monday. When does Bea work?",
      steps: [
        "Cross out Wednesday for both other people.",
        "Ada must take Tuesday, leaving only Monday for Bea."
      ],
      answerMd: "Bea works Monday. The completed schedule satisfies both clues."
    },
    {
      id: "example-2",
      title: "A shared outlet",
      problemMd: "Two inlet pipes deliver up to 4 and 5 litres per minute to one outlet of capacity 7. What steady flow is possible at most?",
      steps: [
        "The inlets could supply nine, but the shared outlet caps the total at seven.",
        "Send four through the first inlet and three through the second to attain the cap."
      ],
      answerMd: "Seven litres per minute. Adding the inlet capacities alone overlooks the outlet."
    }
  ],
  traps: [
    {
      title: "Using a lucky draw",
      md: "A lucky arrangement shows possibility. To prove a guarantee, build the largest arrangement in which the target still fails."
    },
    {
      title: "Adding job times",
      md: "Hours per job cannot be added for simultaneous workers. Convert both numbers to jobs per hour first."
    }
  ],
  check: [
    {
      id: "check-1",
      title: "Three trays",
      topic: "Logic",
      stemMd: "What is the smallest number of discs that guarantees at least four in one tray, however the discs are distributed among three trays?",
      options: [
        {
          id: "A",
          text: "4",
          note: "Four could be split across three trays."
        },
        {
          id: "B",
          text: "9",
          note: "Three discs per tray still avoids four."
        },
        {
          id: "C",
          text: "10",
          note: ""
        },
        {
          id: "D",
          text: "12",
          note: "Multiplying three trays by four discs gives a sufficient total, but ten already forces four discs into one tray."
        },
        {
          id: "E",
          text: "3",
          note: "One disc in each tray would spread them evenly."
        }
      ],
      answer: "C",
      workingMd: "At most three discs in each tray gives room for nine. A tenth breaks that limit, and a three-three-three split shows nine can fail.",
      lesson: "Fill each box to just below the target."
    },
    {
      id: "check-2",
      title: "Simultaneous pumps",
      topic: "Logic",
      stemMd: "Two constant pumps separately fill a vat in 12 and 6 minutes. How long together from empty?",
      options: [
        {
          id: "A",
          text: "4 minutes",
          note: ""
        },
        {
          id: "B",
          text: "3 minutes",
          note: "Halving the faster time treats both pumps as equally fast."
        },
        {
          id: "C",
          text: "6 minutes",
          note: "This ignores the slower pump’s contribution."
        },
        {
          id: "D",
          text: "9 minutes",
          note: "Averaging separate completion times does not combine rates."
        },
        {
          id: "E",
          text: "18 minutes",
          note: "This adds times for two whole vats filled successively."
        }
      ],
      answer: "A",
      workingMd: "Each minute they fill one twelfth plus two twelfths, or a quarter. Four minutes fill the vat.",
      lesson: "Invert the combined rate to obtain the completion time."
    },
    {
      id: "check-3",
      title: "An unlucky draw",
      topic: "Logic",
      stemMd: "A bag holds five white, four grey and three black stones. What is the fewest blind draws without replacement that will guarantee at least two black stones?",
      options: [
        {
          id: "A",
          text: "2",
          note: "The first pair could both be white."
        },
        {
          id: "B",
          text: "9",
          note: "All nine non-black stones might appear first."
        },
        {
          id: "C",
          text: "10",
          note: "Nine non-black stones and one black still fail."
        },
        {
          id: "D",
          text: "12",
          note: "Taking every stone works but is unnecessary."
        },
        {
          id: "E",
          text: "11",
          note: ""
        }
      ],
      answer: "E",
      workingMd: "The largest failing draw contains all nine non-black stones and one black. The eleventh must supply a second black.",
      lesson: "For a named category, exhaust the other categories first."
    }
  ],
  takeaways: [
    "Cross out a slot only when the capacity rule permits it.",
    "Prove both that the bound works and that the previous count can fail.",
    "Check shared links before adding parallel capacities."
  ],
  practice: {
    examKey: "tolc-i",
    domain: "tolci-logic",
    skill: "tolci-logic-problems"
  },
  review: {
    aiAssisted: true,
    independentCheckOn: '2026-11-10',
    expertReview: null
  }
};
