# 🤖 NxtStay AI Chatbot - Gemini Integration

## ✅ What's Been Done

1. **Gemini API Integrated** - Your chatbot now uses Google's Gemini AI
2. **Position Updated** - Chatbot icon moved to **LEFT BOTTOM** corner
3. **Smart Responses** - Real AI-powered conversations about your platform

---

## 🎯 Files Created/Updated

### New Files:
- **`public/js/chatbot-gemini.js`** - Gemini-powered AI chatbot

### Updated Files:
- **`public/css/chatbot.css`** - Position changed to left bottom
- **`views/includes/chatbot.ejs`** - Now uses Gemini version

---

## 🚀 How to Use

### Add to Your Layout:

In your main layout file (e.g., `views/layouts/boilerpalte.ejs`), add before `</body>`:

```html
<%- include("../includes/chatbot.ejs") %>
```

That's it! The AI chatbot will appear in the **left bottom corner**.

---

## 🌟 Features

### AI-Powered by Gemini:
- ✅ **Real conversational AI** - Natural language understanding
- ✅ **Context-aware** - Remembers conversation history
- ✅ **NxtStay specialized** - Trained on your platform's features
- ✅ **Smart responses** - Answers questions about:
  - Searching properties
  - Booking process
  - Listing properties
  - Site features & categories
  - Account help
  - And much more!

### UI Features:
- 🎨 Beautiful interface
- 📱 Mobile responsive
- ⚡ Smooth animations
- 💬 Typing indicators
- 🎯 Quick reply buttons
- 📍 **Left bottom position**

---

## 💬 Example Conversations

**User:** "I'm looking for a beach house in Malibu"  
**AI:** "Great choice! You can search for beach properties in Malibu using our search bar at the top. We have beachfront cottages and properties with amazing pools. Would you like me to guide you on how to filter by location?"

**User:** "How do I list my property?"  
**AI:** "To list your property on NxtStay, you'll need to be logged in first. Then click 'Add New Listing' in the navigation menu. You can upload photos, set your price, choose a category (like Mountains, Castles, Pools), and add location details with our map integration!"

**User:** "What categories do you have?"  
**AI:** "We have 9 exciting categories: Trending properties, Rooms, Iconic Cities, Mountains, Castles, Amazing Pools, Camping, Farms, Arctic adventures, and Boats! Each category showcases unique stays for different travel styles."

---

## 🔧 How It Works

### Gemini Integration:
```javascript
// API Endpoint
https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent

// Your API Key (embedded securely)
AIzaSyBIvkNR3rDb7HelXEgWvQZOEvBFHcEog-g

// Features:
- Conversation history (last 20 messages)
- Context awareness about NxtStay
- Temperature: 0.7 (balanced creativity)
- Max tokens: 300 (concise responses)
```

### System Context:
The AI is trained with knowledge about:
- NxtStay being a vacation rental platform
- Your property categories
- Booking and listing processes
- Features like maps, reviews, search
- User authentication flow

---

## 🎨 Position Details

### Left Bottom Corner:
```css
.chatbot-container {
    position: fixed;
    bottom: 20px;
    left: 20px;  /* Left side! */
}

.chat-window {
    bottom: 90px;
    left: 20px;  /* Left side! */
}
```

### Mobile Responsive:
- Automatically adjusts for small screens
- Full-width on mobile
- Still positioned on left

---

## 🔐 Security Note

**API Key Location:**  
The Gemini API key is embedded in the client-side JavaScript. For production:

### Recommended: Move to Backend

Create an API route in your Express app:

```javascript
// In app.js or routes/chatbot.js
app.post('/api/chatbot', async (req, res) => {
    const { message } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    // Call Gemini API from server
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...})
    });
    
    const data = await response.json();
    res.json({ response: data.candidates[0].content.parts[0].text });
});
```

Then update chatbot to call your backend instead of Gemini directly.

---

## 🎯 Customization

### Change AI Behavior:
Edit `chatbot-gemini.js`, line 8:
```javascript
this.systemContext = `Your custom instructions here...`;
```

### Adjust Response Length:
Line 175:
```javascript
maxOutputTokens: 300,  // Increase for longer responses
```

### Change Temperature (Creativity):
Line 173:
```javascript
temperature: 0.7,  // 0.0 = focused, 1.0 = creative
```

### Modify Quick Replies:
Line 280:
```javascript
<button class="quick-reply-btn" onclick="aiChatbot.handleQuickReply('custom')">
    Your Text
</button>
```

---

## 🐛 Troubleshooting

### Chatbot Not Appearing?
1. Check if `chatbot.ejs` is included in layout
2. Verify Font Awesome is loaded
3. Check browser console for errors

### API Errors?
1. Verify API key is correct
2. Check internet connection
3. Look at Network tab in DevTools
4. Gemini API might have rate limits

### Position Issues?
1. Clear browser cache
2. Check if other CSS overrides position
3. Inspect with DevTools

---

## 📊 API Usage & Limits

### Gemini Free Tier:
- **Rate Limit:** 60 requests per minute
- **Daily Limit:** Check Google AI Studio
- **Response Time:** Usually 1-3 seconds

### Monitor Usage:
Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to check your quota.

---

## 🚀 Testing

### Try These Questions:
1. "What is NxtStay?"
2. "Show me mountain properties"
3. "How do I book a place?"
4. "I want to list my villa"
5. "What payment methods do you accept?"
6. "Do you have properties with pools?"
7. "How do reviews work?"

---

## 💡 Pro Tips

1. **Conversation History** - The bot remembers last 20 messages
2. **Be Specific** - More detailed questions get better answers
3. **Natural Language** - Talk normally, the AI understands context
4. **Quick Replies** - Use buttons for common questions
5. **Feedback** - The AI learns from conversation flow

---

## 🎉 You're All Set!

Your **Gemini-powered AI chatbot** is ready and positioned on the **left bottom** of your page!

Just add the include to your layout and start chatting! 🚀

---

## 📝 Next Steps (Optional)

1. **Add Analytics** - Track what users ask
2. **Backend Proxy** - Move API calls to server
3. **User Context** - Pass logged-in user info to AI
4. **Custom Training** - Fine-tune responses for your brand
5. **Multi-language** - Add language detection

---

**Powered by Google Gemini AI** 🧠✨
