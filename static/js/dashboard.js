// AceGRE Dashboard JavaScript Functionality

// Global variables
let currentLanguage = 'en';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('AceGRE Dashboard loaded successfully!');
    initializeDashboard();
});

// Initialize dashboard functionality
function initializeDashboard() {
    // Set current language from page
    const htmlLang = document.documentElement.lang;
    currentLanguage = htmlLang;
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
    
    // Initialize AI chat
    initializeAIChat();
}

// Navigation functions
function navigateTo(area) {
    const areaNames = {
        'word': currentLanguage === 'en' ? 'Word Study' : '单词学习',
        'word-learning': currentLanguage === 'en' ? 'Word Learning' : '单词学习',
        'math': currentLanguage === 'en' ? 'Math Tutorial' : '数学讲解',
        'reading': currentLanguage === 'en' ? 'Reading & Fill-in' : '阅读填空',
        'writing': currentLanguage === 'en' ? 'Academic Writing' : '学术写作'
    };
    
    console.log(`Navigating to ${areaNames[area]} area`);
    
    // Show loading state
    showLoadingState(area);
    
    // Handle specific routes
    if (area === 'word-learning') {
        console.log('Navigating to word-learning page...');
        console.log('Redirecting to /word-learning');
        window.location.href = '/word-learning';
        return;
    }
    
    // Simulate navigation for other areas (will be replaced with actual routing)
    setTimeout(() => {
        // For now, show coming soon message
        showNotification(`${areaNames[area]} module is coming soon!`, 'success');
    }, 1000);
}

// User dropdown functionality
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (userMenu && dropdown && !userMenu.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Language switching
function switchLanguage(lang) {
    console.log(`Switching language to: ${lang}`);
    
    // Store language preference
    localStorage.setItem('acegre_language', lang);
    
    // Redirect to dashboard with new language
    window.location.href = `/home/${lang}`;
}

// AI Chat functionality
function toggleAIChat() {
    const chatWindow = document.getElementById('aiChatWindow');
    chatWindow.classList.toggle('active');
    
    if (chatWindow.classList.contains('active')) {
        // Focus on input when opening
        document.getElementById('messageInput').focus();
        
        // Add smooth animation
        chatWindow.style.animation = 'slideIn 0.3s ease-out';
    }
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat('user', message);
    
    // Clear input
    input.value = '';
    
    // Simulate AI response (will be replaced with actual AI integration)
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addMessageToChat('ai', aiResponse);
    }, 1000);
}

function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    messageDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
    messageDiv.style.textAlign = sender === 'user' ? 'right' : 'left';
    messageDiv.style.marginLeft = sender === 'user' ? 'auto' : '0';
    messageDiv.style.marginRight = sender === 'user' ? '0' : 'auto';
    messageDiv.style.maxWidth = '80%';
    messageDiv.style.backgroundColor = sender === 'user' ? '#667eea' : 'white';
    messageDiv.style.color = sender === 'user' ? 'white' : '#333';
    
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    // Simple AI response logic (will be replaced with actual AI integration)
    const responses = {
        'en': [
            "That's a great question! Let me help you with that.",
            "I understand your concern. Here's what I can suggest...",
            "Based on your question, I think you should focus on...",
            "That's a common challenge in GRE preparation. Here's my advice...",
            "Great question! This is exactly what you need to know for the GRE..."
        ],
        'zh': [
            "这是一个很好的问题！让我来帮你解答。",
            "我理解你的困惑。以下是我的建议...",
            "根据你的问题，我认为你应该专注于...",
            "这是 GRE 备考中的常见挑战。以下是我的建议...",
            "好问题！这正是 GRE 考试中你需要了解的内容..."
        ]
    };
    
    const randomResponse = responses[currentLanguage][Math.floor(Math.random() * responses[currentLanguage].length)];
    return randomResponse;
}

// Loading state management
function showLoadingState(area) {
    // Add loading animation to the clicked card
    const card = event.currentTarget;
    const originalContent = card.innerHTML;
    
    card.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>${currentLanguage === 'en' ? 'Loading...' : '加载中...'}</p>
        </div>
    `;
    
    // Reset after navigation
    setTimeout(() => {
        card.innerHTML = originalContent;
    }, 2000);
}

// Keyboard shortcuts
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to toggle AI chat
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleAIChat();
        }
        
        // Escape to close AI chat
        if (e.key === 'Escape') {
            const chatWindow = document.getElementById('aiChatWindow');
            if (chatWindow.classList.contains('active')) {
                toggleAIChat();
            }
        }
        
        // Number keys 1-4 to navigate to study areas
        if (e.key >= '1' && e.key <= '4') {
            const areas = ['word', 'quant', 'verbal', 'writing'];
            const areaIndex = parseInt(e.key) - 1;
            navigateTo(areas[areaIndex]);
        }
    });
}

// Initialize AI chat
function initializeAIChat() {
    // Add enter key support for chat input
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Close chat when clicking outside
    document.addEventListener('click', function(e) {
        const chatWindow = document.getElementById('aiChatWindow');
        const aiSupport = document.querySelector('.ai-support');
        
        if (!chatWindow.contains(e.target) && !aiSupport.contains(e.target)) {
            chatWindow.classList.remove('active');
        }
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for loading spinner and notifications
const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        text-align: center;
        padding: 2rem;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
    }
    
    .notification-info {
        background: #667eea;
    }
    
    .notification-success {
        background: #28a745;
    }
    
    .notification-error {
        background: #dc3545;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .user-message {
        margin-bottom: 1rem;
        padding: 0.8rem;
        border-radius: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        font-size: 0.9rem;
        line-height: 1.4;
    }
`;
document.head.appendChild(style);
