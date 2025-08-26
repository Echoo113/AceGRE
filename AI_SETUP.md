# AceGRE AI 集成配置指南

## 概述
AceGRE 已集成AI大模型API支持，可以为单词学习提供智能化的内容生成，包括：
- 词根词缀分析
- 记忆方法生成（联想故事、谐音记忆、视觉记忆）
- GRE六选二同义词练习
- 释义练习题目
- AI聊天助手

## 支持的AI提供商

### 1. OpenAI API (推荐)
- 模型：GPT-3.5-turbo / GPT-4
- 配置位置：`ai_service.py`
- 环境变量：`OPENAI_API_KEY`

### 2. 智谱AI (国内)
- 模型：ChatGLM
- 适合国内用户
- 环境变量：`ZHIPU_API_KEY`

### 3. 其他大模型
- 百度文心一言
- 阿里通义千问
- 腾讯混元
- Claude (Anthropic)

## 配置步骤

### 方法1：环境变量配置
```bash
# 在系统环境变量中设置
export OPENAI_API_KEY="your_openai_api_key_here"
export AI_PROVIDER="openai"
export OPENAI_MODEL="gpt-3.5-turbo"
```

### 方法2：直接修改代码
在 `ai_service.py` 文件中：
```python
# 第13-15行
self.openai_api_key = "你的实际API密钥"
self.ai_provider = "openai"  # openai, zhipu, baidu等
self.model_name = "gpt-3.5-turbo"
```

### 方法3：使用配置文件
创建 `config.json`：
```json
{
    "ai": {
        "provider": "openai",
        "api_key": "your_api_key_here",
        "model": "gpt-3.5-turbo"
    }
}
```

## API接入点说明

### 1. 随机单词获取 (自动AI增强)
- **路由**: `POST /api/word/random`
- **AI增强**: 自动调用AI生成记忆方法和练习题
- **位置**: `app.py` 第327行

### 2. 单词内容增强
- **路由**: `POST /api/word/enhance`
- **功能**: 按需生成特定类型的AI内容
- **参数**: `content_type` (memory, etymology, all)

### 3. AI聊天助手
- **路由**: `POST /api/ai/chat`
- **功能**: 回答用户关于单词学习的问题
- **支持上下文**: 当前学习的单词

### 4. 前端AI功能
- **AI增强按钮**: 记忆方法模块和词根词缀模块
- **快速提问**: 记忆技巧、词根分析、例句、同义词
- **位置**: `word_learning.js` 第419行开始

## 使用示例

### 获取AI增强的单词内容
```javascript
// 前端调用
const response = await fetch('/api/word/enhance', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        word: 'abstruse',
        content_type: 'memory'
    })
});
```

### AI聊天
```javascript
// 前端调用
const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        message: '这个单词怎么记忆？',
        context: {current_word: 'abstruse'}
    })
});
```

## 备用方案
如果没有配置AI API密钥，系统会自动使用内置的fallback内容：
- 预设的记忆方法
- 基础词根词缀分析
- 智能关键词匹配回复

## 安装依赖
```bash
pip install openai==1.3.0 requests==2.31.0 python-dotenv==1.0.0
```

## 成本优化建议
1. 使用GPT-3.5-turbo而非GPT-4（成本更低）
2. 设置适当的max_tokens限制（1000左右）
3. 实现缓存机制避免重复调用
4. 考虑使用国内AI服务商（成本更低）

## 安全注意事项
1. 不要在代码中硬编码API密钥
2. 使用环境变量或配置文件
3. 在生产环境中使用HTTPS
4. 实现API调用频率限制

## 故障排除
1. **API密钥错误**: 检查密钥是否正确设置
2. **网络连接问题**: 确保服务器可以访问AI API
3. **配额不足**: 检查API使用配额
4. **模型不存在**: 确认使用的模型名称正确

配置完成后，重启Flask应用即可开始使用AI功能！
