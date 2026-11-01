// =========================================================
// 《植物冒險趣》 - 國小六年級自然科學多媒體測驗系統 (sketch.js)
// =========================================================

// --- 遊戲狀態管理 ---
let gameState = "HOME"; // HOME, LEVEL_SELECT, QUIZ, LEVEL_RESULT, ENDING
let currentLevel = 0;   // 0: 第一關, 1: 第二關, 2: 第三關, 3: 第四關
let currentQuestionIndex = 0;
let unlockedLevel = 0;  // 目前已解鎖的最高關卡

// --- 計分與紀錄 ---
let totalScore = 0;
let levelScore = 0;
let levelCorrectCount = 0;
let selectedOption = -1;
let isAnswered = false;
let feedbackExplanation = "";

// --- 互動 UI 按鈕儲存陣列 ---
let buttons = [];

// --- 動態角色動畫變數 ---
let charAnimTimer = 0;

// --- 關卡資料定義 ---
const levelTitles = [
  "第一關：種子森林",
  "第二關：根莖葉之地",
  "第三關：花朵秘境",
  "第四關：生命之森"
];

const levelDescriptions = [
  "探索種子發芽的秘密！",
  "認識根、莖、葉的超能力！",
  "揭開花朵與授粉的奧秘！",
  "發現光合作用與生存智慧！"
];

// --- 測驗題目資料庫（圖多字少、每題獨立專屬圖片）---
const quizData = [
  // 第一關：種子森林 (3題)
  [
    {
      question: "1. 種子發芽「不需要」哪一個條件？",
      options: ["A. 水分", "B. 空氣", "C. 陽光", "D. 適溫"],
      correct: 2,
      explanation: "解析：發芽初期不需要陽光，長出綠葉後才需要！",
      imageType: "seed_germ"
    },
    {
      question: "2. 紅豆種子發芽時，最先長出的是？",
      options: ["A. 胚根", "B. 子葉", "C. 幼芽", "D. 本葉"],
      correct: 0,
      explanation: "解析：胚根最先突破種皮向下長，負責吸水！",
      imageType: "seed_root"
    },
    {
      question: "3. 種子發芽初期，養分從哪裡來？",
      options: ["A. 土壤肥料", "B. 陽光照射", "C. 子葉或胚乳", "D. 空氣水分"],
      correct: 2,
      explanation: "解析：子葉或胚乳儲存豐富養分供初期生長！",
      imageType: "seed_cotyledon"
    }
  ],
  // 第二關：根莖葉之地 (3題)
  [
    {
      question: "1. 葉片背面的小孔負責什麼工作？",
      options: ["A. 呼吸與蒸散作用", "B. 製造肥料", "C. 吸收土壤養分", "D. 固著植物"],
      correct: 0,
      explanation: "解析：氣孔進行氣體交換與水分蒸散！",
      imageType: "leaf_stomata"
    },
    {
      question: "2. 植物的「根」沒有哪一項功能？",
      options: ["A. 固著植物", "B. 吸收水分", "C. 光合作用", "D. 儲存養分"],
      correct: 2,
      explanation: "解析：光合作用主要在葉子進行，根負責固著與吸水！",
      imageType: "root_system"
    },
    {
      question: "3. 樹幹內哪一個構造負責向上輸送信號與水分？",
      options: ["A. 木質部", "B. 韌皮部", "C. 氣孔", "D. 表皮層"],
      correct: 0,
      explanation: "解析：木質部輸水，韌皮部輸養分！",
      imageType: "stem_transport"
    }
  ],
  // 第三關：花朵秘境 (3題)
  [
    {
      question: "1. 完整的花必須包含哪四個主要構造？",
      options: ["A. 花瓣、花萼、雄蕊、雌蕊", "B. 根, 莖, 葉, 花", "C. 花粉、花蜜、種子、果實", "D. 花藥、花絲、柱頭、花柱"],
      correct: 0,
      explanation: "解析：花萼、花瓣、雄蕊、雌蕊齊全稱為完全花！",
      imageType: "flower_complete"
    },
    {
      question: "2. 花粉傳遞到雌蕊柱頭上的過程叫？",
      options: ["A. 光合作用", "B. 授粉作用", "C. 蒸散作用", "D. 呼吸作用"],
      correct: 1,
      explanation: "解析：花粉落到柱頭上完成授粉！",
      imageType: "pollination_act"
    },
    {
      question: "3. 鮮豔花瓣與花蜜的主要吸引對象是？",
      options: ["A. 害蟲", "B. 傳粉昆蟲", "C. 鳥類天敵", "D. 微生物"],
      correct: 1,
      explanation: "解析：吸引蜜蜂蝴蝶協助傳播花粉！",
      imageType: "bee_flower"
    }
  ],
  // 第四關：生命之森 (3題)
  [
    {
      question: "1. 光合作用吸收二氧化碳與水，會釋放出？",
      options: ["A. 氧氣", "B. 氮氣", "C. 甲醛", "D. 氫氣"],
      correct: 0,
      explanation: "解析：植物光合作用製造養分並釋放氧氣！",
      imageType: "photo_gas"
    },
    {
      question: "2. 植物在生態系中被稱為？",
      options: ["A. 消費者", "B. 分解者", "C. 生產者", "D. 肉食者"],
      correct: 2,
      explanation: "解析：植物能自製養分，是基層生產者！",
      imageType: "ecosystem_prod"
    },
    {
      question: "3. 森林被稱為「地球之肺」的主因？",
      options: ["A. 產生大量二氧化碳", "B. 釋放氧氣與調節氣候", "C. 消耗大量淡水", "D. 製造土壤廢棄物"],
      correct: 1,
      explanation: "解析：森林釋放氧氣、涵養水源、維護生態！",
      imageType: "forest_lung"
    }
  ]
];

