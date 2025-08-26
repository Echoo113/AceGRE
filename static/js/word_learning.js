// Global variables
let currentWord = null;
let synonymAnswers = [];
let selectedSynonyms = [];
let selectedDefinition = null;
let sessionProgress = 0;
let totalWords = 20;
let difficulty = 'medium';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadNewWord();
    updateProgressDisplay();
});

// Load a new word from the API
async function loadNewWord() {
    showLoading(true);
    
    try {
        const response = await fetch('/api/word/random', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                difficulty: difficulty,
                learned_words: getLearnedWords()
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to load word');
        }
        
        const data = await response.json();
        currentWord = data;
        
        displayWord(data);
        generateSynonymQuestion(data);
        generateEtymology(data);
        generateMemoryMethods(data);
        generateDefinitionPractice(data);
        
        // Reset selections
        selectedSynonyms = [];
        selectedDefinition = null;
        synonymAnswers = data.synonyms || [];
        
    } catch (error) {
        console.error('Error loading word:', error);
        showNotification('Failed to load new word. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

// Display the main word information
function displayWord(wordData) {
    document.getElementById('currentWord').textContent = wordData.word;
    document.getElementById('wordPronunciation').textContent = wordData.pronunciation || '';
    document.getElementById('wordLevel').textContent = `Level: ${wordData.level || difficulty}`;
    
    const definitionContent = document.querySelector('.definition-content');
    definitionContent.innerHTML = `
        <div class="definition-english">${wordData.definition_en}</div>
        <div class="definition-chinese" style="margin-top: 0.5rem; color: #a0a0a0;">${wordData.definition_zh}</div>
    `;
}

// Generate synonym question (GRE六选二)
function generateSynonymQuestion(wordData) {
    const questionContainer = document.getElementById('synonymOptions');
    const options = wordData.synonym_options || [];
    
    questionContainer.innerHTML = '';
    
    options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'synonym-option';
        optionElement.textContent = option;
        optionElement.onclick = () => selectSynonym(index, optionElement);
        questionContainer.appendChild(optionElement);
    });
    
    // Clear result
    document.getElementById('synonymResult').innerHTML = '';
}

// Handle synonym selection
function selectSynonym(index, element) {
    if (selectedSynonyms.includes(index)) {
        // Deselect
        selectedSynonyms = selectedSynonyms.filter(i => i !== index);
        element.classList.remove('selected');
    } else if (selectedSynonyms.length < 2) {
        // Select (max 2)
        selectedSynonyms.push(index);
        element.classList.add('selected');
    }
}

// Check synonym answers
function checkSynonyms() {
    if (selectedSynonyms.length !== 2) {
        showNotification('Please select exactly 2 synonyms.', 'error');
        return;
    }
    
    const options = document.querySelectorAll('.synonym-option');
    const correctAnswers = synonymAnswers;
    
    let correctCount = 0;
    selectedSynonyms.forEach(index => {
        if (correctAnswers.includes(index)) {
            correctCount++;
            options[index].classList.add('correct');
        } else {
            options[index].classList.add('incorrect');
        }
    });
    
    // Show correct answers
    correctAnswers.forEach(index => {
        if (!selectedSynonyms.includes(index)) {
            options[index].classList.add('correct');
        }
    });
    
    const resultDiv = document.getElementById('synonymResult');
    if (correctCount === 2) {
        resultDiv.innerHTML = '<div style="color: #22C55E; font-weight: 600;">✓ Correct! Well done!</div>';
        showNotification('Synonym question correct!', 'success');
    } else {
        resultDiv.innerHTML = '<div style="color: #EF4444; font-weight: 600;">✗ Incorrect. Try to remember the correct synonyms.</div>';
    }
    
    // Disable further selection
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
}

// Generate etymology analysis
function generateEtymology(wordData) {
    const partsContainer = document.getElementById('etymologyParts');
    const explanationContainer = document.getElementById('etymologyExplanation');
    
    if (wordData.etymology && wordData.etymology.parts) {
        partsContainer.innerHTML = '';
        wordData.etymology.parts.forEach(part => {
            const partElement = document.createElement('div');
            partElement.className = 'etymology-part';
            partElement.innerHTML = `<strong>${part.part}</strong><br><small>${part.meaning}</small>`;
            partsContainer.appendChild(partElement);
        });
        
        explanationContainer.textContent = wordData.etymology.explanation || 'Etymology explanation not available.';
    } else {
        partsContainer.innerHTML = '<div style="color: #a0a0a0;">Etymology information not available for this word.</div>';
        explanationContainer.textContent = '';
    }
}

// Generate memory methods
function generateMemoryMethods(wordData) {
    const storyContent = document.querySelector('#storyMethod .story-content');
    const phoneticContent = document.querySelector('#phoneticMethod .phonetic-content');
    const visualContent = document.querySelector('#visualMethod .visual-content');
    
    // Story method
    storyContent.innerHTML = wordData.memory_story || 
        `<div style="color: #a0a0a0;">Creating a memorable story for "${wordData.word}"...</div>`;
    
    // Phonetic method
    phoneticContent.innerHTML = wordData.memory_phonetic || 
        `<div style="color: #a0a0a0;">Phonetic memory aid for "${wordData.word}"...</div>`;
    
    // Visual method
    visualContent.innerHTML = wordData.memory_visual || 
        `<div style="color: #a0a0a0;">Visual memory technique for "${wordData.word}"...</div>`;
}

// Show memory method tab
function showMemoryMethod(method) {
    // Hide all methods
    document.querySelectorAll('.memory-method').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.memory-tab').forEach(t => t.classList.remove('active'));
    
    // Show selected method
    document.getElementById(method + 'Method').classList.add('active');
    event.target.classList.add('active');
}

// Generate definition practice
function generateDefinitionPractice(wordData) {
    const practiceWordEl = document.getElementById('practiceWord');
    const optionsContainer = document.getElementById('definitionOptions');
    
    practiceWordEl.textContent = wordData.word;
    
    if (wordData.definition_options) {
        optionsContainer.innerHTML = '';
        
        wordData.definition_options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'definition-option';
            optionElement.textContent = option;
            optionElement.onclick = () => selectDefinition(index, optionElement);
            optionsContainer.appendChild(optionElement);
        });
    }
    
    // Clear result
    document.getElementById('definitionResult').innerHTML = '';
}

