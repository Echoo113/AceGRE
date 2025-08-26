from flask import Flask, render_template, redirect, url_for, session, request, jsonify
import json
import os
import random
from datetime import datetime
from ai_service import ai_service, enhance_word_with_ai

app = Flask(__name__)
app.secret_key = 'acegre_secret_key_2024'  # For session management

# Simple user storage (in production, use a proper database)
USERS_FILE = 'users.json'

# GRE Word Database (in production, use a proper database)
GRE_WORDS = [
    {
        "word": "abstruse",
        "pronunciation": "/æbˈstrus/",
        "level": "hard",
        "definition_en": "Difficult to understand; obscure",
        "definition_zh": "难以理解的；深奥的",
        "etymology": {
            "parts": [
                {"part": "ab-", "meaning": "away from"},
                {"part": "trus", "meaning": "thrust"},
                {"part": "-e", "meaning": "adjective suffix"}
            ],
            "explanation": "Originally meaning 'thrust away' or hidden from understanding"
        },
        "synonym_options": ["obscure", "clear", "complex", "transparent", "convoluted", "obvious"],
        "synonyms": [0, 4],  # obscure, convoluted
        "definition_options": [
            "Difficult to understand; obscure",
            "Easy to comprehend",
            "Relating to abstract art",
            "Simple and straightforward"
        ],
        "correct_definition": 0,
        "memory_story": "Imagine an 'abstract' painting that's so 'obtuse' (abstruse) that nobody can understand what it means!",
        "memory_phonetic": "Ab-STRUS sounds like 'abstract truth' - abstract truths are often hard to understand.",
        "memory_visual": "Picture a maze with 'ABS' (abstract) pathways that are 'TRUCE' (hard to navigate)"
    },
    {
        "word": "ameliorate",
        "pronunciation": "/əˈmilyəˌreɪt/",
        "level": "medium",
        "definition_en": "To make or become better; improve",
        "definition_zh": "改善；改进",
        "etymology": {
            "parts": [
                {"part": "a-", "meaning": "to"},
                {"part": "melior", "meaning": "better"},
                {"part": "-ate", "meaning": "verb suffix"}
            ],
            "explanation": "From Latin 'melior' meaning better, so literally 'to make better'"
        },
        "synonym_options": ["worsen", "improve", "maintain", "enhance", "deteriorate", "upgrade"],
        "synonyms": [1, 3],  # improve, enhance
        "definition_options": [
            "To make worse",
            "To make or become better; improve",
            "To remain the same",
            "To analyze carefully"
        ],
        "correct_definition": 1,
        "memory_story": "Amy's lemonade was terrible, but she worked to 'ameliorate' it by adding more sugar until it was much better!",
        "memory_phonetic": "A-MELI-ORATE sounds like 'Amy's melody rate' - Amy improved her melody to get a better rate!",
        "memory_visual": "Picture 'A MELON RATE' - upgrading from bad melons to premium melons for a better rate"
    },
    {
        "word": "castigate",
        "pronunciation": "/ˈkæstɪˌgeɪt/",
        "level": "medium",
        "definition_en": "To criticize or punish severely",
        "definition_zh": "严厉批评；惩罚",
        "etymology": {
            "parts": [
                {"part": "castig", "meaning": "pure, chaste"},
                {"part": "-ate", "meaning": "verb suffix"}
            ],
            "explanation": "Originally meant 'to make pure' through punishment or discipline"
        },
        "synonym_options": ["praise", "scold", "ignore", "rebuke", "compliment", "reward"],
        "synonyms": [1, 3],  # scold, rebuke
        "definition_options": [
            "To praise highly",
            "To criticize or punish severely",
            "To ignore completely",
            "To reward generously"
        ],
        "correct_definition": 1,
        "memory_story": "The knight had to 'castigate' (punish) the soldiers who broke the castle gate rules!",
        "memory_phonetic": "CASTI-GATE sounds like 'cast the gate' - someone was severely punished and cast out of the gate!",
        "memory_visual": "Picture a 'CASTLE GATE' where guards severely scold anyone who breaks the rules"
    },
    {
        "word": "ephemeral",
        "pronunciation": "/ɪˈfɛmərəl/",
        "level": "hard",
        "definition_en": "Lasting for a very short time; transitory",
        "definition_zh": "短暂的；瞬息的",
        "etymology": {
            "parts": [
                {"part": "epi-", "meaning": "upon"},
                {"part": "hemer", "meaning": "day"},
                {"part": "-al", "meaning": "adjective suffix"}
            ],
            "explanation": "From Greek 'ephemeros' meaning 'lasting only a day'"
        },
        "synonym_options": ["permanent", "temporary", "eternal", "fleeting", "lasting", "durable"],
        "synonyms": [1, 3],  # temporary, fleeting
        "definition_options": [
            "Lasting forever",
            "Lasting for a very short time; transitory",
            "Happening regularly",
            "Very important"
        ],
        "correct_definition": 1,
        "memory_story": "The beautiful 'ephemeral' butterfly lived for only one day - like an 'e-femoral' (electronic femur) that breaks quickly!",
        "memory_phonetic": "E-PHEMER-AL sounds like 'E-FAME-REAL' - electronic fame is often very short-lived and ephemeral!",
        "memory_visual": "Picture an 'E-FOLDER' that disappears after one day - very ephemeral digital storage"
    },
    {
        "word": "gregarious",
        "pronunciation": "/grɪˈgeəriəs/",
        "level": "easy",
        "definition_en": "Sociable; enjoying the company of others",
        "definition_zh": "爱社交的；合群的",
        "etymology": {
            "parts": [
                {"part": "greg", "meaning": "flock, herd"},
                {"part": "-arious", "meaning": "characterized by"}
            ],
            "explanation": "From Latin 'grex' meaning flock - someone who likes to be part of a group"
        },
        "synonym_options": ["antisocial", "sociable", "isolated", "outgoing", "withdrawn", "lonely"],
        "synonyms": [1, 3],  # sociable, outgoing
        "definition_options": [
            "Preferring to be alone",
            "Sociable; enjoying the company of others",
            "Very aggressive",
            "Extremely quiet"
        ],
        "correct_definition": 1,
        "memory_story": "Greg was so 'gregarious' that everyone called him 'Great Greg' because he loved hanging out with groups!",
        "memory_phonetic": "GREG-ARIOUS sounds like 'Greg-hilarious' - Greg is so sociable and funny that everyone wants to be around him!",
        "memory_visual": "Picture 'GREG' surrounded by 'VARIOUS' people - he's gregarious and loves variety in his social circle"
    },
    {
        "word": "laconic",
        "pronunciation": "/ləˈkɒnɪk/",
        "level": "medium",
        "definition_en": "Using few words; concise",
        "definition_zh": "简洁的；言简意赅的",
        "etymology": {
            "parts": [
                {"part": "Lacon", "meaning": "Laconia (Sparta)"},
                {"part": "-ic", "meaning": "adjective suffix"}
            ],
            "explanation": "From Laconia, region of ancient Sparta, known for brief, pithy speech"
        },
        "synonym_options": ["verbose", "concise", "talkative", "brief", "wordy", "lengthy"],
        "synonyms": [1, 3],  # concise, brief
        "definition_options": [
            "Using many words",
            "Using few words; concise",
            "Speaking loudly",
            "Speaking softly"
        ],
        "correct_definition": 1,
        "memory_story": "The 'laconic' speaker was like a 'lack-tonic' - he lacked the tonic of many words and kept it short!",
        "memory_phonetic": "LACONIC sounds like 'LACK-TONIC' - he lacks the tonic of long speeches, keeps it brief!",
        "memory_visual": "Picture a 'LAKE-COMIC' who tells very short jokes by the lake - brief and to the point"
    }
]

