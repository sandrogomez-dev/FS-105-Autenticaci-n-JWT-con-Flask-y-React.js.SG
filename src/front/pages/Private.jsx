import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store.js';
import { validateToken, getUserProfile } from '../services/user.js';

export const Private = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [isValidating, setIsValidating] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            // Si no hay token, redirigir inmediatamente
            if (!store.token) {
                navigate('/login');
                return;
            }

            // Validar el token con el servidor
            const result = await validateToken();

            if (result.success) {
                actions.validateTokenSuccess(result.data);
            } else {
                actions.validateTokenError();
                navigate('/login');
            }

            setIsValidating(false);
        };

        checkAuthentication();
    }, [store.token, navigate]);

    const handleLogout = () => {
        actions.logout();
        navigate('/login');
    };

    // Mostrar loading mientras se valida
    if (isValidating) {
        return (
            <div className="min-h-screen d-flex align-items-center justify-content-center bg-light">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Validando sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light">
            {/* Navbar */}
            <nav className="navbar navbar-light bg-white shadow-sm border-bottom">
                <div className="container">
                    <div className="d-flex justify-content-between w-100 align-items-center">
                        <h1 className="navbar-brand mb-0 h4">
                            Área Privada
                        </h1>

                        <div className="d-flex align-items-center">
                            <span className="text-muted me-3">
                                Bienvenido, {store.user?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="btn btn-primary-custom btn-sm"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <main className="container py-5">
                <div className="card shadow">
                    <div className="card-body p-5">
                        {/* Header */}
                        <div className="text-center mb-5">
                            <h2 className="display-5 fw-bold text-dark mb-3">
                                ¡Bienvenido a tu área privada!
                            </h2>
                            <p className="lead text-muted">
                                Has iniciado sesión exitosamente. Esta página solo es accesible para usuarios autenticados.
                            </p>
                        </div>

                        {/* Información del usuario */}
                        <div className="row mb-5">
                            <div className="col-lg-8 mx-auto">
                                <div className="card bg-light">
                                    <div className="card-body">
                                        <h5 className="card-title mb-4">
                                            <i className="fas fa-user-circle me-2"></i>
                                            Información de tu cuenta
                                        </h5>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">Email</label>
                                                <p className="mb-0 text-muted">
                                                    {store.user?.email || 'No disponible'}
                                                </p>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">ID de usuario</label>
                                                <p className="mb-0 text-muted">
                                                    #{store.user?.id || 'No disponible'}
                                                </p>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">Estado de la cuenta</label>
                                                <div>
                                                    <span className={`badge ${store.user?.is_active ? 'bg-success' : 'bg-danger'}`}>
                                                        {store.user?.is_active ? 'Activa' : 'Inactiva'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Funcionalidades de ejemplo */}
                        <div className="row g-4 mb-5">
                            <div className="col-md-4">
                                <div className="card border-primary">
                                    <div className="card-body text-center">
                                        <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                            <i className="fas fa-shield-alt text-primary fs-4"></i>
                                        </div>
                                        <h5 className="card-title text-primary">Autenticación JWT</h5>
                                        <p className="card-text text-muted">
                                            Tu sesión está protegida con tokens JWT seguros
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card border-success">
                                    <div className="card-body text-center">
                                        <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                            <i className="fas fa-lock text-success fs-4"></i>
                                        </div>
                                        <h5 className="card-title text-success">Contraseña segura</h5>
                                        <p className="card-text text-muted">
                                            Tu contraseña está encriptada con bcrypt
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card border-info">
                                    <div className="card-body text-center">
                                        <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                            <i className="fas fa-code text-info fs-4"></i>
                                        </div>
                                        <h5 className="card-title text-info">React + Flask</h5>
                                        <p className="card-text text-muted">
                                            Stack moderno con las mejores prácticas
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Información adicional */}
                        <div className="text-center">
                            <div className="alert alert-info">
                                <i className="fas fa-info-circle me-2"></i>
                                Esta es una página protegida que demuestra el funcionamiento del sistema de autenticación.
                            </div>
                            <p className="text-muted small">
                                Tu sesión se mantendrá activa mientras el token JWT sea válido.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}; 