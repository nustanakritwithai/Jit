# JIT · Citta & Cetasika Laboratory — V0.2

**ระบบจำลองวิถีจิต–เจตสิก และตารางสัมปโยคแบบตรวจสอบได้** สำหรับการเรียนรู้พระอภิธรรมในเบราว์เซอร์ โดยไม่ต้องมีเซิร์ฟเวอร์

**เว็บไซต์:** https://nustanakritwithai.github.io/Jit/  
**GitHub:** https://github.com/nustanakritwithai/Jit

## มีอะไรใหม่ใน V0.2

1. **ตารางสัมปโยค 89 × 52 และ 121 × 52:** จิต 89 ตามแบบย่อและ 121 ตามแบบแจกแจงโลกุตตรฌาน พร้อมแถวข้อมูลทุกรายการ รหัสจิต กลุ่ม เวทนา ประเภทกุศล/อกุศล/วิบาก/กิริยา
2. **สถานะแต่ละช่อง:** `required` (ต้องเกิด), `optional` (อาจเกิดเมื่อมีปัจจัย), `forbidden` (เกิดไม่ได้) แยกจากค่าที่ *เกิดจริงในกรณีตัวอย่าง* (true/false)
3. **ตัวแก้เงื่อนไขแบบเคารพกฎพระอภิธรรม:** มานะเฉพาะโลภมูลจิตที่ไม่ประกอบทิฏฐิ; ถีนะ–มิทธะต้องเกิดร่วมกัน; อิสสา/มัจฉริยะ/กุกกุจจะเกิดทีละดวง; วิรตี 3 และอัปปมัญญา 2 เกิดแยกกันในกรณีโลกียะ; วิรตี 3 เกิดร่วมกันเสมอในโลกุตตรจิต
4. **ตรวจทุกขณะจิตด้วย canonical citta ID 1–121:** แทนตารางตัวอย่างกว้าง ๆ ที่เคยเลือกเจตสิกโดยไม่ผูกกับชนิดจิตเฉพาะ
5. **ระหว่างวิถีจิต:** ลำดับหลังวิถีทางปัญจทวาร → ภวังค์คั่นจำนวนที่เลือก *เพื่อการศึกษา* → มโนทวารวิถีถัดไป โดยเลือกชวนจิตวิถีหลังแยกจากวิถีแรกได้
6. **เหตุปัจจัย:** ลงทะเบียนปัฏฐาน 24 ปัจจัยเพื่ออ้างอิง แต่เครื่องจำลอง **ครอบคลุมเฉพาะความสัมพันธ์บางส่วน** ที่พอระบุจากข้อมูล ได้แก่ อนันตร, สมนันตร, นัตถิ, วิคต, อาเสวน (เฉพาะชวนะที่ติดกัน), และปัจจัยที่เกิดร่วมภายในขณะ เช่น เหตุ, อารัมมณ, สหชาต, อัญญมัญญ, สัมปยุตต, กัมม, วิปาก
7. **ตรวจสอบ:** ตารางแบบเลื่อนได้/ค้นหาได้, ส่งออก CSV ทั้ง 89 หรือ 121 แถว, ตรวจตัวแปรเพิ่มเติม, กลับไปที่แถวจิตจาก Timeline, ส่งออก JSON วิถีและเหตุปัจจัย

## ความหมายสำคัญ

**จิตกับเจตสิกไม่ได้รวมตัวจนกลายเป็นจิต:** จิต 1 ดวงและเจตสิกที่เกิดร่วมเป็นหนึ่ง *จิตตปบาท* เกิดและดับร่วมกัน ตามประเภทจิตที่อาศัยเหตุปัจจัยกำหนด ตัวแปร 52 ช่องคือ schema ของแอป ไม่ใช่ว่ามีเจตสิกครบ 52 ดวงเกิดพร้อมกัน

**ตาราง 89 ประเภทไม่ใช่ 121 แถวที่ตัดทิ้ง 32:** โลกุตตรจิต 8 ประเภทในตาราง 89 เป็นหมวดรวมระดับฌาน 1–5 เมื่อเลือกแบบ 89 แปดแถวท้ายใช้ชุด `required` เป็นจุดตัด และ `optional` เป็นส่วนที่ขึ้นกับการแจกแจงระดับฌาน จึงไม่ควรนำแถวรวมไปสร้างจิตเฉพาะขณะ ต้องเลือกระดับฌานในแบบ 121 ก่อน

**ตัวเลขในตาราง 2.3 ของตำราหมายถึงรายการองค์ธรรมที่เป็นไปได้ในหมวด ไม่ได้แปลว่าดวงที่ `optional` ทุกดวงเกิดพร้อมกัน:** ตัวอย่างมหากุศลจิตที่ 31 มี 33 ดวงที่ต้องเกิดและ 5 ดวงที่อาจเกิด (วิรตี 3, อัปปมัญญา 2) แต่ห้ามเปิดวิรตีหลายดวงหรืออัปปมัญญา 2 พร้อมกัน

## วิธีใช้งาน

เปิด `index.html` จาก GitHub Pages หรือรันเว็บเซิร์ฟเวอร์ภายใน (`python -m http.server 8080` แล้วเปิด `http://localhost:8080`). ต้องใช้ HTTP เพราะ JavaScript ใช้ ES modules

