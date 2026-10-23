"use strict";

// Personalize the gift here. No network requests, cookies or browser storage.
const CLASS_NAME = "Lớp chúng mình";
const SENDER_NAME = "Từ các bạn trong lớp, with love ♡";
// Client-side recipient lookup, not secure authentication. Never persisted.
// type: 1 = cùng lớp; type: 2 = người thân quen ngoài lớp.
// Thêm người: "12345678": { name: "Họ và tên", type: 2 },
// special chỉ dùng cho lời chúc riêng của Ý Ly.
const STUDENTS = Object.freeze({
  "26520496": { name: "Nguyễn Thị Thu Hân", type: 1 },
  "26520522": { name: "Nguyễn Thu Hiền", type: 1 },
  "26521078": { name: "Phùng Yến Lam", type: 1 },
  "26521334": { name: "Ôn Huỳnh Hiếu Ngân", type: 1 },
  "26521486": { name: "Lê Uyển Nhi", type: 1 },
  "26521883": { name: "Đinh Thái Thanh Thảo", type: 1 },
  "26521623": { name: "Lê Trần Thiên Phúc", type: 1 },
  "26521429": { name: "Trương Nam Nguyên", type: 1 },
  "26521715": { name: "Lê Tuấn Quang", type: 1 },
  "26522121": { name: "Huỳnh Minh Triết", type: 1 },
  "26520277": { name: "Kiều Văn Đạt", type: 1 },
  "26520548": { name: "Nguyễn Minh Hiếu", type: 1 },
  "26521936": { name: "Nguyễn Văn Thịnh", type: 1 },
  "26522227": { name: "Đặng Võ Hoàng Uyên", type: 1 },
  "21703244": { name: "Trần Thảo Vy", type: 2 },
  "01000280": { name: "Trần Diệu Thảo", type: 2 },
  "25520471": { name: "Lê Nguyễn Thu Hà", type: 2 },
  "51150102": { name: "Phạm Thị Như Phương", type: 2 },
  "21002815": { name: "Trần Yến An", type: 2 },
  "54010035": { name: "Lê Hoàng Thảo Ly", type: 2 },
  "22062007": { name: "Nguyễn Anh Thư", type: 2 },
  "16062004": { name: "Mạnh Thị Diễm Hương", type: 2 },
  "83927359": { name: "Đào Thị Quỳnh Anh", type: 2 },
  "26521177": { name: "Lương Ý Ly", type: 1, special: true, shortName: "Ý Ly" }
});
let recipient = null;
let cardURL = null;
let cardBusy = false;
let recipientVersion = 0;
const specialMessage = "Ý Ly ơi, gửi cậu một vườn hoa và một cái ôm bé xíu! Chúc cậu cười thật nhiều, deadline ngoan ngoãn và ngày nào cũng có điều dễ thương tìm đến. Hôm nay cứ nhận hoa, còn đáng yêu thì cậu làm sẵn rồi ♡";
function recipientMessage() {
  if (recipient?.special) return specialMessage;
  if (recipient?.type === 2) return `Gửi ${recipient.name} một ngày 20/10 thật nhiều niềm vui và những điều dịu dàng. Chúc bạn học tập thật tốt, deadline nhẹ nhàng và luôn có thời gian cho điều mình thích. Luôn tự tin và xinh theo cách của mình nhé ♡`;
  return `Chúc ${recipient?.name || "bạn"} một ngày 20/10 thật rực rỡ, thật nhiều tiếng cười và yêu thương. Mong lớp mình sẽ có thêm thật nhiều kỷ niệm đẹp cùng nhau. Luôn tự tin và xinh theo cách của mình nhé ♡`;
}
function recipientSender() {
  if (recipient?.special) return "Từ tớ, gửi cậu một chút yêu thương ♡";
  return recipient?.type === 2 ? "Gửi bạn chút yêu thương, with love ♡" : SENDER_NAME;
}
function recipientLetter() {
  if (recipient.special) return [
    "Gửi Ý Ly, cô bạn đáng yêu của tớ,",
    "Happy 20/10, Ý Ly! Tớ gói một chút dịu dàng, một chút lấp lánh và thật nhiều niềm vui vào lá thư này cho cậu.",
    "Mong cậu luôn có người nghe những câu chuyện nhỏ, có một món ngon vào ngày mệt và một lý do để mỉm cười mỗi sáng. Deadline có thể hơi khó chiều, nhưng nhớ nhẹ nhàng với bản thân nha. Cậu xứng đáng với những điều thật dễ thương.",
    "Cảm ơn vì cậu là cậu. Gửi một cái ôm bé xíu, nhận giúp tớ nhé ♡"
  ];
  if (recipient.type === 2) return [
    `Gửi ${recipient.name} thân mến,`,
    `Nhân ngày 20/10, gửi ${recipient.shortName} một bó hoa nhỏ và những lời chúc thật lòng. Chúc bạn luôn vui vẻ, tự tin và được yêu thương theo cách mình xứng đáng.`,
    "Mong những ngày đi học của bạn có thật nhiều niềm vui, bài vở thuận lợi, điểm số như ý và deadline cũng nhẹ nhàng một chút. Giữa những lúc bận rộn, nhớ dành thời gian cho điều mình thích và nghỉ ngơi thật đủ nhé.",
    "Thật vui vì chúng ta có duyên quen biết nhau. Chúc những điều tốt lành sẽ ghé thăm bạn, hôm nay và cả những ngày sau nữa ♡"
  ];
  return [
    `Gửi ${recipient.name} thân mến,`,
    `Nhân ngày 20/10, chúc ${recipient.shortName} luôn xinh đẹp, tự tin và thật nhiều niềm vui.`,
    "Mong rằng những năm tháng đại học của chúng ta sẽ có thật nhiều kỷ niệm đẹp, những buổi học vui, những lần cùng nhau vượt deadline và cả những khoảnh khắc rất đỗi bình thường nhưng sau này nhớ lại vẫn thấy đáng yêu.",
    `Cảm ơn ${recipient.shortName} vì đã là một phần thật đặc biệt của tập thể lớp.`
  ];
}

const flowerWishes = [
  { title: "Xinh theo cách của bạn", color: "rose", text: "Chúc bạn ngày nào cũng xinh, mà không cần cố gắng để trở thành phiên bản của ai khác ♡" },
  { title: "Deadline cũng dịu dàng", color: "cream", text: "Mong deadline nhẹ tay với bạn, còn điểm số thì hào phóng một chút ✨" },
  { title: "Những ngày thật đáng nhớ", color: "blush", text: "Chúc bạn luôn gặp những người thật lòng, những chuyện vui và những ngày đáng nhớ." },
  { title: "Hôm nay, bạn tỏa sáng", color: "peach", text: "Hôm nay bạn là nhân vật chính, nên cứ tự tin tỏa sáng nha 🌷" },
  { title: "Dịu dàng với chính mình", color: "mauve", text: "Mong bạn luôn đủ dũng cảm để theo đuổi điều mình thích, và đủ dịu dàng với chính mình." },
  { title: "Nhiều niềm vui, ít bug", color: "pink", text: "Chúc bạn có thật nhiều ngày vui, nhiều ảnh xinh và thật ít bug trong cuộc sống 💗" }
];

