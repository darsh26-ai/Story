// Browser narration engine.
// This version uses SpeechSynthesis so the project works without MP3 files.
// Later, individual stories can be upgraded to recorded audio.

const StoryAudio = {
  voices: [],
  utterance: null,
  isSpeaking: false,
  volume: 1,
  selectedVoiceName: "",
  onEnd: null,

  init(){
    this.loadVoices();
    if("speechSynthesis" in window){
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  },

  loadVoices(){
    if(!("speechSynthesis" in window)) return;
    this.voices = speechSynthesis.getVoices().filter(v => /^en(-|_)/i.test(v.lang));
    if(!this.voices.length) this.voices = speechSynthesis.getVoices();
  },

  getVoices(){ return this.voices; },

  speak(text){
    if(!("speechSynthesis" in window)){
      alert("Your browser does not support speech narration.");
      return;
    }
    this.stop();
    this.utterance = new SpeechSynthesisUtterance(text);
    const voice = this.voices.find(v => v.name === this.selectedVoiceName);
    if(voice) this.utterance.voice = voice;
    this.utterance.lang = voice?.lang || "en-US";
    this.utterance.rate = 0.88;
    this.utterance.pitch = 1.05;
    this.utterance.volume = this.volume;
    this.utterance.onstart = () => { this.isSpeaking = true; };
    this.utterance.onend = () => {
      this.isSpeaking = false;
      if(this.onEnd) this.onEnd();
    };
    this.utterance.onerror = () => { this.isSpeaking = false; };
    speechSynthesis.speak(this.utterance);
  },

  pause(){
    if("speechSynthesis" in window && speechSynthesis.speaking) speechSynthesis.pause();
  },

  resume(){
    if("speechSynthesis" in window && speechSynthesis.paused) speechSynthesis.resume();
  },

  stop(){
    if("speechSynthesis" in window) speechSynthesis.cancel();
    this.isSpeaking = false;
  },

  setVoice(name){ this.selectedVoiceName = name; },
  setVolume(value){ this.volume = Number(value); }
};

StoryAudio.init();
