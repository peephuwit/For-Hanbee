/* ==========================================================
   CONFIG: การตั้งค่าข้อมูลจดหมายความรัก (Love Letter Config)
   - ปรับแต่งข้อมูลเริ่มต้นของ Hanbee ได้จากไฟล์นี้โดยตรง
   - หรือส่งข้อมูลผ่าน URL Hash: index.html#data=<base64_json>
   - หรือส่งข้อมูลผ่าน URL Query: index.html?name=พิม&code=123456
   ========================================================== */

const DEFAULT_CONFIG = {
  partnerName: "Hanbee",
  passcode: "230349",
  passcodeHint: "วันเกิด / วันสำคัญของเธอ (ววดดปป หรือ 23/03/49) 💕",
  startDate: "2026-04-14T00:00:00", // วันเริ่มต้นสำหรับ Love Counter (14 เมษายน 2026)
  avatarImg: "public/images/photo7.jpg",
  musicSrc: "public/Download (1).mp4",
  floatingPhotos: [
    "public/images/photo1.jpg",
    "public/images/photo2.jpg",
    "public/images/photo3.jpg",
    "public/images/photo4.jpg",
    "public/images/photo5.jpg",
    "public/images/photo6.jpg",
    "public/images/photo8.jpg",
    "public/images/photo9.jpg"
  ],
  hangingPhotoLeft: "public/images/photo4.jpg",
  hangingPhotoRight: "public/images/photo8.jpg",

  // ซองจดหมาย
  letterIntro: "มีจดหมายฉบับหนึ่งมาส่ง ♡",
  letterPeekTop: "ถึง",
  letterPeekSub: "มีเรื่องที่เค้าอยากบอกเธอ",
  letterPeekHint: "ถ้าอยากรู้ก็กดต่อได้เลยยย",

  // เนื้อความในจดหมาย
  letterEyebrow: "ถึง {name}",
  letterTitle: "เรื่องที่<br>อยากบอกก็คือ",
  letterMessage1: "ตั้งแต่ที่เรารู้จักกันเค้าไม่คิดว่าจะมาไกลขนาดนี้ขอบคุณอ้วนมากๆที่ทำผู้ชายคนนึงที่ไม่พร้อมที่จะมีหรือคิดที่จะมีความรักด้วยซ้ำให้กลับมารู้สึกสดใสได้ขนาดนี้ขอบคุณที่อดทนจีบเค้ามาเรื่อยๆขอบคุณที่เข้ามาในชีวิตเค้านะ เค้าอาจจะบอกอะไรเยอะๆไม่ค่อยเก่งแต่ทุกอย่างที่อ้วนทำอยู่ในหัวเค้าหมดเเล้ว <br>อยากจะบอกว่า รักนะ!<br>เค้าทำอันนี้ขึ้นมาตั้งแต่เดือน สิงหาคม 69 เเต่กว่าอ้วนจะได้อ่านก็....ตอนไหนไม่รู้ เเต่ถ้าอ้วนได้อ่านเแปลว่าสิ่งที่เค้าบอกไปทั้งหมดเป็นความจรืง",
  letterMessage2: "เค้าอยากดูเเลเธอ อยากอยู่กับเธอไปตลอดนะ อยากทำอะไรสนุกๆด้วยกัน ไปนู่นไปนี่ด้วยกัน<br><br>ยังไม่จบนะยังมีต่ออีก <br>กด Next เลยยยย!",

  // หน้าขอเป็นแฟน (Proposal)
  proposalQuestion: "เป็นแฟนกันนะ 🥺",
  proposalYesText: "Yes ♡",
  proposalNoText: "No 😝",
  proposalSuccessTitle: "เย่! รักที่สุดเลย ♡🎉",
  proposalSuccessSub: "ห้ามเปลี่ยนใจแล้วนะ!",
  counterTitle: "เรารู้จักกันมา...แล้ว 💕",
  bouquetBadge: "💐 ช่อดอกไม้สำหรับ {name} ♡"
};

// เครื่องมือเข้ารหัส / ถอดรหัส Base64 ปลอดภัยสำหรับภาษาไทยและ Emoji
function encodeLoveConfig(obj) {
  try {
    const jsonStr = JSON.stringify(obj);
    return btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
  } catch (err) {
    console.error("Encoding error:", err);
    return "";
  }
}

function decodeLoveConfig(str) {
  try {
    const jsonStr = decodeURIComponent(Array.prototype.map.call(atob(str), c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonStr);
  } catch (err) {
    console.warn("Decoding error, fallback to default config:", err);
    return null;
  }
}

// ตรวจสอบข้อมูลจาก URL (Hash หรือ Query String)
function parseConfigFromURL() {
  let customConfig = {};

  // 1. ตรวจสอบ Hash (#data=...)
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const dataStr = params.get('data');
    if (dataStr) {
      const decoded = decodeLoveConfig(dataStr);
      if (decoded && typeof decoded === 'object') {
        customConfig = decoded;
      }
    }
  }

  // 2. ตรวจสอบ Search Params (?data=... หรือ ?name=...&code=...)
  if (window.location.search) {
    const searchParams = new URLSearchParams(window.location.search);
    const dataStr = searchParams.get('data');
    if (dataStr && !customConfig.partnerName) {
      const decoded = decodeLoveConfig(dataStr);
      if (decoded && typeof decoded === 'object') {
        customConfig = decoded;
      }
    }

    // Override ง่ายๆ ผ่าน Query Params
    if (searchParams.get('name')) customConfig.partnerName = searchParams.get('name');
    if (searchParams.get('code')) customConfig.passcode = searchParams.get('code');
    if (searchParams.get('date')) customConfig.startDate = searchParams.get('date');
  }

  return { ...DEFAULT_CONFIG, ...customConfig };
}

