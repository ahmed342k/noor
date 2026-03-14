const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const themeColorMeta = document.getElementById("themeColorMeta");

const shareBtn = document.getElementById("shareBtn");
const heroShareBtn = document.getElementById("heroShareBtn");
const openReaderBtn = document.getElementById("openReaderBtn");

const mainSearch = document.getElementById("mainSearch");
const mainSearchBtn = document.getElementById("mainSearchBtn");

const reciterSelect = document.getElementById("reciterSelect");
const readerReciterSelect = document.getElementById("readerReciterSelect");
const listenModeSelect = document.getElementById("listenModeSelect");

const surahTitle = document.getElementById("surahTitle");
const surahMeta = document.getElementById("surahMeta");

const surahSearch = document.getElementById("surahSearch");
const surahSearchBtn = document.getElementById("surahSearchBtn");
const surahList = document.getElementById("surahList");

const ayahSearchInput = document.getElementById("ayahSearchInput");
const ayahSearchBtn = document.getElementById("ayahSearchBtn");
const ayahResults = document.getElementById("ayahResults");

const readerSurahSelect = document.getElementById("readerSurahSelect");
const readerLoadBtn = document.getElementById("readerLoadBtn");
const readerContent = document.getElementById("readerContent");

const startMicBtn = document.getElementById("startMicBtn");
const stopMicBtn = document.getElementById("stopMicBtn");
const micStatus = document.getElementById("micStatus");

const audioPlayer = document.getElementById("audioPlayer");
const ayahAudioPlayer = document.getElementById("ayahAudioPlayer");

const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const currentTimeEl = document.getElementById("currentTime");
const durationTimeEl = document.getElementById("durationTime");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const repeatBtn = document.getElementById("repeatBtn");
const downloadBtn = document.getElementById("downloadBtn");
const muteBtn = document.getElementById("muteBtn");

const API_BASE = "https://api.alquran.cloud/v1";

const appState = {
  surahs: [],
  reciters: [],
  currentSurahIndex: 0,
  currentReciter: "",
  currentReaderSurah: 1,
  repeatEnabled: false,
  micRecognition: null,
  currentReaderAyahs: []
};

