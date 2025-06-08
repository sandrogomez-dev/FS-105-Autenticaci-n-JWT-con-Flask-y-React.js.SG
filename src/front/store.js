export const initialStore = () => {
  // Verificar si hay token en sessionStorage al inicializar
  const token = sessionStorage.getItem("token");
  const userData = sessionStorage.getItem("userData");

  return {
    // Estado de autenticación
    isAuthenticated: !!token,
    token: token || null,
    user: userData ? JSON.parse(userData) : null,

    // Estado de la aplicación
    isLoading: false,
    error: null,
    message: null,

    // Datos de ejemplo (puedes mantener o quitar según necesites)
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    // Acciones de autenticación
    case "LOGIN_START":
      return {
        ...store,
        isLoading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
      // Guardar en sessionStorage
      sessionStorage.setItem("token", action.payload.token);
      sessionStorage.setItem("userData", JSON.stringify(action.payload.user));

      return {
        ...store,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        isLoading: false,
        error: null,
      };

    case "LOGIN_ERROR":
      return {
        ...store,
        isAuthenticated: false,
        token: null,
        user: null,
        isLoading: false,
        error: action.payload,
      };

    case "LOGOUT":
      // Limpiar sessionStorage
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userData");

      return {
        ...store,
        isAuthenticated: false,
        token: null,
        user: null,
        error: null,
        message: null,
      };

    case "SIGNUP_START":
      return {
        ...store,
        isLoading: true,
        error: null,
      };

    case "SIGNUP_SUCCESS":
      return {
        ...store,
        isLoading: false,
        error: null,
        message: action.payload.message,
      };

    case "SIGNUP_ERROR":
      return {
        ...store,
        isLoading: false,
        error: action.payload,
      };

    case "VALIDATE_TOKEN_SUCCESS":
      return {
        ...store,
        isAuthenticated: true,
        user: action.payload.user,
      };

    case "VALIDATE_TOKEN_ERROR":
      // Limpiar sessionStorage si el token no es válido
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userData");

      return {
        ...store,
        isAuthenticated: false,
        token: null,
        user: null,
      };

    case "CLEAR_ERROR":
      return {
        ...store,
        error: null,
      };

    case "CLEAR_MESSAGE":
      return {
        ...store,
        message: null,
      };

    case "SET_LOADING":
      return {
        ...store,
        isLoading: action.payload,
      };

    // Acciones existentes (mantener compatibilidad)
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    default:
      throw Error("Unknown action: " + action.type);
  }
}