const randomMessages = [
  "Hôm nay vũ trụ xác nhận: bạn xinh 100 điểm!",
  "Một chiếc deadline dễ thở sắp đến với bạn.",
  "Bạn vừa nhận +100 năng lượng tích cực.",
  "Chúc bạn luôn được yêu thương theo cách bạn xứng đáng.",
  "Một ngày tuyệt vời đang chờ bạn phía trước.",
  "Bạn chính là một bông hoa rất đặc biệt ♡"
];

// Dạng 2 vẫn có lời chúc học tập, chỉ đổi những câu chưa phù hợp với người ngoài lớp.
const personalFlowerWishes = flowerWishes.map((wish, index) => index === 5
  ? { ...wish, title: "Nhiều niềm vui, ít âu lo", text: "Chúc bạn có thật nhiều ngày vui, nhiều ảnh xinh và thật ít âu lo trong cuộc sống 💗" }
  : { ...wish });
const personalRandomMessages = [...randomMessages];
function getFlowerWish(index) {
  return recipient?.type === 2 ? { ...flowerWishes[index], ...personalFlowerWishes[index] } : flowerWishes[index];
}
function giftMessages() { return recipient?.type === 2 ? personalRandomMessages : randomMessages; }
function updateRecipientLabels() {
  $$(".sender-name").forEach(el => { el.textContent = recipientSender(); });
  $$(".class-name").forEach(el => { el.textContent = recipient?.special ? "just for you" : recipient?.type === 2 ? "gửi một người thân quen" : CLASS_NAME; });
  $$(".garden-flower").forEach((button, i) => {
    const seen = state.seen.has(i);
    button.setAttribute("aria-label", `${seen ? "Đã khám phá" : "Khám phá"} bông hoa ${i + 1}: ${getFlowerWish(i).title}${seen ? ". Đọc lại lời chúc" : ""}`);
  });
}

