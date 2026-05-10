---
type: reference
status: active
date: 2026-04-22
tags: [gymstar, quiz, bookmarklets, testing, dev-tools]
---

# Testing Bookmarklets

*Related: [[projects/gymstar/CONTEXT|GymStar CONTEXT]]*

Drag these to your bookmarks bar for quick testing:

## 🔧 Local Testing (for development)

**Step 1:** Start local server
```bash
cd gymstar-quiz
npm run build
npx http-server dist -p 8080 --cors
```

**Step 2:** Drag this bookmarklet:

**[📍 Test Quiz (LOCAL)]**
```javascript
javascript:(function(){const s=document.createElement('script');s.src='http://localhost:8080/gymstar-quiz.min.js';document.body.appendChild(s);const w=document.createElement('gymstar-quiz');document.body.appendChild(w);})();
```

Click on `gymstar.sk` to test!

---

## 🚀 Production Testing (from GitHub CDN)

**[📍 Test Quiz (PRODUCTION)]**
```javascript
javascript:(function(){const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/saiden-ai/gymstar-quiz@main/dist/gymstar-quiz.min.js';document.body.appendChild(s);const w=document.createElement('gymstar-quiz');document.body.appendChild(w);})();
```

---

## 🧹 Cleanup Bookmarklet

Remove quiz from page:

**[🗑️ Remove Quiz]**
```javascript
javascript:(function(){document.querySelectorAll('gymstar-quiz, #gq-trigger-desktop, .gq-trigger-mobile-li').forEach(el=>el.remove());})();
```

---

## How to Use:

1. **Create bookmarklet:**
   - Right-click bookmark bar → Add page
   - Name: "Test GymStar Quiz (LOCAL)"
   - URL: paste the JavaScript code above

2. **Test:**
   - Navigate to `https://www.gymstar.sk`
   - Click bookmarklet
   - Quiz appears!

3. **Quick iteration:**
   - Edit `src/` files
   - `npm run build`
   - Click cleanup → click test bookmarklet
   - Instant reload!