// Handle definition selection
function selectDefinition(index, element) {
    // Clear previous selection
    document.querySelectorAll('.definition-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    selectedDefinition = index;
    element.classList.add('selected');
}

// Check definition answer
function checkDefinition() {
    if (selectedDefinition === null) {
        showNotification('Please select a definition.', 'error');
        return;
    }
    
    const resultDiv = document.getElementById('definitionResult');
    const correctAnswer = currentWord.correct_definition || 0;
    
    if (selectedDefinition === correctAnswer) {
        resultDiv.innerHTML = '<div style="color: #22C55E; font-weight: 600;">✓ Correct definition!</div>';
        showNotification('Definition correct!', 'success');
    } else {
        resultDiv.innerHTML = `<div style="color: #EF4444; font-weight: 600;">✗ Incorrect. The correct answer is option ${correctAnswer + 1}.</div>`;
    }
    
    // Disable further selection
    document.querySelectorAll('.definition-option').forEach(option => {
        option.style.pointerEvents = 'none';
    });
}

// Pronounce word (Text-to-Speech)
function pronounceWord() {
    if ('speechSynthesis' in window && currentWord) {
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    } else {
        showNotification('Speech synthesis not supported.', 'error');
    }
}

// Toggle favorite
async function toggleFavorite() {
    if (!currentWord) return;
    
    try {
        const response = await fetch('/api/word/favorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                word: currentWord.word,
                action: 'toggle'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            const favoriteBtn = document.querySelector('.favorite-btn');
            
            if (data.is_favorite) {
                favoriteBtn.style.color = '#FFD95A';
                favoriteBtn.style.textShadow = '0 0 10px rgba(255, 217, 90, 0.8)';
                showNotification('Added to favorites!', 'success');
            } else {
                favoriteBtn.style.color = '#00FFFF';
                favoriteBtn.style.textShadow = 'none';
                showNotification('Removed from favorites.', 'success');
            }
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        showNotification('Failed to update favorite status.', 'error');
    }
}

// Skip current word
function skipWord() {
    sessionProgress++;
    updateProgressDisplay();
    loadNewWord();
    showNotification('Word skipped.', 'success');
}

// Go to next word
function nextWord() {
    sessionProgress++;
    updateProgressDisplay();
    
    if (sessionProgress >= totalWords) {
        showSessionComplete();
    } else {
        loadNewWord();
    }
}

// Mark word as learned
async function markLearned() {
    if (!currentWord) return;
    
    try {
        const response = await fetch('/api/word/learned', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                word: currentWord.word
            })
        });
        
        if (response.ok) {
            showNotification('Word marked as learned!', 'success');
            addToLearnedWords(currentWord.word);
            nextWord();
        }
    } catch (error) {
        console.error('Error marking word as learned:', error);
        showNotification('Failed to mark word as learned.', 'error');
    }
}

// Change difficulty level
function changeDifficulty() {
    const difficultySelect = document.getElementById('difficultyLevel');
    difficulty = difficultySelect.value;
    
    showNotification(`Difficulty changed to ${difficulty}.`, 'success');
    
    // Restart session with new difficulty
    sessionProgress = 0;
    updateProgressDisplay();
    loadNewWord();
}

// Update progress display
function updateProgressDisplay() {
    document.getElementById('currentProgress').textContent = sessionProgress;
    document.getElementById('totalWords').textContent = totalWords;
    
    const progressFill = document.getElementById('progressFill');
    const percentage = (sessionProgress / totalWords) * 100;
    progressFill.style.width = `${percentage}%`;
}

// Show/hide loading overlay
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Show session complete
function showSessionComplete() {
    showNotification('Session complete! Great job!', 'success');
    
    setTimeout(() => {
        if (confirm('Session complete! Would you like to start a new session?')) {
            sessionProgress = 0;
            updateProgressDisplay();
            loadNewWord();
        } else {
            window.location.href = '/dashboard';
        }
    }, 2000);
}

