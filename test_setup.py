#!/usr/bin/env python3
"""
Test script to verify the setup is working correctly
"""

import os
from dotenv import load_dotenv

def test_setup():
    """Test if the setup is working correctly"""
    print("🧪 Testing setup...")
    
    # Load environment variables
    load_dotenv()
    
    # Check if OpenAI API key is set
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("❌ Error: OPENAI_API_KEY not found in environment variables")
        print("Please create a .env file with your OpenAI API key")
        return False
    
    if api_key.startswith("sk-"):
        print("✅ OpenAI API key found and looks valid")
    else:
        print("⚠️  OpenAI API key found but format looks unusual")
    
    # Check if required packages are installed
    try:
        import openai
        print("✅ OpenAI package installed")
    except ImportError:
        print("❌ OpenAI package not installed. Run: pip install -r requirements.txt")
        return False
    
    try:
        import requests
        print("✅ Requests package installed")
    except ImportError:
        print("❌ Requests package not installed. Run: pip install -r requirements.txt")
        return False
    
    # Check if images directory exists
    image_dir = "images"
    if not os.path.exists(image_dir):
        os.makedirs(image_dir)
        print(f"✅ Created images directory: {image_dir}")
    else:
        print(f"✅ Images directory exists: {image_dir}")
    
    print("\n🎉 Setup test completed successfully!")
    print("You can now run: python generate_images.py")
    
    return True

if __name__ == "__main__":
    test_setup() 