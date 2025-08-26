# 🔧 AceGRE 配置指南

## API密钥配置

为了使用AI功能，你需要配置OpenAI API密钥。

### 方法1: 环境变量（推荐）
```bash
export OPENAI_API_KEY="your_actual_api_key_here"
export AI_PROVIDER="openai"
export OPENAI_MODEL="gpt-3.5-turbo"
```

### 方法2: 直接修改代码
在 `ai_service.py` 第14行：
```python
self.openai_api_key = "your_actual_api_key_here"
```

⚠️ **重要**: 
- 不要将真实的API密钥提交到GitHub
- 使用环境变量是最安全的方法
- 如果修改代码，记得不要提交包含密钥的文件

## 快速开始

1. 克隆仓库后，安装依赖：
```bash
pip install -r requirements.txt
```

2. 配置API密钥（见上方）

3. 运行应用：
```bash
python app.py
```

4. 访问：`http://localhost:8001`

## 没有API密钥？

系统会自动使用预设的学习内容，功能仍然可用，只是AI增强功能会被禁用。
