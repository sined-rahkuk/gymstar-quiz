# GymStar Quiz - Production Web Component

Clean, maintainable web component for GymStar trainer matching quiz.

## 📁 Project Structure

```
gymstar-quiz/
├── src/
│   ├── component.js      # Web Component class (all logic)
│   ├── template.html     # Clean HTML template
│   ├── styles.css        # Complete CSS
│   └── index.js          # Entry point
├── dist/
│   └── gymstar-quiz.min.js  # Built file (auto-generated)
├── index.html           # Dev server page
├── vite.config.js       # Build configuration
├── package.json
└── README.md
```

## 🚀 Development Workflow

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server (with HMR)
```bash
npm run dev
```
Opens `http://localhost:3000` - изменения применяются мгновенно!

### 3. Build for Production
```bash
npm run build
```
Создает `dist/gymstar-quiz.min.js` (~30-50KB gzipped)

## 🧪 Testing

### Option A: Local Testing (FAST - No GitHub Push Needed)

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Start local file server:**
   ```bash
   npx http-server dist -p 8080 --cors
   ```

3. **Use LOCAL bookmarklet** on `gymstar.sk`:
   ```javascript
   javascript:(function(){const s=document.createElement('script');s.src='http://localhost:8080/gymstar-quiz.min.js';document.body.appendChild(s);const w=document.createElement('gymstar-quiz');document.body.appendChild(w);})();
   ```

4. **Iterate:**
   - Change code → `npm run build` → refresh gymstar.sk
   - No GitHub push needed!

### Option B: Production Testing (via CDN)

1. **Push to GitHub**
2. **Use PRODUCTION bookmarklet:**
   ```javascript
   javascript:(function(){const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/saiden-ai/gymstar-quiz@main/dist/gymstar-quiz.min.js';document.body.appendChild(s);const w=document.createElement('gymstar-quiz');document.body.appendChild(w);})();
   ```

## 📦 Deployment

### One-Time Setup (Web Editor adds to Joomla):

Add to `<head>` or before `</body>`:

```html
<script src="https://cdn.jsdelivr.net/gh/saiden-ai/gymstar-quiz@main/dist/gymstar-quiz.min.js"></script>
<gymstar-quiz></gymstar-quiz>
```

### Updates (Forever):

1. Edit `src/` files (clean HTML/CSS/JS!)
2. `npm run build`
3. Git commit + push
4. CDN auto-updates (minutes)
5. **No web editor needed!**

## 🎨 Editing the Quiz

### Change Styles:
Edit `src/styles.css` - чистый CSS, никаких строк в JS!

### Change HTML:
Edit `src/template.html` - чистый HTML, легко читается!

### Change Logic:
Edit `src/component.js` - модульный JS с комментариями.

## ✅ Benefits

- **Maintainable:** Separated concerns (HTML/CSS/JS)
- **Fast updates:** No Joomla edits after initial setup
- **Version control:** Git history, easy rollbacks
- **Performance:** Single optimized bundle, cached by CDN
- **Isolation:** Shadow DOM = no style conflicts

## 🔧 Configuration

Edit `src/component.js`:

```javascript
this.config = {
    primaryColor: '#ee0928',
    webhookUrl: "https://n8n.srv840889.hstgr.cloud/webhook/gymstar-quiz",
    desktopText: "ZISTI SI SVOJHO TRÉNERA",
    mobileText: "NÁJDI SI TRÉNERA"
};
```

## 📝 Features

- ✅ Desktop trigger (fixed bottom-right button)
- ✅ Mobile trigger (injected into menu)
- ✅ 6-step quiz with progress bar
- ✅ Gender-specific logic (cellulitis option)
- ✅ Loading animation with checkmark
- ✅ Form submission to n8n webhook
- ✅ Mobile responsive (fixed height/centering bugs)
- ✅ State reset on re-open
- ✅ Shadow DOM isolation (no CSS conflicts)

## 🐛 Debugging

**Dev Console:**
- `console.log()` messages from component
- Network tab shows webhook requests

**Chrome DevTools:**
- Inspect shadow DOM: Enable "Show user agent shadow DOM"
- Elements → `<gymstar-quiz>` → `#shadow-root`

## 📊 Build Output

`npm run build` produces:
- `dist/gymstar-quiz.min.js` - Minified IIFE bundle
- Tree-shaken (removes unused code)
- Inlined styles & template
- ~30-50KB gzipped

## 🌐 Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

Web Components are well-supported (2024).
