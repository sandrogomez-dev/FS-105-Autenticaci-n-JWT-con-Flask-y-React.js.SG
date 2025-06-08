// API Base URL - ajusta según tu configuración
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

/**
 * Utilidad para manejar errores de la API
 */
const handleApiError = (error) => {
  if (error.response) {
    // Error de respuesta del servidor
    return error.response.data?.message || "Error del servidor";
  } else if (error.request) {
    // Error de red
    return "Error de conexión. Verifica tu conexión a internet.";
  } else {
    // Error desconocido
    return "Error inesperado. Inténtalo de nuevo.";
  }
};

/**
 * Utilidad para hacer peticiones con manejo de errores
 */
const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        response: {
          data: data,
          status: response.status,
        },
      };
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener el token de autenticación de sessionStorage
 */
const getAuthToken = () => {
  return sessionStorage.getItem("token");
};

/**
 * Obtener headers con autenticación
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Servicio de autenticación - Registro de usuario
 */
export const signupUser = async (email, password) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/signup`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
};

/**
 * Servicio de autenticación - Inicio de sesión
 */
export const loginUser = async (email, password) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
};

/**
 * Servicio de autenticación - Validar token
 */
export const validateToken = async () => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/validate-token`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
};

/**
 * Servicio de usuario - Obtener perfil
 */
export const getUserProfile = async () => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
};

/**
 * Utilidad para limpiar datos de autenticación
 */
export const clearAuthData = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userData");
};

/**
 * Utilidad para verificar si el usuario está autenticado
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

/**
 * Servicio de ejemplo - Hello endpoint (mantener compatibilidad)
 */
export const getHello = async () => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/hello`, {
      method: "GET",
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
};