const sceneConfig = [
  { label: "a little surprise", title: "Một điều bất ngờ", heading: "intro-title" },
  { label: "the blooming garden", title: "Khu vườn lời chúc", heading: "garden-title" },
  { label: "a letter for you", title: "Lá thư gửi bạn", heading: "letter-title" },
  { label: "a little magic", title: "Một chút may mắn", heading: "magic-title" },
  { label: "make a wish", title: "Điều ước nho nhỏ", heading: "wish-title" },
  { label: "beautiful souls", title: "Happy 20/10", heading: "finale-title" }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
const state = { scene: 0, highest: 0, transitioning: false, bloomed: false, blooming: false, letterOpen: false, letterOpening: false, giftBusy: false, wishSent: false, seen: new Set(), messageBag: [], lastMessage: -1 };
const scenes = $$(".scene");
const sceneTimers = new Set();
let flowerId = 0;

// Every flower is original inline vector artwork. Rotated petal groups retain
// their own origins, so blooming opens individual petals, not a flat picture.
const palettes = {
  rose: ["#fff0f0", "#f6b4c9", "#d85b8b", "#973359"],
  cream: ["#fffff7", "#f7e9d8", "#d5b79c", "#a78368"],
  blush: ["#fff5f4", "#f6d3dc", "#dfa6b9", "#bb7a98"],
  peach: ["#fff8e9", "#f9d1c0", "#e7a593", "#c67e78"],
  mauve: ["#fff1f3", "#e7bfd1", "#c791b1", "#9b668c"],
  pink: ["#fff0f3", "#f4acc8", "#d84b85", "#9b285c"]
};

function flowerSVG(color = "rose", { bud = false, stem = false, variant = 0 } = {}) {
  const id = `f${++flowerId}`;
  const [light, mid, dark, deep] = palettes[color] || palettes.rose;
  let petals = "";
  const rings = [
    { count: 10, radius: 123, width: 54, offset: 12 },
    { count: 10, radius: 103, width: 43, offset: 29 },
    { count: 9, radius: 81, width: 34, offset: 9 },
    { count: 8, radius: 61, width: 26, offset: 28 },
    { count: 7, radius: 42, width: 18, offset: 2 },
    { count: 5, radius: 24, width: 12, offset: 33 }
  ];
  rings.forEach((ring, layer) => {
    for (let petal = 0; petal < ring.count; petal++) {
      const angle = petal * 360 / ring.count + ring.offset + variant * 13;
      const radius = ring.radius * (1 + Math.sin(petal * 2.4 + variant) * .1);
      const width = ring.width * (1 + Math.cos(petal * 1.7 + variant) * .18);
      const path = `M 0 10 C ${-width * .4} -8 ${-width * 1.08} ${-radius * .48} ${-width} ${-radius * .76} C ${-width * 1.1} ${-radius * .98} ${-width * .54} ${-radius * 1.06} ${-width * .14} ${-radius * .98} C ${width * .2} ${-radius * 1.08} ${width * .92} ${-radius * 1.02} ${width} ${-radius * .82} C ${width * 1.18} ${-radius * .52} ${width * .35} -9 0 10 Z`;
      const type = layer < 2 ? "outer-petal" : layer < 4 ? "middle-petal" : "inner-petal";
      // Inner layers open first, outer petals follow in a gentle spiral.
      const delay = (5 - layer) * .1 + petal * .016;
      petals += `<g transform="rotate(${angle.toFixed(2)})"><g class="petal ${type}" style="--petal-delay:${delay.toFixed(3)}s"><path d="${path}" fill="url(#${id}-p${layer % 3})" stroke="${deep}" stroke-opacity=".24" stroke-width=".8"/><path d="M ${-width * .93} ${-radius * .77} C ${-width} ${-radius * .97} ${-width * .48} ${-radius * 1.01} ${-width * .14} ${-radius * .94} C ${width * .2} ${-radius * 1.035} ${width * .86} ${-radius * .98} ${width * .93} ${-radius * .81}" fill="none" stroke="${light}" stroke-opacity=".65" stroke-width="1"/><path d="M 0 -5 Q ${-width * .42} ${-radius * .48} ${-width * .22} ${-radius * .84}" fill="none" stroke="${light}" stroke-opacity=".2" stroke-width="1"/></g></g>`;
    }
  });
  return `<svg class="flower-art${bud ? " is-bud" : ""}" viewBox="0 0 320 ${stem ? 370 : 310}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><defs>
    <linearGradient id="${id}-p0" x1=".2" y1="0" x2=".72" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="${light}"/><stop offset=".27" stop-color="${mid}"/><stop offset=".75" stop-color="${dark}"/><stop offset="1" stop-color="${deep}"/></linearGradient>
    <linearGradient id="${id}-p1" x1="0" y1=".1" x2=".8" y2=".85"><stop stop-color="${light}"/><stop offset=".38" stop-color="${mid}"/><stop offset="1" stop-color="${deep}"/></linearGradient>
    <linearGradient id="${id}-p2" x1=".8" y1="0" x2=".25" y2="1"><stop stop-color="${light}"/><stop offset=".24" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
    <linearGradient id="${id}-leaf" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#c9ceaf"/><stop offset=".5" stop-color="#a8b58d"/><stop offset="1" stop-color="#7f966e"/></linearGradient>
    <radialGradient id="${id}-shadow"><stop stop-color="${deep}" stop-opacity=".16"/><stop offset="1" stop-color="${deep}" stop-opacity="0"/></radialGradient>
    </defs>
    ${stem ? `<path d="M160 170Q148 264 164 351" fill="none" stroke="#9cae88" stroke-width="3"/><g class="flower-leaf"><path d="M157 295C108 293 92 263 88 247C122 245 153 263 157 295Z" fill="url(#${id}-leaf)"/><path d="M158 310C192 306 223 272 228 247C189 249 162 273 158 310Z" fill="url(#${id}-leaf)"/><path d="M91 250L154 290M224 251L163 304" fill="none" stroke="#e3e5cf" stroke-width="1"/></g>` : `<g opacity=".8"><path d="M92 191Q28 196 15 246Q79 254 119 214Z" fill="url(#${id}-leaf)"/><path d="M210 207Q258 220 299 174Q245 161 210 207Z" fill="url(#${id}-leaf)"/><path d="M22 242L108 209M218 206L288 179" stroke="#e0e2cc" fill="none"/></g>`}
    <ellipse cx="160" cy="163" rx="139" ry="137" fill="url(#${id}-shadow)"/>
    <g class="flower-head"><g transform="translate(160 145)"><circle class="flower-core" r="58" fill="${deep}"/>${petals}<path d="M-7 0C-18-14 8-23 13-10C18 2-1 12-6 3C-10-5 5-9 6-3" fill="${mid}" stroke="${light}" stroke-width="2" stroke-linecap="round"/></g></g>
    <g class="bud-cup"><g transform="translate(160 145)">
      <path d="M-57-48C-62-78-34-99-8-85C17-107 50-80 57-49C69 0 45 57 0 68C-43 56-65 3-57-48Z" fill="url(#${id}-p0)"/>
      <path d="M-29-64C-40-86 8-99 25-72C39-52 18-23-2 0C-29-16-40-43-29-64Z" fill="url(#${id}-p1)" stroke="${light}" stroke-width="1.5"/>
      <path d="M-13-68C-15-81 16-81 16-65C14-51-8-41-13-53C-17-64 6-72 8-61" fill="${dark}" stroke="${light}" stroke-width="2"/>
      <path d="M-57-52C-31-62-22-16 14 3C34 16 34 49 0 68C-46 57-64 4-57-52Z" fill="url(#${id}-p2)" stroke="${light}" stroke-opacity=".6" stroke-width="1.5"/>
      <path d="M57-50C28-42 39-11 10 15C-8 31-13 49 0 68C46 55 67 0 57-50Z" fill="url(#${id}-p0)" stroke="${light}" stroke-opacity=".6" stroke-width="1.5"/>
      <path d="M-23 54Q-8 58 0 68Q12 60 25 52Q17 74 0 78Q-16 73-23 54Z" fill="url(#${id}-leaf)"/>
    </g></g>
  </svg>`;
}

function later(callback, delay) {
  const timer = setTimeout(() => { sceneTimers.delete(timer); callback(); }, motionQuery.matches ? 0 : delay);
  sceneTimers.add(timer);
  return timer;
}

function clearSceneTimers() {
  sceneTimers.forEach(clearTimeout);
  sceneTimers.clear();
}

function announce(message) { $("#announcer").textContent = message; }

function centerOf(element) {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function burstAt(element, count = 24, variant = 0) {
  const { x, y } = centerOf(element);
  particles.burst(x, y, count, variant);
}

function populateArtwork() {
  $("#entry-flower").innerHTML = flowerSVG("blush", { bud: true });
  $("#hero-flower").innerHTML = flowerSVG("rose", { bud: true, stem: true });
  $("#wish-flower").innerHTML = flowerSVG("blush", { bud: true });
  $("#finale-small-flower").innerHTML = flowerSVG("cream", { bud: true });
  const frameFlowers = [
    ["blush", "320px", "-110px", "7%", "-24deg"],
    ["cream", "340px", "calc(100% - 210px)", "-2%", "24deg"],
    ["rose", "360px", "-65px", "68%", "-15deg"],
    ["blush", "360px", "calc(100% - 270px)", "68%", "20deg"],
    ["cream", "230px", "20px", "88%", "-34deg"],
    ["peach", "230px", "calc(100% - 300px)", "91%", "18deg"],
    ["cream", "240px", "-75px", "42%", "35deg"],
    ["pink", "240px", "calc(100% - 125px)", "40%", "-30deg"],
    ["peach", "210px", "95px", "-15%", "14deg"],
    ["blush", "220px", "calc(100% - 350px)", "-17%", "-20deg"]
  ];
  $("#floral-frame").innerHTML = frameFlowers.map(([color, size, left, top, rotate], i) => `<div class="decor-flower" style="--size:${size};--left:${left};--top:${top};--rotate:${rotate};--sway:${8 + i}s">${flowerSVG(color, { variant: i })}</div>`).join("");
  $("#garden").innerHTML = flowerWishes.map((wish, i) => `<button class="garden-flower" data-flower="${i}" aria-label="Khám phá bông hoa ${i + 1}: ${wish.title}" style="--idle-delay:-${i * 1.1}s"><span class="flower-seen" aria-hidden="true">♡</span><span class="garden-art">${flowerSVG(wish.color, { stem: true, variant: i })}</span><span class="garden-number">0${i + 1}</span></button>`).join("");
  const colors = ["cream", "rose", "peach", "blush", "cream", "pink", "blush", "rose", "cream"];
  $("#finale-garden").innerHTML = colors.map((color, i) => {
    const distance = Math.abs(i - 4);
    return `<div class="finale-bloom" style="--size:${260 + (i % 3) * 30}px;--left:calc(${i * 12.5}% - 130px);--bottom:${distance * 12 - 10}px;--rotate:${(i - 4) * -8}deg;--bloom-delay:${(4 - distance) * .16}s">${flowerSVG(color, { bud: true, variant: i })}</div>`;
  }).join("");
  // An overlapping floral tapestry with a clear, raised card at its center.
  const wall = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      const i = row * 7 + col;
      wall.push(`<div class="wall-bloom" style="--x:${col * 16.5 - 8 + (row % 2) * 5}%;--y:${row * 29 - 15}%;--turn:${Math.sin(i * 4) * 30}deg;--delay:${(Math.abs(col - 3) + row % 2) * .13}s;--scale:${.92 + (i % 3) * .1}">${flowerSVG(colors[(i * 3 + row) % colors.length], { variant: i })}</div>`);
    }
  }
  $("#flower-wall").innerHTML = wall.join("");
  $("#chapter-dots").innerHTML = sceneConfig.map((scene, i) => `<button class="chapter-dot" data-scene="${i}" aria-label="Chương ${i + 1}: ${scene.title}"${i === 0 ? ' aria-current="step"' : " disabled"}></button>`).join("");
  $$(".class-name").forEach(el => { el.textContent = CLASS_NAME; });
  $$(".sender-name").forEach(el => { el.textContent = SENDER_NAME; });
}

