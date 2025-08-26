// AceGRE Welcome & Login Page JavaScript - Two-Column Layout Version
document.addEventListener('DOMContentLoaded', function() {
    initializeWelcomePage();
});

function initializeWelcomePage() {
    console.log('Initializing AceGRE Welcome Page...'); // Debug log
    
    // Initialize language switcher
    initializeLanguageSwitcher();
    
    // Initialize form handling
    initializeForms();
    
    // Initialize modal functionality
    initializeModal();
    
    // Add sign up event listeners
    addSignUpEventListeners();
    
    // Add global click handler as backup
    addGlobalClickHandler();
    
    // Initialize feature cards
    initializeFeatureCards();
    
    // Add entrance animations
    addEntranceAnimations();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
    
    // Add particle effects
    addParticleEffects();
    
    // Debug: Check if modal exists
    const modal = document.getElementById('registerModal');
    if (modal) {
        console.log('✅ Registration modal found in DOM');
    } else {
        console.warn('⚠️ Registration modal NOT found in DOM');
    }
    
    // Debug: Check if functions are globally accessible
    if (typeof window.showRegister === 'function') {
        console.log('✅ showRegister function is globally accessible');
    } else {
        console.error('❌ showRegister function is NOT globally accessible');
    }
    
    console.log('AceGRE Welcome Page initialization complete!'); // Debug log
}

// Initialize Feature Cards
function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const feature = this.dataset.feature;
            console.log(`Feature card clicked: ${feature}`);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Show feature preview (for demo purposes)
            showFeaturePreview(feature);
        });
        
        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Show Feature Preview
function showFeaturePreview(feature) {
    const featureNames = {
        'word': '单词学习模块',
        'math': '数学讲解模块',
        'reading': '阅读填空模块',
        'writing': '写作提分模块'
    };
    
    const featureName = featureNames[feature] || '功能模块';
    showNotification(`即将进入${featureName}，请先登录！`, 'info');
}

// Language Switcher Functionality - Simplified (Top Right Only)
function initializeLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-switch-btn');
    
    // Top right language switcher
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            
            // Update active state
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Store language preference
            localStorage.setItem('acegre_language', lang);
            
            // Update page content based on language
            updatePageLanguage(lang);
        });
    });
    
    // Load saved language preference
    const savedLang = localStorage.getItem('acegre_language') || 'en';
    const activeBtn = document.querySelector(`[data-lang="${savedLang}"]`);
    if (activeBtn) {
        activeBtn.click();
    }
}

