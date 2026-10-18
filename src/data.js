/** Canonical 52 mental-factor index (Abhidhammatthasaṅgaha, cetasika-saṅgaha).
 *  The graph coordinates and examples are visualization choices, not scripture. */
const rows = [
[1,'ผัสสะ','Phassa','การกระทบอารมณ์'],[2,'เวทนา','Vedanā','การเสวยอารมณ์'],
[3,'สัญญา','Saññā','การจำหมาย'],[4,'เจตนา','Cetanā','การจงใจและประสานสหชาตธรรม'],
[5,'เอกัคคตา','Ekaggatā','ความมีอารมณ์เป็นหนึ่ง'],[6,'ชีวิตินทรีย์','Jīvitindriya','ความดำรงอยู่ของนามธรรม'],
[7,'มนสิการ','Manasikāra','การใส่ใจอารมณ์'],[8,'วิตก','Vitakka','การยกจิตสู่อารมณ์'],
[9,'วิจาร','Vicāra','การประคองจิตกับอารมณ์'],[10,'อธิโมกข์','Adhimokkha','การตัดสินอารมณ์'],
[11,'วิริยะ','Vīriya','ความเพียร'],[12,'ปีติ','Pīti','ความอิ่มใจ'],[13,'ฉันทะ','Chanda','ความพอใจที่จะกระทำ'],
[14,'โมหะ','Moha','ความหลงไม่รู้ตามจริง'],[15,'อหิริกะ','Ahirika','ไม่ละอายต่อบาป'],
[16,'อโนตตัปปะ','Anottappa','ไม่เกรงกลัวต่อบาป'],[17,'อุทธัจจะ','Uddhacca','ความฟุ้งซ่าน'],
[18,'โลภะ','Lobha','ความติดข้อง'],[19,'ทิฏฐิ','Diṭṭhi','ความเห็นผิด'],[20,'มานะ','Māna','ความถือตัว'],
[21,'โทสะ','Dosa','ความขัดเคือง'],[22,'อิสสา','Issā','ความริษยา'],[23,'มัจฉริยะ','Macchariya','ความตระหนี่'],
[24,'กุกกุจจะ','Kukkucca','ความเดือดร้อนใจ'],[25,'ถีนะ','Thīna','ความหดหู่'],
[26,'มิทธะ','Middha','ความง่วงเหงา'],[27,'วิจิกิจฉา','Vicikicchā','ความสงสัยลังเลในธรรม'],
[28,'สัทธา','Saddhā','ความเชื่อมั่นที่ดี'],[29,'สติ','Sati','ความระลึกรู้ไม่เผลอ'],
[30,'หิริ','Hirī','ความละอายต่อบาป'],[31,'โอตตัปปะ','Ottappa','ความเกรงกลัวต่อบาป'],
[32,'อโลภะ','Alobha','ความไม่ติดข้อง'],[33,'อโทสะ','Adosa','ความไม่ขัดเคือง'],
[34,'ตัตรมัชฌัตตตา','Tatramajjhattatā','ความเป็นกลางในธรรมที่เกิดร่วม'],
[35,'กายปัสสัทธิ','Kāyapassaddhi','ความสงบของเจตสิก'],[36,'จิตตปัสสัทธิ','Cittapassaddhi','ความสงบของจิต'],
[37,'กายลหุตา','Kāyalahutā','ความเบาของเจตสิก'],[38,'จิตตลหุตา','Cittalahutā','ความเบาของจิต'],
[39,'กายมุทุตา','Kāyamudutā','ความอ่อนโยนของเจตสิก'],[40,'จิตตมุทุตา','Cittamudutā','ความอ่อนโยนของจิต'],
[41,'กายกัมมัญญตา','Kāyakammaññatā','ความควรแก่การงานของเจตสิก'],[42,'จิตตกัมมัญญตา','Cittakammaññatā','ความควรแก่การงานของจิต'],
[43,'กายปาคุญญตา','Kāyapāguññatā','ความคล่องแคล่วของเจตสิก'],[44,'จิตตปาคุญญตา','Cittapāguññatā','ความคล่องแคล่วของจิต'],
[45,'กายุชุกตา','Kāyujukatā','ความตรงของเจตสิก'],[46,'จิตตุชุกตา','Cittujukatā','ความตรงของจิต'],
[47,'สัมมาวาจา','Sammāvācā','การเว้นวจีทุจริต'],[48,'สัมมากัมมันตะ','Sammākammanta','การเว้นกายทุจริต'],
[49,'สัมมาอาชีวะ','Sammāājīva','การเว้นมิจฉาชีพ'],[50,'กรุณา','Karuṇā','ความกรุณาต่อผู้ทุกข์'],
[51,'มุทิตา','Muditā','ความยินดีต่อผู้ได้ดี'],[52,'ปัญญินทรีย์','Paññindriya','ความรู้ตามเป็นจริง']
];
export const GROUPS = [
 {id:'universal',name:'สัพพจิตตสาธารณะ',short:'เกิดกับจิตทุกดวง',count:7,color:'#51b9f9'},
 {id:'occasional',name:'ปกิณณกเจตสิก',short:'เกิดได้บางประเภทจิต',count:6,color:'#a88aff'},
 {id:'unwholesome',name:'อกุศลเจตสิก',short:'ฝ่ายอกุศล',count:14,color:'#fb797f'},
 {id:'beautiful',name:'โสภณเจตสิก',short:'ฝ่ายดีงาม',count:25,color:'#58dab5'}
];
export const FACTORS = Object.freeze(rows.map(([id,name,pali,meaning]) => Object.freeze({
 id, name, pali, meaning,
 group:id<=7?'universal':id<=13?'occasional':id<=27?'unwholesome':'beautiful',
 subgroup:id<=7?'สัพพจิตตสาธารณะ 7':id<=13?'ปกิณณกะ 6':id<=17?'อกุศลสาธารณะ 4':id<=20?'โลภะหมวด 3':id<=24?'โทสะหมวด 4':id<=26?'ถีนมิทธะ 2':id===27?'วิจิกิจฉา 1':id<=46?'โสภณสาธารณะ 19':id<=49?'วิรตี 3':id<=51?'อัปปมัญญา 2':'ปัญญา 1'
})));
export const BY_ID = new Map(FACTORS.map(x=>[x.id,x]));
export const IDS = Object.freeze({
 universal:[1,2,3,4,5,6,7],occasional:[8,9,10,11,12,13],
 akusalaCommon:[14,15,16,17],beautifulCommon:Array.from({length:19},(_,i)=>i+28)
});
export const DOORS = [
 {id:'eye',name:'จักขุทวาร · รูป',sense:'จักขุวิญญาณ',object:'รูปารมณ์'},
 {id:'ear',name:'โสตทวาร · เสียง',sense:'โสตวิญญาณ',object:'สัททารมณ์'},
 {id:'nose',name:'ฆานทวาร · กลิ่น',sense:'ฆานวิญญาณ',object:'คันธารมณ์'},
 {id:'tongue',name:'ชิวหาทวาร · รส',sense:'ชิวหาวิญญาณ',object:'รสารมณ์'},
 {id:'body',name:'กายทวาร · สัมผัส',sense:'กายวิญญาณ',object:'โผฏฐัพพารมณ์'},
 {id:'mind',name:'มโนทวาร · ธรรมารมณ์',sense:'มโนวิญญาณ',object:'ธรรมารมณ์'}
];
export const INTENSITIES = [
 {id:'very-great',name:'อติมหันตารมณ์ — ครบ 17 ขณะ'},
 {id:'great',name:'มหันตารมณ์ — ถึงชวนะ'},
 {id:'slight',name:'ปริตตารมณ์ — ถึงโวฏฐัพพนะ'},
 {id:'very-slight',name:'อติปริตตารมณ์ — ภวังค์ไหวเท่านั้น'}
];
export const JAVANAS = [
 {id:'kusala_wisdom',name:'มหากุศลประกอบปัญญา',tone:'beautiful',base:'kusala',extra:[],description:'ตัวอย่างกามาวจรมหากุศล โสมนัส ประกอบปัญญา'},
 {id:'kusala_compassion',name:'มหากุศล + กรุณา',tone:'beautiful',base:'kusala',extra:[50],description:'ตัวอย่างกุศลที่มีกรุณาเกิดร่วม'},
 {id:'kusala_joy',name:'มหากุศล + มุทิตา',tone:'beautiful',base:'kusala',extra:[51],description:'ตัวอย่างกุศลที่มีมุทิตาเกิดร่วม'},
 {id:'kusala_speech',name:'มหากุศล + สัมมาวาจา',tone:'beautiful',base:'kusala',extra:[47],description:'วิรตีการเว้นวจีทุจริตหนึ่งอย่าง'},
 {id:'kusala_action',name:'มหากุศล + สัมมากัมมันตะ',tone:'beautiful',base:'kusala',extra:[48],description:'วิรตีการเว้นกายทุจริตหนึ่งอย่าง'},
 {id:'kusala_livelihood',name:'มหากุศล + สัมมาอาชีวะ',tone:'beautiful',base:'kusala',extra:[49],description:'วิรตีการเว้นมิจฉาชีพหนึ่งอย่าง'},
 {id:'kusala_neutral',name:'มหากุศลอุเบกขาประกอบปัญญา',tone:'beautiful',base:'kusala-neutral',extra:[],description:'จิตกุศลที่ประกอบอุเบกขาเวทนา ไม่มีปีติ'},
 {id:'lobha_view',name:'โลภมูลจิต + ทิฏฐิ',tone:'unwholesome',base:'lobha',extra:[19],description:'โสมนัส สัมปยุตด้วยความเห็นผิด อสังขาริก'},
 {id:'lobha_conceit',name:'โลภมูลจิต + มานะ',tone:'unwholesome',base:'lobha',extra:[20],description:'ตัวอย่างโลภมูลจิตไม่ประกอบทิฏฐิ มีมานะเกิดร่วม'},
 {id:'lobha_sloth',name:'โลภมูลจิต + ถีนะมิทธะ',tone:'unwholesome',base:'lobha',extra:[25,26],description:'ตัวอย่างโลภมูลจิตสสังขาริกที่มีถีนะและมิทธะเกิดร่วม'},
 {id:'dosa',name:'โทสมูลจิต',tone:'unwholesome',base:'dosa',extra:[],description:'จิตมีโทสะ โทมนัส และไม่มีปีติ'},
 {id:'dosa_envy',name:'โทสมูลจิต + อิสสา',tone:'unwholesome',base:'dosa',extra:[22],description:'โทสะประกอบความริษยา'},
 {id:'dosa_stingy',name:'โทสมูลจิต + มัจฉริยะ',tone:'unwholesome',base:'dosa',extra:[23],description:'โทสะประกอบความตระหนี่'},
 {id:'dosa_remorse',name:'โทสมูลจิต + กุกกุจจะ',tone:'unwholesome',base:'dosa',extra:[24],description:'โทสะประกอบความเดือดร้อนใจ'},
 {id:'moha_doubt',name:'โมหมูลจิต + วิจิกิจฉา',tone:'unwholesome',base:'moha-doubt',extra:[27],description:'ไม่เกิดอธิโมกข์และฉันทะ'},
 {id:'moha_restless',name:'โมหมูลจิต + อุทธัจจะ',tone:'unwholesome',base:'moha-restless',extra:[],description:'โมหมูลจิตฝ่ายอุทธัจจะ มีอธิโมกข์'}
];
export const SOURCES = [
 {title:'BPS · A Comprehensive Manual of Abhidhamma (ตาราง 1.1, 2.2, 2.3, 8.2)',url:'https://www.abhidhamma.org/wp-content/uploads/2025/05/bp304s_Bfodhi_Comprehensive_Manual_of_Abhidhamma.pdf'},
 {title:'Abhidhammattha-saṅgaha · Chapter II: Cetasika',url:'https://thaipitaka.gitlab.io/sangaha/chapter_2.htm'},
 {title:'Abhidhammattha-saṅgaha · Chapter IV: Cognitive Process',url:'https://thaipitaka.gitlab.io/sangaha/chapter_4.htm'},
 {title:'Conditionality of Life · นิพนธ์ Nina van Gorkom',url:'https://www.abhidhamma.org/study/conditionality-of-life/index.html'}
];