function canAdvance() {
  return state.scene < scenes.length - 1 && (state.scene !== 0 || state.bloomed) && !state.blooming && !state.letterOpening;
}

function updateNavigation() {
  $("#previous").disabled = state.scene === 0 || state.transitioning;
  $("#next").disabled = !canAdvance() || state.transitioning;
  $$(".chapter-dot").forEach((dot, index) => {
    dot.disabled = index > state.highest || state.transitioning;
    if (index === state.scene) dot.setAttribute("aria-current", "step");
    else dot.removeAttribute("aria-current");
  });
  $("#chapter-label").innerHTML = `${String(state.scene + 1).padStart(2, "0")} <span>/</span> 06 · ${sceneConfig[state.scene].label}`;
}

function leaveScene() {
  clearSceneTimers();
  $$(".garden-flower.is-picked").forEach(button => button.classList.remove("is-picked"));
  // Finish transient interactions when leaving, so revisits never get stuck.
  state.giftBusy = false;
  $("#gift").classList.remove("is-opening");
  $("#gift").disabled = false;
  $("#magic-button").disabled = false;
  if (state.wishSent) {
    $("#wish-success").textContent = "Mong điều ước của bạn sẽ sớm thành hiện thực ♡";
    $("#wish-flight").hidden = true;
    $("#wish-echo").textContent = "";
  }
  if (state.letterOpening) finishLetter(false);
  if (state.blooming) finishBloom(false);
}

function goToScene(index, { reset = false } = {}) {
  if ((!recipient && !reset) || state.transitioning || $("#flower-dialog").open || index < 0 || index >= scenes.length || (!reset && index === state.scene)) return;
  if (!reset && index > state.highest && (index !== state.scene + 1 || !canAdvance())) return;
  state.transitioning = true;
  updateNavigation();
  leaveScene();
  const previousScene = scenes[state.scene];
  previousScene.classList.add("is-leaving");
  later(() => {
    previousScene.hidden = true;
    previousScene.classList.remove("is-active", "is-leaving", "is-entering");
    state.scene = index;
    state.highest = Math.max(state.highest, index);
    const nextScene = scenes[index];
    nextScene.hidden = false;
    nextScene.classList.add("is-active", "is-entering");
    document.body.dataset.scene = String(index);
    $("#floral-frame").style.opacity = index === 5 ? ".28" : index === 1 ? ".45" : "1";
    window.scrollTo({ top: 0, behavior: "instant" });
    (recipient ? $(`#${sceneConfig[index].heading}`) : $("#student-id")).focus({ preventScroll: true });
    enterScene(index);
    later(() => {
      state.transitioning = false;
      nextScene.classList.remove("is-entering");
      updateNavigation();
    }, 650);
  }, 300);
}

function enterScene(index) {
  if (index === 5) {
    soundtrack.chime(6);
    floralWave();
    $$(".flower-art", scenes[5]).forEach(svg => svg.classList.add("is-bud"));
    later(() => {
      $$(".flower-art", scenes[5]).forEach(svg => svg.classList.remove("is-bud"));
      burstAt($("#finale-title"), 52, 2);
    }, 450);
  }
}

function finishBloom(focus = true) {
  state.bloomed = true;
  state.blooming = false;
  $("#hero-flower .flower-art").classList.remove("is-bud");
  $("#hero-flower").classList.remove("is-shaking");
  $("#hero-flower").classList.add("bloomed");
  $("#intro-before").hidden = true;
  $("#intro-after").hidden = false;
  updateNavigation();
  if (focus) {
    announce("Happy Vietnamese Women’s Day, 20 tháng 10! Món quà nhỏ đã sẵn sàng.");
    $("#intro-after button").focus({ preventScroll: true });
  }
}

function bloom() {
  if (!recipient || state.blooming || state.bloomed || state.transitioning) return;
  state.blooming = true;
  soundtrack.startFromGesture();
  floralWave();
  $("#bloom-flower").disabled = true;
  $("#bloom-button").disabled = true;
  $("#bloom-button").textContent = "một chút phép màu…";
  $("#hero-flower").classList.add("is-shaking");
  later(() => {
    $("#hero-flower").classList.remove("is-shaking");
    $("#hero-flower .flower-art").classList.remove("is-bud");
    $("#hero-flower").classList.add("bloomed");
    burstAt($("#hero-flower"), 35, 1);
    soundtrack.chime(0);
  }, 450);
  later(() => finishBloom(), 2350);
}

function openFlower(button) {
  if (state.transitioning || $("#flower-dialog").open) return;
  const index = Number(button.dataset.flower);
  const wish = getFlowerWish(index);
  state.seen.add(index);
  soundtrack.chime(index);
  button.classList.add("is-seen", "is-picked");
  button.setAttribute("aria-label", `Đã khám phá bông hoa ${index + 1}: ${wish.title}. Đọc lại lời chúc`);
  $("#garden-count").innerHTML = `Đã khám phá <strong>${state.seen.size} / 6</strong> bông hoa`;
  $("#dialog-title").textContent = wish.title;
  $("#dialog-message").textContent = `${recipient.shortName} ơi, ${wish.text.charAt(0).toLowerCase()}${wish.text.slice(1)}`;
  $("#dialog-flower").innerHTML = flowerSVG(wish.color, { bud: true, variant: index });
  $("#flower-dialog").showModal();
  later(() => $("#dialog-flower .flower-art").classList.remove("is-bud"), 60);
  later(() => button.classList.remove("is-picked"), 750);
  if (state.seen.size === flowerWishes.length && $("#secret-message").hidden) {
    $("#secret-message").hidden = false;
    announce("Bạn đã khám phá cả sáu bông hoa. Một lời nhắn bí mật đang đợi trong vườn.");
  }
}

function finishLetter(focus = true) {
  state.letterOpen = true;
  state.letterOpening = false;
  $("#envelope").hidden = true;
  $("#envelope-caption").hidden = true;
  $("#letter-stage").classList.add("has-paper");
  $("#letter-paper").hidden = false;
  $("#keep-letter").hidden = false;
  $("#envelope-hint").hidden = true;
  updateNavigation();
  if (focus) $("#letter-paper").focus({ preventScroll: true });
}

function openLetter() {
  if (state.letterOpen || state.letterOpening || state.transitioning) return;
  state.letterOpening = true;
  soundtrack.paper();
  $("#envelope").disabled = true;
  $("#envelope").setAttribute("aria-expanded", "true");
  $("#letter-stage").classList.add("is-open");
  $("#envelope-caption").hidden = true;
  updateNavigation();
  later(() => finishLetter(), 1300);
}

function nextMessage() {
  if (!state.messageBag.length) {
    state.messageBag = giftMessages().map((_, i) => i);
    for (let i = state.messageBag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.messageBag[i], state.messageBag[j]] = [state.messageBag[j], state.messageBag[i]];
    }
    if (state.messageBag.at(-1) === state.lastMessage) {
      [state.messageBag[0], state.messageBag[state.messageBag.length - 1]] = [state.messageBag.at(-1), state.messageBag[0]];
    }
  }
  state.lastMessage = state.messageBag.pop();
  return giftMessages()[state.lastMessage];
}

