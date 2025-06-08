// Import necessary hooks and functions from React.
import { useContext, useReducer, createContext } from "react";
import storeReducer, { initialStore } from "../store"  // Import the reducer and the initial state.

// Create a context to hold the global state of the application
// We will call this global state the "store" to avoid confusion while using local states
const StoreContext = createContext()

// Export the context so other components can import it directly
export const Context = StoreContext;

// Define a provider component that encapsulates the store and warps it in a context provider to 
// broadcast the information throught all the app pages and components.
export function StoreProvider({ children }) {
    // Initialize reducer with the initial state.
    const [store, dispatch] = useReducer(storeReducer, initialStore())

    // Define actions for better organization and reusability
    const actions = {
        // Authentication actions
        loginStart: () => dispatch({ type: 'LOGIN_START' }),
        loginSuccess: (data) => dispatch({ type: 'LOGIN_SUCCESS', payload: data }),
        loginError: (error) => dispatch({ type: 'LOGIN_ERROR', payload: error }),
        logout: () => dispatch({ type: 'LOGOUT' }),

        signupStart: () => dispatch({ type: 'SIGNUP_START' }),
        signupSuccess: (data) => dispatch({ type: 'SIGNUP_SUCCESS', payload: data }),
        signupError: (error) => dispatch({ type: 'SIGNUP_ERROR', payload: error }),

        validateTokenSuccess: (data) => dispatch({ type: 'VALIDATE_TOKEN_SUCCESS', payload: data }),
        validateTokenError: () => dispatch({ type: 'VALIDATE_TOKEN_ERROR' }),

        // Utility actions
        clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
        clearMessage: () => dispatch({ type: 'CLEAR_MESSAGE' }),
        setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),

        // Legacy actions (for backward compatibility)
        setHello: (message) => dispatch({ type: 'set_hello', payload: message }),
        addTask: (id, color) => dispatch({ type: 'add_task', payload: { id, color } })
    };

    // Provide the store, dispatch method, and actions to all child components.
    return <StoreContext.Provider value={{ store, dispatch, actions }}>
        {children}
    </StoreContext.Provider>
}

// Custom hook to access the global state and dispatch function.
export default function useGlobalReducer() {
    const context = useContext(StoreContext)
    if (!context) {
        throw new Error('useGlobalReducer must be used within a StoreProvider')
    }
    const { dispatch, store, actions } = context
    return { dispatch, store, actions };
}