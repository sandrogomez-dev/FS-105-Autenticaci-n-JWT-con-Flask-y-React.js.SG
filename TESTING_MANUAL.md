# 🧪 GUÍA DE TESTING MANUAL - Sistema de Autenticación JWT

## 📋 **CHECKLIST DE REQUISITOS**

### ✅ **Requisitos Técnicos**

- [ ] Backend Flask con autenticación JWT
- [ ] Frontend React con componentes específicos
- [ ] Bcrypt para encriptación de contraseñas
- [ ] Services folder con user.js
- [ ] sessionStorage para persistencia de tokens
- [ ] Rutas protegidas implementadas

### ✅ **Componentes Requeridos**

- [ ] `/signup` - Componente Signup
- [ ] `/login` - Componente Login
- [ ] `/private` - Componente Private (protegido)
- [ ] Navbar con links de autenticación
- [ ] Services/user.js con funciones API

---

## 🚀 **PLAN DE TESTING PASO A PASO**

### **PASO 1: Verificar Estructura del Proyecto**

```bash
# Verificar estructura backend
ls -la src/
ls -la src/api/

# Verificar estructura frontend
ls -la src/front/js/
ls -la src/front/js/component/
ls -la src/front/js/services/
```

### **PASO 2: Iniciar Servidores**

#### **Backend (Terminal 1)**

```bash
# Desde la raíz del proyecto
python src/app.py
```

**Expectativa**: Servidor corriendo en http://localhost:3001

#### **Frontend (Terminal 2)**

```bash
# Desde la raíz del proyecto
npm start
```

**Expectativa**: Servidor corriendo en http://localhost:3000

---

## 🔐 **TESTING DE AUTENTICACIÓN**

### **TEST 1: Registro de Usuario (Signup)**

#### **Pasos**:

1. Ir a `http://localhost:3000/signup`
2. Completar formulario:
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Hacer clic en "Sign Up"

#### **Verificaciones**:

- [ ] Formulario muestra validación en tiempo real
- [ ] Passwords coinciden antes de enviar
- [ ] Redirección a `/login` después del registro
- [ ] Mensaje de éxito visible
- [ ] No se guarda token en sessionStorage (registro exitoso)

#### **Casos Edge a Probar**:

- [ ] Passwords no coinciden → Mensaje de error
- [ ] Email inválido → Mensaje de error
- [ ] Campos vacíos → Validación requerida
- [ ] Usuario ya existe → Mensaje de error del servidor

---

### **TEST 2: Inicio de Sesión (Login)**

#### **Pasos**:

1. Ir a `http://localhost:3000/login`
2. Completar formulario:
   - Email: `test@example.com`
   - Password: `password123`
3. Hacer clic en "Login"

#### **Verificaciones**:

- [ ] Formulario funciona correctamente
- [ ] Redirección a `/private` después del login
- [ ] Token se guarda en sessionStorage
- [ ] Navbar cambia a mostrar "Logout"
- [ ] Estado global se actualiza con usuario

#### **Casos Edge a Probar**:

- [ ] Credenciales incorrectas → Mensaje de error
- [ ] Usuario no existe → Mensaje de error
- [ ] Campos vacíos → Validación requerida
- [ ] Servidor no disponible → Manejo de error

---

### **TEST 3: Página Privada (Protected Route)**

#### **Pasos**:

1. Después del login, verificar acceso a `/private`
2. Verificar contenido de la página
3. Cerrar sesión y intentar acceder directamente

#### **Verificaciones**:

- [ ] Página carga correctamente con usuario autenticado
- [ ] Muestra información del usuario
- [ ] Muestra mensaje de bienvenida personalizado
- [ ] Sin token válido → Redirección a `/login`
- [ ] Token expirado → Redirección a `/login`

---

### **TEST 4: Logout**

#### **Pasos**:

1. Estando logueado, hacer clic en "Logout"
2. Verificar limpieza de sesión

#### **Verificaciones**:

- [ ] Token se elimina de sessionStorage
- [ ] Estado global se resetea
- [ ] Redirección a página pública
- [ ] Navbar cambia a mostrar "Login/Signup"
- [ ] Acceso a `/private` ya no es posible

---

## 🔧 **TESTING DE SEGURIDAD**

### **TEST 5: Validación de Tokens**

#### **Verificaciones Manuales**:

1. **Token Válido**:

   ```javascript
   // En consola del navegador
   console.log(sessionStorage.getItem("token"));
   ```

   - [ ] Token existe después del login
   - [ ] Token es JWT válido (formato: xxx.yyy.zzz)

2. **Token Inválido**:

   ```javascript
   // Modificar token manualmente
   sessionStorage.setItem("token", "invalid-token");
   // Recargar página /private
   ```

   - [ ] Redirección automática a `/login`

3. **Sin Token**:
   ```javascript
   // Eliminar token
   sessionStorage.removeItem("token");
   // Intentar acceder a /private
   ```
   - [ ] Redirección automática a `/login`

---

### **TEST 6: Validación de Contraseñas (Bcrypt)**

#### **Verificación Backend**:

1. Registrar usuario con contraseña conocida
2. Revisar base de datos:
   ```python
   # En Python shell
   from src.api.models import User
   user = User.query.filter_by(email='test@example.com').first()
   print(user.password)  # Debe estar hasheada, no en texto plano
   ```

#### **Verificaciones**:

- [ ] Contraseña NO se guarda en texto plano
- [ ] Hash bcrypt es diferente en cada registro
- [ ] Login funciona con contraseña original
- [ ] Login falla con contraseña incorrecta