function openGift() {
  if (state.giftBusy || state.transitioning) return;
  state.giftBusy = true;
  const gift = $("#gift");
  gift.disabled = true;
  $("#magic-button").disabled = true;
  gift.style.setProperty("--lid-tilt", `${-10 - Math.random() * 24}deg`);
  gift.classList.add("is-opening");
  $("#fortune-card").classList.remove("is-new");
  later(() => {
    $("#fortune-message").textContent = nextMessage();
    soundtrack.chime(4);
    $("#fortune-card").classList.add("is-new");
    burstAt(gift, 25 + Math.floor(Math.random() * 12), state.lastMessage % 3);
    $("#magic-button").innerHTML = 'thêm một chút may mắn <span aria-hidden="true">✧</span>';
  }, 500);
  later(() => {
    gift.classList.remove("is-opening");
    gift.disabled = false;
    $("#magic-button").disabled = false;
    state.giftBusy = false;
  }, 1150);
}

function sendWish(event) {
  event.preventDefault();
  if (state.wishSent || state.transitioning) return;
  const input = $("#wish-input");
  const wish = input.value.trim();
  if (!wish) {
    $("#wish-error").textContent = "Viết một điều ước nhỏ trước khi gửi nhé ♡";
    input.setAttribute("aria-invalid", "true");
    input.focus();
    return;
  }
  state.wishSent = true;
  soundtrack.chime(5);
  $("#wish-error").textContent = "";
  input.removeAttribute("aria-invalid");
  $("#wish-echo").textContent = wish;
  input.value = "";
  $("#wish-length").textContent = "0 / 240";
  $("#wish-form").hidden = true;
  $("#skip-wish").hidden = true;
  $("#wish-result").hidden = false;
  $("#wish-result button").focus({ preventScroll: true });
  later(() => {
    $("#wish-flower .flower-art").classList.remove("is-bud");
    burstAt($("#wish-flight"), 30, 1);
  }, 150);
  later(() => {
    $("#wish-success").textContent = "Mong điều ước của bạn sẽ sớm thành hiện thực ♡";
    burstAt($("#wish-title"), 20, 2);
    $("#wish-flight").hidden = true;
    $("#wish-echo").textContent = "";
  }, 3100);
}

function resetExperience() {
  if (state.transitioning) return;
  clearSceneTimers();
  state.highest = 0;
  state.bloomed = false;
  state.blooming = false;
  state.letterOpen = false;
  state.letterOpening = false;
  state.giftBusy = false;
  state.wishSent = false;
  state.seen.clear();
  state.messageBag = [];
  state.lastMessage = -1;
  $("#hero-flower").classList.remove("bloomed", "is-shaking");
  $("#hero-flower .flower-art").classList.add("is-bud");
  $("#bloom-flower").disabled = false;
  $("#bloom-button").disabled = false;
  $("#bloom-button").innerHTML = 'chạm để hoa nở <span aria-hidden="true">♡</span>';
  $("#intro-before").hidden = false;
  $("#intro-after").hidden = true;
  $$(".garden-flower").forEach((button, i) => {
    button.classList.remove("is-seen", "is-picked");
    button.setAttribute("aria-label", `Khám phá bông hoa ${i + 1}: ${getFlowerWish(i).title}`);
  });
  $("#garden-count").innerHTML = 'Đã khám phá <strong>0 / 6</strong> bông hoa';
  $("#secret-message").hidden = true;
  $("#envelope").hidden = false;
  $("#envelope").disabled = false;
  $("#envelope").setAttribute("aria-expanded", "false");
  $("#envelope-caption").hidden = false;
  $("#envelope-hint").hidden = false;
  $("#letter-stage").classList.remove("is-open", "has-paper");
  $("#letter-paper").hidden = true;
  $("#keep-letter").hidden = true;
  $("#fortune-message").textContent = "Vũ trụ đã gói ghém một điều dễ thương cho bạn.";
  $("#magic-button").innerHTML = 'mở một chút may mắn <span aria-hidden="true">✧</span>';
  $("#wish-form").reset();
  $("#wish-form").hidden = false;
  $("#wish-error").textContent = "";
  $("#wish-input").removeAttribute("aria-invalid");
  $("#wish-length").textContent = "0 / 240";
  $("#skip-wish").hidden = false;
  $("#wish-result").hidden = true;
  $("#wish-flight").hidden = false;
  $("#wish-flower .flower-art").classList.add("is-bud");
  $("#wish-success").textContent = "";
  $("#wish-echo").textContent = "";
  particles.clear();
  goToScene(0, { reset: true });
}

// A single capped Canvas particle pool keeps repeated interactions lightweight.
// The animation sleeps when hidden and stops entirely for reduced motion.
const particles = (() => {
  const canvas = $("#petal-canvas");
  const ctx = canvas.getContext("2d");
  let width = 0, height = 0, frame = 0, previousTime = 0, spawnTime = 0;
  let pool = [];
  const colors = ["#e9a0ba", "#f3c8d5", "#fff8e9", "#d08b9d", "#e5bf98"];
  const mobile = () => width < 700;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function addAmbient() {
    pool.push({ x: Math.random() * width, y: -20, vx: 7 + Math.random() * 15, vy: 18 + Math.random() * 20, size: 4 + Math.random() * 5, rotation: Math.random() * Math.PI, spin: (Math.random() - .5) * 1.2, age: 0, life: 40, type: "petal", color: colors[Math.floor(Math.random() * 3)], ambient: true, phase: Math.random() * 6 });
  }

  function drawParticle(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    const fade = p.ambient ? .46 : Math.min(p.age * 4, 1) * Math.min((p.life - p.age) * 1.3, 1);
    ctx.globalAlpha = Math.max(0, fade);
    ctx.fillStyle = p.color;
    const size = p.size;
    ctx.beginPath();
    if (p.type === "heart") {
      ctx.moveTo(0, size * .7);
      ctx.bezierCurveTo(-size * 1.7, -size * .3, -size * .8, -size * 1.4, 0, -size * .5);
      ctx.bezierCurveTo(size * .8, -size * 1.4, size * 1.7, -size * .3, 0, size * .7);
    } else if (p.type === "spark") {
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * .15, -size * .15, size, 0);
      ctx.quadraticCurveTo(size * .15, size * .15, 0, size);
      ctx.quadraticCurveTo(-size * .15, size * .15, -size, 0);
      ctx.quadraticCurveTo(-size * .15, -size * .15, 0, -size);
    } else {
      ctx.ellipse(0, 0, size, size * (.35 + Math.abs(Math.cos(p.age * 1.4 + p.phase)) * .28), .4, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.restore();
  }

  function tick(time) {
    frame = 0;
    if (!ctx || motionQuery.matches || document.hidden) return;
    const dt = Math.min((time - (previousTime || time)) / 1000, .04);
    previousTime = time;
    spawnTime += dt;
    const ambientCount = pool.filter(p => p.ambient).length;
    if (spawnTime > (mobile() ? 2.8 : 1.5) && ambientCount < (mobile() ? 7 : 15)) { addAmbient(); spawnTime = 0; }
    ctx.clearRect(0, 0, width, height);
    pool = pool.filter(p => p.age < p.life && p.y < height + 35 && p.x > -80 && p.x < width + 80);
    for (const p of pool) {
      p.age += dt;
      p.x += (p.vx + Math.sin(p.age * 1.2 + p.phase) * 10) * dt;
      p.y += p.vy * dt;
      if (!p.ambient) { p.vy += (p.type === "heart" ? -10 : 32) * dt; p.vx *= Math.pow(.98, dt * 60); }
      p.rotation += p.spin * dt;
      drawParticle(p);
    }
    frame = requestAnimationFrame(tick);
  }

  function start() {
    if (!frame && ctx && !motionQuery.matches && !document.hidden) { previousTime = 0; frame = requestAnimationFrame(tick); }
  }

  function clear() { pool = []; ctx?.clearRect(0, 0, width, height); }
  function stop() { cancelAnimationFrame(frame); frame = 0; clear(); }
  function burst(x, y, count, variant = 0) {
    if (!ctx || motionQuery.matches || document.hidden) return;
    const limit = mobile() ? 65 : 125;
    count = Math.min(Math.round(count * (mobile() ? .6 : 1)), limit - pool.length);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 35 + Math.random() * (variant === 2 ? 175 : 115);
      pool.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 60, size: 3 + Math.random() * 6, rotation: Math.random() * 6, spin: (Math.random() - .5) * 3, age: 0, life: 2 + Math.random() * 2, color: colors[Math.floor(Math.random() * colors.length)], type: (i + variant) % 4 === 0 ? "heart" : i % 3 === 0 ? "spark" : "petal", ambient: false, phase: Math.random() * 6 });
    }
    start();
  }
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
  motionQuery.addEventListener("change", () => motionQuery.matches ? stop() : start());
  window.addEventListener("pagehide", stop);
  window.addEventListener("pageshow", start);
  resize();
  start();
  return { burst, clear };
})();

