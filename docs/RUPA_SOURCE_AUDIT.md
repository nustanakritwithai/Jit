# JIT V0.6 — Rūpa 28 / Rūpakalāpa 21 Source & Scope Audit

**Scope:** This is a **source-bound catalog with a guarded sense-support example**. It is **not** a working full Paṭṭhāna/physical-dependence solver, not a prediction of consciousness, and not a biological account of the human nervous system.

## Source hierarchy

- **R0 Canonical:** *Dhammasaṅgaṇī* (Abhidhamma Piṭaka), Rūpakaṇḍa, [Rūpavibhatti (Pāli)](https://dhammatalks.net/suttacentral/sc2016/sc/pi/ds2.2.3.html), [English translation](https://dhammatalks.net/suttacentral/sc2016/sc/en/ds2.2.3.html). Primary classifications of material phenomena, the great essentials, sensitivity, the objects and other material categories. **It is not assumed that the exact modern 1–28 numbering below is present in the Piṭaka in this exact order.**
- **R1 Manual:** Ācariya Anuruddha, *Abhidhammatthasaṅgaha*, Chapter VI (*Rūpasaṅgaha*), [Pāli and translation](https://www.ruyimeditation.org/theravada/abhidhamma/rupa-sangaha/). Directly supplies the **28/18+10, four causes 18/15/13/12 and 21 kalāpas 9/6/4/2** enumeration.
- **R1 Expanded guide:** [A Comprehensive Manual of Abhidhamma](https://www.bps.lk/olib/bp/bp304s_Bfodhi_Comprehensive_Manual_of_Abhidhamma.pdf), Chapter VI. Commentary/explanatory source, not the Tipiṭaka itself.
- **S Scenario inputs:** Presence or absence of a base and object declared by the website visitor. This cannot establish a real past kamma, the age of a material phenomenon, or a person’s mind.

## Enumerations and test fixtures

| Rule | Verified fixture / source | Test |
|---|---|---|
| Exactly 28 material phenomena, 11 groups | Chapter VI, rūpasamuddesa | `RUPA_28`, `RUPA_GROUPS` |
| 18 nipphanna + 10 anipphanna | Chapter VI, § enumeration | `CONCRETE_RUPA`, `NONCONCRETE_RUPA` |
| Tangible ≠ 29th rupa; earth/fire/air; water excluded | Chapter VI enumeration of `phoṭṭhabba` | `PHOTTHABBA_3 = [1,3,4]` |
| Inseparable eight | Chapter VI, rūpavibhāga / kalāpa | `AVINIBBHOGA_8 = [1,2,3,4,10,12,13,18]` |
| Four modes of origination: 18/15/13/12 | Chapter VI, rūpasamuṭṭhāna | `RUPA_ORIGINS` |
| Four characteristic phenomena are NOT independently produced by a cause | Chapter VI, `lakkhaṇāni na jāyanti kehici` | `potentialOrigins(25..28) = []` |
| 21 kalāpas: kamma 9, citta 6, temperature 4, nutriment 2 | Chapter VI, kalāpayojanā | `KALAPAS_21` |
| Space and characteristic marks do not count as internal kalāpa members | Chapter VI, `na kalāpaṅgam` | all 21 explicit fixtures |
| Pure octad, decads, vital nonad, speech/sound distinctions | Chapter VI, kalāpa catalogue | `getKalapa`, `evaluateKalapa` |
| Five sense bases / corresponding sense objects | Dhammasaṅgaṇī Rūpakaṇḍa and Chapter VI §§2,6 | `SENSE_RUPA_SUPPORT` 10 entries |
| No unique citta inferred from declared base + object | App epistemic boundary, not a scriptural theorem | `assessSenseSupport` returns `UNKNOWN` / `CONDITIONAL_ON_SCENARIO` / `BLOCKED_IN_DECLARED_SCENARIO`, never `CONFIRMED` |

## Distinctions against misinterpretation

- **Mental life faculty and material life faculty are different.** Rūpa `#17` is not cetasika `#6`.
- **Mental nutriment and material nutritive essence are different categories.** Rūpa `#18` is *ojā*; the earlier mental-food example involved contact, volition, and consciousness.
- **Matter does not know an object.** The labels “eye base” and “object” do not imply that material phenomena are themselves conscious.
- **Heart-base** is identified in the manual/commentarial tradition, so its exact anatomical interpretation cannot be asserted as a direct Buddhist canonical empirical discovery.
- **Production/continuity** in the 28-list describe two aspects of material arising; they are not two independently created primary particles.
- **Rūpa kalāpa** is an Abhidhamma doctrinal classification; it must **not** be labeled a proven physical particle observed in microscopy.
- **A material object's existence doesn't prove that a citta arises.** For a real conclusion the model would need context about the physical base, sense object, their timing and conditioning, and the realm/person. The program has none of those measurements.

## Current limitation flags (UNKNOWN ≠ PASS)

`assessSenseSupport` treats all ten sense consciousnesses as a **conditional example**. Even if the visitor declares both the appropriate base and sensory object present, the program cannot establish any complete occurrence of *purejāta*, *nissaya*, *indriya*, or *vippayutta paccaya* or certify a real conscious moment. The JSON export of the previous JIT cognitive workflow is unchanged.

Not yet implemented: actual material lifetimes, three-submoment synchronisation of rūpa/citta, aggregates by plane and rebirth event, all-cause physical generation, the eleven rūpa classifications beyond Chapter VI inventory, Dhammasaṅgaṇī full exegesis, and actual Paṭṭhāna naya calculations across mental/material phenomena.

**How to test**: `node --check src/rupa.js && node --check src/rupa-ui.js && node --test tests/rupa.test.js`, plus repository-wide `npm run check && npm test`.

**Approval rule**: a green engineering CI indicates that the encoded fixtures behave as written. It does not certify a complete or universally uncontested doctrinal interpretation. Any new relationship must include an independently sourced affirmative fixture, a counterexample, and a documented scope.
