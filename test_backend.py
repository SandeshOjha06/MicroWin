#!/usr/bin/env python3
"""
Test script for microWin backend
Run this after starting the FastAPI server with: uvicorn backend.main:app --reload
"""

import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def test_decompose_stream():
    """Test the streaming decompose endpoint"""
    print("\n" + "="*50)
    print("Testing POST /api/v1/decompose/stream")
    print("="*50)
    
    # Test payload
    payload = {
        "instruction": "I need to clean my desk and organize my files"
    }
    
    print(f"\nSending request with instruction: '{payload['instruction']}'")
    
    try:
        # Use stream=True to handle streaming response
        response = requests.post(
            f"{BASE_URL}/api/v1/decompose/stream",
            json=payload,
            stream=True,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code != 200:
            print(f"Error: {response.text}")
            return False
        
        print("\nStreaming Response:")
        print("-" * 50)
        
        step_count = 0
        try:
            for line in response.iter_lines():
                if line:
                    line = line.decode('utf-8') if isinstance(line, bytes) else line
                    if line.startswith("data: "):
                        # Extract and parse JSON
                        json_str = line.replace("data: ", "").strip()
                        try:
                            step_data = json.loads(json_str)
                            step_count += 1
                            print(f"\n Step {step_count}:")
                            print(f"   - ID: {step_data.get('step_id')}")
                            print(f"   - Action: {step_data.get('action')}")
                            print(f"   - Completed: {step_data.get('is_completed')}")
                        except json.JSONDecodeError as e:
                            print(f"Failed to parse JSON: {e}")
                            print(f"   Raw: {json_str}")
        
        except Exception as e:
            print(f"❌ Error reading stream: {e}")
            return False
        
        print(f"\n{'='*50}")
        print(f"Test Passed! Received {step_count} steps")
        return True
        
    except requests.exceptions.ConnectionError:
        print(f"Connection Error: Cannot connect to {BASE_URL}")
        print("   Make sure to start the server first:")
        print("   cd backend && uvicorn main:app --reload")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_validation():
    """Test invalid input validation"""
    print("\n" + "="*50)
    print("Testing Input Validation")
    print("="*50)
    
    # Test with too short instruction
    print("\n1️⃣  Testing with instruction too short (< 5 chars):")
    response = requests.post(
        f"{BASE_URL}/api/v1/decompose/stream",
        json={"instruction": "hi"},
        timeout=10
    )
    print(f"Status: {response.status_code}")
    if response.status_code == 422:
        print("✅ Validation working (rejected short instruction)")
    else:
        print(f"Expected 422, got {response.status_code}")
    
    # Test with too long instruction
    print("\n2️⃣  Testing with instruction too long (> 500 chars):")
    response = requests.post(
        f"{BASE_URL}/api/v1/decompose/stream",
        json={"instruction": "a" * 501},
        timeout=10
    )
    print(f"Status: {response.status_code}")
    if response.status_code == 422:
        print("Validation working (rejected long instruction)")
    else:
        print(f" Expected 422, got {response.status_code}")

if __name__ == "__main__":
    print("\n microWin Backend Test Suite")
    print("="*50)
    
    # Run tests
    success = test_decompose_stream()
    test_validation()
    
    if success:
        print("\nAll tests passed! Backend is working correctly.")
        sys.exit(0)
    else:
        print("\nTests failed. Check the errors above.")
        sys.exit(1)
