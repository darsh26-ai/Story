let currentView = "homeView";
let selectedRegion = "india";
let selectedStory = null;
let selectedDuration = 20;
let session = null;
let storyStartTime = 0;
let sessionElapsed = 0;
let progressTimer = null;
let isPaused = false;
let autoplay = true;
let favorites = JSON.parse(localStorage.getItem("storyFavorites") || "[]");
let recent = JSON.parse(localStorage.getItem("storyRecent") || "[]");

const $ = id => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  renderRegions();
  renderCharacters();
  updateFavoriteCount();
  bindEvents();
  updateNarrationControls();
});

function bindEvents(){
  $("startExploringBtn").onclick = () => scrollToRegions();
  $("favoritesBtn").onclick = () => showView("favoritesView");
  $("customDurationBtn").onclick = useCustomDuration;
  $("startSessionBtn").onclick = startStorySession;
  $("playBtn").onclick = togglePlayback;
  $("nextBtn").onclick = () => advanceStory(true);
  $("prevBtn").onclick = () => advanceStory(false);
  $("replayBtn").onclick = replayStory;
  $("exitPlayerBtn").onclick = exitPlayer;

  $("volumeRange").oninput = e => StoryAudio.setVolume(e.target.value);

  if ($("musicVolumeRange")) {
    $("musicVolumeRange").oninput = e => StoryAudio.setMusicVolume(e.target.value);
  }

  if ($("effectsVolumeRange")) {
    $("effectsVolumeRange").oninput = e => StoryAudio.setEffectsVolume(e.target.value);
  }

  $("setupFavoriteBtn").onclick = () => toggleFavorite(selectedStory?.id);
  $("playerFavoriteBtn").onclick = () => toggleFavorite(session?.playlist[session.index]?.id);

  $("bedtimeToggle").onchange = e => {
    document.body.classList.toggle("bedtime", e.target.checked);
  };

  document.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => showView(btn.dataset.view));
  });

  document.querySelectorAll(".duration-grid button").forEach(btn => {
    btn.onclick = () => {
      selectedDuration = Number(btn.dataset.minutes);
      markDuration();
    };
  });

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderStories(btn.dataset.category);
    };
  });

  StoryAudio.onLoadedMetadata = duration => {
    if (!session) return;

    const story = session.playlist[session.index];
    if (!story) return;

    story.actualDuration = duration;
    updateCurrentStoryTiming();
  };

  StoryAudio.onTimeUpdate = () => {
    updatePlayerProgress();
  };
}

function showView(id){
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  $(id).classList.add("active");
  currentView = id;
  window.scrollTo({top:0,behavior:"smooth"});
  if(id === "favoritesView") renderFavorites();
}

function scrollToRegions(){
  document.querySelector("#regionGrid").scrollIntoView({behavior:"smooth",block:"center"});
}

function renderRegions(){
  $("regionGrid").innerHTML = REGION_DATA.map(r => `
    <button class="region-card" onclick="selectRegion('${r.id}')">
      <div class="region-icon">${r.icon}</div>
      <h3>${r.title}</h3>
      <p>${r.description}</p>
    </button>
  `).join("");
}

function renderCharacters(){
  $("characterGrid").innerHTML = CHARACTER_DATA.map(c => `
    <button class="character-card" onclick="openStory('${c.storyId}')">
      <div class="character-icon">${c.icon}</div>
      <h3>${c.name}</h3>
      <p>Start a story</p>
    </button>
  `).join("");
}

function selectRegion(region){
  selectedRegion = region;
  $("libraryTitle").textContent = region === "india" ? "🇮🇳 Indian Stories" : "🧚 Fantasy Adventures";
  $("librarySubtitle").textContent = region === "india"
    ? "Choose mythology, folk tales or moral stories."
    : "Original magical stories for young listeners.";
  showView("libraryView");
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  document.querySelector('[data-category="all"]').classList.add("active");
  renderStories("all");
}

function renderStories(category="all"){
  let list = STORY_DATA.filter(s => s.region === selectedRegion);
  if(category !== "all") list = list.filter(s => s.category === category);

  if(!list.length){
    $("storyGrid").innerHTML = `<div class="empty">No stories in this category yet. Try another tab. ✨</div>`;
    return;
  }

  $("storyGrid").innerHTML = list.map(story => `
    <article class="story-card">
      <div class="story-art">${story.icon}</div>
      <div class="story-tags">
        <span class="tag">${story.category}</span>
        <span class="tag">~${story.duration} min</span>
        ${story.narration ? '<span class="tag">🎙️ Your Voice</span>' : '<span class="tag">🗣️ Fallback</span>'}
      </div>
      <h3>${story.title}</h3>
      <p>${story.description}</p>
      <div class="story-buttons">
        <button class="secondary-btn" onclick="toggleFavorite('${story.id}')">${favorites.includes(story.id) ? "★ Saved" : "☆ Save"}</button>
        <button class="primary-btn" onclick="openStory('${story.id}')">Choose →</button>
      </div>
    </article>
  `).join("");
}

