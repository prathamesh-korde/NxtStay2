# 🤖 NxtStay Chatbot Integration Guide

## ✅ Files Created (No existing code modified!)

1. **`public/css/chatbot.css`** - Complete chatbot styling
2. **`public/js/chatbot.js`** - Chatbot functionality and logic
3. **`views/includes/chatbot.ejs`** - Inclusion snippet

---

## 🚀 How to Add Chatbot to Your Pages

### Option 1: Add to Main Layout (Recommended - Shows on All Pages)

Open your main layout file (e.g., `views/layouts/boilerpalte.ejs`) and add this line **before the closing `</body>` tag**:

```html
<%- include("../includes/chatbot.ejs") %>
</body>
</html>
```

### Option 2: Add to Specific Pages Only

Open any EJS page where you want the chatbot (e.g., `views/listings/index.ejs`) and add at the bottom:

```html
<%- include("../includes/chatbot.ejs") %>
```

---

## 🎨 Chatbot Features

### ✨ What's Included:

1. **Floating Chat Icon** - Fixed bottom-right corner
2. **Smooth Animations** - Slide-up effect when opening
3. **Auto-Welcome Message** - Greets users automatically
4. **Quick Reply Buttons** - Common questions at fingertips
5. **Typing Indicator** - Shows bot is "thinking"
6. **Smart Responses** - Understands common queries about:
   - Searching properties
   - Booking process
   - Adding listings
   - Login/Account
   - Site features
   - Categories
   - Help & Support

7. **Responsive Design** - Works on mobile and desktop
8. **Notification Badge** - Can show unread messages
9. **Custom Styling** - Matches NxtStay's theme (red #fe424d)

---

## 🎯 How It Works

### User Interactions:
- Click chat icon to open/close
- Type messages in input field
- Press Enter or click send button
- Click quick reply buttons for common questions

### Bot Intelligence:
The bot recognizes keywords like:
- "search", "find", "browse" → Search help
- "book", "reserve", "rent" → Booking info
- "list", "add property" → Listing guide
- "login", "sign up" → Account help
- "features", "what can" → Features overview
- "category", "mountain", "beach" → Category info
- "help", "assist" → General help

---

## 🎨 Customization Options

### Change Bot Colors:
Edit `public/css/chatbot.css`:
```css
/* Line 5-6: Change primary color */
background: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_COLOR_LIGHT 100%);
```

### Modify Bot Responses:
Edit `public/js/chatbot.js` - Find the `botResponses` object (Line 8) and customize messages.

### Add More Quick Replies:
In `chatbot.js`, find the `showQuickReplies()` function and add buttons:
```javascript
<button class="quick-reply-btn" onclick="chatbot.handleQuickReply('yourTopic')">
    Your Button Text
</button>
```

### Change Bot Position:
In `chatbot.css`, modify:
```css
.chatbot-container {
    bottom: 20px;  /* Distance from bottom */
    right: 20px;   /* Distance from right */
    /* Or use 'left' instead of 'right' */
}
```

---

## 📱 Mobile Responsive

The chatbot automatically adjusts for mobile screens:
- Full-width on small devices
- Touch-friendly buttons
- Smooth scrolling

---

## 🔧 Advanced Features You Can Add

### 1. **Save Chat History**
```javascript
// In chatbot.js, add localStorage
localStorage.setItem('chatHistory', JSON.stringify(this.messages));
```

### 2. **Connect to Real Backend**
```javascript
// Replace generateResponse() with API call
async generateResponse(message) {
    const response = await fetch('/api/chatbot', {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
}
```

### 3. **Add User Authentication**
```javascript
// Check if user is logged in and personalize
if (currentUser) {
    welcomeMessage = `Hi ${currentUser.username}! How can I help you today?`;
}
```

### 4. **Add Rich Media**
```javascript
// Send images, links, or buttons in messages
addBotMessage(`
    Check out this property:
    <img src="..." style="width: 100%; border-radius: 8px; margin-top: 8px;">
    <a href="/listings/123">View Details</a>
`);
```

---

## 🎭 Testing the Chatbot

### Try These Messages:
1. "Hello" → Gets greeting
2. "How do I search for properties?" → Search help
3. "I want to book a place" → Booking info
4. "How can I list my property?" → Listing guide
5. "What features do you have?" → Features overview
6. "Help me" → General assistance

---

## 🐛 Troubleshooting

### Chatbot Not Appearing?
1. Check if chatbot.ejs is included in your template
2. Verify Font Awesome is loaded (for icons)
3. Check browser console for errors
4. Ensure static files are served: `app.use(express.static('public'))`

### Styling Issues?
1. Make sure chatbot.css is loaded
2. Check for CSS conflicts with existing styles
3. Use browser DevTools to inspect z-index

### JavaScript Errors?
1. Ensure jQuery is NOT required (uses vanilla JS)
2. Check Font Awesome is loaded
3. Verify no JavaScript conflicts

---

## 📦 Dependencies

**Already Included in Your Project:**
- ✅ Font Awesome (for icons)
- ✅ Express static middleware

**No Additional Packages Needed!**

---

## 🚀 Quick Start (5 Steps)

1. **Files are already created** ✅
2. **Add to layout:**
   ```html
   <%- include("../includes/chatbot.ejs") %>
   ```
3. **Restart your server:**
   ```bash
   node app.js
   ```
4. **Visit any page**
5. **Look for red chat icon in bottom-right!** 🎉

---

## 🎨 Preview

```
┌─────────────────────────────┐
│  🤖 NxtStay Assistant      ✕│
├─────────────────────────────┤
│                             │
│  🤖 Hello! Welcome to       │
│     NxtStay! 👋             │
│                             │
│     You: Hi there           │
│                             │
│  🤖 Quick options:          │
│     [Search Properties]     │
│     [How to Book]          │
│     [Add Listing]          │
│                             │
├─────────────────────────────┤
│  Type your message... [✈️]  │
└─────────────────────────────┘
```

---

## 💡 Pro Tips

1. **Test thoroughly** - Try various messages
2. **Customize responses** - Make it match your brand voice
3. **Add analytics** - Track what users ask most
4. **Monitor usage** - See if users find it helpful
5. **Iterate** - Add more responses based on user needs

---

## 🔥 Next Steps

1. Add the chatbot include to your layout
2. Test on different pages
3. Customize colors if needed
4. Add more bot responses for your specific use cases
5. Consider connecting to a real AI service later

---

**That's it! Your chatbot is ready to use! 🎉**

No existing code was modified - just add the include statement and you're done!
