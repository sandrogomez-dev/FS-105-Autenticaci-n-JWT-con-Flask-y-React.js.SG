#!/usr/bin/env python3
"""
✅ VERIFICADOR DE REQUISITOS - Bootcamp JWT Authentication
Verifica que el proyecto cumple con todos los requisitos especificados
"""

import os
import sys
import json
import re
from pathlib import Path

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
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}")
    print(f"✅ {text}")
    print(f"{'='*60}{Colors.ENDC}")

def print_check(item, passed, details=""):
    status = f"{Colors.OKGREEN}✅ PASS" if passed else f"{Colors.FAIL}❌ FAIL"
    print(f"{status}{Colors.ENDC} - {item}")
    if details:
        print(f"   {Colors.OKCYAN}→ {details}{Colors.ENDC}")

def print_info(text):
    print(f"{Colors.OKBLUE}ℹ️  {text}{Colors.ENDC}")

def check_file_exists(file_path, description):
    """Verifica si un archivo existe"""
    exists = os.path.exists(file_path)
    print_check(f"{description}: {file_path}", exists)
    return exists

def check_file_contains(file_path, pattern, description):
    """Verifica si un archivo contiene un patrón específico"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            contains = bool(re.search(pattern, content, re.IGNORECASE | re.MULTILINE))
            print_check(f"{description}", contains, f"Pattern: {pattern[:50]}...")
            return contains
    except FileNotFoundError:
        print_check(f"{description}", False, f"File not found: {file_path}")
        return False
    except Exception as e:
        print_check(f"{description}", False, f"Error reading file: {e}")
        return False

def verify_backend_structure():
    """Verifica la estructura del backend"""
    print_header("BACKEND STRUCTURE VERIFICATION")
    
    checks = []
    
    # Flask app principal
    checks.append(check_file_exists("src/app.py", "Flask App"))
    checks.append(check_file_exists("src/api/routes.py", "API Routes"))
    checks.append(check_file_exists("src/api/models.py", "Database Models"))
    
    # Requirements
    checks.append(check_file_exists("requirements.txt", "Requirements File"))
    
    return all(checks)

def verify_frontend_structure():
    """Verifica la estructura del frontend"""
    print_header("FRONTEND STRUCTURE VERIFICATION")
    
    checks = []
    
    # Componentes requeridos
    checks.append(check_file_exists("src/front/pages/Login.jsx", "Login Component"))
    checks.append(check_file_exists("src/front/pages/Signup.jsx", "Signup Component"))
    checks.append(check_file_exists("src/front/pages/Private.jsx", "Private Component"))
    checks.append(check_file_exists("src/front/components/Navbar.jsx", "Navbar Component"))
    
    # Services folder
    checks.append(check_file_exists("src/front/services/user.js", "User Services"))
    
    # Store y routing
    checks.append(check_file_exists("src/front/store.js", "Store Configuration"))
    checks.append(check_file_exists("src/front/routes.jsx", "Routes Configuration"))
    
    return all(checks)

def verify_dependencies():
    """Verifica las dependencias necesarias"""
    print_header("DEPENDENCIES VERIFICATION")
    
    checks = []
    
    # Backend dependencies
    try:
        with open("requirements.txt", 'r') as f:
            requirements = f.read()
            
        checks.append(check_file_contains("requirements.txt", r"PyJWT", "PyJWT Library"))
        checks.append(check_file_contains("requirements.txt", r"flask-bcrypt", "Flask-Bcrypt Library"))
        checks.append(check_file_contains("requirements.txt", r"flask-cors", "Flask-CORS Library"))
        checks.append(check_file_contains("requirements.txt", r"flask==", "Flask Framework"))
        
    except:
        print_check("Requirements.txt readable", False)
    
    # Frontend dependencies
    try:
        with open("package.json", 'r') as f:
            package_json = json.load(f)
            
        dependencies = package_json.get('dependencies', {})
        
        checks.append(check_file_contains("package.json", r"react", "React Framework"))
        checks.append(check_file_contains("package.json", r"react-router", "React Router"))
        
    except:
        print_check("Package.json readable", False)
    
    return all(checks)

def verify_authentication_implementation():
    """Verifica la implementación de autenticación"""
    print_header("AUTHENTICATION IMPLEMENTATION")
    
    checks = []
    
    # Backend authentication
    checks.append(check_file_contains(
        "src/api/models.py", 
        r"bcrypt|set_password|check_password",
        "Bcrypt Password Hashing"
    ))
    
    checks.append(check_file_contains(
        "src/api/models.py",
        r"jwt|generate_token|verify_token",
        "JWT Token Implementation"
    ))
    
    checks.append(check_file_contains(
        "src/api/routes.py",
        r"/signup|/login|/validate-token",
        "Authentication Routes"
    ))
    
    checks.append(check_file_contains(
        "src/api/routes.py",
        r"@token_required|token_required",
        "Token Protection Decorator"
    ))
    
    # Frontend authentication
    checks.append(check_file_contains(
        "src/front/services/user.js",
        r"signup|login|validateToken",
        "User Service Functions"
    ))
    
    checks.append(check_file_contains(
        "src/front/services/user.js",
        r"sessionStorage",
        "SessionStorage Usage"
    ))
    
    checks.append(check_file_contains(
        "src/front/store.js",
        r"login|logout|signup",
        "Authentication Actions"
    ))
    
    return all(checks)

def verify_components():
    """Verifica los componentes específicos"""
    print_header("COMPONENT IMPLEMENTATION")
    
    checks = []
    
    # Login Component
    checks.append(check_file_contains(
        "src/front/pages/Login.jsx",
        r"email|password|handleSubmit",
        "Login Form Implementation"
    ))
    
    # Signup Component
    checks.append(check_file_contains(
        "src/front/pages/Signup.jsx",
        r"confirmPassword|password.*match",
        "Signup Password Confirmation"
    ))
    
    # Private Component
    checks.append(check_file_contains(
        "src/front/pages/Private.jsx",
        r"useEffect|validateToken|navigate",
        "Private Route Protection"
    ))
    
    # Navbar Authentication
    checks.append(check_file_contains(
        "src/front/components/Navbar.jsx",
        r"login|logout|signup",
        "Navbar Authentication Links"
    ))
    
    return all(checks)

def verify_routing():
    """Verifica la configuración de rutas"""
    print_header("ROUTING CONFIGURATION")
    
    checks = []
    
    checks.append(check_file_contains(
        "src/front/routes.jsx",
        r"/login.*Login",
        "Login Route"
    ))
    
    checks.append(check_file_contains(
        "src/front/routes.jsx",
        r"/signup.*Signup",
        "Signup Route"
    ))
    
    checks.append(check_file_contains(
        "src/front/routes.jsx",
        r"/private.*Private",
        "Private Route"
    ))
    
    return all(checks)

def verify_security_features():
    """Verifica características de seguridad"""
    print_header("SECURITY FEATURES")
    
    checks = []
    
    # CORS Configuration (verificar en routes.py si no está en app.py)
    cors_check = check_file_contains("src/app.py", r"CORS|flask_cors", "CORS in app.py")
    if not cors_check:
        cors_check = check_file_contains("src/api/routes.py", r"CORS|flask_cors|@cross_origin", "CORS in routes.py")
    checks.append(cors_check)
    
    # JWT Secret
    checks.append(check_file_contains(
        "src/app.py",
        r"JWT_SECRET_KEY|SECRET_KEY",
        "JWT Secret Configuration"
    ))
    
    # Password Validation
    checks.append(check_file_contains(
        "src/front/pages/Signup.jsx",
        r"password.*length|validation",
        "Frontend Password Validation"
    ))
    
    return all(checks)

def generate_report(results):
    """Genera un reporte de verificación"""
    print_header("VERIFICATION REPORT")
    
    total_checks = sum(len(result) for result in results.values())
    passed_checks = sum(sum(result) for result in results.values())
    
    print(f"{Colors.BOLD}📊 SUMMARY:{Colors.ENDC}")
    print(f"   Total Checks: {total_checks}")
    print(f"   Passed: {Colors.OKGREEN}{passed_checks}{Colors.ENDC}")
    print(f"   Failed: {Colors.FAIL}{total_checks - passed_checks}{Colors.ENDC}")
    print(f"   Success Rate: {Colors.OKGREEN}{(passed_checks/total_checks)*100:.1f}%{Colors.ENDC}")
    
    print(f"\n{Colors.BOLD}📋 DETAILED RESULTS:{Colors.ENDC}")
    for category, checks in results.items():
        category_passed = sum(checks)
        category_total = len(checks)
        status = "✅" if category_passed == category_total else "⚠️"
        print(f"   {status} {category}: {category_passed}/{category_total}")
    
    if passed_checks == total_checks:
        print(f"\n{Colors.OKGREEN}{Colors.BOLD}🎉 ALL REQUIREMENTS VERIFIED SUCCESSFULLY!")
        print("The project is ready for bootcamp submission.{Colors.ENDC}")
    else:
        print(f"\n{Colors.WARNING}{Colors.BOLD}⚠️  SOME REQUIREMENTS NOT MET")
        print("Please address the failed checks above.{Colors.ENDC}")
    
    return passed_checks == total_checks

def main():
    """Función principal de verificación"""
    print(f"\n{Colors.BOLD}{Colors.HEADER}")
    print("🔍 BOOTCAMP REQUIREMENTS VERIFICATION")
    print("=" * 60)
    print("Checking JWT Authentication Project Compliance")
    print(f"{'='*60}{Colors.ENDC}")
    
    # Verificar directorio actual
    if not os.path.exists("src"):
        print(f"{Colors.FAIL}❌ Error: Run this script from the project root directory{Colors.ENDC}")
        sys.exit(1)
    
    print_info("Starting comprehensive requirements verification...")
    
    # Ejecutar todas las verificaciones
    results = {}
    
    print_info("Checking backend structure...")
    results['Backend Structure'] = [verify_backend_structure()]
    
    print_info("Checking frontend structure...")
    results['Frontend Structure'] = [verify_frontend_structure()]
    
    print_info("Checking dependencies...")
    results['Dependencies'] = [verify_dependencies()]
    
    print_info("Checking authentication implementation...")
    results['Authentication'] = [verify_authentication_implementation()]
    
    print_info("Checking components...")
    results['Components'] = [verify_components()]
    
    print_info("Checking routing...")
    results['Routing'] = [verify_routing()]
    
    print_info("Checking security features...")
    results['Security'] = [verify_security_features()]
    
    # Generar reporte final
    success = generate_report(results)
    
    if success:
        print(f"\n{Colors.OKGREEN}✅ Project verification completed successfully!{Colors.ENDC}")
        sys.exit(0)
    else:
        print(f"\n{Colors.FAIL}❌ Project verification found issues. Please fix and re-run.{Colors.ENDC}")
        sys.exit(1)

if __name__ == "__main__":
    main() 