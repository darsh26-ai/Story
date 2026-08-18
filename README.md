# 📚 Story Adventure

A kid-friendly, GitHub Pages-ready storytelling website with:

- 🇮🇳 Indian mythology
- 📖 Indian folk tales
- 🧚 Original fantasy adventures
- ⏰ Selectable storytime: 5, 10, 15, 20, 30, 45, 60 minutes
- 🎯 Custom duration from 1–180 minutes
- 🎙️ Browser text-to-speech narration
- ▶️ Play / pause / next / previous / replay
- ⭐ Favorites saved in localStorage
- 🌙 Bedtime mode
- 📱 Responsive mobile/tablet/desktop UI
- 🚀 No backend required

## 1. Run locally

Download or clone the repository and open `index.html`.

For the best browser experience, use a small local server instead of opening the file directly.

### VS Code

Install the Live Server extension and choose:

`Open with Live Server`

### Python

From the project folder:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000`

## 2. Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload all project files.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select your main branch and `/ (root)`.
6. Save.
7. GitHub will provide your Pages URL.

No build command is required.

## 3. Audio

The first version uses the browser's Web Speech API, so you do not need MP3 files to test it.

Voice availability depends on the browser and operating system.

For professional narration, you can later add MP3 files under:

```text
audio/
  rama/
  krishna/
  ganesha/
  shiva/
  hanuman/
  fantasy/
```

The current player can be upgraded to use those files instead of SpeechSynthesis.

## 4. Adding a new story

Open:

```text
js/stories.js
```

Add an object to `STORY_DATA`:

```javascript
{
  id:"my-new-story",
  region:"india",
  category:"mythology",
  character:"Example Character",
  title:"My New Story",
  icon:"🌟",
  color:"gold",
  description:"A short description.",
  duration:4,
  text:"Write your original kid-friendly story here."
}
```

Supported regions currently include:

- `india`
- `fantasy`

Supported categories:

- `mythology`
- `folk`
- `fantasy`
- `moral`

## 5. How duration works

The selected duration is a **storytime session target**, not the length of one story.

For example, selecting 20 minutes creates a playlist of several stories until the playlist reaches or slightly exceeds the selected target.

This makes it possible to have:

- 10-minute Krishna storytime
- 20-minute Rama storytime
- 30-minute Ganesha storytime
- 45-minute mythology storytime
- 60-minute bedtime storytime

## 6. Important content note

The sample mythology stories are written as simple original retellings inspired by traditional stories.

The fantasy section uses original characters and settings rather than reproducing copyrighted Disney characters, scripts, or story text.

## 7. Recommended future upgrades

- Recorded professional narration
- Hindi, Gujarati, Marathi, Tamil, Telugu and other languages
- Story illustrations
- Animated scene transitions
- Read-along highlighting
- Parent dashboard
- Age-based story selection
- More regional Indian folklore
- Downloadable offline story packs
- PWA/offline support
- Story creation/admin panel
- Cloud database and user profiles