// --- p5.js 初始化 ---
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Helvetica, Arial, sans-serif');
  textAlign(CENTER, CENTER);
  rectMode(CORNER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// --- 主繪圖循環 ---
function draw() {
  charAnimTimer += 0.06; // 控制角色呼吸與手部輕微晃動
  buttons = []; // 清空每幀按鈕清單

  drawDynamicBackground();
  drawTopHeader();

  // 取得角色當前說話的頭頂回饋文字
  let headMessage = getCharacterHeadMessage();

  // 繪製放大的冒險人物
  drawChubbyAdventurer(width * 0.16, height * 0.83, height * 0.32, headMessage);

  if (gameState === "HOME") {
    drawHomeScreen();
  } else if (gameState === "LEVEL_SELECT") {
    drawLevelSelectScreen();
  } else if (gameState === "QUIZ") {
    drawQuizScreen();
  } else if (gameState === "LEVEL_RESULT") {
    drawLevelResultScreen();
  } else if (gameState === "ENDING") {
    drawEndingScreen();
  }
}

// 根據遊戲狀態與答題狀況決定人物頭頂的回饋對話
function getCharacterHeadMessage() {
  if (gameState === "HOME") {
    return "嗨！我是植物探險家，\n一起讓王國變繽紛吧！";
  } else if (gameState === "LEVEL_SELECT") {
    return "選個想挑戰的關卡吧！";
  } else if (gameState === "QUIZ") {
    if (!isAnswered) {
      return "仔細想想看喔！";
    } else {
      let qData = quizData[currentLevel][currentQuestionIndex];
      return selectedOption === qData.correct ? "太棒了！答對囉！" : "沒關係，再加油！";
    }
  } else if (gameState === "LEVEL_RESULT") {
    return "這一關表現得很棒！";
  } else {
    return totalScore >= 150 ? "太神啦！王國得救了！" : "你已經很棒囉！別放棄！";
  }
}

// =========================================================
// 動態背景與生機恢復（首頁靜態繽紛裝飾）
// =========================================================
function drawDynamicBackground() {
  let progress = unlockedLevel / 3.0;
  if (gameState === "HOME" || gameState === "ENDING") {
    progress = 1.0; // 首頁與結局頁預設最繽紛
  }

  let skyTop = lerpColor(color(160, 210, 255), color(135, 206, 250), progress);
  let skyBottom = lerpColor(color(255, 240, 245), color(220, 255, 220), progress);

  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    stroke(lerpColor(skyTop, skyBottom, inter));
    line(0, y, width, y);
  }

  // 首頁與結局頁的【靜態繽紛裝飾】（完全不會動）
  if (gameState === "HOME" || gameState === "ENDING") {
    noStroke();
    for (let i = 0; i < 8; i++) {
      let fx = (width / 9) * (i + 1);
      let fy = height * 0.12 + (i % 2) * 25;
      fill(255, 120 + (i * 15) % 130, 180, 200);
      ellipse(fx, fy, 22, 22);
      fill(255, 235, 59);
      ellipse(fx, fy, 8, 8);
    }
  }

  // 陽光
  noStroke();
  fill(255, 235, 150, 220);
  ellipse(width * 0.85, height * 0.18, 120);

  // 地面草皮
  fill(lerpColor(color(100, 150, 80), color(124, 195, 65), progress));
  rect(0, height * 0.76, width, height * 0.24);
}