def load_users():
    """Load users from JSON file"""
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_users(users):
    """Save users to JSON file"""
    with open(USERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

@app.route('/')
def language_selection():
    return render_template('language.html')

@app.route('/api/login', methods=['POST'])
def api_login():
    """Handle login API request"""
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({'success': False, 'message': 'Please fill in all fields'})
    
    users = load_users()
    user = users.get(email)
    
    if user and user.get('password') == password:
        # Store user session
        session['user_id'] = email
        session['user_name'] = user.get('name', email.split('@')[0])
        session['login_time'] = datetime.now().isoformat()
        
        return jsonify({
            'success': True, 
            'message': 'Login successful!',
            'user': {
                'name': user.get('name', email.split('@')[0]),
                'email': email
            }
        })
    else:
        return jsonify({'success': False, 'message': 'Invalid email or password'})

@app.route('/api/register', methods=['POST'])
def api_register():
    """Handle registration API request"""
    data = request.get_json()
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not all([name, email, password]):
        return jsonify({'success': False, 'message': 'Please fill in all fields'})
    
    if len(password) < 6:
        return jsonify({'success': False, 'message': 'Password must be at least 6 characters'})
    
    users = load_users()
    
    if email in users:
        return jsonify({'success': False, 'message': 'Email already exists'})
    
    # Create new user
    users[email] = {
        'name': name,
        'email': email,
        'password': password,  # In production, hash this!
        'created_at': datetime.now().isoformat(),
        'study_progress': {
            'word': {'level': 1, 'completed': 0},
            'math': {'level': 1, 'completed': 0},
            'reading': {'level': 1, 'completed': 0},
            'writing': {'level': 1, 'completed': 0}
        }
    }
    
    save_users(users)
    
    return jsonify({
        'success': True, 
        'message': 'Account created successfully!',
        'user': {
            'name': name,
            'email': email
        }
    })

@app.route('/home/<lang>')
def home(lang):
    # Store language preference in session
    session['language'] = lang
    return redirect(url_for('dashboard'))

@app.route('/dashboard')
def dashboard():
    # Check if user is logged in
    if 'user_id' not in session:
        return redirect(url_for('language_selection'))
    
    lang = session.get('language', 'en')
    user_name = session.get('user_name', 'User')
    
    # Load user progress
    users = load_users()
    user_data = users.get(session['user_id'], {})
    study_progress = user_data.get('study_progress', {})
    
    return render_template('dashboard.html', 
                         language=lang, 
                         user_name=user_name,
                         study_progress=study_progress)

@app.route('/word-learning')
def word_learning():
    """Word learning page"""
    # Check if user is logged in
    if 'user_id' not in session:
        print(f"Word learning access denied - no session. Current session: {dict(session)}")
        return redirect(url_for('language_selection'))
    
    user_name = session.get('user_name', 'User')
    print(f"Word learning accessed by user: {user_name}")
    return render_template('word_learning.html', user_name=user_name)

@app.route('/api/word/random', methods=['POST'])
def api_get_random_word():
    """Get a random word based on difficulty and learned words"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not logged in'})
    
    data = request.get_json()
    difficulty = data.get('difficulty', 'medium')
    learned_words = data.get('learned_words', [])
    
    # Filter words by difficulty
    available_words = [word for word in GRE_WORDS 
                      if word['level'] == difficulty and word['word'] not in learned_words]
    
    # If no words available at this difficulty, use all words
    if not available_words:
        available_words = [word for word in GRE_WORDS if word['word'] not in learned_words]
    
    # If still no words, reset learned words
    if not available_words:
        available_words = GRE_WORDS
    
    # Select random word
    word = random.choice(available_words)
    
    # 使用AI增强单词内容（如果需要）
    enhanced_word = enhance_word_with_ai(word.copy())
    
    return jsonify({
        'success': True,
        'word': enhanced_word['word'],
        'pronunciation': enhanced_word['pronunciation'],
        'level': enhanced_word['level'],
        'definition_en': enhanced_word['definition_en'],
        'definition_zh': enhanced_word['definition_zh'],
        'etymology': enhanced_word['etymology'],
        'synonym_options': enhanced_word['synonym_options'],
        'synonyms': enhanced_word['synonyms'],
        'definition_options': enhanced_word['definition_options'],
        'correct_definition': enhanced_word['correct_definition'],
        'memory_story': enhanced_word['memory_story'],
        'memory_phonetic': enhanced_word['memory_phonetic'],
        'memory_visual': enhanced_word['memory_visual']
    })

@app.route('/api/word/favorite', methods=['POST'])
def api_toggle_favorite():
    """Toggle word favorite status"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not logged in'})
    
    data = request.get_json()
    word = data.get('word')
    
    users = load_users()
    user_data = users.get(session['user_id'], {})
    favorites = user_data.get('favorite_words', [])
    
    is_favorite = word in favorites
    
    if is_favorite:
        favorites.remove(word)
    else:
        favorites.append(word)
    
    user_data['favorite_words'] = favorites
    users[session['user_id']] = user_data
    save_users(users)
    
    return jsonify({
        'success': True,
        'is_favorite': not is_favorite,
        'message': 'Favorite updated'
    })

@app.route('/api/word/learned', methods=['POST'])
def api_mark_learned():
    """Mark a word as learned"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not logged in'})
    
    data = request.get_json()
    word = data.get('word')
    
    users = load_users()
    user_data = users.get(session['user_id'], {})
    learned_words = user_data.get('learned_words', [])
    
    if word not in learned_words:
        learned_words.append(word)
        user_data['learned_words'] = learned_words
        
        # Update study progress
        if 'study_progress' not in user_data:
            user_data['study_progress'] = {}
        if 'word' not in user_data['study_progress']:
            user_data['study_progress']['word'] = {'level': 1, 'completed': 0}
        
        user_data['study_progress']['word']['completed'] += 1
        
        users[session['user_id']] = user_data
        save_users(users)
    
    return jsonify({
        'success': True,
        'message': 'Word marked as learned'
    })

@app.route('/api/word/enhance', methods=['POST'])
def api_enhance_word():
    """使用AI增强单词内容"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not logged in'})
    
    data = request.get_json()
    word = data.get('word')
    content_type = data.get('content_type', 'all')  # all, memory, etymology, exercise
    
    # 找到对应的单词
    word_data = None
    for w in GRE_WORDS:
        if w['word'] == word:
            word_data = w.copy()
            break
    
    if not word_data:
        return jsonify({'success': False, 'message': 'Word not found'})
    
    try:
        # 使用AI服务生成内容
        if content_type == 'memory':
            # 只生成记忆方法
            enhanced_content = ai_service.generate_word_content(word, word_data)
            return jsonify({
                'success': True,
                'memory_story': enhanced_content.get('memory_story'),
                'memory_phonetic': enhanced_content.get('memory_phonetic'),
                'memory_visual': enhanced_content.get('memory_visual')
            })
        elif content_type == 'etymology':
            # 只生成词根词缀
            enhanced_content = ai_service.generate_word_content(word, word_data)
            return jsonify({
                'success': True,
                'etymology': enhanced_content.get('etymology')
            })
        else:
            # 生成全部内容
            enhanced_content = ai_service.generate_word_content(word, word_data)
            return jsonify({
                'success': True,
                'enhanced_data': enhanced_content
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'AI enhancement failed: {str(e)}'
        })

@app.route('/api/ai/chat', methods=['POST'])
def api_ai_chat():
    """AI聊天接口 - 回答用户关于单词学习的问题"""
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not logged in'})
    
    data = request.get_json()
    user_message = data.get('message', '')
    context = data.get('context', {})  # 当前单词上下文
    
    if not user_message:
        return jsonify({'success': False, 'message': 'Message cannot be empty'})
    
    try:
        # 创建AI聊天提示
        system_prompt = """你是一位专业的GRE词汇导师。请用友好、专业的方式回答学生关于GRE单词学习的问题。
        你可以帮助学生：
        1. 解释单词含义和用法
        2. 提供记忆技巧
        3. 分析词根词缀
        4. 给出同义词和反义词
        5. 提供例句和语境
        
        请用中英文混合的方式回答，确保学生能够理解。"""
        
        # 构建用户消息（包含上下文）
        full_message = user_message
        if context.get('current_word'):
            full_message = f"关于单词'{context['current_word']}'：{user_message}"
        
        # 这里可以调用实际的AI API
        # 暂时返回智能回复
        ai_response = generate_smart_response(user_message, context)
        
        return jsonify({
            'success': True,
            'response': ai_response
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'AI chat failed: {str(e)}'
        })

def generate_smart_response(message: str, context: dict) -> str:
    """生成智能回复（当AI API不可用时的fallback）"""
    message_lower = message.lower()
    current_word = context.get('current_word', '')
    
    # 关键词匹配回复
    if '记忆' in message or 'remember' in message_lower:
        if current_word:
            return f"对于单词'{current_word}'，我建议使用多种记忆方法：\n1. 词根词缀法：分析单词构成\n2. 联想记忆法：创造有趣的故事\n3. 谐音记忆法：利用发音相似的中文词汇\n4. 视觉记忆法：在脑海中构建画面\n\n你想了解哪种方法呢？"
        else:
            return "记忆GRE单词的关键是多样化的方法：词根词缀、联想故事、谐音记忆、视觉画面等。选择最适合你的方法坚持练习！"
    
    elif '词根' in message or 'etymology' in message_lower:
        return f"词根词缀是理解单词的强大工具！它们像拼图一样组成完整的单词含义。{'我来为你分析一下' + current_word + '的词根构成。' if current_word else '告诉我你想了解哪个单词的词根分析？'}"
    
    elif '同义词' in message or 'synonym' in message_lower:
        return f"同义词练习是GRE的重点！{'对于' + current_word + '，' if current_word else ''}记住要注意词汇的细微差别和使用语境。想要更多练习吗？"
    
    elif '例句' in message or 'example' in message_lower:
        if current_word:
            return f"理解'{current_word}'的用法需要看具体语境。我来给你一些实际例句，帮助你掌握正确用法。"
        else:
            return "例句确实很重要！它们帮助我们理解单词在实际语境中的使用。你想看哪个单词的例句？"
    
    elif '难' in message or 'difficult' in message_lower:
        return "GRE单词确实有挑战性，但不要担心！每个人都会遇到困难。关键是：\n1. 循序渐进，不要急于求成\n2. 反复复习，加深印象\n3. 多种方法结合使用\n4. 保持积极心态\n\n坚持下去，你一定可以的！💪"
    
    else:
        # 通用回复
        return f"我理解你的问题。{'关于' + current_word + '，' if current_word else ''}让我来帮你解答。如果你有具体的学习困惑，可以告诉我更多细节，我会提供更有针对性的建议。"

@app.route('/logout')
def logout():
    """Logout user and clear session"""
    session.clear()
    return redirect(url_for('language_selection'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8001)
