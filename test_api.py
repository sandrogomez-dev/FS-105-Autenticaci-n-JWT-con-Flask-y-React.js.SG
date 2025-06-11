#!/usr/bin/env python3
"""
🧪 SCRIPT DE TESTING AUTOMATIZADO - API Backend
Prueba automática de todos los endpoints de autenticación
"""

import requests
import json
import sys
import time
from datetime import datetime

# Configuración
BASE_URL = "http://localhost:3001/api"
TEST_USER = {
    "email": "test@automated.com",
    "password": "TestPassword123!"
}

class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*50}")
    print(f"🧪 {text}")
    print(f"{'='*50}{Colors.ENDC}")

def print_test(test_name, passed, details=""):
    status = f"{Colors.OKGREEN}✅ PASSED" if passed else f"{Colors.FAIL}❌ FAILED"
    print(f"{status}{Colors.ENDC} - {test_name}")
    if details:
        print(f"   {Colors.OKCYAN}→ {details}{Colors.ENDC}")

def print_info(text):
    print(f"{Colors.OKBLUE}ℹ️  {text}{Colors.ENDC}")

def test_server_connection():
    """Test si el servidor está corriendo"""
    print_header("TESTING SERVER CONNECTION")
    try:
        response = requests.get(f"{BASE_URL.replace('/api', '')}/", timeout=5)
        print_test("Server Connection", True, f"Status: {response.status_code}")
        return True
    except requests.exceptions.RequestException as e:
        print_test("Server Connection", False, f"Error: {e}")
        return False

def test_signup():
    """Test endpoint de registro"""
    print_header("TESTING USER SIGNUP")
    
    # Test 1: Signup exitoso
    try:
        response = requests.post(
            f"{BASE_URL}/signup",
            json=TEST_USER,
            timeout=10
        )
        
        if response.status_code == 201:
            print_test("User Signup", True, "User created successfully")
            return True
        elif response.status_code == 400 and "already exists" in response.text:
            print_test("User Signup", True, "User already exists (expected)")
            return True
        else:
            print_test("User Signup", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_test("User Signup", False, f"Request error: {e}")
        return False
    
    # Test 2: Signup con datos inválidos
    try:
        invalid_data = {"email": "invalid", "password": ""}
        response = requests.post(
            f"{BASE_URL}/signup",
            json=invalid_data,
            timeout=10
        )
        
        if response.status_code == 400:
            print_test("Signup Validation", True, "Invalid data rejected")
        else:
            print_test("Signup Validation", False, f"Should reject invalid data, got: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print_test("Signup Validation", False, f"Request error: {e}")

def test_login():
    """Test endpoint de login"""
    print_header("TESTING USER LOGIN")
    
    # Test 1: Login exitoso
    try:
        response = requests.post(
            f"{BASE_URL}/login",
            json=TEST_USER,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'token' in data and 'user' in data:
                print_test("User Login", True, "Login successful with token")
                return data['token']
            else:
                print_test("User Login", False, "Missing token or user in response")
                return None
        else:
            print_test("User Login", False, f"Status: {response.status_code}, Response: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print_test("User Login", False, f"Request error: {e}")
        return None
    
    # Test 2: Login con credenciales incorrectas
    try:
        wrong_credentials = {"email": TEST_USER["email"], "password": "wrongpassword"}
        response = requests.post(
            f"{BASE_URL}/login",
            json=wrong_credentials,
            timeout=10
        )
        
        if response.status_code == 401:
            print_test("Login Validation", True, "Wrong credentials rejected")
        else:
            print_test("Login Validation", False, f"Should reject wrong credentials, got: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print_test("Login Validation", False, f"Request error: {e}")

def test_protected_routes(token):
    """Test rutas protegidas"""
    print_header("TESTING PROTECTED ROUTES")
    
    if not token:
        print_test("Protected Routes", False, "No token available")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test 1: Validar token
    try:
        response = requests.get(
            f"{BASE_URL}/validate-token",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('valid'):
                print_test("Token Validation", True, "Token is valid")
            else:
                print_test("Token Validation", False, "Token marked as invalid")
        else:
            print_test("Token Validation", False, f"Status: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print_test("Token Validation", False, f"Request error: {e}")
    
    # Test 2: Obtener perfil
    try:
        response = requests.get(
            f"{BASE_URL}/profile",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'email' in data:
                print_test("Profile Access", True, f"Profile retrieved for: {data['email']}")
            else:
                print_test("Profile Access", False, "Missing email in profile response")
        else:
            print_test("Profile Access", False, f"Status: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print_test("Profile Access", False, f"Request error: {e}")
    
    # Test 3: Acceso sin token
    try:
        response = requests.get(
            f"{BASE_URL}/profile",
            timeout=10
        )
        
        if response.status_code == 401:
            print_test("No Token Protection", True, "Access denied without token")
        else:
            print_test("No Token Protection", False, f"Should deny access without token, got: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print_test("No Token Protection", False, f"Request error: {e}")

def test_security():
    """Test aspectos de seguridad"""
    print_header("TESTING SECURITY FEATURES")
    
    # Test 1: Token inválido
    try:
        invalid_headers = {"Authorization": "Bearer invalid-token-here"}
        response = requests.get(
            f"{BASE_URL}/profile",
            headers=invalid_headers,
            timeout=10
        )
        
        if response.status_code == 401:
            print_test("Invalid Token Rejection", True, "Invalid token rejected")
        else:
            print_test("Invalid Token Rejection", False, f"Should reject invalid token, got: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print_test("Invalid Token Rejection", False, f"Request error: {e}")
    
    # Test 2: CORS Headers
    try:
        response = requests.options(f"{BASE_URL}/login", timeout=10)
        cors_header = response.headers.get('Access-Control-Allow-Origin')
        
        if cors_header:
            print_test("CORS Configuration", True, f"CORS enabled: {cors_header}")
        else:
            print_test("CORS Configuration", False, "No CORS headers found")
            
    except requests.exceptions.RequestException as e:
        print_test("CORS Configuration", False, f"Request error: {e}")

def main():
    """Función principal de testing"""
    print(f"\n{Colors.BOLD}{Colors.HEADER}")
    print("🚀 AUTOMATED API TESTING SUITE")
    print("=" * 50)
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Target: {BASE_URL}")
    print(f"{'='*50}{Colors.ENDC}")
    
    # Verificar conexión al servidor
    if not test_server_connection():
        print(f"\n{Colors.FAIL}❌ Cannot connect to server. Make sure Flask is running on port 3001{Colors.ENDC}")
        sys.exit(1)
    
    print_info("Server is running, proceeding with tests...")
    time.sleep(1)
    
    # Ejecutar tests
    test_signup()
    time.sleep(1)
    
    token = test_login()
    time.sleep(1)
    
    test_protected_routes(token)
    time.sleep(1)
    
    test_security()
    
    # Resumen final
    print_header("TESTING COMPLETED")
    print(f"{Colors.OKGREEN}✅ All automated tests completed!")
    print(f"📋 Check the results above for any failures")
    print(f"🔍 Run manual tests from TESTING_MANUAL.md for complete validation{Colors.ENDC}")

if __name__ == "__main__":
    main() 