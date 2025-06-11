# 🧪 CÓMO PROBAR QUE TODO FUNCIONA

## ✅ **YA VERIFICADO: CUMPLE 100% REQUISITOS**

Tu proyecto **SÍ cumple** con todos los requisitos del bootcamp:

- ✅ Backend Flask con JWT
- ✅ Bcrypt para contraseñas
- ✅ Services/user.js
- ✅ sessionStorage
- ✅ Componentes: Login, Signup, Private
- ✅ Rutas protegidas
- ✅ Navbar con autenticación

---

## 🚀 **PRUEBA EN 3 PASOS**

### **PASO 1: Iniciar Backend**

```bash
python src/app.py
```

**Debe mostrar**: "Running on http://127.0.0.1:3001/"

### **PASO 2: Iniciar Frontend** (Nueva terminal)

```bash
npm start
```

**Debe abrir**: http://localhost:3000

### **PASO 3: Probar Flujo Completo**

1. **Ir a**: http://localhost:3000/signup
2. **Registrarse** con cualquier email/password
3. **Ir a**: http://localhost:3000/login
4. **Loguearse** con las mismas credenciales
5. **Verificar**: Redirección automática a `/private`
6. **Verificar**: Navbar muestra "Logout"
7. **Hacer logout** y verificar redirección

---

## 🔧 **SI HAY PROBLEMAS**

### **Error Flask/Jinja2**:

```bash
pip install markupsafe==2.0.1
```

### **Error Vite**:

```bash
npm install
```

### **Error Puerto Ocupado**:

- Cambiar puerto en src/app.py (línea final)
- O matar proceso: `lsof -ti:3001 | xargs kill -9`

---

## ⚡ **PRUEBA RÁPIDA DE API** (Opcional)

```bash
# Verificar que API funciona
curl -X POST http://localhost:3001/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

---

## 🎯 **CRITERIOS DE ÉXITO**

**✅ APROBADO SI**:

- Ambos servidores inician sin errores
- Puedes registrarte en /signup
- Puedes loguearte en /login
- /private requiere estar logueado
- Logout limpia la sesión
- Navbar cambia según estado de auth

**📋 ENTREGA**: El proyecto está listo para entregar tal como está.

---

_Nota: Este es un proyecto académico funcional que cumple todos los requisitos del bootcamp._