// =========================================================
// 頂部導覽列 (均一教育平台按鈕)
// =========================================================
function drawTopHeader() {
  let btnW = min(width * 0.22, 210);
  let btnH = min(height * 0.06, 42);
  drawCustomButton(
    15, 15, btnW, btnH,
    "▶ 均一自然影片",
    color(255, 140, 0), color(255, 165, 0),
    min(width * 0.013, 15),
    () => { window.open("https://www.junyiacademy.org/topics/ns-ele-high", "_blank"); }
  );
}

// =========================================================
// 首頁 (HOME)
// =========================================================
function drawHomeScreen() {
  let boxW = min(width * 0.82, 780);
  let boxH = min(height * 0.75, 540);
  let boxX = (width - boxW) / 2;
  let boxY = (height - boxH) / 2 + 10;

  drawPanel(boxX, boxY, boxW, boxH, "🌿 植物冒險趣 🌸", "小六自然多媒體測驗系統");

  fill(30);
  textSize(min(width * 0.021, 21));
  textAlign(CENTER, TOP);
  let introText =
    "✨ 歡迎來到繽紛的植物王國！ ✨\n" +
    "王國失去色彩，森林逐漸枯萎……\n\n" +
    "【任務目標】\n" +
    "• 回答自然科學關卡問題\n" +
    "• 幫助植物王國恢復盎然生機\n" +
    "• 成為真正的「植物守護者」！";

  text(introText, boxX + 30, boxY + boxH * 0.26, boxW - 60, boxH * 0.48);

  let btnW = min(boxW * 0.42, 250);
  let btnH = min(boxH * 0.12, 55);
  drawCustomButton(
    width / 2 - btnW / 2, boxY + boxH - btnH - 25,
    btnW, btnH,
    "🚀 開始冒險挑戰",
    color(76, 175, 80), color(102, 187, 106),
    min(width * 0.023, 22),
    () => { gameState = "LEVEL_SELECT"; }
  );
}

// =========================================================
// 關卡選擇頁 (LEVEL_SELECT)
// =========================================================
function drawLevelSelectScreen() {
  textAlign(CENTER, CENTER);
  fill(30, 80, 30);
  textSize(min(width * 0.032, 34));
  textStyle(BOLD);
  text("選擇冒險關卡", width / 2, height * 0.12);
  textStyle(NORMAL);

  let gridW = min(width * 0.85, 900);
  let cardW = (gridW - 40) / 2;
  let cardH = min(height * 0.26, 150);
  let startX = (width - gridW) / 2;
  let startY = height * 0.22;

  for (let i = 0; i < 4; i++) {
    let col = i % 2;
    let row = floor(i / 2);
    let cx = startX + col * (cardW + 40);
    let cy = startY + row * (cardH + 25);

    let isUnlocked = i <= unlockedLevel;
    fill(isUnlocked ? color(255, 255, 255, 240) : color(210, 210, 210, 200));
    stroke(isUnlocked ? color(76, 175, 80) : color(150));
    strokeWeight(3);
    rect(cx, cy, cardW, cardH, 12);
    noStroke();

    fill(isUnlocked ? color(30, 90, 30) : color(100));
    textSize(min(width * 0.021, 21));
    textAlign(LEFT, TOP);
    text(levelTitles[i], cx + 20, cy + 18);

    fill(90);
    textSize(min(width * 0.015, 15));
    text(levelDescriptions[i], cx + 20, cy + 52, cardW - 40, 40);

    let btnW = cardW * 0.42;
    let btnH = 38;
    let btnX = cx + cardW - btnW - 18;
    let btnY = cy + cardH - btnH - 15;

    if (isUnlocked) {
      drawCustomButton(
        btnX, btnY, btnW, btnH,
        "進入關卡 ▶",
        color(255, 152, 0), color(255, 183, 77),
        min(width * 0.016, 16),
        () => { startLevel(i); }
      );
    } else {
      fill(130);
      rect(btnX, btnY, btnW, btnH, 6);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(15);
      text("🔒 未解鎖", btnX + btnW / 2, btnY + btnH / 2);
    }
  }
}