function openStory(id){
  selectedStory = STORY_DATA.find(s => s.id === id);
  if(!selectedStory) return;

  $("setupStoryName").textContent = selectedStory.character + " • " + selectedStory.category;
  $("setupTitle").textContent = selectedStory.title;
  $("setupDescription").textContent = selectedStory.description;
  $("setupArtwork").textContent = selectedStory.icon;
  updateSetupFavorite();
  markDuration();
  showView("setupView");
}

function markDuration(){
  document.querySelectorAll(".duration-grid button").forEach(btn => {
    btn.classList.toggle("selected", Number(btn.dataset.minutes) === selectedDuration);
  });
}

function useCustomDuration(){
  const value = Number($("customMinutes").value);
  if(!value || value < 1 || value > 180){
    alert("Please enter a duration between 1 and 180 minutes.");
    return;
  }

  selectedDuration = value;
  document.querySelectorAll(".duration-grid button").forEach(btn => btn.classList.remove("selected"));
  $("customMinutes").value = "";
  alert(`Storytime set to ${value} minutes. ✨`);
}

function buildPlaylist(minutes){
  const pool = STORY_DATA.filter(s => s.region === selectedRegion);
  if(!pool.length) return [];

  const target = minutes * 60;
  const playlist = [];
  let total = 0;
  let index = pool.findIndex(s => s.id === selectedStory?.id);

  if(index < 0) index = 0;

  for(let i = 0; total < target; i++){
    const story = pool[(index + i) % pool.length];
    playlist.push(story);
    total += Number(story.duration || 1) * 60;
    if(i > 100) break;
  }

  return playlist;
}

function startStorySession(){
  if(!selectedStory) return;

  autoplay = $("autoplayToggle").checked;

  const bedtime = $("bedtimeToggle").checked;

  session = {
    duration: selectedDuration * 60,
    playlist: buildPlaylist(selectedDuration),
    index: 0
  };

  sessionElapsed = 0;
  isPaused = false;

  document.body.classList.toggle("bedtime", bedtime);
  addRecent(selectedStory.id);

  showView("playerView");
  loadCurrentStory();
  startProgressTimer();
}

function loadCurrentStory(){
  if(!session || !session.playlist.length) return;

  StoryAudio.stop();

  const story = session.playlist[session.index];

  $("playerArtwork").textContent = story.icon;
  $("playerCategory").textContent = `${story.character} • ${story.category.toUpperCase()}`;
  $("playerTitle").textContent = story.title;
  $("playerText").textContent = story.text;
  $("playBtn").textContent = "▶️";
  $("playerModeLabel").textContent =
    document.body.classList.contains("bedtime")
      ? "🌙 Bedtime Story"
      : "🎧 Storytime";

  updatePlayerFavorite();
  renderPlaylist();
  updateNarrationControls();

  StoryAudio.onEnd = () => {
    if(!session) return;

    const actualDuration = StoryAudio.getDuration() || Number(story.duration || 1) * 60;
    sessionElapsed += actualDuration;

    if(sessionElapsed >= session.duration){
      finishSession();
    } else if(autoplay){
      advanceStory(true);
    } else {
      $("playBtn").textContent = "▶️";
    }
  };

  // Start your recorded narration automatically.
  StoryAudio.speak(story);
  $("playBtn").textContent = "⏸️";
  storyStartTime = Date.now();
}

function togglePlayback(){
  if(!session) return;

  if(StoryAudio.isSpeaking){
    StoryAudio.pause();
    isPaused = true;
    $("playBtn").textContent = "▶️";
    return;
  }

  StoryAudio.resume();

  if(!StoryAudio.isSpeaking){
    StoryAudio.speak(session.playlist[session.index]);
  }

  isPaused = false;
  $("playBtn").textContent = "⏸️";
}

function replayStory(){
  if(!session) return;

  const story = session.playlist[session.index];

  StoryAudio.speak(story);
  storyStartTime = Date.now();
  isPaused = false;
  $("playBtn").textContent = "⏸️";
}

function advanceStory(forward){
  if(!session) return;

  const oldStory = session.playlist[session.index];
  const actualDuration = StoryAudio.getCurrentTime() || Number(oldStory?.duration || 1) * 60;

  if(forward) {
    sessionElapsed += Math.min(actualDuration, Number(oldStory?.duration || actualDuration));
    session.index = (session.index + 1) % session.playlist.length;
  } else {
    session.index = (session.index - 1 + session.playlist.length) % session.playlist.length;
  }

  loadCurrentStory();
}

function finishSession(){
  StoryAudio.stop();
  stopProgressTimer();

  $("playBtn").textContent = "▶️";
  $("playerText").textContent =
    "✨ Storytime complete! Wonderful listening. Would you like another adventure?";
  $("playerTitle").textContent = "The End ✨";

  session = null;
  renderPlaylist();
}

