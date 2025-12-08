// NxtStay Chatbot Functionality
class NxtStayChatbot {
    constructor() {
        this.messages = [];
        this.isOpen = false;
        this.botResponses = {
            greetings: [
                "Hello! Welcome to NxtStay! 👋 How can I help you find your perfect stay today?",
                "Hi there! I'm here to help you discover amazing places to stay. What are you looking for?",
                "Welcome to NxtStay! Ready to find your dream vacation rental?"
            ],
            search: [
                "I can help you search for listings! Try filtering by category or use the search bar at the top to find properties by location.",
                "Looking for something specific? You can browse by categories like Mountains, Beaches, or use our search feature!",
                "To search for a place, use the search bar or click on any category filter at the top of the page."
            ],
            booking: [
                "To book a listing, first browse our available properties, then click on one to see details. You'll need to create an account or login to proceed!",
                "Ready to book? Just select a property you like, and click on it to view full details and contact the owner.",
                "Booking is easy! Find a property, click to view details, and if you're logged in, you can contact the owner."
            ],
            listing: [
                "Want to list your property? Click on 'Add New Listing' in the navigation menu. You'll need to be logged in first!",
                "To add your property, make sure you're logged in, then click 'Add New Listing' and fill in the details.",
                "Listing your property is simple! Sign in, click 'Add New Listing', upload photos, and provide details about your place."
            ],
            login: [
                "To login, click the 'Login' button in the top right corner. Don't have an account? You can sign up easily!",
                "Need to login? Find the 'Login' button in the navigation bar. New here? Sign up takes just a minute!",
                "Click 'Login' at the top right. First time? Choose 'Sign Up' to create your account."
            ],
            features: [
                "NxtStay offers: Property listings, Interactive maps, Reviews & ratings, Photo uploads, Category filters, and User authentication!",
                "Our features include: Browse properties by location, View on interactive maps, Leave reviews, Upload images, and much more!",
                "Explore properties, view exact locations on maps, read reviews, filter by categories, and connect with property owners!"
            ],
            help: [
                "I can help you with: Searching properties, Booking information, Adding listings, Account questions, and site navigation. What do you need help with?",
                "Need assistance? I can guide you through searching, booking, listing properties, or using site features. Just ask!",
                "I'm here to help! Ask me about finding properties, creating listings, using maps, or anything else about NxtStay."
            ],
            categories: [
                "We have amazing categories: Trending, Rooms, Iconic Cities, Mountains, Castles, Amazing Pools, Camping, Farms, Arctic stays, and Boats!",
                "Browse by category: Trending properties, Mountain retreats, Castle stays, Beach houses, Camping spots, Farm stays, and more!",
                "Explore our categories at the top: Mountains, Beaches, Castles, Pools, Camping, Farms, Arctic adventures, and Boats!"
            ],
            thanks: [
                "You're welcome! Feel free to ask if you need anything else. Happy exploring! 🏡",
                "Glad I could help! Enjoy browsing NxtStay. Let me know if you have more questions!",
                "My pleasure! Have a great time finding your perfect stay. I'm here if you need me!"
            ],
            default: [
                "I'm not sure about that, but I can help you with: searching properties, booking info, adding listings, or site features. What would you like to know?",
                "Hmm, I didn't quite get that. I can assist with finding properties, creating listings, or answering questions about NxtStay. Try asking something else!",
                "I'm still learning! I can help with searches, bookings, listings, and navigation. What can I help you with?"
            ]
        };
        
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
                    <i class="fas fa-comments"></i>
                    <span class="chat-notification" style="display: none;">1</span>
                </button>
                
                <div class="chat-window" id="chatWindow">
                    <div class="chat-header">
                        <div class="chat-header-content">
                            <div class="chat-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="chat-header-text">
                                <h3>NxtStay Assistant</h3>
                                <p>Online • Ready to help</p>
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
                                placeholder="Type your message..."
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
            chatIcon.innerHTML = '<i class="fas fa-comments"></i>';
        }
    }

    displayWelcomeMessage() {
        setTimeout(() => {
            const welcomeMsg = this.getRandomResponse('greetings');
            this.addBotMessage(welcomeMsg);
            this.showQuickReplies();
        }, 500);
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();

        if (message === '') return;

        this.addUserMessage(message);
        input.value = '';

        this.showTypingIndicator();

        setTimeout(() => {
            this.removeTypingIndicator();
            const response = this.generateResponse(message);
            this.addBotMessage(response);
        }, 1000 + Math.random() * 1000);
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

        const messageHTML = `
            <div class="chat-message bot">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    ${message}
                    <span class="message-time">${time}</span>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    showQuickReplies() {
        const messagesContainer = document.getElementById('chatMessages');
        const quickRepliesHTML = `
            <div class="chat-message bot">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    Quick options:
                    <div class="quick-replies">
                        <button class="quick-reply-btn" onclick="chatbot.handleQuickReply('search')">Search Properties</button>
                        <button class="quick-reply-btn" onclick="chatbot.handleQuickReply('booking')">How to Book</button>
                        <button class="quick-reply-btn" onclick="chatbot.handleQuickReply('listing')">Add Listing</button>
                        <button class="quick-reply-btn" onclick="chatbot.handleQuickReply('features')">Features</button>
                    </div>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', quickRepliesHTML);
        this.scrollToBottom();
    }

    handleQuickReply(topic) {
        const topicMap = {
            'search': 'How do I search for properties?',
            'booking': 'How do I book a property?',
            'listing': 'How can I add my property?',
            'features': 'What features does NxtStay offer?'
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

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Greetings
        if (/(hello|hi|hey|good morning|good evening|good afternoon)/i.test(lowerMessage)) {
            return this.getRandomResponse('greetings');
        }

        // Search related
        if (/(search|find|look|looking for|browse)/i.test(lowerMessage)) {
            return this.getRandomResponse('search');
        }

        // Booking related
        if (/(book|booking|reserve|reservation|rent)/i.test(lowerMessage)) {
            return this.getRandomResponse('booking');
        }

        // Listing related
        if (/(list|add|post|upload|create listing|add property)/i.test(lowerMessage)) {
            return this.getRandomResponse('listing');
        }

        // Login/Account
        if (/(login|sign in|sign up|register|account|password)/i.test(lowerMessage)) {
            return this.getRandomResponse('login');
        }

        // Features
        if (/(feature|what can|what do|how does|functionality)/i.test(lowerMessage)) {
            return this.getRandomResponse('features');
        }

        // Categories
        if (/(category|categories|type|types|mountain|beach|castle)/i.test(lowerMessage)) {
            return this.getRandomResponse('categories');
        }

        // Help
        if (/(help|assist|support|guide)/i.test(lowerMessage)) {
            return this.getRandomResponse('help');
        }

        // Thanks
        if (/(thank|thanks|appreciate)/i.test(lowerMessage)) {
            return this.getRandomResponse('thanks');
        }

        // Default
        return this.getRandomResponse('default');
    }

    getRandomResponse(category) {
        const responses = this.botResponses[category];
        return responses[Math.floor(Math.random() * responses.length)];
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

// Initialize chatbot when DOM is ready
let chatbot;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        chatbot = new NxtStayChatbot();
    });
} else {
    chatbot = new NxtStayChatbot();
}