function startLevel(lvlIndex) {
  currentLevel = lvlIndex;
  currentQuestionIndex = 0;
  levelScore = 0;
  levelCorrectCount = 0;
  isAnswered = false;
  selectedOption = -1;
  gameState = "QUIZ";
}

// =========================================================
// 測驗頁面 (QUIZ)
// =========================================================
function drawQuizScreen() {
  let qData = quizData[currentLevel][currentQuestionIndex];

  let mainW = min(width * 0.62, 720);
  let mainH = min(height * 0.82, 580);
  let mainX = width * 0.35;
  let mainY = (height - mainH) / 2 + 10;

  drawPanel(mainX, mainY, mainW, mainH, levelTitles[currentLevel], `得分: ${totalScore + levelScore} | 第 ${currentQuestionIndex + 1}/3 題`);

  let qBoxW = mainW - 40;
  let qBoxH = mainH * 0.16;
  let qBoxX = mainX + 20;
  let qBoxY = mainY + mainH * 0.13;

  fill(240, 248, 255);
  stroke(100, 180, 245);
  strokeWeight(2);
  rect(qBoxX, qBoxY, qBoxW, qBoxH, 8);
  noStroke();

  fill(20, 40, 80);
  textSize(min(width * 0.019, 19));
  textAlign(CENTER, CENTER);
  text(qData.question, qBoxX + 10, qBoxY + 5, qBoxW - 20, qBoxH - 10);

  let imgBoxW = mainW - 40;
  let imgBoxH = mainH * 0.24;
  let imgBoxX = mainX + 20;
  let imgBoxY = qBoxY + qBoxH + 10;

  fill(255);
  stroke(220);
  strokeWeight(1);
  rect(imgBoxX, imgBoxY, imgBoxW, imgBoxH, 8);
  noStroke();

  drawUniqueQuizImage(qData.imageType, imgBoxX + imgBoxW / 2, imgBoxY + imgBoxH / 2, imgBoxH * 0.75);

  let optGridY = imgBoxY + imgBoxH + 10;
  let optW = (mainW - 50) / 2;
  let optH = min(mainH * 0.12, 50);

  for (let i = 0; i < 4; i++) {
    let col = i % 2;
    let row = floor(i / 2);
    let ox = mainX + 20 + col * (optW + 15);
    let oy = optGridY + row * (optH + 10);

    let btnColor = color(255, 255, 255);
    let btnHover = color(230, 245, 255);

    if (isAnswered) {
      if (i === qData.correct) btnColor = color(205, 245, 205);
      else if (i === selectedOption) btnColor = color(255, 205, 205);
    }

    drawCustomButton(
      ox, oy, optW, optH,
      qData.options[i],
      btnColor, btnHover,
      min(width * 0.016, 16),
      () => { handleOptionClick(i); },
      color(40), 2
    );
  }

  if (isAnswered) {
    let fbY = optGridY + optH * 2 + 18;
    let fbH = mainY + mainH - fbY - 12;

    fill(selectedOption === qData.correct ? color(235, 255, 235) : color(255, 235, 235));
    stroke(selectedOption === qData.correct ? color(76, 175, 80) : color(244, 67, 54));
    strokeWeight(2);
    rect(qBoxX, fbY, qBoxW, fbH, 6);
    noStroke();

    fill(30);
    textSize(min(width * 0.015, 15));
    textAlign(CENTER, CENTER);
    text(feedbackExplanation, qBoxX + 10, fbY + 2, qBoxW - 20, fbH - 4);

    let nextBtnW = 120;
    let nextBtnH = 35;
    drawCustomButton(
      mainX + mainW - nextBtnW - 20, fbY + fbH - nextBtnH - 6,
      nextBtnW, nextBtnH,
      currentQuestionIndex < 2 ? "下一題 ▶" : "看結果",
      color(33, 150, 243), color(100, 181, 246),
      15,
      () => { nextQuestion(); }
    );
  }
}

function handleOptionClick(idx) {
  if (isAnswered) return;
  selectedOption = idx;
  isAnswered = true;
  let qData = quizData[currentLevel][currentQuestionIndex];

  if (idx === qData.correct) {
    levelScore += 20;
    levelCorrectCount++;
    feedbackExplanation = "🎉 答對了！ " + qData.explanation;
  } else {
    feedbackExplanation = "💡 答錯囉！ " + qData.explanation;
  }
}