const COMMON_RECITERS_PRIORITY = [
  "ar.alafasy",
  "ar.abdurrahmaansudais",
  "ar.mahermuaiqly",
  "ar.minshawi",
  "ar.husary",
  "ar.hudhaify",
  "ar.shaatree",
  "ar.ahmedajamy",
  "ar.saoodshuraym",
  "ar.abdulbasitmurattal",
  "ar.abdulbasitmujawwad",
  "ar.muhammadayyoub",
  "ar.muhammadjibreel",
  "ar.abdullahbasfar",
  "ar.yasserdossari",
  "ar.faresabbad"
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

function escapeHtml(text = "") {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function pad3(num) {
  return String(num).padStart(3, "0");
}

function formatTime(seconds) {
  if (!isFinite(seconds) || Number.isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function setTheme(isDark) {
  body.classList.toggle("dark", isDark);
  localStorage.setItem("qarie-theme", isDark ? "dark" : "light");
  themeColorMeta.setAttribute("content", isDark ? "#03101e" : "#071427");
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("qarie-theme");
  setTheme(savedTheme === "dark");
}

function showMessage(container, message, type = "placeholder") {
  const className =
    type === "error"
      ? "error-box"
      : type === "success"
      ? "success-box"
      : "placeholder-box";
  container.innerHTML = `<div class="${className}">${escapeHtml(message)}</div>`;
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function scoreTextMatch(query, candidate) {
  const q = normalizeArabic(query);
  const c = normalizeArabic(candidate);

  if (!q) return 0;
  if (!c) return 9999;
  if (c === q) return 0;
  if (c.startsWith(q)) return 1;
  if (c.includes(q)) return 2;

  let score = 10;
  const qWords = q.split(" ").filter(Boolean);
  const cWords = c.split(" ").filter(Boolean);

  for (const qw of qWords) {
    if (cWords.some(cw => cw.startsWith(qw))) score -= 1;
    else if (c.includes(qw)) score -= 0.5;
  }

  score += Math.abs(c.length - q.length) / 10;
  return score;
}

function findClosestSurahs(query, limit = 20) {
  const q = normalizeArabic(query);
  if (!q) return appState.surahs.slice(0, limit);

  return [...appState.surahs]
    .map(surah => {
      const title = surah.name || "";
      const simple = surah.englishName || "";
      const allText = `${title} ${simple} ${surah.englishNameTranslation || ""}`;
      return {
        surah,
        score: scoreTextMatch(q, allText)
      };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map(item => item.surah);
}

function renderSurahList(list) {
  if (!list.length) {
    surahList.innerHTML = `<div class="empty-state">لا توجد نتائج</div>`;
    return;
  }

  surahList.innerHTML = list
    .map(surah => {
      const active = appState.currentSurahIndex === (surah.number - 1) ? "active" : "";
      return `
        <div class="surah-item ${active}" data-surah-number="${surah.number}">
          <div class="surah-no">${surah.number}</div>
          <div class="surah-meta">
            <h3>${escapeHtml(surah.name)}</h3>
            <p>${surah.numberOfAyahs} آية • ${escapeHtml(surah.englishName || "")}</p>
          </div>
          <div class="surah-type">${surah.revelationType === "Meccan" ? "مكية" : "مدنية"}</div>
        </div>
      `;
    })
    .join("");
}

function populateSurahSelects() {
  const options = appState.surahs
    .map(
      surah =>
        `<option value="${surah.number}">${surah.number} - ${escapeHtml(
          surah.name
        )}</option>`
    )
    .join("");

  readerSurahSelect.innerHTML = options;
  readerSurahSelect.value = String(appState.currentReaderSurah);
}

function getReadableReciterName(identifier) {
  const map = {
    "ar.alafasy": "مشاري العفاسي",
    "ar.abdurrahmaansudais": "عبد الرحمن السديس",
    "ar.mahermuaiqly": "ماهر المعيقلي",
    "ar.minshawi": "محمد صديق المنشاوي",
    "ar.husary": "محمود خليل الحصري",
    "ar.hudhaify": "علي الحذيفي",
    "ar.shaatree": "أبو بكر الشاطري",
    "ar.ahmedajamy": "أحمد العجمي",
    "ar.saoodshuraym": "سعود الشريم",
    "ar.abdulbasitmurattal": "عبد الباسط عبد الصمد",
    "ar.abdulbasitmujawwad": "عبد الباسط عبد الصمد مجود",
    "ar.muhammadayyoub": "محمد أيوب",
    "ar.muhammadjibreel": "محمد جبريل",
    "ar.abdullahbasfar": "عبد الله بصفر",
    "ar.yasserdossari": "ياسر الدوسري",
    "ar.faresabbad": "فارس عباد"
  };

  return map[identifier] || identifier.replace(/^ar\./, "");
}

function sortReciters(reciters) {
  const priorityMap = new Map(COMMON_RECITERS_PRIORITY.map((id, index) => [id, index]));
  return [...reciters].sort((a, b) => {
    const aIndex = priorityMap.has(a.identifier) ? priorityMap.get(a.identifier) : 9999;
    const bIndex = priorityMap.has(b.identifier) ? priorityMap.get(b.identifier) : 9999;

    if (aIndex !== bIndex) return aIndex - bIndex;

    return getReadableReciterName(a.identifier).localeCompare(
      getReadableReciterName(b.identifier),
      "ar"
    );
  });
}

function populateReciters() {
  const options = appState.reciters
    .map(
      reciter =>
        `<option value="${reciter.identifier}">${escapeHtml(
          getReadableReciterName(reciter.identifier)
        )}</option>`
    )
    .join("");

  reciterSelect.innerHTML = options;
  readerReciterSelect.innerHTML = options;

  if (!appState.currentReciter && appState.reciters.length) {
    appState.currentReciter = appState.reciters[0].identifier;
  }

  reciterSelect.value = appState.currentReciter;
  readerReciterSelect.value = appState.currentReciter;
}

function buildSurahAudioUrl(reciterIdentifier, surahNumber) {
  return `${API_BASE}/ayah/${surahNumber}:1/${reciterIdentifier}`;
}

async function resolveSurahAudio(reciterIdentifier, surahNumber) {
  const data = await fetchJson(buildSurahAudioUrl(reciterIdentifier, surahNumber));
  const audioUrl = data?.data?.audio;
  if (!audioUrl) throw new Error("No audio url");
  return audioUrl;
}

function updatePlayerMeta() {
  const surah = appState.surahs[appState.currentSurahIndex];
  const reciterName = getReadableReciterName(appState.currentReciter);

  surahTitle.textContent = `سورة ${surah.name}`;
  surahMeta.textContent = `القارئ: ${reciterName} • ${surah.numberOfAyahs} آية • ${
    surah.revelationType === "Meccan" ? "مكية" : "مدنية"
  }`;
}

function setActiveSurahItem() {
  document.querySelectorAll(".surah-item").forEach(item => {
    const isActive = Number(item.dataset.surahNumber) === appState.currentSurahIndex + 1;
    item.classList.toggle("active", isActive);
  });
}

function updatePlayButton() {
  playBtn.classList.toggle("is-paused", audioPlayer.paused);
}

function updateMuteButton() {
  muteBtn.classList.toggle("is-muted", audioPlayer.muted);
}

function resetProgress() {
  progressFill.style.width = "0%";
  currentTimeEl.textContent = "00:00";
  durationTimeEl.textContent = "-00:00";
}

async function loadCurrentSurahAudio(autoPlay = false) {
  const surah = appState.surahs[appState.currentSurahIndex];
  updatePlayerMeta();
  setActiveSurahItem();
  resetProgress();

  try {
    playBtn.disabled = true;
    const audioUrl = await resolveSurahAudio(appState.currentReciter, surah.number);
    audioPlayer.src = audioUrl;
    audioPlayer.load();

    if (autoPlay) {
      await audioPlayer.play();
    }
  } catch (error) {
    alert("تعذر تشغيل الصوت. تأكد من الاتصال بالإنترنت أو جرّب قارئًا آخر.");
    console.error(error);
  } finally {
    playBtn.disabled = false;
    updatePlayButton();
  }
}

function setCurrentSurahByNumber(surahNumber, autoPlay = false) {
  const index = appState.surahs.findIndex(s => s.number === surahNumber);
  if (index === -1) return;
  appState.currentSurahIndex = index;
  appState.currentReaderSurah = surahNumber;
  readerSurahSelect.value = String(surahNumber);
  loadCurrentSurahAudio(autoPlay);
}

async function searchAyahs(query) {
  if (!query.trim()) {
    showMessage(ayahResults, "اكتب جزءًا من آية لبدء البحث");
    return;
  }

  showMessage(ayahResults, "جارِ البحث...");
  try {
    const normalized = encodeURIComponent(query.trim());
    const data = await fetchJson(`${API_BASE}/search/${normalized}/all/ar`);
    const matches = data?.data?.matches || [];

    if (!matches.length) {
      showMessage(ayahResults, "لم يتم العثور على نتائج");
      return;
    }

    ayahResults.innerHTML = matches
      .slice(0, 10)
      .map(match => {
        const highlightedText = highlightMatch(match.text, query);
        return `
          <div class="ayah-result">
            <div class="ayah-result-top">
              <div class="ayah-result-title">${escapeHtml(match.surah.name)}</div>
              <div class="ayah-result-meta">الآية ${match.numberInSurah}</div>
            </div>
            <div class="ayah-result-text">${highlightedText}</div>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    showMessage(ayahResults, "حدث خطأ أثناء البحث في الآيات", "error");
    console.error(error);
  }
}

function highlightMatch(text, query) {
  const safeText = escapeHtml(text);
  const q = query.trim();
  if (!q) return safeText;

  const normalizedQuery = normalizeArabic(q);
  const words = normalizedQuery.split(" ").filter(Boolean).slice(0, 6);

  let result = safeText;

  for (const word of words) {
    if (word.length < 2) continue;
    const pattern = new RegExp(`(${escapeRegex(word)})`, "gi");
    result = result.replace(pattern, `<span class="highlight">$1</span>`);
  }

  return result;
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function loadReaderSurah() {
  const surahNumber = Number(readerSurahSelect.value || 1);
  const edition = "quran-uthmani";

  appState.currentReaderSurah = surahNumber;
  readerContent.innerHTML = `<div class="loading-box">جارِ تحميل نص السورة...</div>`;

  try {
    const data = await fetchJson(`${API_BASE}/surah/${surahNumber}/${edition}`);
    const surahData = data?.data;
    const ayahs = surahData?.ayahs || [];
    appState.currentReaderAyahs = ayahs;

    readerContent.innerHTML = `
      <div class="reader-header">
        <h3>سورة ${escapeHtml(surahData.name)}</h3>
        <p>${ayahs.length} آية • ${surahData.revelationType === "Meccan" ? "مكية" : "مدنية"}</p>
      </div>
      <div class="reader-ayahs">
        ${ayahs
          .map(
            ayah => `
              <div class="reader-ayah" data-ayah-number="${ayah.numberInSurah}">
                ${escapeHtml(ayah.text)}
                <span class="ayah-number">${ayah.numberInSurah}</span>
              </div>
            `
          )
          .join("")}
      </div>
    `;
  } catch (error) {
    showMessage(readerContent, "تعذر تحميل السورة", "error");
    console.error(error);
  }
}

async function playSingleAyah(surahNumber, ayahNumber) {
  const edition = readerReciterSelect.value || appState.currentReciter;
  const globalAyahNumber = await getGlobalAyahNumber(surahNumber, ayahNumber);

  try {
    const data = await fetchJson(`${API_BASE}/ayah/${globalAyahNumber}/${edition}`);
    const audioUrl = data?.data?.audio;
    if (!audioUrl) throw new Error("No ayah audio");
    ayahAudioPlayer.src = audioUrl;
    ayahAudioPlayer.load();
    await ayahAudioPlayer.play();
  } catch (error) {
    alert("تعذر تشغيل الآية بصوت القارئ المختار");
    console.error(error);
  }
}

function getGlobalAyahNumber(surahNumber, ayahNumber) {
  let total = 0;
  for (const surah of appState.surahs) {
    if (surah.number < surahNumber) {
      total += surah.numberOfAyahs;
    }
  }
  return Promise.resolve(total + ayahNumber);
}

async function initializeSurahs() {
  showMessage(surahList, "جارِ تحميل السور...");
  try {
    const data = await fetchJson(`${API_BASE}/surah`);
    appState.surahs = data?.data || [];
    renderSurahList(appState.surahs);
    populateSurahSelects();
    updatePlayerMeta();
  } catch (error) {
    showMessage(surahList, "تعذر تحميل السور", "error");
    console.error(error);
  }
}

async function initializeReciters() {
  try {
    const data = await fetchJson(`${API_BASE}/edition?format=audio&language=ar&type=versebyverse`);
    const editions = data?.data || [];

    const filtered = editions
      .filter(item => item.identifier && item.format === "audio")
      .filter(item => item.language === "ar")
      .filter(item => item.type === "versebyverse");

    const uniqueMap = new Map();
    for (const item of filtered) {
      if (!uniqueMap.has(item.identifier)) {
        uniqueMap.set(item.identifier, item);
      }
    }

    appState.reciters = sortReciters(Array.from(uniqueMap.values())).slice(0, 30);
    if (!appState.reciters.length) {
      throw new Error("No reciters found");
    }

    appState.currentReciter = appState.reciters[0].identifier;
    populateReciters();
  } catch (error) {
    reciterSelect.innerHTML = `<option value="">تعذر تحميل القراء</option>`;
    readerReciterSelect.innerHTML = `<option value="">تعذر تحميل القراء</option>`;
    console.error(error);
  }
}

function filterSurahs(query) {
  const results = findClosestSurahs(query, 114);
  renderSurahList(results);
}

function shareSite(button) {
  const shareData = {
    title: "القارئ | استمع إلى القرآن الكريم",
    text: "موقع للاستماع إلى القرآن الكريم وقراءة السور والبحث في الآيات.",
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        const original = button.textContent;
        button.textContent = "تم نسخ الرابط";
        setTimeout(() => {
          button.textContent = original;
        }, 1500);
      })
      .catch(() => {
        alert("تعذر نسخ الرابط");
      });
  } else {
    alert("المشاركة غير مدعومة على هذا الجهاز");
  }
}

function initializeMicFeature() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    micStatus.textContent = "ميزة الاستماع غير مدعومة في هذا المتصفح";
    startMicBtn.disabled = true;
    stopMicBtn.disabled = true;
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "ar-SA";
  recognition.interimResults = true;
  recognition.continuous = true;
  appState.micRecognition = recognition;

  recognition.onstart = () => {
    micStatus.textContent = "جاري الاستماع لك...";
    micStatus.classList.add("listening");
  };

  recognition.onend = () => {
    micStatus.classList.remove("listening");
    micStatus.textContent = "تم إيقاف الاستماع";
  };

  recognition.onerror = () => {
    micStatus.classList.remove("listening");
    micStatus.textContent = "حدث خطأ أثناء الاستماع";
  };

  recognition.onresult = event => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript + " ";
    }

    const cleaned = transcript.trim();
    if (!cleaned) return;
    micStatus.textContent = `سمعنا: ${cleaned}`;
    tryHighlightReaderText(cleaned);
  };

  startMicBtn.addEventListener("click", () => {
    try {
      recognition.start();
    } catch (_) {}
  });

  stopMicBtn.addEventListener("click", () => {
    recognition.stop();
  });
}

function tryHighlightReaderText(spokenText) {
  if (!appState.currentReaderAyahs.length) return;

  const normalizedSpoken = normalizeArabic(spokenText);
  if (!normalizedSpoken) return;

  let bestMatch = null;
  let bestScore = Infinity;

  for (const ayah of appState.currentReaderAyahs) {
    const score = scoreTextMatch(normalizedSpoken, ayah.text);
    if (score < bestScore) {
      bestScore = score;
      bestMatch = ayah;
    }
  }

  if (!bestMatch) return;

  document.querySelectorAll(".reader-ayah").forEach(el => {
    el.classList.toggle(
      "active",
      Number(el.dataset.ayahNumber) === bestMatch.numberInSurah
    );
  });
}

function setupAudioEvents() {
  audioPlayer.addEventListener("timeupdate", () => {
    if (audioPlayer.duration) {
      const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressFill.style.width = `${progress}%`;
      currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
      durationTimeEl.textContent = `-${formatTime(audioPlayer.duration - audioPlayer.currentTime)}`;
    }
  });

  audioPlayer.addEventListener("loadedmetadata", () => {
    currentTimeEl.textContent = "00:00";
    durationTimeEl.textContent = `-${formatTime(audioPlayer.duration)}`;
  });

  audioPlayer.addEventListener("ended", () => {
    if (appState.repeatEnabled) {
      audioPlayer.currentTime = 0;
      audioPlayer.play().catch(() => {});
    } else {
      const nextIndex = (appState.currentSurahIndex + 1) % appState.surahs.length;
      appState.currentSurahIndex = nextIndex;
      loadCurrentSurahAudio(true);
    }
    updatePlayButton();
  });

  audioPlayer.addEventListener("play", updatePlayButton);
  audioPlayer.addEventListener("pause", updatePlayButton);
}

function setupEvents() {
  themeToggle.addEventListener("click", () => {
    setTheme(!body.classList.contains("dark"));
  });

  shareBtn.addEventListener("click", () => shareSite(shareBtn));
  heroShareBtn.addEventListener("click", () => shareSite(heroShareBtn));

  openReaderBtn.addEventListener("click", () => {
    document.getElementById("readerSection").scrollIntoView({ behavior: "smooth" });
  });

  mainSearch.addEventListener("input", e => {
    filterSurahs(e.target.value);
    surahSearch.value = e.target.value;
  });

  mainSearchBtn.addEventListener("click", () => {
    filterSurahs(mainSearch.value);
    document.getElementById("listen").scrollIntoView({ behavior: "smooth" });
  });

  surahSearch.addEventListener("input", e => {
    filterSurahs(e.target.value);
    mainSearch.value = e.target.value;
  });

  surahSearchBtn.addEventListener("click", () => {
    filterSurahs(surahSearch.value);
  });

  surahList.addEventListener("click", e => {
    const item = e.target.closest(".surah-item");
    if (!item) return;
    const surahNumber = Number(item.dataset.surahNumber);
    setCurrentSurahByNumber(surahNumber, true);
  });

  reciterSelect.addEventListener("change", async e => {
    appState.currentReciter = e.target.value;
    readerReciterSelect.value = appState.currentReciter;
    await loadCurrentSurahAudio(false);
  });

  readerReciterSelect.addEventListener("change", e => {
    appState.currentReciter = e.target.value;
    reciterSelect.value = appState.currentReciter;
  });

  readerSurahSelect.addEventListener("change", e => {
    appState.currentReaderSurah = Number(e.target.value || 1);
  });

  readerLoadBtn.addEventListener("click", loadReaderSurah);

  readerContent.addEventListener("click", e => {
    const ayahEl = e.target.closest(".reader-ayah");
    if (!ayahEl) return;

    document.querySelectorAll(".reader-ayah").forEach(el => el.classList.remove("active"));
    ayahEl.classList.add("active");

    const ayahNumber = Number(ayahEl.dataset.ayahNumber);
    playSingleAyah(appState.currentReaderSurah, ayahNumber);
  });

  ayahSearchBtn.addEventListener("click", () => {
    searchAyahs(ayahSearchInput.value);
  });

  ayahSearchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      searchAyahs(ayahSearchInput.value);
    }
  });

  playBtn.addEventListener("click", async () => {
    try {
      if (audioPlayer.paused) {
        if (!audioPlayer.src) {
          await loadCurrentSurahAudio(true);
        } else {
          await audioPlayer.play();
        }
      } else {
        audioPlayer.pause();
      }
    } catch (error) {
      alert("تعذر تشغيل الصوت");
      console.error(error);
    }
  });

  prevBtn.addEventListener("click", () => {
    const prevIndex =
      (appState.currentSurahIndex - 1 + appState.surahs.length) % appState.surahs.length;
    appState.currentSurahIndex = prevIndex;
    loadCurrentSurahAudio(true);
  });

  nextBtn.addEventListener("click", () => {
    const nextIndex = (appState.currentSurahIndex + 1) % appState.surahs.length;
    appState.currentSurahIndex = nextIndex;
    loadCurrentSurahAudio(true);
  });

  repeatBtn.addEventListener("click", () => {
    appState.repeatEnabled = !appState.repeatEnabled;
    repeatBtn.classList.toggle("active", appState.repeatEnabled);
    repeatBtn.style.background = appState.repeatEnabled
      ? "linear-gradient(135deg, var(--primary), var(--primary2))"
      : "var(--surface-2)";
    repeatBtn.style.color = appState.repeatEnabled ? "#fff" : "var(--text)";
  });

  muteBtn.addEventListener("click", () => {
    audioPlayer.muted = !audioPlayer.muted;
    updateMuteButton();
  });

  downloadBtn.addEventListener("click", () => {
    if (!audioPlayer.src) {
      alert("لا يوجد ملف صوتي محمل حاليًا");
      return;
    }

    const link = document.createElement("a");
    link.href = audioPlayer.src;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  progressBar.addEventListener("click", e => {
    if (!audioPlayer.duration) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    audioPlayer.currentTime = ratio * audioPlayer.duration;
  });

  listenModeSelect.addEventListener("change", e => {
    const mode = e.target.value;
    if (mode === "reader") {
      document.getElementById("readerSection").scrollIntoView({ behavior: "smooth" });
    }
  });
}

async function init() {
  initializeTheme();
  setupAudioEvents();
  setupEvents();
  initializeMicFeature();

  await Promise.all([initializeSurahs(), initializeReciters()]);

  if (appState.surahs.length && appState.reciters.length) {
    updatePlayerMeta();
    renderSurahList(appState.surahs);
    await loadCurrentSurahAudio(false);
    await loadReaderSurah();
  }
}

init();