- กำหนดทวารและระดับอารมณ์ แล้วกดเล่นหรือคลิก Timeline เพื่อดูจิตเกิด–ดับ 17 ขณะในตัวอย่างปัญจทวารเต็ม และ 12 ขณะในตัวอย่างมโนทวารแบบชัด
- เปิด “ต่อมโนทวารวิถี” เลือกชวนจิตวิถีถัดไปกับจำนวนภวังค์คั่นเพื่อทดลองความต่อเนื่องสองวิถี
- เปิดเมนู “ตารางสัมปโยค” เลือก 89/121, ค้นหา, คลิกชื่อจิตเพื่ออ่านว่าดวงใดบังคับ ดวงใดเกิดได้ ทดลองเปิด optional; ระบบจะปฏิเสธชุดที่เข้ากันไม่ได้
- “เหตุปัจจัย” แสดง incoming/outgoing ของขณะที่เลือก, อาเสวนเฉพาะชวนะต่อชวนะ, ภวังค์คั่นที่จำลอง และสารบบอ้างอิง 24 ปัจจัย

## ข้อจำกัดและการตรวจสอบความถูกต้อง

**ส่วนที่นำมาจากตำรา:** จำนวนชนิดจิต 89/121, เจตสิก 52, กฎว่าเจตสิกใดเกี่ยวข้องกับจิตใด, ข้อจำกัด adjuncts, ลำดับวิถีที่แสดงในกรณีศึกษาปกติ และชื่อปัจจัยที่อธิบายได้จากความสัมพันธ์ตัวอย่าง

**ส่วนที่เป็นสมมติฐาน/การกำหนดฉาก:** ชนิดภวังค์และวิบากที่เลือกเป็นหนึ่งกรณีตัวอย่าง, ชนิดชวนจิตที่ผู้ใช้กำหนดในสองวิถี, ภวังค์คั่น 1–8 ขณะ, อัตลักษณ์อารมณ์ `objectId`, ความเร็วภาพและการลากดูด้วย UI ทั้งหมด **ไม่ใช่ข้อมูลว่าจิตจริงมีค่าตามนี้**

**สิ่งที่ยังไม่ใช่การจำลองครบ:** จิต 121 ทุกประเภทอยู่ใน *ตารางสัมปโยค* แต่ไม่ได้แปลว่าเครื่องจำลองวิถีรองรับวิถีพิเศษทั้งหมด (อัปปนา, มรรค–ผล, การตาย/ปฏิสนธิ ฯลฯ). สารบบ 24 ปัจจัยไม่ได้หมายถึงการคำนวณปัจจัยครบทุกอย่าง เช่น วิปปยุตตะ ปุเรชาตะ อธิปติ–อุปนิสสยะหรือการสืบเนื่องของกรรมเฉพาะบุคคล เครื่องจำลองไม่ทำนายผลกรรมและไม่รับรองคุณภาพจิตจริงของผู้ชม

## หลักฐานประกอบกฎ (source map)

* Bhikkhu Bodhi (ed.) et al., **A Comprehensive Manual of Abhidhamma**, BPS (2007), [ฉบับ PDF](https://www.abhidhamma.org/wp-content/uploads/2025/05/bp304s_Bfodhi_Comprehensive_Manual_of_Abhidhamma.pdf)
  * Table **1.1**, printed p. 28 — canonical citta 89/121 numbering
  * Table **1.3**, printed p. 43 — rootless citta numbers and feelings
  * Table **1.4**, printed p. 47 — 24 sense-sphere beautiful cittas
  * Table **2.2**, printed p. 92 — association of mental factors (allowed counts; 11 unfixed adjuncts)
  * Table **2.3**, printed p. 101 — combinations by citta category
  * Chapter **IV**, printed pp. 149–184 — five-door, mind-door, javana and registration processes
  * Chapter **VIII**, Table **8.2**, printed p. 304, §§11–14 — 24 conditional relations; āsevana between preceding/subsequent mundane javanas
* [Abhidhammatthasaṅgaha, chapter II](https://thaipitaka.gitlab.io/sangaha/chapter_2.htm) and [chapter IV](https://thaipitaka.gitlab.io/sangaha/chapter_4.htm) — parallel translation for human auditing

> Editorial policy: never use “UNKNOWN” as PASS. When source claims are disputed or not computable from the implemented scenario, show the limitation explicitly instead of pretending numerical precision.

## Engineering

- `src/data.js` — 52 factor lexicon, UI input vocabulary
- `src/association.js` — 121 concrete citta rows and 89 grouped citta rows, mandatory/optional/forbidden logic
- `src/engine.js` — selected citta instantiation, six-door vīthi, two-stage continuity, invariants
- `src/conditions.js` — 24-condition reference taxonomy, adjacent citta edges and within-moment relations
- `src/matrix-ui.js`, `src/conditions-ui.js`, `src/app.js` — data inspector, causal inspector, interactive simulator
- `tests/` — Node.js tests for full matrix counts, conditional adjunct rules, workflows, paccaya adjacency, no conflation of across-bhavanga and same-moment links

```bash
npm run check
npm test
```

GitHub Actions automatically runs the tests on push and deploys GitHub Pages after the check has completed successfully. V0.2 is an educational implementation, not a canonical machine-readable edition of the entire Paṭṭhāna.