function nextQuestion() {
  if (currentQuestionIndex < 2) {
    currentQuestionIndex++;
    isAnswered = false;
    selectedOption = -1;
  } else {
    totalScore += levelScore;
    if (currentLevel === unlockedLevel && unlockedLevel < 3) {
      unlockedLevel++;
    }
    gameState = "LEVEL_RESULT";
  }
}

// =========================================================
// 關卡結果頁 (LEVEL_RESULT)
// =========================================================
function drawLevelResultScreen() {
  let boxW = min(width * 0.68, 620);
  let boxH = min(height * 0.62, 430);
  let boxX = (width - boxW) / 2;
  let boxY = (height - boxH) / 2;

  drawPanel(boxX, boxY, boxW, boxH, "關卡挑戰完成！", levelTitles[currentLevel]);

  fill(40);
  textSize(min(width * 0.022, 22));
  textAlign(CENTER, CENTER);

  let msg =
    `答對題數：${levelCorrectCount} / 3 題\n` +
    `本關得分：${levelScore} 分\n` +
    `總累積得分：${totalScore} 分\n\n` +
    `✨ 太棒了！王國又恢復更多生機囉！`;

  text(msg, boxX + 20, boxY + boxH * 0.22, boxW - 40, boxH * 0.45);

  let btnW = min(boxW * 0.38, 190);
  let btnH = 48;

  drawCustomButton(
    boxX + boxW * 0.12, boxY + boxH - btnH - 25,
    btnW, btnH,
    "回地圖",
    color(156, 39, 176), color(186, 104, 200),
    17,
    () => { gameState = "LEVEL_SELECT"; }
  );

  let nextLabel = currentLevel < 3 ? "下一關 ▶" : "遊戲結局 🏆";
  drawCustomButton(
    boxX + boxW * 0.5, boxY + boxH - btnH - 25,
    btnW, btnH,
    nextLabel,
    color(76, 175, 80), color(102, 187, 106),
    17,
    () => {
      if (currentLevel < 3) startLevel(currentLevel + 1);
      else gameState = "ENDING";
    }
  );
}

// =========================================================
// 遊戲結局畫面 (ENDING)
// =========================================================
function drawEndingScreen() {
  let boxW = min(width * 0.78, 750);
  let boxH = min(height * 0.72, 520);
  let boxX = (width - boxW) / 2;
  let boxY = (height - boxH) / 2;

  let isSuccess = totalScore >= 150;
  let title = isSuccess ? "🎉 恭喜成功拯救植物王國！ 🌸" : "🌱 沒關係！你已經非常努力了！ 💪";
  let subtitle = isSuccess ? "榮獲最高榮譽：【植物守護者 👑】" : "小小的挫折是冒險的養分，再加油一次一定行！";

  drawPanel(boxX, boxY, boxW, boxH, title, subtitle);

  fill(30);
  textSize(min(width * 0.02, 20));
  textAlign(CENTER, CENTER);

  let endTxt = isSuccess
    ? `總分 ${totalScore} 分！太厲害了！\n你完全解開了所有的自然科學奧秘，\n整個植物王國因為你而充滿燦爛色彩與無限生機！`
    : `總分 ${totalScore} 分（拯救目標 150 分）。\n\n別氣餒喔！探險家最需要的就是堅持與勇氣。\n只要重新複習挑戰一次，王國一定能再次綻放光彩！`;

  text(endTxt, boxX + 30, boxY + boxH * 0.28, boxW - 60, boxH * 0.42);

  let btnW = min(boxW * 0.42, 260);
  let btnH = 52;
  drawCustomButton(
    width / 2 - btnW / 2, boxY + boxH - btnH - 25,
    btnW, btnH,
    "🔄 再次挑戰冒險",
    color(255, 152, 0), color(255, 183, 77),
    19,
    () => {
      totalScore = 0;
      unlockedLevel = 0;
      gameState = "HOME";
    }
  );
}