function setupParallax() {
  const hoverQuery = matchMedia("(hover: hover) and (pointer: fine)");
  const frame = $("#floral-frame");
  let scheduled = 0, x = 0, y = 0;
  function reset() {
    cancelAnimationFrame(scheduled);
    scheduled = 0;
    frame.style.removeProperty("--parallax-x");
    frame.style.removeProperty("--parallax-y");
  }
  window.addEventListener("pointermove", event => {
    if (motionQuery.matches || !hoverQuery.matches || document.hidden) return;
    x = (event.clientX / innerWidth - .5) * 10;
    y = (event.clientY / innerHeight - .5) * 8;
    if (!scheduled) scheduled = requestAnimationFrame(() => {
      frame.style.setProperty("--parallax-x", `${x.toFixed(1)}px`);
      frame.style.setProperty("--parallax-y", `${y.toFixed(1)}px`);
      scheduled = 0;
    });
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", reset);
  motionQuery.addEventListener("change", reset);
  window.addEventListener("pagehide", reset);
}

function bindEvents() {
  document.addEventListener("click", event => {
    if (!(event.target instanceof Element)) return;
    const control = event.target.closest("button, a.button, #home-link");
    if (!control || control.disabled || state.transitioning) return;
    // Dedicated interactions have their own sounds; avoid stacking a click on top.
    if (control.matches("#sound-toggle, #bloom-button, #bloom-flower, .garden-flower, #envelope, #gift, #magic-button, #more-love, #wish-form button")) return;
    soundtrack.click();
  }, { capture: true });
  $("#entry-form").addEventListener("submit", enterGarden);
  $("#student-id").addEventListener("input", () => {
    $("#entry-error").textContent = "";
    $("#student-id").removeAttribute("aria-invalid");
  });
  $("#download-card").addEventListener("click", downloadCard);
  $("#download-close").addEventListener("click", () => $("#download-dialog").close());
  $("#change-recipient").addEventListener("click", changeRecipient);
  $("#sound-toggle").addEventListener("click", () => soundtrack.toggle());
  $("#bloom-button").addEventListener("click", bloom);
  $("#bloom-flower").addEventListener("click", bloom);
  $("#home-link").addEventListener("click", event => { event.preventDefault(); goToScene(0); });
  $("#previous").addEventListener("click", () => goToScene(state.scene - 1));
  $("#next").addEventListener("click", () => { if (canAdvance()) goToScene(state.scene + 1); });
  $$('[data-next]').forEach(button => button.addEventListener("click", () => { if (canAdvance()) goToScene(state.scene + 1); }));
  $("#chapter-dots").addEventListener("click", event => {
    const dot = event.target.closest("[data-scene]");
    if (dot && !dot.disabled) goToScene(Number(dot.dataset.scene));
  });
  $("#garden").addEventListener("click", event => {
    const flower = event.target.closest("[data-flower]");
    if (flower) openFlower(flower);
  });
  // Sparkles are created only on entering a flower, never for every mouse move.
  $$(".garden-flower").forEach(button => button.addEventListener("pointerenter", event => {
    if (event.pointerType === "mouse") burstAt(button, 4, 1);
  }));
  const dialog = $("#flower-dialog");
  $("#dialog-close").addEventListener("click", () => dialog.close());
  $("#dialog-keep").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (state.seen.size === 6) burstAt($("#garden-count"), 18, 1);
  });
  $("#envelope").addEventListener("click", openLetter);
  $("#keep-letter").addEventListener("click", () => {
    if (state.transitioning) return;
    burstAt($("#keep-letter"), 24, 1);
    goToScene(3);
  });
  $("#gift").addEventListener("click", openGift);
  $("#magic-button").addEventListener("click", openGift);
  $("#wish-form").addEventListener("submit", sendWish);
  $("#wish-input").addEventListener("input", event => {
    $("#wish-length").textContent = `${event.target.value.length} / 240`;
    if (event.target.value.trim()) { $("#wish-error").textContent = ""; event.target.removeAttribute("aria-invalid"); }
  });
  $("#restart").addEventListener("click", resetExperience);
  $("#more-love").addEventListener("click", () => {
    burstAt($("#finale-title"), 55, Math.floor(Math.random() * 3));
    soundtrack.chime(6);
    floralWave();
    announce("Thêm một chút yêu thương dành cho bạn ♡");
  });
  document.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing || event.repeat || dialog.open || $("#download-dialog").open || !recipient || state.transitioning) return;
    if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable]")) return;
    if (event.key === "ArrowRight" && canAdvance()) { event.preventDefault(); goToScene(state.scene + 1); }
    if (event.key === "ArrowLeft" && state.scene > 0) { event.preventDefault(); goToScene(state.scene - 1); }
  });
}

