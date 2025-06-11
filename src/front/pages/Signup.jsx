import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../hooks/useGlobalReducer.jsx';
import { signupUser } from '../services/user.js';

export const Signup = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
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
        } else if (formData.password.length < 6) {
            errors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        // Validar confirmación de contraseña
        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        actions.signupStart();

        const result = await signupUser(formData.email, formData.password);

        if (result.success) {
            actions.signupSuccess(result.data);
            // Redirigir al login después del registro exitoso
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            actions.signupError(result.error);
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
                                    Crear cuenta
                                </h2>
                                <p className="text-muted">
                                    ¿Ya tienes una cuenta?{' '}
                                    <Link to="/login" className="text-decoration-none">
                                        Inicia sesión aquí
                                    </Link>
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {store.message && (
                                    <div className="alert alert-success">
                                        <i className="fas fa-check-circle me-2"></i>
                                        {store.message}
                                    </div>
                                )}

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
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                    {formErrors.password && (
                                        <div className="invalid-feedback">
                                            {formErrors.password}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">
                                        Confirmar contraseña
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                                        placeholder="Confirma tu contraseña"
                                    />
                                    {formErrors.confirmPassword && (
                                        <div className="invalid-feedback">
                                            {formErrors.confirmPassword}
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
                                    {store.isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 