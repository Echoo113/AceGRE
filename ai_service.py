"""
AI Service Module for AceGRE
Handles integration with various AI providers for word learning features
"""

import os
import json
import requests
from typing import Dict, List, Optional

class AIService:
    def __init__(self):
        # API配置 - 在生产环境中应该从环境变量读取
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.ai_provider = os.getenv('AI_PROVIDER', 'openai')
        self.model_name = os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo')
        
    def generate_word_content(self, word: str, word_info: Dict) -> Dict:
        """
        使用AI生成单词学习内容
        包括：词根词缀解析、记忆方法、同义词练习等
        """
        try:
            if self.ai_provider == 'openai':
                return self._generate_with_openai(word, word_info)
            elif self.ai_provider == 'zhipu':
                return self._generate_with_zhipu(word, word_info)
            else:
                # 如果没有配置AI API，返回默认内容
                return self._generate_fallback_content(word, word_info)
        except Exception as e:
            print(f"AI generation error: {e}")
            return self._generate_fallback_content(word, word_info)
    
    def _generate_with_openai(self, word: str, word_info: Dict) -> Dict:
        """使用OpenAI API生成内容"""
        
        prompt = self._create_word_prompt(word, word_info)
        
        try:
            from openai import OpenAI
            
            client = OpenAI(api_key=self.openai_api_key)
            
            response = client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": "You are an expert GRE vocabulary tutor. Generate educational content for word learning in JSON format."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.7
            )
            
            content = response.choices[0].message.content
            return self._parse_ai_response(content, word, word_info)
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return self._generate_fallback_content(word, word_info)
    
    def _generate_with_zhipu(self, word: str, word_info: Dict) -> Dict:
        """使用智谱AI API生成内容"""
        # 智谱AI API集成示例
        api_key = os.getenv('ZHIPU_API_KEY', '')
        
        if not api_key:
            return self._generate_fallback_content(word, word_info)
        
        url = "https://open.bigmodel.cn/api/paas/v3/model-api/chatglm_turbo/invoke"
        
        prompt = self._create_word_prompt(word, word_info)
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "prompt": prompt,
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        try:
            response = requests.post(url, headers=headers, json=data, timeout=10)
            if response.status_code == 200:
                result = response.json()
                content = result.get('data', {}).get('choices', [{}])[0].get('content', '')
                return self._parse_ai_response(content, word, word_info)
            else:
                return self._generate_fallback_content(word, word_info)
        except Exception as e:
            print(f"Zhipu API error: {e}")
            return self._generate_fallback_content(word, word_info)
    
    def _create_word_prompt(self, word: str, word_info: Dict) -> str:
        """创建AI提示词"""
        return f"""
        请为GRE单词 "{word}" 生成以下学习内容，要求准确、有趣、易记：

        单词信息：
        - 发音：{word_info.get('pronunciation', '')}
        - 英文释义：{word_info.get('definition_en', '')}
        - 中文释义：{word_info.get('definition_zh', '')}
        
        请生成：
        1. 词根词缀分析（如果有的话）：
           - 拆解词根、前缀、后缀
           - 每个部分的含义
           - 组合后的含义解释

        2. 记忆方法（请提供3种）：
           - 联想记忆法：编写一个有趣的小故事
           - 谐音记忆法：利用谐音帮助记忆
           - 视觉记忆法：创造形象的画面联想

        3. 6个同义词选项（用于六选二练习）：
           - 包含2个正确同义词
           - 4个干扰选项（意思相近但不完全相同）

        4. 4个释义选项（用于释义练习）：
           - 1个正确释义
           - 3个错误但相似的释义

        请以JSON格式返回，包含以下字段：
        etymology_parts, etymology_explanation, memory_story, memory_phonetic, memory_visual, 
        synonym_options, correct_synonyms, definition_options, correct_definition_index
        """
    
    def _parse_ai_response(self, content: str, word: str, word_info: Dict) -> Dict:
        """解析AI响应并格式化"""
        try:
            # 尝试解析JSON响应
            if content.strip().startswith('{'):
                ai_data = json.loads(content)
            else:
                # 如果不是JSON格式，手动解析
                ai_data = self._manual_parse_response(content)
            
            # 更新原始单词信息
            enhanced_info = word_info.copy()
            
            # 词根词缀
            if 'etymology_parts' in ai_data:
                enhanced_info['etymology'] = {
                    'parts': ai_data['etymology_parts'],
                    'explanation': ai_data.get('etymology_explanation', '')
                }
            
            # 记忆方法
            enhanced_info['memory_story'] = ai_data.get('memory_story', word_info.get('memory_story', ''))
            enhanced_info['memory_phonetic'] = ai_data.get('memory_phonetic', word_info.get('memory_phonetic', ''))
            enhanced_info['memory_visual'] = ai_data.get('memory_visual', word_info.get('memory_visual', ''))
            
            # 同义词选项
            if 'synonym_options' in ai_data:
                enhanced_info['synonym_options'] = ai_data['synonym_options']
                enhanced_info['synonyms'] = ai_data.get('correct_synonyms', [0, 1])
            
            # 释义选项
            if 'definition_options' in ai_data:
                enhanced_info['definition_options'] = ai_data['definition_options']
                enhanced_info['correct_definition'] = ai_data.get('correct_definition_index', 0)
            
            return enhanced_info
            
        except Exception as e:
            print(f"Response parsing error: {e}")
            return word_info
    
    def _manual_parse_response(self, content: str) -> Dict:
        """手动解析非JSON格式的AI响应"""
        # 简单的文本解析逻辑
        result = {}
        
        lines = content.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if '词根词缀' in line or 'etymology' in line.lower():
                current_section = 'etymology'
            elif '联想记忆' in line or 'story' in line.lower():
                current_section = 'story'
            elif '谐音记忆' in line or 'phonetic' in line.lower():
                current_section = 'phonetic'
            elif '视觉记忆' in line or 'visual' in line.lower():
                current_section = 'visual'
            elif line and current_section:
                if current_section == 'story':
                    result['memory_story'] = line
                elif current_section == 'phonetic':
                    result['memory_phonetic'] = line
                elif current_section == 'visual':
                    result['memory_visual'] = line
        
        return result
    
    def _generate_fallback_content(self, word: str, word_info: Dict) -> Dict:
        """生成默认内容（当AI API不可用时）"""
        
        # 扩展现有的记忆方法
        fallback_memories = {
            'abstruse': {
                'story': f"想象一个抽象艺术家画了一幅非常'{word}'的画，连他自己都看不懂！",
                'phonetic': f"'{word}'听起来像'爱不死你'，爱得太深奥难懂！",
                'visual': f"画面：一个迷宫般复杂的'{word[:3].upper()}'标志，让人困惑不解"
            },
            'ameliorate': {
                'story': f"Amy的柠檬水很难喝，她努力'{word}'改善配方，终于变得美味！",
                'phonetic': f"'{word}'像'Amy来优化'，Amy来优化让一切变得更好！",
                'visual': f"想象'{word[:4].upper()}'牌神奇药水，能让任何东西都变得更好"
            }
        }
        
        # 使用预设内容或生成简单内容
        if word in fallback_memories:
            memory_data = fallback_memories[word]
            word_info['memory_story'] = memory_data['story']
            word_info['memory_phonetic'] = memory_data['phonetic'] 
            word_info['memory_visual'] = memory_data['visual']
        else:
            # 生成通用记忆方法
            word_info['memory_story'] = f"想象'{word}'这个词出现在一个有趣的故事中，帮助你记住它的含义：{word_info.get('definition_zh', '')}"
            word_info['memory_phonetic'] = f"'{word}'的发音可以联想到相似的中文词汇，帮助记忆"
            word_info['memory_visual'] = f"在脑海中创造一个与'{word}'含义相关的生动画面"
        
        return word_info

# 全局AI服务实例
ai_service = AIService()

def enhance_word_with_ai(word_data: Dict) -> Dict:
    """
    使用AI增强单词数据
    这是主要的API接口函数
    """
    return ai_service.generate_word_content(word_data['word'], word_data)

def generate_custom_exercise(word: str, exercise_type: str) -> Dict:
    """
    生成自定义练习
    exercise_type: 'synonym', 'definition', 'usage', 'antonym'
    """
    prompt = f"为单词'{word}'生成{exercise_type}练习，包含选项和正确答案"
    
    # 这里可以调用AI API生成练习
    # 暂时返回示例数据
    return {
        'question': f"What is the best {exercise_type} for '{word}'?",
        'options': ['Option A', 'Option B', 'Option C', 'Option D'],
        'correct_answer': 0
    }
