// ===== NXTSTAY AI CHATBOT =====
// AI-powered chatbot using Google Gemini API to help users with questions about NxtStay
class NxtStayAIChatbot {
    constructor() {
        this.messages = [];
        this.isOpen = false;
        // API key is securely stored in backend (.env file) and accessed via /api/chat route
        this.conversationHistory = []; // Stores conversation for context
        // System context - defines chatbot's role
        this.systemContext = `You are a helpful assistant for NxtStay, a vacation rental platform where people can book unique homes, apartments, and experiences worldwide - just like Airbnb but called NxtStay. Help users with searching, booking, listing properties, reviews, maps, categories, and account management. Be friendly and concise.`;
        
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
        this.displayWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <div class="chatbot-container">
                <button class="chat-icon" id="chatIcon">
                    <i class="fas fa-robot"></i>
                    <span class="chat-notification" style="display: none;">1</span>
                </button>
                
                <div class="chat-window" id="chatWindow">
                    <div class="chat-header">
                        <div class="chat-header-content">
                            <div class="chat-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="chat-header-text">
                                <h3>NxtStay AI Assistant</h3>
                                <p>Powered by Gemini • Online</p>
                            </div>
                        </div>
                        <button class="chat-close" id="chatClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="chat-messages" id="chatMessages">
                        <!-- Messages will be inserted here -->
                    </div>
                    
                    <div class="chat-input-container">
                        <div class="chat-input-wrapper">
                            <input 
                                type="text" 
                                class="chat-input" 
                                id="chatInput" 
                                placeholder="Ask me anything about NxtStay..."
                                autocomplete="off"
                            >
                            <button class="chat-send-btn" id="chatSend">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const chatIcon = document.getElementById('chatIcon');
        const chatClose = document.getElementById('chatClose');
        const chatSend = document.getElementById('chatSend');
        const chatInput = document.getElementById('chatInput');

        chatIcon.addEventListener('click', () => this.toggleChat());
        chatClose.addEventListener('click', () => this.toggleChat());
        chatSend.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chatWindow');
        const chatIcon = document.getElementById('chatIcon');
        const notification = chatIcon.querySelector('.chat-notification');

        if (this.isOpen) {
            chatWindow.classList.add('active');
            chatIcon.classList.add('active');
            chatIcon.innerHTML = '<i class="fas fa-times"></i>';
            if (notification) notification.style.display = 'none';
        } else {
            chatWindow.classList.remove('active');
            chatIcon.classList.remove('active');
            chatIcon.innerHTML = '<i class="fas fa-robot"></i>';
        }
    }

    displayWelcomeMessage() {
        setTimeout(() => {
            const welcomeMsg = "Hey there! 👋 I'm here to help you with NxtStay. Looking for a place to stay or want to list your property?";
            this.addBotMessage(welcomeMsg);
            this.showQuickReplies();
        }, 500);
    }

    // ===== SEND MESSAGE TO AI =====
    // Sends user message to Gemini API and displays response
    async sendMessage() {
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('chatSend');
        const message = input.value.trim();

        if (message === '') return;

        // Disable input while processing
        input.disabled = true;
        sendBtn.disabled = true;

        this.addUserMessage(message);
        input.value = '';

        this.showTypingIndicator();

        try {
            // Get AI response from Gemini
            const response = await this.getGeminiResponse(message);
            this.removeTypingIndicator();
            this.addBotMessage(response);
        } catch (error) {
            console.error('Error getting Gemini response:', error);
            this.removeTypingIndicator();
            
            // Provide helpful fallback responses if API fails
            const fallbackResponse = this.getFallbackResponse(message);
            this.addBotMessage(fallbackResponse);
        } finally {
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
        }
    }

    getFallbackResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Specific FAQ responses
        if (/(what is nxtstay|what's nxtstay|purpose of nxtstay|about nxtstay|tell me about nxtstay)/i.test(lowerMessage)) {
            return `NxtStay is an online marketplace that connects people who want to rent out their homes (hosts) with people looking for places to stay (guests).

It allows travelers to book unique accommodations—such as houses, apartments, villas, shared rooms, or even cabins and treehouses—typically at competitive prices compared to hotels.

✔️ Platform-based business: NxtStay doesn't own the properties—it provides the platform for hosts to list spaces and for guests to book them.

✔️ Global network: Available in many countries worldwide, offering numerous listings.

✔️ Flexible hosting: Anyone with extra space can become a host and earn money by renting it out.

✔️ Experience-based: In addition to stays, NxtStay also allows hosts to offer experiences, like tours, cooking classes, or activities.

✔️ Trust and safety features: Includes reviews, identity checks, secure payments, and customer support.

In simple terms — NxtStay is a service that helps people find places to stay and helps property owners earn money by renting space to travelers.`;
        }
        
        if (/(how to use nxtstay|how do i use nxtstay|using nxtstay|get started|start using)/i.test(lowerMessage)) {
            return `🏖️ For Guests (Travelers):

1. Create an Account - Sign up using your email or phone number
2. Search for Stays - Use the search bar to select destination, dates, and number of guests. Browse rooms, apartments, villas, or unique homes
3. Check Details - Review photos, amenities, house rules, pricing, and host ratings
4. Book Your Stay - Submit a booking request or use instant booking
5. Make Payment Securely - Pay through the platform to confirm
6. Enjoy Your Stay - You'll receive check-in instructions and host communication

🏡 For Hosts (Property Owners):

1. Register as a Host - Create a NxtStay account and choose to list your space
2. Create Your Listing - Add property details, photos, pricing, availability, house rules
3. Approve Bookings - Review and accept guest requests
4. Host Your Guests - Provide a welcoming stay and follow platform standards
5. Earn Money - Payment is processed securely and transferred after check-in

🔐 Safety & Support:
✔ Verified profiles
✔ Secure transactions
✔ Reviews and ratings
✔ Customer support for issues`;
        }
        
        // Provide context-aware fallback responses
        if (/(search|find|look|browse|property|properties|listing)/i.test(lowerMessage)) {
            return "Just use the search bar up top! 🏡 Enter where you want to go, your dates, and browse through the results. You can filter by Mountains, Beaches, Castles, price range, and more.";
        }
        
        if (/(book|booking|reserve|rent)/i.test(lowerMessage)) {
            return "Click on a property you like, check out the details and photos, then hit the book button. You'll need to login first though! 📅";
        }
        
        if (/(list|add|post|upload|property|sell|rent out)/i.test(lowerMessage)) {
            return "Easy! Login, click 'Add New Listing', upload some photos, add your property details and pricing. You'll be live right away! 🏠";
        }
        
        if (/(login|sign|account|register|password)/i.test(lowerMessage)) {
            return "Check the top right corner for the 'Login' button. New here? Just click 'Sign Up' - takes like 30 seconds! 🔐";
        }
        
        if (/(category|categories|type|types|mountain|beach|castle|pool)/i.test(lowerMessage)) {
            return "We've got Trending spots, Mountains, Castles, Pools, Camping, Farms, Arctic stays, and even Boats! 🏔️ Check out the filters at the top to browse.";
        }
        
        if (/(price|cost|cheap|expensive|budget)/i.test(lowerMessage)) {
            return "Prices vary by property and location. Just use the price filter to set your budget and find what works for you. All prices are per night! 💰";
        }
        
        if (/(help|assist|support)/i.test(lowerMessage)) {
            return "You can browse listings by category, search by location, or click on any property to see details. Need to book or list? Just login first! What are you looking for? 🔧";
        }
        
        // Generic fallback
        return `Not sure what you mean, but I can help you search for properties, book a stay, or list your own place. What are you looking for? 😊`;
    }

    async getGeminiResponse(userMessage) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    conversationHistory: this.conversationHistory
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Details:', errorData);
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);
            
            // Update conversation history from server
            this.conversationHistory = data.conversationHistory;

            // Keep only last 10 exchanges to manage context length
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }

            return data.response;

        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatMessages');
        const time = this.getCurrentTime();

        const messageHTML = `
            <div class="chat-message user">
                <div class="message-content">
                    ${this.escapeHtml(message)}
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-avatar">
                    <i class="fas fa-user"></i>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chatMessages');
        const time = this.getCurrentTime();

        // Convert markdown-style formatting to HTML
        const formattedMessage = this.formatMessage(message);

        const messageHTML = `
            <div class="chat-message bot">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    ${formattedMessage}
                    <span class="message-time">${time}</span>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    formatMessage(text) {
        // Convert **bold** to <strong>
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Convert *italic* to <em>
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Convert line breaks
        text = text.replace(/\n/g, '<br>');
        
        // Convert bullet points
        text = text.replace(/^- (.*?)$/gm, '• $1');
        
        return text;
    }

    showQuickReplies() {
        const messagesContainer = document.getElementById('chatMessages');
        const quickRepliesHTML = `
            <div class="chat-message bot">
                <div class="message-avatar">
                    <i class="fas fa-lightbulb"></i>
                </div>
                <div class="message-content">
                    Try asking about:
                    <div class="quick-replies">
                        <button class="quick-reply-btn" onclick="aiChatbot.handleQuickReply('search')">🔍 Search Properties</button>
                        <button class="quick-reply-btn" onclick="aiChatbot.handleQuickReply('booking')">📅 How to Book</button>
                        <button class="quick-reply-btn" onclick="aiChatbot.handleQuickReply('listing')">🏠 List My Property</button>
                        <button class="quick-reply-btn" onclick="aiChatbot.handleQuickReply('features')">✨ Features</button>
                    </div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', quickRepliesHTML);
        this.scrollToBottom();
    }

    handleQuickReply(topic) {
        const topicMap = {
            'search': 'How do I search for properties on NxtStay?',
            'booking': 'How can I book a property?',
            'listing': 'I want to list my property on NxtStay. How do I do that?',
            'features': 'What features and categories does NxtStay offer?'
        };

        const message = topicMap[topic];
        document.getElementById('chatInput').value = message;
        this.sendMessage();
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingHTML = `
            <div class="chat-message bot typing-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) typingMessage.remove();
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize AI chatbot when DOM is ready
let aiChatbot;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        aiChatbot = new NxtStayAIChatbot();
    });
} else {
    aiChatbot = new NxtStayAIChatbot();
}