// Update page content based on selected language
function updatePageLanguage(lang) {
    const elements = {
        'en': {
            'brand-subtitle': 'Master the GRE, Master Your Future',
            'word-title': 'Word Learning',
            'word-desc': 'High-frequency vocabulary · AI root analysis',
            'math-title': 'Math Tutorial',
            'math-desc': 'Test point breakdown · Problem search',
            'reading-title': 'Reading & Fill-in',
            'reading-desc': 'Logical guidance · Dual-line method',
            'writing-title': 'Academic Writing',
            'writing-desc': 'Issue structure · AI grading · Outline',
            'panel-title': 'Welcome Back',
            'panel-subtitle': 'Please log in to continue your GRE journey',
            'email-placeholder': 'Email Address',
            'password-placeholder': 'Password',
            'login-btn': 'Log In',
            'register-btn': 'Create Account',
            'auth-footer': 'Don\'t have an account?',
            'auth-link': 'Sign up here',
            'modal-title': 'Create Your AceGRE Account',
            'modal-subtitle': 'Join thousands of students mastering the GRE',
            'name-placeholder': 'Full Name',
            'confirm-password-placeholder': 'Confirm Password',
            'password-requirement': 'At least 6 characters',
            'create-account-btn': 'Create Account',
            'modal-footer': 'Already have an account?',
            'modal-footer-link': 'Log in'
        },
        'zh': {
            'brand-subtitle': '掌握 GRE，掌握你的未来',
            'word-title': '单词学习',
            'word-desc': '高频词汇 · AI词根分析',
            'math-title': '数学讲解',
            'math-desc': '考点拆解 · 题目搜索',
            'reading-title': '阅读填空',
            'reading-desc': '逻辑引导 · 双线方法',
            'writing-title': '学术写作',
            'writing-desc': 'Issue结构 · AI批改 · 提纲',
            'panel-title': '欢迎回来',
            'panel-subtitle': '请登录继续您的 GRE 学习之旅',
            'email-placeholder': '邮箱地址',
            'password-placeholder': '密码',
            'login-btn': '登录',
            'register-btn': '创建账户',
            'auth-footer': '还没有账户？',
            'auth-link': '立即注册',
            'modal-title': '创建您的 AceGRE 账户',
            'modal-subtitle': '加入数千名正在掌握 GRE 的学生',
            'name-placeholder': '姓名',
            'confirm-password-placeholder': '确认密码',
            'password-requirement': '至少6位字符',
            'create-account-btn': '创建账户',
            'modal-footer': '已有账户？',
            'modal-footer-link': '立即登录'
        }
    };
    
    const content = elements[lang];
    
    // Update brand subtitle
    const brandSubtitle = document.querySelector('.brand-subtitle');
    if (brandSubtitle) brandSubtitle.textContent = content['brand-subtitle'];
    
    // Update feature cards
    const wordCard = document.querySelector('[data-feature="word"] .feature-title');
    if (wordCard) wordCard.textContent = content['word-title'];
    
    const wordDesc = document.querySelector('[data-feature="word"] .feature-desc');
    if (wordDesc) wordDesc.textContent = content['word-desc'];
    
    const mathCard = document.querySelector('[data-feature="math"] .feature-title');
    if (mathCard) mathCard.textContent = content['math-title'];
    
    const mathDesc = document.querySelector('[data-feature="math"] .feature-desc');
    if (mathDesc) mathDesc.textContent = content['math-desc'];
    
    const readingCard = document.querySelector('[data-feature="reading"] .feature-title');
    if (readingCard) readingCard.textContent = content['reading-title'];
    
    const readingDesc = document.querySelector('[data-feature="reading"] .feature-desc');
    if (readingDesc) readingDesc.textContent = content['reading-desc'];
    
    const writingCard = document.querySelector('[data-feature="writing"] .feature-title');
    if (writingCard) writingCard.textContent = content['writing-title'];
    
    const writingDesc = document.querySelector('[data-feature="writing"] .feature-desc');
    if (writingDesc) writingDesc.textContent = content['writing-desc'];
    
    // Update glass panel
    const panelTitle = document.querySelector('.panel-title');
    if (panelTitle) panelTitle.textContent = content['panel-title'];
    
    const panelSubtitle = document.querySelector('.panel-subtitle');
    if (panelSubtitle) panelSubtitle.textContent = content['panel-subtitle'];
    
    // Update form placeholders
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.placeholder = content['email-placeholder'];
    
    const passwordInput = document.getElementById('password');
    if (passwordInput) passwordInput.placeholder = content['password-placeholder'];
    
    // Update buttons
    const loginBtn = document.querySelector('.btn-primary');
    if (loginBtn) loginBtn.textContent = content['login-btn'];
    
    const registerBtn = document.querySelector('.btn-secondary');
    if (registerBtn) registerBtn.textContent = content['register-btn'];
    
    // Update auth footer
    const authFooter = document.querySelector('.auth-footer');
    if (authFooter) {
        authFooter.innerHTML = `${content['auth-footer']} <a href="#" onclick="showRegister(); return false;" class="auth-link" data-action="register">${content['auth-link']}</a>`;
    }
    
    // Update modal content
    const modalTitle = document.querySelector('.modal-header h2');
    if (modalTitle) modalTitle.textContent = content['modal-title'];
    
    const modalSubtitle = document.querySelector('.modal-subtitle');
    if (modalSubtitle) modalSubtitle.textContent = content['modal-subtitle'];
    
    const nameInput = document.getElementById('fullName');
    if (nameInput) nameInput.placeholder = content['name-placeholder'];
    
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) confirmPasswordInput.placeholder = content['confirm-password-placeholder'];
    
    const createAccountBtn = document.querySelector('.register-form .btn-primary');
    if (createAccountBtn) createAccountBtn.textContent = content['create-account-btn'];
    
    const modalFooter = document.querySelector('.modal-footer p');
    if (modalFooter) {
        modalFooter.innerHTML = `${content['modal-footer']} <a href="#" onclick="hideRegister()">${content['modal-footer-link']}</a>`;
    }
}

// Form Handling
function initializeForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
        
        // Add password strength detection
        const passwordInput = document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                checkPasswordStrength(this.value);
            });
        }
        
        // Add confirm password validation
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', function() {
                validatePasswordMatch();
            });
        }
    }
    
    // Add input focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// Password Strength Detection
function checkPasswordStrength(password) {
    const strengthIndicator = document.getElementById('passwordStrength');
    if (!strengthIndicator) return;
    
    let score = 0;
    let feedback = '';
    let tips = [];
    
    // Length checks (more lenient)
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (password.length >= 10) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Generate helpful tips
    if (password.length < 8) tips.push('longer password');
    if (!/[A-Z]/.test(password)) tips.push('uppercase letter');
    if (!/[0-9]/.test(password)) tips.push('number');
    if (!/[^A-Za-z0-9]/.test(password)) tips.push('special character');
    
    // Remove all classes first
    strengthIndicator.className = 'password-strength';
    
    // Apply strength class and color
    if (score <= 2) {
        strengthIndicator.classList.add('weak');
        feedback = `Weak - Consider adding: ${tips.slice(0, 2).join(', ')}`;
    } else if (score <= 4) {
        strengthIndicator.classList.add('medium');
        feedback = tips.length > 0 ? `Good - Try adding: ${tips[0]}` : 'Good password';
    } else if (score <= 5) {
        strengthIndicator.classList.add('strong');
        feedback = 'Strong password 💪';
    } else {
        strengthIndicator.classList.add('very-strong');
        feedback = 'Excellent password! 🔒';
    }
    
    // Display feedback
    strengthIndicator.textContent = feedback;
    strengthIndicator.title = feedback;
}

