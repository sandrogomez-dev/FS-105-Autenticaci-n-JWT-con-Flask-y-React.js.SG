import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../store.js';
import { loginUser } from '../services/user.js';

export const Login = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState({});

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (store.isAuthenticated) {
            navigate('/private');
        }
    }, [store.isAuthenticated, navigate]);

    // Limpiar mensajes cuando el componente se monta
    useEffect(() => {
        actions.clearError();
        actions.clearMessage();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error específico cuando el usuario empieza a escribir
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        // Validar email
        if (!formData.email) {
            errors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'El formato del email no es válido';
        }

        // Validar contraseña
        if (!formData.password) {
            errors.password = 'La contraseña es requerida';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        actions.loginStart();

        const result = await loginUser(formData.email, formData.password);

        if (result.success) {
            actions.loginSuccess(result.data);
            navigate('/private');
        } else {
            actions.loginError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-auth d-flex align-items-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="form-container-auth">
                            <div className="text-center mb-4">
                                <h2 className="h3 mb-3 fw-bold">
                                    Iniciar sesión
                                </h2>
                                <p className="text-muted">
                                    ¿No tienes una cuenta?{' '}
                                    <Link to="/signup" className="text-decoration-none">
                                        Regístrate aquí
                                    </Link>
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {store.error && (
                                    <div className="alert alert-danger">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        {store.error}
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                                        placeholder="tu@email.com"
                                    />
                                    {formErrors.email && (
                                        <div className="invalid-feedback">
                                            {formErrors.email}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Contraseña
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                                        placeholder="Tu contraseña"
                                    />
                                    {formErrors.password && (
                                        <div className="invalid-feedback">
                                            {formErrors.password}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={store.isLoading}
                                    className="btn btn-primary-custom w-100"
                                >
                                    {store.isLoading && (
                                        <span className="spinner-custom"></span>
                                    )}
                                    {store.isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                                </button>

                                <div className="text-center mt-3">
                                    <small className="text-muted">
                                        ¿Olvidaste tu contraseña?{' '}
                                        <span className="text-primary" style={{ cursor: 'pointer' }}>
                                            Contáctanos
                                        </span>
                                    </small>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 