// โหลดและเตรียม Config ให้ทั่วทั้งแอป
window.APP_CONFIG = parseConfigFromURL();
window.encodeLoveConfig = encodeLoveConfig;
window.decodeLoveConfig = decodeLoveConfig;

// ฟังก์ชันนำค่าจาก Config ไปแสดงผลบน DOM
function applyConfigToDOM(config) {
  if (!config) config = window.APP_CONFIG;
  const name = config.partnerName || "Hanbee";

  // 1. Browser Title
  document.title = `A Letter For ${name} 💌`;

  // 2. Lockscreen Profile & Name
  const iosUserName = document.querySelector('.ios-user-name');
  if (iosUserName) iosUserName.textContent = `${name} ♡`;

  const iosAvatar = document.querySelector('.ios-avatar-img');
  if (iosAvatar && config.avatarImg) iosAvatar.src = config.avatarImg;

  // 3. Hint Modal
  const hintP = document.querySelector('#hint-popup .hint-popup-box p');
  if (hintP && config.passcodeHint) hintP.textContent = config.passcodeHint;

  // 4. Vinyl Music Player Core Image
  const vinylImg = document.querySelector('.vinyl-core');
  if (vinylImg && config.avatarImg) vinylImg.src = config.avatarImg;

  // 5. Hanging Frames
  const hangLeftImg = document.querySelector('#hanging-photo-left img');
  if (hangLeftImg && (config.hangingPhotoLeft || config.avatarImg)) {
    hangLeftImg.src = config.hangingPhotoLeft || config.avatarImg;
  }
  const hangLeftCaption = document.querySelector('#hanging-photo-left .photo-caption');
  if (hangLeftCaption) hangLeftCaption.textContent = `${name} ♡`;

  const hangRightImg = document.querySelector('#hanging-photo-right img');
  if (hangRightImg && (config.hangingPhotoRight || config.avatarImg)) {
    hangRightImg.src = config.hangingPhotoRight || config.avatarImg;
  }
  const hangRightCaption = document.querySelector('#hanging-photo-right .photo-caption');
  if (hangRightCaption) hangRightCaption.textContent = `${name} ♡`;

  // 6. Envelope Peek
  const letterPeek = document.querySelector('.letter-peek');
  if (letterPeek) {
    letterPeek.innerHTML = `<p>${config.letterPeekTop || 'ถึง'}</p><h1>${name}</h1><p>${config.letterPeekSub || 'มีเรื่องที่เค้าอยากบอกเธอ'}</p><p class="peek-hint">${config.letterPeekHint || 'ถ้าอยากรู้ก็กดต่อได้เลยยย'}</p>`;
  }

  // 7. Intro
  const intro = document.querySelector('.intro');
  if (intro && config.letterIntro) {
    intro.innerHTML = `${config.letterIntro} <span class="pulse">♡</span>`;
  }

  // 8. Story Card
  const eyebrow = document.querySelector('#story-card .eyebrow');
  if (eyebrow) eyebrow.textContent = (config.letterEyebrow || 'ถึง {name}').replace('{name}', name);

  const storyH2 = document.querySelector('#story-card h2');
  if (storyH2 && config.letterTitle) storyH2.innerHTML = config.letterTitle;

  const messages = document.querySelectorAll('#story-card .message');
  if (messages.length > 0 && config.letterMessage1) {
    messages[0].innerHTML = config.letterMessage1;
  }
  if (messages.length > 1 && config.letterMessage2) {
    messages[1].innerHTML = config.letterMessage2;
  }

  // 9. Proposal Card
  const bearRibbon = document.querySelector('.bear-badge-ribbon');
  if (bearRibbon) bearRibbon.textContent = `🎀 For ${name}`;

  const questionH1 = document.querySelector('#question-container h1');
  if (questionH1 && config.proposalQuestion) questionH1.textContent = config.proposalQuestion;

  const yesBtn = document.querySelector('#yes-btn');
  if (yesBtn && config.proposalYesText) yesBtn.textContent = config.proposalYesText;

  const noBtn = document.querySelector('#no-btn');
  if (noBtn && config.proposalNoText) noBtn.textContent = config.proposalNoText;

  const successH1 = document.querySelector('#success-message h1');
  if (successH1 && config.proposalSuccessTitle) successH1.textContent = config.proposalSuccessTitle;

  const successP = document.querySelector('#success-message p');
  if (successP && config.proposalSuccessSub) successP.textContent = config.proposalSuccessSub;

  const counterTitle = document.querySelector('.counter-title');
  if (counterTitle && config.counterTitle) counterTitle.textContent = config.counterTitle;

  // 10. Bouquet badge
  const bouquetBadge = document.querySelector('.bouquet-badge');
  if (bouquetBadge) bouquetBadge.textContent = (config.bouquetBadge || '💐 ช่อดอกไม้สำหรับ {name} ♡').replace('{name}', name);

  // 11. Background Music
  const bgMusic = document.getElementById('bg-music');
  if (bgMusic && config.musicSrc) {
    bgMusic.src = config.musicSrc;
  }
}

// สั่งให้แสดงผลตาม Config ทันทีเมื่อ DOM พร้อม
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => applyConfigToDOM(window.APP_CONFIG));
} else {
  applyConfigToDOM(window.APP_CONFIG);
}