// Validate Password Match
function validatePasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmInput = document.getElementById('confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmInput.style.borderColor = '#EF4444';
        confirmInput.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.15)';
    } else if (confirmPassword) {
        confirmInput.style.borderColor = '#10B981';
        confirmInput.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.15)';
    } else {
        confirmInput.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        confirmInput.style.boxShadow = 'none';
    }
}

// Handle login submission
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading state
    const loginBtn = document.querySelector('.btn-primary');
    loginBtn.classList.add('loading');
    loginBtn.textContent = 'Logging in...';
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(result.message, 'success');
            
            // Store user info in localStorage for client-side access
            localStorage.setItem('acegre_user', JSON.stringify(result.user));
            
            // Redirect to dashboard after delay
            setTimeout(() => {
                const lang = localStorage.getItem('acegre_language') || 'en';
                window.location.href = `/home/${lang}`;
            }, 1500);
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    } finally {
        // Reset button
        loginBtn.classList.remove('loading');
        loginBtn.textContent = 'Login';
    }
}

// Handle register submission
async function handleRegister() {
    const form = document.getElementById('registerForm');
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate form
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Show loading state
    const registerBtn = form.querySelector('.btn-primary');
    registerBtn.classList.add('loading');
    registerBtn.textContent = 'Creating...';
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(result.message, 'success');
            
            // Reset form
            form.reset();
            
            // Reset password strength indicator
            if (strengthIndicator) {
                strengthIndicator.className = 'password-strength';
            }
            
            // Reset confirm password validation
            const confirmInput = document.getElementById('confirmPassword');
            if (confirmInput) {
                confirmInput.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                confirmInput.style.boxShadow = 'none';
            }
            
            // Hide modal after delay
            setTimeout(() => {
                hideRegister();
            }, 1500);
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration failed. Please try again.', 'error');
    } finally {
        // Reset button
        registerBtn.classList.remove('loading');
        registerBtn.textContent = 'Create Account';
    }
}

// Modal Functionality
function initializeModal() {
    // Close modal when clicking overlay
    const modalOverlay = document.getElementById('registerModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                hideRegister();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideRegister();
        }
    });
}

// Enhanced showRegister function with debugging and global accessibility
function showRegister() {
    console.log('showRegister function called'); // Debug log
    
    const modal = document.getElementById('registerModal');
    if (modal) {
        console.log('Modal found, showing...'); // Debug log
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
        
        // Reset form state
        const form = document.getElementById('registerForm');
        if (form) form.reset();
        
        // Reset password strength indicator
        const strengthIndicator = document.getElementById('passwordStrength');
        if (strengthIndicator) {
            strengthIndicator.className = 'password-strength';
        }
        
        // Reset confirm password validation
        const confirmInput = document.getElementById('confirmPassword');
        if (confirmInput) {
            confirmInput.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            confirmInput.style.boxShadow = 'none';
        }
    } else {
        console.error('Modal not found!'); // Debug log
        // Fallback: create modal dynamically if not found
        createModalFallback();
    }
}