// The local MP3 is the only background track; Web Audio adds short interaction chimes.
// AudioContext is created only from a user gesture; a manual mute persists
// through chapter changes and replay (in memory only).
const soundtrack = (() => {
  let context, master, compressor, enabled = false, mutedByUser = false;
  let playRequest = 0, lastChime = -Infinity, lastClick = -Infinity;
  let duckFrame = 0, duckUntil = 0, noiseBuffer;
  const MUSIC_VOLUME = .45;
  const EFFECTS_VOLUME = .55;
  const DUCKED_MUSIC_VOLUME = .25;
  const music = new Audio("./music.mp3");
  music.preload = "none";
  music.loop = true;
  music.volume = MUSIC_VOLUME;
  const voices = new Set();
  function update() {
    $("#sound-toggle").setAttribute("aria-pressed", String(enabled));
    $("#sound-toggle").setAttribute("aria-label", enabled ? "Tắt nhạc nền và âm thanh" : "Bật nhạc nền và âm thanh");
    $("#sound-label").textContent = enabled ? "nhạc đang ngân" : "bật nhạc";
  }
  function ready() { return enabled && context?.state === "running" && !document.hidden; }
  function duck(duration = 400) {
    duckUntil = Math.max(duckUntil, performance.now() + duration);
    if (duckFrame) return;
    let previous = performance.now();
    function fade(now) {
      if (!ready()) { duckFrame = 0; music.volume = MUSIC_VOLUME; return; }
      const target = now < duckUntil ? DUCKED_MUSIC_VOLUME : MUSIC_VOLUME;
      const elapsed = Math.min(now - previous, 80); previous = now;
      music.volume += (target - music.volume) * (1 - Math.exp(-elapsed / (target < music.volume ? 25 : 180)));
      if (now >= duckUntil && Math.abs(music.volume - MUSIC_VOLUME) < .002) {
        music.volume = MUSIC_VOLUME; duckFrame = 0; return;
      }
      duckFrame = requestAnimationFrame(fade);
    }
    duckFrame = requestAnimationFrame(fade);
  }
  function click() {
    if (!ready() || context.currentTime - lastClick < .09) return;
    lastClick = context.currentTime;
    // A clear wooden tap with a short upper tone for small phone speakers.
    note(67, lastClick, .09, .20);
    note(79, lastClick + .006, .065, .05);
    duck(150);
  }
  function paper() {
    if (!ready() || voices.size >= 30 || context.currentTime - lastChime < .35) return;
    lastChime = context.currentTime;
    if (!noiseBuffer) {
      noiseBuffer = context.createBuffer(1, Math.ceil(context.sampleRate * .35), context.sampleRate);
      const samples = noiseBuffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    }
    const source = context.createBufferSource(), filter = context.createBiquadFilter(), gain = context.createGain();
    source.buffer = noiseBuffer; filter.type = "bandpass"; filter.frequency.value = 1400; filter.Q.value = .65;
    const now = context.currentTime;
    gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(.11, now + .045);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .32);
    source.connect(filter); filter.connect(gain); gain.connect(master); voices.add(source);
    source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); voices.delete(source); };
    source.start(now); source.stop(now + .35); duck(350);
  }
  function note(midi, time, duration = 1.8, volume = .12) {
    if (!midi || !context || voices.size >= 36) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
    oscillator.connect(gain); gain.connect(master);
    voices.add(oscillator);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); voices.delete(oscillator); };
    oscillator.start(time); oscillator.stop(time + duration + .02);
  }
  async function activate() {
    const request = ++playRequest;
    enabled = true;
    update();
    try {
      // Call play directly during the gesture, before awaiting other promises.
      const playing = music.play();
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      try {
        if (!context && AudioContextClass) {
          context = new AudioContextClass();
          master = context.createGain(); master.gain.value = EFFECTS_VOLUME;
          compressor = context.createDynamicsCompressor();
          master.connect(compressor); compressor.connect(context.destination);
        }
        if (context) context.resume().catch(() => {});
      } catch { /* Music still works when optional chimes are unavailable. */ }
      await playing;
      if (request !== playRequest) return;
      if (mutedByUser || document.hidden) pause();
    } catch {
      if (request !== playRequest) return;
      enabled = false; pause(); update();
      announce("Chưa phát được music.mp3. Bạn chạm nút bật nhạc để thử lại nhé.");
    }
  }
  function pause() {
    playRequest++;
    music.pause();
    cancelAnimationFrame(duckFrame); duckFrame = 0; duckUntil = 0; music.volume = MUSIC_VOLUME;
    voices.forEach(voice => { try { voice.stop(); } catch { /* already stopped */ } });
    if (context && context.state === "running") context.suspend().catch(() => {});
  }
  function chime(kind = 0) {
    if (!enabled || !context || context.state !== "running" || document.hidden) return;
    const now = context.currentTime;
    if (now - lastChime < .35) return;
    lastChime = now;
    const motifs = [[79,84], [76,79], [72,79], [79,84,88], [76,79,84], [79,84,88], [72,76,79,84]];
    const pitches = motifs[kind % motifs.length];
    pitches.forEach((pitch, i) => note(pitch, now + i * .09, .7, .075));
    duck(pitches.length * 90 + 350);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
    else if (enabled && !mutedByUser) activate();
  });
  window.addEventListener("pagehide", pause);
  window.addEventListener("pageshow", () => { if (enabled && !document.hidden) activate(); });
  return {
    startFromGesture() { if (!mutedByUser && !enabled) activate(); },
    toggle() {
      if (enabled) { enabled = false; mutedByUser = true; pause(); update(); }
      else { mutedByUser = false; activate(); }
    },
    chime, click, paper
  };
})();

function floralWave() {
  if (motionQuery.matches) return;
  document.body.classList.remove("floral-wave");
  // Reuse a single animation class and the capped particle pool on each replay.
  void document.body.offsetWidth;
  document.body.classList.add("floral-wave");
  for (let i = 0; i < 4; i++) {
    later(() => particles.burst(innerWidth * (i % 2 ? .82 : .18), innerHeight * (.4 + i * .12), 18, i % 3), i * 180);
  }
}

