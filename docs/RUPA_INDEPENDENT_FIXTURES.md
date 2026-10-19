# JIT V0.6.1 — Independent Rūpa Fixtures

## Source hierarchy

R1: [A Comprehensive Manual of Abhidhamma](https://www.bps.lk/olib/bp/bp304s_Bfodhi_Comprehensive_Manual_of_Abhidhamma.pdf), Chapter VI. The enumerations 28/18+10, the four origin counts and 21 clusters are taken from this manual/commentarial presentation; the numbering is **not** represented as an identical canonical layout in Dhammasaṅgaṇī.

## Audit table

| Assertion | Exact source | Independently tested expectation |
|---|---|---|
| Rūpa 28, concrete 18, nonconcrete 10 | Ch VI §5 and Table 6.1 | Group and class of each ID 1–28 |
| Tangibles and inseparables | Ch VI §§3, 7 | [1,3,4] tangibles; complete octad |
| Four samutthāna eligibility lists | Ch VI §§14–15 | Exact member sets of 18/15/13/12 |
| Kamma / citta / utu / āhāra kalāpas | Ch VI §§17–20 | Each of 21 group IDs, cause and every member, not just totals |
| Groups possible outside the body | Ch VI §21 | Only temperature pure-octad and sound-nonad flagged externally possible |
| Space and characteristic phenomena | Ch VI §22 | Neither space nor four characteristic marks counted inside any kalāpa |

### Textual consistency note

Chapter VI §18 (Pāli and its accompanying English translation) describes bodily-intimation **navaka**, the inseparable octad plus bodily intimation (8+1=9). A later English prose list under the Guide to §22 uses **decad** for that group. JIT follows the explicitly enumerated components and §18 rather than silently imposing the divergent English wording. The discrepancy is documented, not erased.

## What PASS means

The independent `tests/rupa-manual-fixtures.test.js` hardcodes a second expected full membership table and compares it with `src/rupa.js`. PASS establishes correspondence to these cited printed fixtures, **not** the correctness of all Paṭṭhāna cause–effect relations. Whether a material instance really arose, or a sense-citta actually occurred, stays UNKNOWN. **UNKNOWN ≠ PASS.**