// Fallback modal creation if original modal is missing
function createModalFallback() {
    console.log('Creating fallback modal...'); // Debug log
    
    const modalHTML = `
        <div class="modal-overlay show" id="registerModal">
            <div class="modal">
                <div class="modal-header">
                    <h2>Create Your AceGRE Account</h2>
                    <button class="close-btn" onclick="hideRegister()">×</button>
                </div>
                
                <div class="modal-subtitle">
                    Join thousands of students mastering the GRE
                </div>
                
                <form class="register-form" id="registerForm">
                    <div class="input-group">
                        <input type="text" id="fullName" placeholder="Full Name" required>
                        <div class="input-icon">👤</div>
                    </div>
                    
                    <div class="input-group">
                        <input type="email" id="registerEmail" placeholder="Email Address" required>
                        <div class="input-icon">📧</div>
                    </div>
                    
                    <div class="input-group">
                        <input type="password" id="registerPassword" placeholder="Password" required>
                        <div class="input-icon">🔒</div>
                        <div class="password-strength" id="passwordStrength"></div>
                    </div>
                    
                    <div class="input-group">
                        <input type="password" id="confirmPassword" placeholder="Confirm Password" required>
                        <div class="input-icon">🔐</div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Create Account</button>
                    </div>
                </form>

                <div class="modal-footer">
                    <p>Already have an account? <a href="#" onclick="hideRegister()">Log in</a></p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Re-initialize the modal functionality
    initializeModal();
    
    // Focus first input
    setTimeout(() => {
        const firstInput = document.getElementById('fullName');
        if (firstInput) firstInput.focus();
    }, 100);
}

// Enhanced hideRegister function
function hideRegister() {
    console.log('hideRegister function called'); // Debug log
    
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Add additional event listeners for sign up link
function addSignUpEventListeners() {
    const signUpLink = document.querySelector('.auth-link[data-action="register"]');
    if (signUpLink) {
        console.log('Sign up link found, adding event listeners...'); // Debug log
        
        // Remove existing onclick to avoid conflicts
        signUpLink.removeAttribute('onclick');
        
        // Add click event listener
        signUpLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Sign up link clicked via addEventListener'); // Debug log
            showRegister();
        });
        
        // Also add touch events for mobile
        signUpLink.addEventListener('touchend', function(e) {
            e.preventDefault();
            console.log('Sign up link touched via addEventListener'); // Debug log
            showRegister();
        });
        
        console.log('Event listeners added successfully'); // Debug log
    } else {
        console.log('Sign up link not found'); // Debug log
    }
}

// Global click handler as backup
function addGlobalClickHandler() {
    document.addEventListener('click', function(e) {
        // Check if clicked element is sign up link or has sign up class
        if (e.target.classList.contains('auth-link') || 
            e.target.closest('.auth-link') || 
            e.target.getAttribute('data-action') === 'register') {
            
            console.log('Sign up element clicked via global handler'); // Debug log
            e.preventDefault();
            e.stopPropagation();
            showRegister();
        }
    });
    
    console.log('Global click handler added'); // Debug log
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Entrance Animations
function addEntranceAnimations() {
    const featureSection = document.querySelector('.feature-section');
    const loginSection = document.querySelector('.login-section');
    const languageSwitcher = document.querySelector('.language-switcher');
    
    if (featureSection) {
        featureSection.style.opacity = '0';
        featureSection.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            featureSection.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            featureSection.style.opacity = '1';
            featureSection.style.transform = 'translateX(0)';
        }, 200);
    }
    
    if (loginSection) {
        loginSection.style.opacity = '0';
        loginSection.style.transform = 'translateX(30px)';
        
        setTimeout(() => {
            loginSection.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            loginSection.style.opacity = '1';
            loginSection.style.transform = 'translateX(0)';
        }, 400);
    }
    
    if (languageSwitcher) {
        languageSwitcher.style.opacity = '0';
        languageSwitcher.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            languageSwitcher.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            languageSwitcher.style.opacity = '1';
            languageSwitcher.style.transform = 'translateX(0)';
        }, 600);
    }
}

// Keyboard Shortcuts
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit login form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            const inputs = document.querySelectorAll('input, button, .lang-switch-btn');
            const firstInput = inputs[0];
            const lastInput = inputs[inputs.length - 1];
            
            if (e.shiftKey && document.activeElement === firstInput) {
                e.preventDefault();
                lastInput.focus();
            } else if (!e.shiftKey && document.activeElement === lastInput) {
                e.preventDefault();
                firstInput.focus();
            }
        }
    });
}

// Particle Effects
function addParticleEffects() {
    // Add floating animation to particles
    const particles = document.querySelectorAll('.tech-particle');
    particles.forEach((particle, index) => {
        particle.style.animationDelay = `${index * 2}s`;
        particle.style.animationDuration = `${25 + index * 2}s`;
    });
}

// Make functions globally accessible
window.showRegister = showRegister;
window.hideRegister = hideRegister;

// Add notification styles dynamically
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: linear-gradient(135deg, #4a5d5a, #5a6b68);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 1.2rem 1.8rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 400px;
    border-left: 4px solid #FFD95A;
}

.notification.show {
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.2rem;
}

.notification-message {
    color: #f8f8f8;
    font-size: 1rem;
    font-weight: 500;
    font-family: 'New Times Enrollment', serif;
}

.notification-close {
    background: none;
    border: none;
    color: #b0b0b0;
    font-size: 1.4rem;
    cursor: pointer;
    padding: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.notification-close:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #f8f8f8;
}

.notification-success {
    border-left-color: #10B981;
}

.notification-error {
    border-left-color: #EF4444;
}

.notification-info {
    border-left-color: #3B82F6;
}

@media (max-width: 768px) {
    .notification {
        right: 1rem;
        left: 1rem;
        max-width: none;
        transform: translateY(-100px);
    }
    
    .notification.show {
        transform: translateY(0);
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);