function exitPlayer(){
  StoryAudio.stop();
  stopProgressTimer();
  session = null;
  showView("homeView");
}

function startProgressTimer(){
  stopProgressTimer();

  storyStartTime = Date.now();

  progressTimer = setInterval(() => {
    updatePlayerProgress();
  }, 250);
}

function updatePlayerProgress(){
  if(!session) return;

  const story = session.playlist[session.index];

  let storyCurrent = StoryAudio.getCurrentTime();

  if(!storyCurrent && StoryAudio.isSpeaking) {
    storyCurrent = Math.min(
      (Date.now() - storyStartTime) / 1000,
      Number(story.duration || 1) * 60
    );
  }

  const current = Math.min(
    session.duration,
    sessionElapsed + storyCurrent
  );

  const percent = Math.min(100, current / session.duration * 100);

  $("sessionProgress").style.width = percent + "%";
  $("storyProgressText").textContent = Math.round(percent) + "%";
  $("sessionTimeLabel").textContent =
    formatTime(current) + " / " + formatTime(session.duration);
}

function updateCurrentStoryTiming(){
  const duration = StoryAudio.getDuration();

  if(duration > 0 && session?.playlist?.[session.index]) {
    session.playlist[session.index].actualDuration = duration;
  }
}

function stopProgressTimer(){
  if(progressTimer) clearInterval(progressTimer);
  progressTimer = null;
}

function renderPlaylist(){
  if(!session){
    $("playlist").innerHTML = "";
    return;
  }

  $("playlist").innerHTML = session.playlist.map((s,i) => `
    <div class="playlist-item ${i === session.index ? "current" : ""}">
      <span class="playlist-num">${i+1}</span>
      <span>${s.icon} ${s.title}</span>
    </div>
  `).join("");
}

function updateNarrationControls(){
  const voiceSelect = $("voiceSelect");

  if(voiceSelect){
    voiceSelect.innerHTML = `<option value="recorded">🎙️ Your Recorded Voice</option>`;
    voiceSelect.disabled = true;
  }

  const story = session?.playlist?.[session.index] || selectedStory;

  const status = $("voiceStatus");
  if(status){
    status.textContent = story?.narration
      ? "✓ Recorded narration"
      : "⚠ Browser voice fallback";
  }
}

function formatTime(seconds){
  seconds = Math.max(0, Math.floor(seconds));
  const m = Math.floor(seconds/60);
  const s = seconds % 60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function toggleFavorite(id){
  if(!id) return;

  favorites = favorites.includes(id)
    ? favorites.filter(x => x !== id)
    : [...favorites,id];

  localStorage.setItem("storyFavorites", JSON.stringify(favorites));

  updateFavoriteCount();
  updateSetupFavorite();
  updatePlayerFavorite();

  if(currentView === "libraryView"){
    renderStories(document.querySelector(".filter-btn.active")?.dataset.category || "all");
  }

  if(currentView === "favoritesView") renderFavorites();
}

function updateFavoriteCount(){
  $("favoriteCount").textContent = favorites.length;
}

function updateSetupFavorite(){
  if(!selectedStory) return;

  $("setupFavoriteBtn").textContent =
    favorites.includes(selectedStory.id)
      ? "★ Saved to Favorites"
      : "☆ Add to Favorites";
}

function updatePlayerFavorite(){
  const id = session?.playlist?.[session.index]?.id;

  $("playerFavoriteBtn").textContent =
    favorites.includes(id)
      ? "★ Favorite Saved"
      : "☆ Favorite";
}

function renderFavorites(){
  const list = STORY_DATA.filter(s => favorites.includes(s.id));

  if(!list.length){
    $("favoritesGrid").innerHTML =
      `<div class="empty">No favorites yet. Save a story and it will appear here. ⭐</div>`;
    return;
  }

  $("favoritesGrid").innerHTML = list.map(story => `
    <article class="story-card">
      <div class="story-art">${story.icon}</div>
      <div class="story-tags">
        <span class="tag">${story.category}</span>
        <span class="tag">~${story.duration} min</span>
        ${story.narration ? '<span class="tag">🎙️ Your Voice</span>' : '<span class="tag">🗣️ Fallback</span>'}
      </div>
      <h3>${story.title}</h3>
      <p>${story.description}</p>
      <div class="story-buttons">
        <button class="secondary-btn" onclick="toggleFavorite('${story.id}')">★ Remove</button>
        <button class="primary-btn" onclick="openStory('${story.id}')">Choose →</button>
      </div>
    </article>
  `).join("");
}

function addRecent(id){
  recent = [id, ...recent.filter(x => x !== id)].slice(0,10);
  localStorage.setItem("storyRecent", JSON.stringify(recent));
}
