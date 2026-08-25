// StoryAudio - recorded narration + background music + sound effects.
// Your recorded narration is the primary voice.
// Browser SpeechSynthesis is only used as an optional fallback when a story
// does not have a narration file.

const StoryAudio = {
  narration: new Audio(),
  music: new Audio(),
  effectPlayers: [],
  isSpeaking: false,
  volume: 1,
  musicVolume: 0.25,
  effectsVolume: 0.65,
  onEnd: null,
  onTimeUpdate: null,
  onLoadedMetadata: null,
  currentStory: null,

  init() {
    this.narration.preload = "metadata";
    this.music.preload = "auto";
    this.music.loop = true;

    this.narration.addEventListener("play", () => {
      this.isSpeaking = true;
    });

    this.narration.addEventListener("pause", () => {
      this.isSpeaking = false;
    });

    this.narration.addEventListener("ended", () => {
      this.isSpeaking = false;
      this.stopMusic();
      this.stopEffects();
      if (typeof this.onEnd === "function") this.onEnd();
    });

    this.narration.addEventListener("timeupdate", () => {
      if (typeof this.onTimeUpdate === "function") {
        this.onTimeUpdate(this.narration.currentTime, this.narration.duration || 0);
      }
    });

    this.narration.addEventListener("loadedmetadata", () => {
      if (typeof this.onLoadedMetadata === "function") {
        this.onLoadedMetadata(this.narration.duration || 0);
      }
    });

    this.applyVolumes();
  },

  getVoices() {
    // Kept for compatibility with older app.js versions.
    return [];
  },

  setVoice() {
    // Recorded narration does not need a browser voice selection.
  },

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, Number(value)));
    this.narration.volume = this.volume;
  },

  setMusicVolume(value) {
    this.musicVolume = Math.max(0, Math.min(1, Number(value)));
    this.music.volume = this.musicVolume;
  },

  setEffectsVolume(value) {
    this.effectsVolume = Math.max(0, Math.min(1, Number(value)));
    this.effectPlayers.forEach(player => {
      player.volume = this.effectsVolume;
    });
  },

  applyVolumes() {
    this.narration.volume = this.volume;
    this.music.volume = this.musicVolume;
    this.effectPlayers.forEach(player => {
      player.volume = this.effectsVolume;
    });
  },

  loadStory(story) {
    this.stop();
    this.currentStory = story || null;

    if (!story) return;

    this.narration.src = story.narration || "";
    this.narration.load();

    if (story.music) {
      this.music.src = story.music;
      this.music.load();
    } else {
      this.music.removeAttribute("src");
      this.music.load();
    }

    this.applyVolumes();
  },

  async speak(storyOrText) {
    // Preferred API: speak(storyObject)
    // Compatibility API: speak(text)
    if (typeof storyOrText === "object" && storyOrText) {
      return this.playStory(storyOrText);
    }

    // Optional browser fallback for old calls that pass plain text.
    return this.speakFallback(String(storyOrText || ""));
  },

  async playStory(story) {
    this.stop();
    this.currentStory = story;

    const narrationSrc = story.narration;

    if (!narrationSrc) {
      return this.speakFallback(story.text || "");
    }

    this.narration.src = narrationSrc;
    this.narration.currentTime = 0;
    this.narration.load();

    if (story.music) {
      this.music.src = story.music;
      this.music.currentTime = 0;
      this.music.loop = true;
      this.music.load();
    }

    this.applyVolumes();

    try {
      await this.narration.play();

      if (story.music) {
        try {
          await this.music.play();
        } catch (error) {
          // The narration is still allowed to play if music autoplay is blocked.
          console.warn("Background music could not start:", error);
        }
      }

      this.startScheduledEffects(story.effects || []);
      return true;
    } catch (error) {
      console.warn("Recorded narration could not be played:", error);
      return this.speakFallback(story.text || "");
    }
  },

  speakFallback(text) {
    if (!("speechSynthesis" in window) || !text) {
      alert("This story does not have a recorded narration yet.");
      return false;
    }

    this.stop();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    utterance.volume = this.volume;

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (typeof this.onEnd === "function") this.onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
    };

    speechSynthesis.speak(utterance);
    return true;
  },

  pause() {
    if ("speechSynthesis" in window && speechSynthesis.speaking && !this.narration.src) {
      speechSynthesis.pause();
      return;
    }

    this.narration.pause();
    this.music.pause();
    this.stopEffects(true);
    this.isSpeaking = false;
  },

  resume() {
    if ("speechSynthesis" in window && speechSynthesis.paused && !this.narration.src) {
      speechSynthesis.resume();
      return;
    }

    if (this.narration.src) {
      this.narration.play().catch(error => console.warn("Narration resume failed:", error));
      if (this.music.src) {
        this.music.play().catch(error => console.warn("Music resume failed:", error));
      }
      this.isSpeaking = true;
    }
  },

  stop() {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }

    this.narration.pause();
    this.narration.currentTime = 0;

    this.stopMusic();
    this.stopEffects();

    this.isSpeaking = false;
  },

  stopMusic() {
    this.music.pause();
    try {
      this.music.currentTime = 0;
    } catch (_) {}
  },

  stopEffects(resetOnly = false) {
    this.effectPlayers.forEach(player => {
      player.pause();
      if (!resetOnly) {
        try {
          player.currentTime = 0;
        } catch (_) {}
      }
    });

    if (!resetOnly) this.effectPlayers = [];
  },

  startScheduledEffects(effects) {
    this.stopEffects();

    if (!Array.isArray(effects) || !effects.length) return;

    effects.forEach(effect => {
      const time = Number(effect.time);
      if (!effect.src || !Number.isFinite(time) || time < 0) return;

      const player = new Audio(effect.src);
      player.preload = "auto";
      player.volume = this.effectsVolume;
      player.dataset.effectTime = String(time);
      player.dataset.started = "false";
      this.effectPlayers.push(player);
    });

    const checkEffects = () => {
      if (!this.narration.src || this.narration.paused) return;

      const currentTime = this.narration.currentTime;

      this.effectPlayers.forEach(player => {
        const effectTime = Number(player.dataset.effectTime);

        if (
          player.dataset.started !== "true" &&
          currentTime >= effectTime &&
          currentTime < effectTime + 1.5
        ) {
          player.dataset.started = "true";
          player.currentTime = 0;
          player.play().catch(error => {
            console.warn("Sound effect could not start:", error);
          });
        }
      });
    };

    this.narration.addEventListener("timeupdate", checkEffects);
  },

  getCurrentTime() {
    return this.narration.currentTime || 0;
  },

  getDuration() {
    return Number.isFinite(this.narration.duration) ? this.narration.duration : 0;
  },

  hasRecordedNarration(story) {
    return Boolean(story?.narration);
  }
};

StoryAudio.init();
