# JIT — Causal inference boundary and source audit (Issue #1)

**Status:** implemented as a guardrail, not a complete Paṭṭhāna solver. **UNKNOWN ≠ PASS.**

## What is tested vs. what is only displayed

The app teaches **citta-vīthi sequences** and instantiates **citta–cetasika combinations** from the canonical 121-row association table. It does not observe anyone's consciousness or determine the karmic prerequisites of a moment.

| Input or transition | Evidence class | What may be shown | What must not be inferred |
|---|---|---|---|
| Five-door stages (āvajjana → viññāṇa → sampaṭicchana → santīraṇa → votthapana) under the *declared* illustration of sense-object strength | Abhidhammatthasaṅgaha Chapter IV, conditioned illustration | Ordered *type/function* in a selected worked example | That the modeled physical base, object-age and person's full conditions were observed |
| Five-sense consciousness and receiving/investigating resultants in a *declared* desirable/undesirable object scenario | Manual Ch IV, conditional on the entered premises | `CONDITIONAL_ON_SCENARIO`; the illustrative `cittaId` | Real past kamma, or a certain actual resultant |
| Tadārammaṇa / registration citta | Manual Ch III function classification; Ch IV conditional descriptions | **UNKNOWN**, with an illustrative example only | Unique resultant from object pleasantness alone, without plane/person/rebirth-resultant and preceding javana |
| `yoniso` or `ayoniso manasikāra`, and one speculative attraction/aversion/doubt cue | Manual Ch III §9 guide; Ch IV cognitive-process treatment | **UNKNOWN** for exact citta; allow user-selected example `cittaId` for learning only | Automatically assigning mahākusala **with wisdom** (#31), lobha with wrong view (#1), dosa (#9), or doubt (#11) as the necessary result |
| Any javana example chosen explicitly in a selector | Scenario input | `NOT_INFERRED`, and labeled `user-example-preset` | Treating selected citta as a canonical deduction or a diagnosis |
| First jhāna *worked sequence* | Manual Ch IV | A known illustrated course with required association constraints; no attainment detector | Predicting who has entered appanā or inferring the necessary attainment from a UI toggle |

**Why yoniso does not uniquely identify citta #31:** the commentarial manual differentiates wholesome, unwholesome and functional javanas by both wise/unwise attention and the status of the individual. It further distinguishes *knowledge-associated vs. knowledge-dissociated* and *prompted vs. unprompted* citta types. Hence a simple wise/unwise switch cannot select any one exact type or set every occasional cetasika. The exact type remains unknown without sufficiently grounded conditions. This implementation does **not** claim there is no doctrinal conditioning at all; it says only that the program cannot establish a unique outcome from its current inputs.

## Sources and hierarchy

- **Pāḷi canonical source (direct)**: [Paṭṭhāna Paccayuddesa / Paccayaniddesa](https://dhammatalks.net/suttacentral/sc2016/sc/pi/patthana1.1.html). Gives conditionality categories; does *not* warrant an invented algorithm assigning exact citta from UI cues.
- **Commentarial/manual source (not a direct canonical quote)**: Ācariya Anuruddha, *Abhidhammatthasaṅgaha*, Bhikkhu Bodhi (ed.), [*A Comprehensive Manual of Abhidhamma*](https://www.bps.lk/olib/bp/bp304s_Bfodhi_Comprehensive_Manual_of_Abhidhamma.pdf), particularly Ch III §§9–14 (citta functions and realms) and Ch IV §§4–17 (vīthi, javana, registration).
- **App-only scenario**: hypothetical object desirability, simulated person, preselected javana, count of intervening bhavaṅgas, and assumed first absorption. These are **not** canonical entailments or empirical observations.

## Machine-readable audit fields

Each modeled moment contains `ruleAudit.selection` with:

- `basis`: `commentarial-pattern` or `scenario-assumption` (which rule/choice was used).
- `epistemicStatus`: `CONDITIONAL_ON_SCENARIO`, `UNKNOWN`, or `NOT_INFERRED` for the relevant selections.
- `inference.status`, `inference.exactCittaId`, `inference.exactCetasikaIds`: when inspecting guided attention, both exact values are **null** and the status is **UNKNOWN**.
- `chosenBy: user-example-preset`: a concrete javana shown for education is the *separate selected example*, not the output of a wise/unwise attention inference.

The UI visibly marks `UNKNOWN` and still allows browsing an explicit example. The JSON export preserves this boundary. `validateProcess()` refuses a modified audit that relabels an unknown guided selection as proven, marks registration as commentarially determined, or quietly changes the declared example.

## Test criteria / blocking rules

Run `npm run check && npm test`.

1. Changing attention to wise/unwise or cue to aversion/attraction/doubt **must not change the citta of a given selected example**.
2. Guided choice of a precise citta must report `UNKNOWN` and `exactCittaId === null`.
3. Manual choice must report `NOT_INFERRED`.
4. Registration from object quality only is `UNKNOWN`; sense/receiving/investigating illustrative cases are `CONDITIONAL_ON_SCENARIO`.
5. Tampering with `ruleAudit.selection` to claim `CONFIRMED`, or a specific inferred `cittaId`, must cause **FAIL**, not PASS.
6. Full source-to-matrix tests and Paṭṭhāna rule tests must keep passing. This change does **not** amend the 121 × 52 association table.

## Outstanding limitations

The planner still uses *selected instructional vīthi routes*. It is **not** a general causal selector for all 121 citta types, or a full 24-paccaya calculus. No inference of prior kamma, rebirth, meditative attainment, a real person's citta, or relationships with physical rupa is supported. A missing explanation is **UNKNOWN**, never an invented rule.
