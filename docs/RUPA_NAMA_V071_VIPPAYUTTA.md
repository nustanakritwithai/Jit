# JIT V0.7.1 — audit of prenascence dissociation

**Added:** Paṭṭhāna Paccayaniddesa §20 *vippayutta-paccaya*, in the specific form *purejāta-vippayutta*: the corresponding previously-arisen and still-present **five sense-base rūpa** conditions its respective five-sense consciousness and accompanying cetasikas.

## Source hierarchy
- **R0, general definition:** [Paṭṭhāna Paccayaniddesa §20](https://www.opentipitaka.org/texts/abh03m7_mul?ui=en): material and immaterial dhammas are disassociated but can condition one another; this does not by itself make *every* material object a dissociation condition for every citta.
- **R0, applied cases:** [Paṭṭhāna Arisen Triplet](https://dharma.inti.foundation/en/scripture/theravada/abhidhamma-pitaka/patthana1.18) gives prenascent eye-base → eye-consciousness, etc., under dissociation condition.
- **R1 explanation, not Tipiṭaka:** [Nina van Gorkom, The Conditionality of Life](https://www.abhidhamma.org/study/conditionality-of-life/index.html) explains the prenascent dissociation of physical sense-bases and the corresponding consciousness.
- **S scenario declarations:** the visitor labels base/object presence and timing; no actual material interval, mind, or kamma is observed.

| Check | V0.7.1 behavior | Boundary |
|---|---|---|
| Matching base, declared present and previously arisen | `CONDITIONAL_ON_SCENARIO` | conditional classroom example; never `CONFIRMED` |
| Object present but base time missing | §20 base `UNKNOWN` | no `vippayutta/object` role |
| Wrong sense base | rejects as incompatible | e.g. ear-base does not condition eye-consciousness as eye-base |
| Base newly arisen, dissolving, ceased, absent | `BLOCKED_IN_DECLARED_SCENARIO` | only that declared example |
| Citta outside 13–17 and 20–24 | `NOT_EVALUATED` | heart-base and other rūpa–nāma contexts absent |

**API and evidence:** the new proof has `conditionId='vippayutta'`, `conditionNumber=20`, `role='base'`, and `subtype='purejata-vippayutta'`. Exactly **7 condition names/10 role checks** are supported in this narrow demonstration (6 base, 4 object roles). The earlier mental-only registry measures a different scope and is unchanged.

**Verification:** independent positive/negative tests for all ten sense-citta types, five correct base IDs, exclusion of object-§20 claims, wrong-door and timing cases, and tamper rejection. A green CI does not imply all Paṭṭhāna doctrinal relations are verified.

**Still UNKNOWN / not implemented:** conascent or postnascent dissociation; pacchājāta, upanissaya; heart-base and rebirth; physical lifetime of rūpa; complete Paṭṭhāna; actual mind or karmic inference. **UNKNOWN ≠ PASS.**
