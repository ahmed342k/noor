const themeToggle = document.getElementById("themeToggle");
const themeColorMeta = document.getElementById("themeColorMeta");
const shareBtn = document.getElementById("shareBtn");

const reciterSelect = document.getElementById("reciterSelect");
const surahSelect = document.getElementById("surahSelect");
const surahSearchInput = document.getElementById("surahSearchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const surahList = document.getElementById("surahList");

const nowTitle = document.getElementById("nowTitle");
const nowMeta = document.getElementById("nowMeta");
const startListenBtn = document.getElementById("startListenBtn");
const statusBox = document.getElementById("statusBox");

const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const currentTime = document.getElementById("currentTime");
const durationTime = document.getElementById("durationTime");

const prevBtn = document.getElementById("prevBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const nextBtn = document.getElementById("nextBtn");
const repeatBtn = document.getElementById("repeatBtn");
const muteBtn = document.getElementById("muteBtn");
const downloadBtn = document.getElementById("downloadBtn");

const audioPlayer = document.getElementById("audioPlayer");

const state = {
  surahs: [],
  filteredSurahs: [],
  reciters: [],
  currentSurahId: 1,
  currentReciterId: null,
  currentAudioUrl: "",
  repeat: false
};

const SURAHS_API = "https://www.mp3quran.net/api/v3/suwar?language=ar";
const RECITERS_API = "https://www.mp3quran.net/api/v3/reciters?language=ar";

const preferredReciters = [
  { display: "مشاري العفاسي", keys: ["مشاري", "العفاسي"] },
  { display: "ماهر المعيقلي", keys: ["ماهر", "المعيقلي"] },
  { display: "محمد صديق المنشاوي", keys: ["محمد", "المنشاوي"] },
  { display: "عبد الباسط عبد الصمد", keys: ["عبد", "الباسط"] },
  { display: "عبد الرحمن السديس", keys: ["عبد", "الرحمن", "السديس"] },
  { display: "سعود الشريم", keys: ["سعود", "الشريم"] },
  { display: "فارس عباد", keys: ["فارس", "عباد"] },
  { display: "أحمد العجمي", keys: ["احمد", "العجمي"] },
  { display: "ياسر الدوسري", keys: ["ياسر", "الدوسري"] },
  { display: "ناصر القطامي", keys: ["ناصر", "القطامي"] },
  { display: "إدريس أبكر", keys: ["ادريس", "ابكر"] },
  { display: "هاني الرفاعي", keys: ["هاني", "الرفاعي"] },
  { display: "محمد أيوب", keys: ["محمد", "ايوب"] },
  { display: "علي الحذيفي", keys: ["علي", "الحذيفي"] },
  { display: "صلاح البدير", keys: ["صلاح", "البدير"] },
  { display: "محمد الطبلاوي", keys: ["محمد", "الطبلاوي"] },
  { display: "محمد جبريل", keys: ["محمد", "جبريل"] },
  { display: "عبد الله بصفر", keys: ["عبد", "الله", "بصفر"] },
  { display: "إبراهيم الأخضر", keys: ["ابراهيم", "الاخضر"] },
  { display: "عبد الله الجهني", keys: ["عبد", "الله", "الجهني"] },
  { display: "أبو بكر الشاطري", keys: ["ابو", "بكر", "الشاطري"] },
  { display: "توفيق الصايغ", keys: ["توفيق", "الصايغ"] },
  { display: "بندر بليلة", keys: ["بندر", "بليله"] },
  { display: "خالد الجليل", keys: ["خالد", "الجليل"] },
  { display: "عبد الله خياط", keys: ["عبد", "الله", "خياط"] },
  { display: "محمد اللحيدان", keys: ["محمد", "اللحيدان"] },
  { display: "محمود خليل الحصري", keys: ["محمود", "الحصري"] },
  { display: "أحمد النفيس", keys: ["احمد", "النفيس"] },
  { display: "هزاع البلوشي", keys: ["هزاع", "البلوشي"] },
  { display: "عبد الله كامل", keys: ["عبد", "الله", "كامل"] }
];

function normalizeArabic(text = "") {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ـ/g, "")
    .replace(/[^\u0621-\u063A\u0641-\u064A0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pad3(num) {
  return String(num).padStart(3, "0");
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function setStatus(text, ok = false) {
  statusBox.textContent = text;
  statusBox.classList.toggle("ok", ok);
}

function setTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("qaree-theme", isDark ? "dark" : "light");
  themeColorMeta.setAttribute("content", isDark ? "#061221" : "#edf2f9");
}

function initTheme() {
  const saved = localStorage.getItem("qaree-theme");
  setTheme(saved === "dark");
}

function scoreCandidate(query, text) {
  const q = normalizeArabic(query);
  const t = normalizeArabic(text);

  if (!q) return 0;
  if (!t) return 9999;
  if (t === q) return 0;
  if (t.startsWith(q)) return 1;
  if (t.includes(q)) return 2;

  let score = 10;
  const qWords = q.split(" ").filter(Boolean);
  for (const word of qWords) {
    if (t.includes(word)) score -= 1;
  }
  score += Math.abs(t.length - q.length) / 10;
  return score;
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function ensureSlash(url) {
  return url.endsWith("/") ? url : `${url}/`;
}

function buildAudioUrl(server, surahId) {
  return `${ensureSlash(server)}${pad3(surahId)}.mp3`;
}

function findSurahById(id) {
  return state.surahs.find(s => Number(s.id) === Number(id));
}

function renderSurahOptions() {
  surahSelect.innerHTML = state.surahs
    .map(s => `<option value="${s.id}">${s.id} - ${s.name}</option>`)
    .join("");

  surahSelect.value = String(state.currentSurahId);
}

function renderReciterOptions() {
  reciterSelect.innerHTML = state.reciters
    .map(r => `<option value="${r.id}">${r.displayName}</option>`)
    .join("");

  if (!state.currentReciterId && state.reciters.length) {
    state.currentReciterId = state.reciters[0].id;
  }

  reciterSelect.value = String(state.currentReciterId);
}

function renderSurahList(list) {
  if (!list.length) {
    surahList.innerHTML = `<div class="list-loading">لا توجد نتائج</div>`;
    return;
  }

  surahList.innerHTML = list.map(surah => {
    const active = Number(surah.id) === Number(state.currentSurahId) ? "active" : "";
    return `
      <div class="surah-item ${active}" data-id="${surah.id}">
        <div class="surah-num">${surah.id}</div>
        <div class="surah-body">
          <h4>${surah.name}</h4>
          <p>${surah.start_page ? `الصفحة ${surah.start_page}` : "سورة قرآنية"}</p>
        </div>
        <div class="surah-end">${surah.type || ""}</div>
      </div>
    `;
  }).join("");
}

function applySurahSearch(query) {
  const q = normalizeArabic(query);

  if (!q) {
    state.filteredSurahs = [...state.surahs];
    renderSurahList(state.filteredSurahs);
    return;
  }

  state.filteredSurahs = [...state.surahs]
    .map(surah => ({
      surah,
      score: scoreCandidate(q, `${surah.name} ${surah.id}`)
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 114)
    .map(item => item.surah);

  renderSurahList(state.filteredSurahs);
}

function updateNowCard() {
  const surah = findSurahById(state.currentSurahId);
  const reciter = state.reciters.find(r => Number(r.id) === Number(state.currentReciterId));

  nowTitle.textContent = surah ? `سورة ${surah.name}` : "اختر سورة";
  nowMeta.textContent = reciter
    ? `القارئ: ${reciter.displayName} • السورة رقم ${state.currentSurahId}`
    : "اختر قارئًا وسورة للبدء";
}

function syncSelects() {
  surahSelect.value = String(state.currentSurahId);
  reciterSelect.value = String(state.currentReciterId);
  updateNowCard();
  renderSurahList(state.filteredSurahs.length ? state.filteredSurahs : state.surahs);
}

function updatePlayButton() {
  playPauseBtn.classList.toggle("is-paused", audioPlayer.paused);
}

function updateMuteButton() {
  muteBtn.classList.toggle("is-muted", audioPlayer.muted);
}

function updateRepeatButton() {
  repeatBtn.classList.toggle("active", state.repeat);
}

async function loadAndMaybePlay(autoPlay = false) {
  const reciter = state.reciters.find(r => Number(r.id) === Number(state.currentReciterId));
  const surah = findSurahById(state.currentSurahId);

  if (!reciter || !surah) return;

  const audioUrl = buildAudioUrl(reciter.server, surah.id);
  state.currentAudioUrl = audioUrl;

  audioPlayer.src = audioUrl;
  audioPlayer.load();

  setStatus(`تم اختيار ${surah.name} بصوت ${reciter.displayName}`, true);

  if (autoPlay) {
    try {
      await audioPlayer.play();
    } catch (err) {
      setStatus("تعذر بدء التشغيل تلقائيًا. اضغط زر التشغيل.", false);
    }
  }

  setupMediaSession(reciter.displayName, surah.name);
  updatePlayButton();
}

function setupMediaSession(reciterName, surahName) {
  if (!("mediaSession" in navigator)) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title: `سورة ${surahName}`,
    artist: reciterName,
    album: "القارئ"
  });

  navigator.mediaSession.setActionHandler("play", async () => {
    try { await audioPlayer.play(); } catch (_) {}
  });

  navigator.mediaSession.setActionHandler("pause", () => {
    audioPlayer.pause();
  });

  navigator.mediaSession.setActionHandler("previoustrack", () => {
    goPrev();
  });

  navigator.mediaSession.setActionHandler("nexttrack", () => {
    goNext();
  });
}

function goPrev() {
  const currentIndex = state.surahs.findIndex(s => Number(s.id) === Number(state.currentSurahId));
  const prevIndex = currentIndex <= 0 ? state.surahs.length - 1 : currentIndex - 1;
  state.currentSurahId = Number(state.surahs[prevIndex].id);
  syncSelects();
  loadAndMaybePlay(true);
}

function goNext() {
  const currentIndex = state.surahs.findIndex(s => Number(s.id) === Number(state.currentSurahId));
  const nextIndex = currentIndex >= state.surahs.length - 1 ? 0 : currentIndex + 1;
  state.currentSurahId = Number(state.surahs[nextIndex].id);
  syncSelects();
  loadAndMaybePlay(true);
}

function pickPreferredReciters(rawReciters) {
  const usable = rawReciters
    .map(r => {
      const bestMoshaf = (r.moshaf || []).find(m => Number(m.surah_total) === 114 && m.server);
      if (!bestMoshaf) return null;
      return {
        id: r.id,
        rawName: r.name,
        normalizedName: normalizeArabic(r.name),
        server: bestMoshaf.server
      };
    })
    .filter(Boolean);

  const picked = [];
  const usedIds = new Set();

  for (const pref of preferredReciters) {
    const found = usable.find(item => {
      if (usedIds.has(item.id)) return false;
      return pref.keys.every(k => item.normalizedName.includes(normalizeArabic(k)));
    });

    if (found) {
      picked.push({
        id: found.id,
        displayName: pref.display,
        server: found.server
      });
      usedIds.add(found.id);
    }
  }

  for (const item of usable) {
    if (picked.length >= 30) break;
    if (usedIds.has(item.id)) continue;
    picked.push({
      id: item.id,
      displayName: item.rawName,
      server: item.server
    });
    usedIds.add(item.id);
  }

  return picked.slice(0, 30);
}

async function loadData() {
  setStatus("جارِ تحميل السور والقراء...");
  try {
    const [suwarData, recitersData] = await Promise.all([
      getJson(SURAHS_API),
      getJson(RECITERS_API)
    ]);

    const suwar = suwarData.suwar || [];
    const reciters = recitersData.reciters || [];

    state.surahs = suwar.map(item => ({
      id: Number(item.id),
      name: item.name,
      start_page: item.start_page || "",
      type:
        item.type === 1 || item.type === "1" ? "مكية" :
        item.type === 2 || item.type === "2" ? "مدنية" :
        ""
    }));

    state.filteredSurahs = [...state.surahs];
    state.reciters = pickPreferredReciters(reciters);

    if (!state.surahs.length) {
      throw new Error("no surahs");
    }

    if (!state.reciters.length) {
      throw new Error("no reciters");
    }

    state.currentSurahId = 1;
    state.currentReciterId = state.reciters[0].id;

    renderSurahOptions();
    renderReciterOptions();
    renderSurahList(state.surahs);
    updateNowCard();
    updateRepeatButton();
    updateMuteButton();
    updatePlayButton();

    setStatus("تم تحميل السور والقراء بنجاح", true);
  } catch (err) {
    console.error(err);
    setStatus("تعذر تحميل البيانات. تحقق من الإنترنت ثم حدّث الصفحة.", false);
    surahList.innerHTML = `<div class="list-loading">تعذر تحميل السور</div>`;
  }
}

function initEvents() {
  themeToggle.addEventListener("click", () => {
    setTheme(!document.body.classList.contains("dark"));
  });

  shareBtn.addEventListener("click", async () => {
    const data = {
      title: "القارئ | استمع إلى القرآن الكريم",
      text: "مشغل قرآن صوتي لاختيار السورة والقارئ والاستماع بسهولة.",
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (_) {}
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      const old = shareBtn.textContent;
      shareBtn.textContent = "تم نسخ الرابط";
      setTimeout(() => {
        shareBtn.textContent = old;
      }, 1400);
    } catch (_) {
      setStatus("تعذر نسخ الرابط", false);
    }
  });

  reciterSelect.addEventListener("change", () => {
    state.currentReciterId = Number(reciterSelect.value);
    syncSelects();
    loadAndMaybePlay(false);
  });

  surahSelect.addEventListener("change", () => {
    state.currentSurahId = Number(surahSelect.value);
    syncSelects();
    loadAndMaybePlay(false);
  });

  startListenBtn.addEventListener("click", () => {
    loadAndMaybePlay(true);
  });

  surahSearchInput.addEventListener("input", () => {
    applySurahSearch(surahSearchInput.value);
  });

  clearSearchBtn.addEventListener("click", () => {
    surahSearchInput.value = "";
    applySurahSearch("");
    surahSearchInput.focus();
  });

  surahList.addEventListener("click", (e) => {
    const item = e.target.closest(".surah-item");
    if (!item) return;
    state.currentSurahId = Number(item.dataset.id);
    syncSelects();
    loadAndMaybePlay(false);
  });

  playPauseBtn.addEventListener("click", async () => {
    if (!audioPlayer.src) {
      await loadAndMaybePlay(true);
      return;
    }

    if (audioPlayer.paused) {
      try {
        await audioPlayer.play();
      } catch (_) {
        setStatus("تعذر التشغيل. جرّب مرة أخرى.", false);
      }
    } else {
      audioPlayer.pause();
    }
  });

  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);

  repeatBtn.addEventListener("click", () => {
    state.repeat = !state.repeat;
    audioPlayer.loop = state.repeat;
    updateRepeatButton();
  });

  muteBtn.addEventListener("click", () => {
    audioPlayer.muted = !audioPlayer.muted;
    updateMuteButton();
  });

  downloadBtn.addEventListener("click", () => {
    if (!state.currentAudioUrl) {
      setStatus("لا يوجد ملف صوتي جاهز للتحميل بعد", false);
      return;
    }

    const a = document.createElement("a");
    a.href = state.currentAudioUrl;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  progressBar.addEventListener("click", (e) => {
    if (!audioPlayer.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    audioPlayer.currentTime = ratio * audioPlayer.duration;
  });

  audioPlayer.addEventListener("timeupdate", () => {
    if (!audioPlayer.duration) return;
    const ratio = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressFill.style.width = `${ratio}%`;
    currentTime.textContent = formatTime(audioPlayer.currentTime);
    durationTime.textContent = `-${formatTime(audioPlayer.duration - audioPlayer.currentTime)}`;
  });

  audioPlayer.addEventListener("loadedmetadata", () => {
    currentTime.textContent = "00:00";
    durationTime.textContent = `-${formatTime(audioPlayer.duration)}`;
  });

  audioPlayer.addEventListener("play", () => {
    updatePlayButton();
  });

  audioPlayer.addEventListener("pause", () => {
    updatePlayButton();
  });

  audioPlayer.addEventListener("ended", () => {
    if (!state.repeat) {
      goNext();
    }
  });
}

async function init() {
  initTheme();
  initEvents();
  await loadData();
}

init();
