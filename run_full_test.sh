#!/bin/bash

# 🧪 SCRIPT DE TESTING COMPLETO
# Inicia servidores y ejecuta todos los tests

echo "🚀 INICIANDO TESTING COMPLETO DEL SISTEMA JWT"
echo "=============================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "src/app.py" ]; then
    print_error "Error: Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

print_status "Verificando dependencias..."

# Verificar Python
if ! command -v python &> /dev/null; then
    print_error "Python no está instalado"
    exit 1
fi

# Verificar Node
if ! command -v npm &> /dev/null; then
    print_error "Node.js/npm no está instalado"
    exit 1
fi

print_success "Dependencias verificadas"

# 1. VERIFICACIÓN DE REQUISITOS
print_status "Ejecutando verificación de requisitos..."
python verify_requirements.py
if [ $? -ne 0 ]; then
    print_error "Verificación de requisitos falló"
    exit 1
fi
print_success "Todos los requisitos verificados"

# 2. INSTALAR DEPENDENCIAS FRONTEND
print_status "Instalando dependencias del frontend..."
npm install --silent
if [ $? -ne 0 ]; then
    print_warning "Algunas dependencias del frontend pueden faltar"
fi

# 3. INICIAR SERVIDOR BACKEND
print_status "Iniciando servidor Flask en puerto 3001..."
python src/app.py &
FLASK_PID=$!

# Esperar a que Flask inicie
sleep 5

# Verificar que Flask está corriendo
if ! curl -s http://localhost:3001/ > /dev/null; then
    print_error "Flask no pudo iniciarse en puerto 3001"
    kill $FLASK_PID 2>/dev/null
    exit 1
fi
print_success "Servidor Flask iniciado (PID: $FLASK_PID)"

# 4. EJECUTAR TESTS DE API
print_status "Ejecutando tests automatizados de API..."
python test_api.py
API_TEST_RESULT=$?

# 5. INICIAR SERVIDOR FRONTEND
print_status "Iniciando servidor React en puerto 3000..."
npm start &
REACT_PID=$!

# Esperar a que React inicie
sleep 10

# Verificar que React está corriendo
if ! curl -s http://localhost:3000/ > /dev/null; then
    print_warning "React no pudo iniciarse en puerto 3000"
    REACT_RUNNING=false
else
    print_success "Servidor React iniciado (PID: $REACT_PID)"
    REACT_RUNNING=true
fi

# 6. MOSTRAR RESUMEN
echo ""
echo "🎯 RESUMEN DE TESTING"
echo "===================="

if [ $API_TEST_RESULT -eq 0 ]; then
    print_success "API Tests: PASSED"
else
    print_error "API Tests: FAILED"
fi

if [ "$REACT_RUNNING" = true ]; then
    print_success "Frontend: RUNNING"
    echo ""
    print_status "Servidores activos:"
    echo "   🔧 Backend:  http://localhost:3001"
    echo "   🌐 Frontend: http://localhost:3000"
    echo ""
    print_status "Para testing manual, abre tu navegador en:"
    echo "   http://localhost:3000"
    echo ""
    print_warning "Presiona Ctrl+C para detener todos los servidores"
    
    # Mantener script corriendo hasta Ctrl+C
    trap 'print_status "Deteniendo servidores..."; kill $FLASK_PID $REACT_PID 2>/dev/null; exit 0' INT
    
    # Mostrar instrucciones de testing manual
    echo ""
    echo "📋 TESTING MANUAL DISPONIBLE:"
    echo "1. Ir a http://localhost:3000/signup - Registrar usuario"
    echo "2. Ir a http://localhost:3000/login - Iniciar sesión"
    echo "3. Ir a http://localhost:3000/private - Área protegida"
    echo "4. Probar logout desde navbar"
    echo ""
    echo "📖 Ver TESTING_MANUAL.md para guía completa"
    
    # Esperar indefinidamente
    while true; do
        sleep 1
    done
else
    print_error "Frontend: FAILED TO START"
fi

# Cleanup
print_status "Limpiando procesos..."
kill $FLASK_PID 2>/dev/null
if [ "$REACT_RUNNING" = true ]; then
    kill $REACT_PID 2>/dev/null
fi

if [ $API_TEST_RESULT -eq 0 ] && [ "$REACT_RUNNING" = true ]; then
    print_success "TESTING COMPLETO: EXITOSO"
    exit 0
else
    print_error "TESTING COMPLETO: CON ERRORES"
    exit 1
fi 