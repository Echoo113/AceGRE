#!/usr/bin/env python3
"""
本地开发环境设置脚本
用于配置API密钥等敏感信息
"""

import os

def setup_local_config():
    """设置本地配置"""
    print("🔧 AceGRE 本地配置设置")
    print("=" * 40)
    
    # OpenAI API 密钥
    current_key = os.getenv('OPENAI_API_KEY', '')
    if current_key:
        print(f"✅ 当前OpenAI API密钥: {current_key[:10]}...")
        use_current = input("是否使用当前密钥? (y/n): ").lower().strip()
        if use_current != 'y':
            current_key = ''
    
    if not current_key:
        api_key = input("请输入你的OpenAI API密钥: ").strip()
        if api_key:
            # 更新ai_service.py中的密钥
            update_api_key_in_file(api_key)
            print(f"✅ API密钥已设置: {api_key[:10]}...")
        else:
            print("⚠️  跳过API密钥设置，将使用默认内容")
    
    print("\n🎉 配置完成！")
    print("现在可以运行: python app.py")

def update_api_key_in_file(api_key):
    """更新ai_service.py中的API密钥"""
    try:
        with open('ai_service.py', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 替换API密钥
        old_line = "self.openai_api_key = os.getenv('OPENAI_API_KEY', 'your_openai_api_key_here')"
        new_line = f"self.openai_api_key = os.getenv('OPENAI_API_KEY', '{api_key}')"
        
        if old_line in content:
            content = content.replace(old_line, new_line)
            
            with open('ai_service.py', 'w', encoding='utf-8') as f:
                f.write(content)
            
            print("✅ ai_service.py 已更新")
        else:
            print("⚠️  未找到需要更新的行，请手动设置")
            
    except Exception as e:
        print(f"❌ 更新失败: {e}")
        print("请手动在ai_service.py第14行设置API密钥")

if __name__ == "__main__":
    setup_local_config()
