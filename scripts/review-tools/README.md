# Review tools

Checks and helpers used to take new questions from draft to published. The
full order of steps is in `docs/STATUS-2026-09-30.md`, "How content gets
published". Run everything from the repository root.

| Tool | What it does |
| --- | --- |
| `qa-scan.mjs [exam...]` | Finds damage schema validation cannot see: control characters and tabs where a TeX backslash was eaten, TeX commands without their backslash, unbalanced `$`, newlines inside maths, option counts other than five on the PoliTo and TOLC exams. |
| `render-check.ts [exam...]` (tsx) | Renders every maths-bearing field through the site's own `renderMarkdown` and lists any that fail. `render-errors.ts <file...>` prints the failing spans. |
| `cue-scan.mjs <exam...>` | Answer-length cueing: how often the key is the longest choice, and items where it is at least 30% longer than the next. |
| `numeric-order-scan.mjs` | Numeric choice sets not in ascending order by true value. |
| `two-part-positions.mjs` | Where each blank's correct answer sits in two-part items (position cue). |
| `collect.mjs <journal> <index> <out>` | Gathers blind-solver verdicts from a workflow journal into a by-question file; reports coverage, splits, ambiguity flags and concerns. |
| `build-verdicts.mjs <by-question> <index> <out> [held]` | One `apply-review` verdict per item: publishes only when every blind run agrees and none flags ambiguity. |
| `translate-verdicts.mjs snapshot/translate ...` | Keeps recorded verdicts valid when options are reordered after the solve, by matching option text. |
| `reversion.mjs "<note>" <file...>` | Returns an edited published item to review: bumps the version, clears the old solve, records why. |
| `quarantine.mjs <file> "<reason>"` | Quarantines an item with a recorded reason. |

On Windows, the Git Bash shell collapses doubled backslashes, even inside
quoted heredocs and `node -e`. Write content, or scripts that contain
backslashes, with an editor rather than through the shell.

`docs/review/wave7-held-verdicts.json` holds the recorded blind solves for the
13 wave-7 items still in review. Their ids already match the current option
order.