---

## 🌐 **TESTING DE API ENDPOINTS**

### **TEST 7: Endpoints del Backend**

#### **Usando cURL o Postman**:

1. **Signup**:

   ```bash
   curl -X POST http://localhost:3001/api/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"curl@test.com","password":"test123"}'
   ```

   **Expectativa**: `{"message": "User created successfully"}`

2. **Login**:

   ```bash
   curl -X POST http://localhost:3001/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"curl@test.com","password":"test123"}'
   ```

   **Expectativa**: `{"token": "eyJ0eXAiOiJKV1Q...", "user": {...}}`

3. **Validate Token**:

   ```bash
   curl -X GET http://localhost:3001/api/validate-token \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

   **Expectativa**: `{"valid": true, "user": {...}}`

4. **Profile**:
   ```bash
   curl -X GET http://localhost:3001/api/profile \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```
   **Expectativa**: Información del usuario

---

## 📱 **TESTING DE UX/UI**

### **TEST 8: Interfaz de Usuario**

#### **Verificaciones Bootstrap**:

- [ ] Formularios se ven correctamente estilizados
- [ ] Botones tienen hover effects
- [ ] Mensajes de error se muestran claramente
- [ ] Loading spinners aparecen durante requests
- [ ] Responsive design funciona en móvil

#### **Verificaciones de Navegación**:

- [ ] Links del navbar funcionan correctamente
- [ ] Redirecciones automáticas son fluidas
- [ ] Breadcrumbs o indicadores de estado
- [ ] Mensajes de feedback al usuario

---

## 🔄 **TESTING DE FLUJOS COMPLETOS**

### **TEST 9: Flujo Usuario Nuevo**

#### **Scenario**: Usuario visita por primera vez

1. Llegar a `/`
2. Click en "Sign Up"
3. Completar registro
4. Ser redirigido a login
5. Hacer login
6. Acceder a área privada
7. Hacer logout

#### **Verificaciones**:

- [ ] Cada paso funciona sin errores
- [ ] Mensajes de feedback apropiados
- [ ] Estado persiste entre recargas
- [ ] Experiencia fluida y intuitiva

### **TEST 10: Flujo Usuario Recurrente**

#### **Scenario**: Usuario vuelve después

1. Tener token válido en sessionStorage
2. Acceder directamente a `/private`
3. Verificar que no necesita login
4. Hacer logout
5. Intentar acceder a `/private` → Redirección

---

## 🐛 **TESTING DE EDGE CASES**

### **TEST 11: Casos Límite**

#### **Red/Conectividad**:

- [ ] Servidor backend apagado → Mensaje de error
- [ ] Timeout de requests → Mensaje apropiado
- [ ] Respuestas lentas → Loading states

#### **Datos Extremos**:

- [ ] Email muy largo → Validación
- [ ] Password muy corto → Validación
- [ ] Caracteres especiales en password → Funcionamiento
- [ ] Múltiples usuarios con mismos datos → Manejo de errores

#### **Navegador**:

- [ ] Funciona en Chrome, Firefox, Safari
- [ ] sessionStorage no disponible → Fallback
- [ ] JavaScript deshabilitado → Mensaje de error
- [ ] Recarga de página → Persistencia de estado

---

## ✅ **CRITERIOS DE ACEPTACIÓN**

### **Funcionalidad Mínima**:

- [ ] Registro de usuarios funcional
- [ ] Login con validación de credenciales
- [ ] Rutas protegidas con JWT
- [ ] Logout limpia la sesión
- [ ] Persistencia con sessionStorage

### **Seguridad**:

- [ ] Passwords encriptadas con bcrypt
- [ ] Tokens JWT válidos y verificados
- [ ] Rutas protegidas inaccesibles sin token
- [ ] Validación de input en frontend y backend

### **UX/UI**:

- [ ] Interfaz clara y funcional
- [ ] Mensajes de error informativos
- [ ] Loading states durante operaciones
- [ ] Responsive design básico

### **Código**:

- [ ] Services layer organizado
- [ ] Componentes reutilizables
- [ ] Manejo de errores consistente
- [ ] Código limpio y documentado

---

## 📝 **REPORTE DE TESTING**

### **Formato de Reporte**:

```
FECHA: ___________
TESTER: ___________

TESTS EJECUTADOS: ___/11
TESTS EXITOSOS: ___/11
TESTS FALLIDOS: ___/11

ISSUES ENCONTRADOS:
1. [SEVERIDAD] Descripción del problema
2. [SEVERIDAD] Descripción del problema

RECOMENDACIONES:
1. Descripción de mejora
2. Descripción de mejora

ESTADO GENERAL: ✅ APROBADO / ❌ REQUIERE CAMBIOS
```

---

## 🚨 **TROUBLESHOOTING COMÚN**

### **Problemas Típicos**:

1. **CORS Error**: Verificar flask-cors configurado
2. **Token no persiste**: Verificar sessionStorage
3. **Redirección infinita**: Verificar validación de tokens
4. **Styles no aplican**: Verificar Bootstrap importado
5. **API no responde**: Verificar puerto y servidor activo

### **Comandos de Debug**:

```bash
# Ver logs del servidor
tail -f logs/error.log

# Verificar base de datos
python -c "from src.api.models import User; print(User.query.all())"

# Limpiar sessionStorage
# En consola del navegador: sessionStorage.clear()
```

---

_Esta guía debe completarse al 100% antes de considerar el proyecto terminado y funcional._