// =========================================================
// 冒險人物繪製：對話框置中於頭部正上方
// =========================================================
function drawChubbyAdventurer(x, groundY, charHeight, headMsg) {
  push();
  let px = x;
  let py = groundY;

  // 地面陰影
  fill(0, 0, 0, 45);
  ellipse(x, groundY, charHeight * 0.5, charHeight * 0.12);

  // 1. 腳（固定站好在地上，不搖動）
  fill(100, 70, 30);
  ellipse(px - charHeight * 0.1, py - charHeight * 0.06, charHeight * 0.14, charHeight * 0.1);
  ellipse(px + charHeight * 0.1, py - charHeight * 0.06, charHeight * 0.14, charHeight * 0.1);

  // 2. 胖胖身體與衣服（輕微呼吸起伏）
  let bodyBounce = sin(charAnimTimer * 3) * 2;
  fill(245, 180, 60);
  ellipse(px, py - charHeight * 0.38 + bodyBounce, charHeight * 0.38, charHeight * 0.34);

  // 3. 雙手（伴隨呼吸輕微上下擺動）
  let handSwing = cos(charAnimTimer * 3) * 3;
  fill(220, 150, 40);
  ellipse(px - charHeight * 0.22, py - charHeight * 0.38 + bodyBounce + handSwing, charHeight * 0.12, charHeight * 0.16);
  ellipse(px + charHeight * 0.22, py - charHeight * 0.38 + bodyBounce - handSwing, charHeight * 0.12, charHeight * 0.16);

  // 4. 圓潤頭部
  fill(255, 224, 189);
  ellipse(px, py - charHeight * 0.65 + bodyBounce, charHeight * 0.32, charHeight * 0.3);

  // 臉部表情
  fill(40);
  ellipse(px - charHeight * 0.06, py - charHeight * 0.67 + bodyBounce, 5, 7);
  ellipse(px + charHeight * 0.06, py - charHeight * 0.67 + bodyBounce, 5, 7);
  noFill();
  stroke(40);
  strokeWeight(2);
  arc(px, py - charHeight * 0.62 + bodyBounce, 12, 7, 0, PI);
  noStroke();

  // 5. 淺棕色帽子
  fill(180, 130, 85);
  arc(px, py - charHeight * 0.74 + bodyBounce, charHeight * 0.36, charHeight * 0.2, PI, 0);
  fill(150, 100, 60);
  ellipse(px, py - charHeight * 0.74 + bodyBounce, charHeight * 0.44, charHeight * 0.07);

  // 6. 【對話回饋框：精準置中在頭部正上方】
  if (headMsg) {
    let bubbleW = 200;
    let bubbleH = 65;
    let bubbleX = px - bubbleW / 2; // 讓對話框水平置中對齊人物中心
    let bubbleY = py - charHeight * 1.15 + bodyBounce;

    // 氣泡框背景
    fill(255, 255, 255, 245);
    stroke(76, 175, 80);
    strokeWeight(2);
    rect(bubbleX, bubbleY, bubbleW, bubbleH, 12);
    noStroke();

    // 氣泡小尖角（朝下正對頭頂）
    fill(255, 255, 255, 245);
    triangle(px - 8, bubbleY + bubbleH, px + 8, bubbleY + bubbleH, px, bubbleY + bubbleH + 10);

    // 文字置中
    fill(30);
    textSize(15);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text(headMsg, bubbleX + 8, bubbleY + 5, bubbleW - 16, bubbleH - 10);
  }

  pop();
}