// Local storage helpers
function getLearnedWords() {
    const learned = localStorage.getItem('learnedWords');
    return learned ? JSON.parse(learned) : [];
}

function addToLearnedWords(word) {
    const learned = getLearnedWords();
    if (!learned.includes(word)) {
        learned.push(word);
        localStorage.setItem('learnedWords', JSON.stringify(learned));
    }
}

// AI Enhancement Functions
async function enhanceWithAI(contentType = 'all') {
    if (!currentWord) return;
    
    showLoading(true);
    
    try {
        const response = await fetch('/api/word/enhance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                word: currentWord.word,
                content_type: contentType
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.success) {
                // 更新对应的内容
                if (contentType === 'memory' || contentType === 'all') {
                    updateMemoryMethods(data);
                }
                if (contentType === 'etymology' || contentType === 'all') {
                    updateEtymology(data);
                }
                if (contentType === 'all' && data.enhanced_data) {
                    currentWord = data.enhanced_data;
                    displayWord(currentWord);
                    generateSynonymQuestion(currentWord);
                    generateDefinitionPractice(currentWord);
                }
                
                showNotification('AI内容生成成功！', 'success');
            } else {
                showNotification('AI增强失败: ' + data.message, 'error');
            }
        }
    } catch (error) {
        console.error('AI enhancement error:', error);
        showNotification('AI服务暂时不可用', 'error');
    } finally {
        showLoading(false);
    }
}

function updateMemoryMethods(data) {
    if (data.memory_story) {
        document.querySelector('#storyMethod .story-content').innerHTML = data.memory_story;
    }
    if (data.memory_phonetic) {
        document.querySelector('#phoneticMethod .phonetic-content').innerHTML = data.memory_phonetic;
    }
    if (data.memory_visual) {
        document.querySelector('#visualMethod .visual-content').innerHTML = data.memory_visual;
    }
}

function updateEtymology(data) {
    if (data.etymology) {
        generateEtymology({etymology: data.etymology});
    }
}

// AI Chat Function (可以集成到界面中)
async function askAI(question) {
    try {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: question,
                context: {
                    current_word: currentWord ? currentWord.word : null
                }
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                return data.response;
            }
        }
        return "抱歉，AI助手暂时无法回答您的问题。";
    } catch (error) {
        console.error('AI chat error:', error);
        return "AI服务连接失败，请稍后再试。";
    }
}

// 添加AI增强按钮到界面
function addAIEnhanceButtons() {
    // 在记忆方法模块添加AI增强按钮
    const memoryModule = document.querySelector('.memory-module');
    if (memoryModule) {
        const aiButton = document.createElement('button');
        aiButton.className = 'ai-enhance-btn';
        aiButton.innerHTML = '🤖 AI增强记忆法';
        aiButton.onclick = () => enhanceWithAI('memory');
        aiButton.style.cssText = `
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        `;
        memoryModule.appendChild(aiButton);
    }
    
    // 在词根词缀模块添加AI增强按钮
    const etymologyModule = document.querySelector('.etymology-module');
    if (etymologyModule) {
        const aiButton = document.createElement('button');
        aiButton.className = 'ai-enhance-btn';
        aiButton.innerHTML = '🤖 AI分析词根';
        aiButton.onclick = () => enhanceWithAI('etymology');
        aiButton.style.cssText = `
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        `;
        etymologyModule.appendChild(aiButton);
    }
}

// 添加快速AI问答功能
function addQuickAIQuestions() {
    const wordCard = document.querySelector('.word-card');
    if (wordCard) {
        const aiQuickPanel = document.createElement('div');
        aiQuickPanel.className = 'ai-quick-panel';
        aiQuickPanel.innerHTML = `
            <div class="ai-quick-title">🤖 快速提问</div>
            <div class="ai-quick-buttons">
                <button onclick="quickAI('记忆技巧')">记忆技巧</button>
                <button onclick="quickAI('词根分析')">词根分析</button>
                <button onclick="quickAI('例句')">例句</button>
                <button onclick="quickAI('同义词')">同义词</button>
            </div>
            <div class="ai-response" id="aiQuickResponse"></div>
        `;
        aiQuickPanel.style.cssText = `
            margin-top: 1.5rem;
            padding: 1rem;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 12px;
            border: 1px solid rgba(102, 126, 234, 0.2);
        `;
        wordCard.appendChild(aiQuickPanel);
    }
}

async function quickAI(question) {
    const responseDiv = document.getElementById('aiQuickResponse');
    responseDiv.innerHTML = '<div style="color: #667eea;">🤖 AI思考中...</div>';
    
    const response = await askAI(question);
    responseDiv.innerHTML = `<div style="color: #e0e0e0; line-height: 1.5; margin-top: 0.5rem;">${response}</div>`;
}

// 页面加载时添加AI功能
document.addEventListener('DOMContentLoaded', function() {
    // 延迟添加AI按钮，确保DOM完全加载
    setTimeout(() => {
        addAIEnhanceButtons();
        addQuickAIQuestions();
    }, 1000);
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '/logout';
    }
}
