# JIT V0.7 — Source-bound Rūpa–Nāma Conditions

> Historical V0.7 ledger: V0.7.1 now adds a narrowly scoped **§20 prenascence dissociation (sense-base only)**. The older six-condition/nine-role and vippayutta-UNKNOWN lines below describe V0.7, not current V0.7.1. See [V0.7.1 source ledger](RUPA_NAMA_V071_VIPPAYUTTA.md).
**Scope:** only five-sense consciousness (10 types). The display is **conditional on declared premises**, not an observation of matter or real consciousness. **UNKNOWN ≠ PASS; CONDITIONAL_ON_SCENARIO ≠ CONFIRMED**.

## Source hierarchy
- **R0 Canonical:** [Paṭṭhāna Paccayaniddesa (Pāḷi)](https://dhammatalks.net/suttacentral/sc2016/sc/pi/patthana1.1.html) and [parallel English](https://dhammatalks.net/suttacentral/sc2016/sc/en/patthana1.1.html), §§2,8,10,16,21,24.
- **R1 Manual, not direct Tipiṭaka:** [Abhidhammatthasaṅgaha Chapter IV](https://www.ruyimeditation.org/theravada/abhidhamma/vithi-sangaha/) for the conventional 17-citta-moment lifespan of rūpa and the presence phase. The app does **not** compute this lifespan.
- **R2 Explanation:** Nina van Gorkom, [The Conditionality of Life](https://www.abhidhamma.org/study/conditionality-of-life/index.html), on sense bases conditioning later consciousness while present, not during their own arising or dissolution.
- **S Scenario:** Visitors manually declare whether base and object are present and in which material phase; no real measurement or past-kamma assessment occurs.

## Exact pairs tested
| Citta IDs (121 list) | Five-sense base (rūpa ID) | Corresponding object |
|---|---:|---|
| 13,20 eye | 5 | #10 visual |
| 14,21 ear | 6 | #11 sound |
| 15,22 nose | 7 | #12 smell |
| 16,23 tongue | 8 | #13 taste |
| 17,24 body | 9 | #1 earth, #3 fire, **or** #4 air (not #2 water) |

## Six conditions and nine distinct roles in the limited scenario
| Paccayaniddesa | Paccaya | Material base | Material object |
|---|---|---|---|
| §2 | Ārammaṇa | — | yes |
| §8 | Nissaya | yes | — |
| §10 | Purejāta | yes | yes |
| §16 | Indriya | yes | — |
| §21 | Atthi | yes | yes |
| §24 | Avigata | yes | yes |

**9 role checks for 6 condition names do not amount to complete coverage of 24 paccayas.** When material existence and its preexistence/presence are both declared, the website labels the pattern CONDITIONAL_ON_SCENARIO; lacking data is UNKNOWN; absent, newly arisen or dissolving relevant matter BLOCKS only that declared example. No verdict is empirical CONFIRMED.

## Remaining UNKNOWN
Vippayutta (§20), pacchājāta (§11), upanissaya (§9), all heart-base contexts, physical birth/rebirth, precisely timed 17-moment rūpa lifetimes, real sensing, and actual prior kamma.

The earlier mental-only `PACCAYA_24` registry still labels purejāta reference-only **within its original scope**; this page offers a separate conditional material case and does not silently relabel the old coverage measure.

## Test criteria
`npm run check && npm test`; independent witnesses in `tests/rupa-nama.test.js` test all 10 pairings, 6 source locators/9 roles, rejection of wrong doors and fabricated certainty, material arising/presence counterexamples. Green CI means the coded fixtures behave as specified, **not** full scholarly verification of all Theravāda Abhidhamma interpretations.