// =========================================================
// 每題獨立專屬的植物向量圖片繪製
// =========================================================
function drawUniqueQuizImage(type, cx, cy, size) {
  push();
  translate(cx, cy);

  if (type === "seed_germ") {
    fill(139, 69, 19);
    ellipse(0, 0, size * 0.6, size * 0.4);
    fill(100, 200, 250);
    ellipse(-size * 0.25, 0, 10, 10);
  } else if (type === "seed_root") {
    fill(139, 69, 19);
    ellipse(0, -size * 0.15, size * 0.5, size * 0.35);
    stroke(76, 175, 80);
    strokeWeight(4);
    noFill();
    beginShape();
    vertex(0, 0);
    quadraticVertex(0, size * 0.3, size * 0.1, size * 0.45);
    endShape();
    noStroke();
  } else if (type === "seed_cotyledon") {
    fill(76, 175, 80);
    ellipse(-size * 0.15, -size * 0.1, size * 0.3, size * 0.2);
    ellipse(size * 0.15, -size * 0.1, size * 0.3, size * 0.2);
    fill(139, 69, 19);
    ellipse(0, size * 0.15, size * 0.35, size * 0.25);
  } else if (type === "leaf_stomata") {
    fill(102, 187, 106);
    ellipse(0, 0, size * 0.7, size * 0.45);
    fill(46, 125, 50);
    ellipse(0, 0, size * 0.15, size * 0.3);
  } else if (type === "root_system") {
    stroke(120, 80, 40);
    strokeWeight(3);
    noFill();
    line(0, -size * 0.3, 0, 0);
    line(0, 0, -size * 0.3, size * 0.3);
    line(0, 0, size * 0.3, size * 0.3);
    line(0, size * 0.15, -size * 0.15, size * 0.4);
    noStroke();
  } else if (type === "stem_transport") {
    fill(180, 120, 60);
    rect(-size * 0.2, -size * 0.35, size * 0.4, size * 0.7, 6);
    stroke(255, 100, 100);
    strokeWeight(3);
    line(-size * 0.08, -size * 0.25, -size * 0.08, size * 0.25);
    line(size * 0.08, -size * 0.25, size * 0.08, size * 0.25);
    noStroke();
  } else if (type === "flower_complete") {
    for (let a = 0; a < TWO_PI; a += TWO_PI / 5) {
      fill(255, 130, 180);
      ellipse(cos(a) * size * 0.2, sin(a) * size * 0.2, size * 0.3);
    }
    fill(255, 220, 50);
    ellipse(0, 0, size * 0.25);
  } else if (type === "pollination_act") {
    fill(255, 220, 50);
    ellipse(-size * 0.2, -size * 0.2, size * 0.2);
    fill(255, 100, 150);
    ellipse(size * 0.15, size * 0.1, size * 0.35, size * 0.25);
  } else if (type === "bee_flower") {
    fill(255, 230, 50);
    ellipse(-size * 0.2, 0, size * 0.25, size * 0.2);
    fill(255, 150, 200);
    ellipse(size * 0.2, 0, size * 0.35, size * 0.3);
  } else if (type === "photo_gas") {
    fill(255, 193, 7);
    ellipse(-size * 0.3, -size * 0.2, size * 0.25);
    fill(76, 175, 80);
    ellipse(size * 0.1, size * 0.1, size * 0.45, size * 0.3);
  } else if (type === "ecosystem_prod") {
    fill(76, 175, 80);
    triangle(0, -size * 0.4, -size * 0.25, size * 0.2, size * 0.25, size * 0.2);
    fill(120, 80, 40);
    rect(-size * 0.06, size * 0.2, size * 0.12, size * 0.2);
  } else {
    fill(33, 150, 243);
    ellipse(0, 0, size * 0.5);
    fill(76, 175, 80);
    ellipse(-size * 0.1, 0, size * 0.25, size * 0.3);
  }

  pop();
}

// =========================================================
// UI 通用面板與按鈕
// =========================================================
function drawPanel(x, y, w, h, title, subtitle) {
  push();
  fill(0, 0, 0, 35);
  rect(x + 5, y + 5, w, h, 15);

  fill(255, 255, 255, 245);
  stroke(139, 195, 74);
  strokeWeight(3);
  rect(x, y, w, h, 15);

  fill(139, 195, 74);
  rect(x, y, w, h * 0.12, 12, 12, 0, 0);

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(min(w * 0.045, 24));
  textStyle(BOLD);
  text(title, x + w / 2, y + h * 0.06);

  if (subtitle) {
    fill(60);
    textSize(min(w * 0.03, 16));
    textStyle(NORMAL);
    text(subtitle, x + w / 2, y + h * 0.155);
  }
  pop();
}

function drawCustomButton(x, y, w, h, txt, bgColor, hoverColor, txtSize, onClick, textColor = color(255), strokeW = 0) {
  let isHover = mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;

  push();
  buttons.push({ x: x, y: y, w: w, h: h, action: onClick });

  fill(isHover ? hoverColor : bgColor);
  if (strokeW > 0) {
    stroke(180);
    strokeWeight(strokeW);
  } else {
    noStroke();
  }
  rect(x, y, w, h, 8);

  noStroke();
  fill(textColor);
  textAlign(CENTER, CENTER);
  textSize(txtSize);
  textStyle(BOLD);
  text(txt, x + 4, y + 4, w - 8, h - 8);
  pop();
}

function mousePressed() {
  for (let i = buttons.length - 1; i >= 0; i--) {
    let btn = buttons[i];
    if (mouseX >= btn.x && mouseX <= btn.x + btn.w && mouseY >= btn.y && mouseY <= btn.y + btn.h) {
      btn.action();
      break;
    }
  }
}