function enterGarden(event) {
  event.preventDefault();
  if (state.transitioning) return;
  const input = $("#student-id");
  const id = input.value.trim();
  if (!/^[0-9]{8}$/.test(id) || !Object.hasOwn(STUDENTS, id)) {
    $("#entry-error").textContent = !/^[0-9]{8}$/.test(id) ? "Nhập đủ 8 chữ số MSSV nhé." : "MSSV này chưa có trong danh sách nhận quà. Bạn kiểm tra lại nhé ♡";
    input.setAttribute("aria-invalid", "true"); input.focus(); return;
  }
  // Keep accepting the old "MSSV": "Tên" format as type 1.
  const entry = typeof STUDENTS[id] === "string" ? { name: STUDENTS[id], type: 1 } : STUDENTS[id];
  const name = entry.name;
  // Play synchronously from submit/Enter so mobile autoplay rules allow it.
  soundtrack.startFromGesture();
  state.transitioning = true;
  updateNavigation();
  input.removeAttribute("aria-invalid");
  $("#entry-error").textContent = "";
  input.blur();
  input.disabled = true;
  $("#entry-form button").disabled = true;
  $("#entry-form").setAttribute("aria-busy", "true");
  recipient = { name, type: entry.type === 2 ? 2 : 1, shortName: entry.shortName || name.split(" ").at(-1), special: entry.special === true };
  recipientVersion++;
  $(".intro-note").textContent = recipient.special ? "psst… Ý Ly ơi, có một vườn thương bé xíu dành riêng cho cậu ♡" : `${name} ơi, có một điều nhỏ xíu dành riêng cho bạn ♡`;
  const letter = recipientLetter();
  const paragraphs = $$("#letter-paper p");
  letter.forEach((text, i) => { paragraphs[i].textContent = text; });
  $("#envelope").setAttribute("aria-label", `Mở lá thư gửi ${name}`);
  updateRecipientLabels();
  $("#recipient-name").textContent = `dành riêng cho ${name}`;
  $(".finale-message").textContent = recipientMessage();
  $(".finale-signature").textContent = recipient.special ? "a little hug, just for Ý Ly ♡" : "you make the world a little softer.";
  document.body.classList.toggle("special-recipient", recipient.special);
  const gate = $("#entry-gate");
  $("#entry-welcome-name").textContent = recipient.special ? "Ý Ly ơi, chào cậu ♡" : `${name} ơi, chào bạn ♡`;
  $("#entry-welcome").hidden = false;
  gate.classList.add("is-opening");
  $("#entry-flower .flower-art").classList.remove("is-bud");
  later(() => {
    burstAt($("#entry-flower"), 32, 1);
    soundtrack.chime(3);
  }, 180);
  later(() => gate.classList.add("is-departing"), 1250);
  later(() => {
    gate.hidden = true; $("#main").hidden = false; $(".site-footer").hidden = false;
    input.value = ""; input.disabled = false; $("#entry-form button").disabled = false;
    $("#entry-form").removeAttribute("aria-busy");
    scenes[0].classList.add("is-entering");
    $("#intro-title").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    later(() => {
      scenes[0].classList.remove("is-entering");
      state.transitioning = false;
      updateNavigation();
    }, 650);
  }, 1650);
}

function changeRecipient() {
  if (state.transitioning || cardBusy) return;
  resetExperience();
  recipient = null; recipientVersion++;
  if (cardURL) { URL.revokeObjectURL(cardURL); cardURL = null; }
  $("#card-preview").removeAttribute("src");
  $("#save-card").removeAttribute("href");
  $("#download-status").textContent = "";
  $("#main").hidden = true; $(".site-footer").hidden = true; $("#entry-gate").hidden = false;
  $("#entry-form").reset(); $("#entry-error").textContent = "";
  $("#entry-gate").classList.remove("is-opening", "is-departing");
  $("#entry-welcome").hidden = true;
  $("#entry-welcome-name").textContent = "";
  $("#entry-flower .flower-art").classList.add("is-bud");
  document.body.classList.remove("special-recipient");
  $("#student-id").focus();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function wrapCardText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(/\s+/); let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) { ctx.fillText(line, x, y); y += lineHeight; line = word; }
    else line = next;
  }
  if (line) { ctx.fillText(line, x, y); y += lineHeight; }
  return y;
}

async function cardFlower(color, variant) {
  // Standalone SVG contains no external resources or HTML foreignObject.
  const source = flowerSVG(color, { variant }).replace("<defs>", "<style>.bud-cup{display:none}</style><defs>");
  const url = URL.createObjectURL(new Blob([source], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const image = new Image();
    await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; image.src = url; });
    return image;
  } finally { URL.revokeObjectURL(url); }
}

async function downloadCard() {
  if (!recipient || cardBusy) return;
  const version = recipientVersion;
  const button = $("#download-card");
  cardBusy = true; button.disabled = true; button.setAttribute("aria-busy", "true");
  $("#download-status").textContent = "Đang gói vườn hoa vào thiệp của bạn…";
  try {
    if (!cardURL) {
      const canvas = document.createElement("canvas"); canvas.width = 1600; canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      const background = ctx.createLinearGradient(0, 0, 1600, 1200);
      background.addColorStop(0, "#f8c9d8"); background.addColorStop(1, "#efafc7");
      ctx.fillStyle = background; ctx.fillRect(0, 0, 1600, 1200);
      const flowers = await Promise.all(["rose", "cream", "blush", "peach", "pink", "cream"].map(cardFlower));
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 6; col++) {
          const i = row * 6 + col, size = 400 + i % 3 * 28;
          ctx.save(); ctx.translate(col * 290 + (row % 2) * 90, row * 310 + 30);
          ctx.rotate(Math.sin(i * 3) * .3);
          ctx.shadowColor = "#87324c44"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 14;
          ctx.drawImage(flowers[i % flowers.length], -size / 2, -size / 2, size, size);
          ctx.restore();
        }
      }
      ctx.shadowColor = "#7c304c55"; ctx.shadowBlur = 48; ctx.shadowOffsetY = 20;
      ctx.fillStyle = "#fff0f4"; ctx.beginPath(); ctx.roundRect(255, 215, 1090, 780, 65); ctx.fill();
      ctx.shadowColor = "transparent"; ctx.strokeStyle = "#fffaf5"; ctx.lineWidth = 3; ctx.stroke();
      ctx.textAlign = "center"; ctx.fillStyle = "#a96682";
      ctx.font = '20px "Trebuchet MS", Arial, sans-serif'; ctx.fillText("BLOOMING WISHES · JUST FOR YOU", 800, 290);
      ctx.fillStyle = "#b34f79"; ctx.font = 'italic 112px Georgia, serif'; ctx.fillText("happy 20/10", 800, 445);
      ctx.fillStyle = "#813b5a"; ctx.font = '28px "Trebuchet MS", Arial, sans-serif'; ctx.fillText("luôn xinh theo cách của bạn ♡", 800, 507);
      ctx.font = 'bold 37px "Trebuchet MS", Arial, sans-serif';
      const nameBottom = wrapCardText(ctx, recipient.name, 800, 590, 920, 46);
      ctx.font = '27px "Trebuchet MS", Arial, sans-serif';
      wrapCardText(ctx, recipientMessage(), 800, nameBottom + 22, 850, 43);
      ctx.fillStyle = "#b46b88"; ctx.font = 'italic 25px Georgia, serif';
      ctx.fillText(recipient.special ? "Gửi Ý Ly một cái ôm bé xíu, with love ♡" : recipientSender(), 800, 925);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("PNG export failed");
      if (version !== recipientVersion) return;
      cardURL = URL.createObjectURL(blob);
    }
    const slug = recipient.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const link = $("#save-card"); link.href = cardURL; link.download = `happy-20-10-${slug}.png`;
    $("#card-preview").src = cardURL;
    $("#card-preview").alt = `Thiệp 20/10 dành riêng cho ${recipient.name}`;
    $("#download-dialog").showModal();
    link.click();
    $("#download-status").textContent = "Thiệp PNG 1600 × 1200 đã sẵn sàng ♡";
  } catch {
    $("#download-status").textContent = "Chưa tạo được ảnh. Bạn thử tải thiệp thêm lần nữa nhé.";
  } finally {
    cardBusy = false; button.disabled = false; button.removeAttribute("aria-busy");
  }
}

populateArtwork();
bindEvents();
setupParallax();
updateNavigation();
