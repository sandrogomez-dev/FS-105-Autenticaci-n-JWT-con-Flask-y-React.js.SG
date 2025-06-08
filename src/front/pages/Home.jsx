import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom";
import { Context } from "../hooks/useGlobalReducer.jsx";
import { getHello } from "../services/user.js";

export const Home = () => {
	const { store, actions } = useContext(Context);

	const loadMessage = async () => {
		try {
			const result = await getHello();
			if (result.success) {
				actions.setHello(result.data.message);
			}
		} catch (error) {
			console.error("Error loading message:", error);
		}
	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="min-h-screen bg-gradient-auth">
			{/* Hero Section */}
			<div className="container py-5">
				<div className="text-center">
					<h1 className="display-4 fw-bold text-dark mb-4">
						Sistema de Autenticación
						<span className="d-block text-primary">JWT + React + Flask</span>
					</h1>
					<p className="lead text-muted mb-5">
						Una implementación completa de autenticación usando JWT tokens, bcrypt para encriptación de contraseñas,
						React.js para el frontend y Flask para el backend API.
					</p>

					{/* CTA Buttons */}
					<div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-5">
						{!store.isAuthenticated ? (
							<>
								<Link to="/signup" className="btn btn-primary-custom btn-lg">
									Crear cuenta
								</Link>
								<Link to="/login" className="btn btn-outline-primary-custom btn-lg">
									Iniciar sesión
								</Link>
							</>
						) : (
							<Link to="/private" className="btn btn-primary-custom btn-lg">
								Ir al área privada
							</Link>
						)}
					</div>

					{/* Backend Status */}
					<div className="card mx-auto mb-5" style={{ maxWidth: '400px' }}>
						<div className="card-body">
							<h5 className="card-title">Estado del Backend</h5>
							{store.message ? (
								<div className="d-flex align-items-center status-connected">
									<i className="fas fa-check-circle me-2"></i>
									<span>Conectado: {store.message}</span>
								</div>
							) : (
								<div className="d-flex align-items-center status-connecting">
									<div className="spinner-custom"></div>
									<span>Conectando al backend...</span>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Features Grid */}
				<div className="row g-4 mb-5">
					<div className="col-md-4">
						<div className="card h-100 card-feature">
							<div className="card-body">
								<div className="d-flex align-items-center mb-3">
									<div className="bg-primary bg-opacity-10 p-3 rounded">
										<i className="fas fa-shield-alt text-primary fs-4"></i>
									</div>
									<h5 className="card-title ms-3 mb-0">JWT Tokens</h5>
								</div>
								<p className="card-text text-muted">
									Autenticación segura usando JSON Web Tokens con expiración automática de 24 horas.
								</p>
							</div>
						</div>
					</div>

					<div className="col-md-4">
						<div className="card h-100 card-feature">
							<div className="card-body">
								<div className="d-flex align-items-center mb-3">
									<div className="bg-success bg-opacity-10 p-3 rounded">
										<i className="fas fa-lock text-success fs-4"></i>
									</div>
									<h5 className="card-title ms-3 mb-0">Bcrypt</h5>
								</div>
								<p className="card-text text-muted">
									Contraseñas encriptadas usando bcrypt para máxima seguridad.
								</p>
							</div>
						</div>
					</div>

					<div className="col-md-4">
						<div className="card h-100 card-feature">
							<div className="card-body">
								<div className="d-flex align-items-center mb-3">
									<div className="bg-info bg-opacity-10 p-3 rounded">
										<i className="fas fa-code text-info fs-4"></i>
									</div>
									<h5 className="card-title ms-3 mb-0">React + Flask</h5>
								</div>
								<p className="card-text text-muted">
									Stack moderno con React.js en el frontend y Flask API en el backend.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* How it works */}
				<div className="card">
					<div className="card-body p-5">
						<h2 className="text-center mb-5">¿Cómo funciona?</h2>
						<div className="row g-4">
							<div className="col-md-3 text-center">
								<div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
									<span className="text-white fw-bold fs-5">1</span>
								</div>
								<h6 className="fw-bold">Registro</h6>
								<p className="text-muted small">Crea una cuenta con email y contraseña</p>
							</div>
							<div className="col-md-3 text-center">
								<div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
									<span className="text-white fw-bold fs-5">2</span>
								</div>
								<h6 className="fw-bold">Login</h6>
								<p className="text-muted small">Inicia sesión y recibe un JWT token</p>
							</div>
							<div className="col-md-3 text-center">
								<div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
									<span className="text-white fw-bold fs-5">3</span>
								</div>
								<h6 className="fw-bold">Acceso</h6>
								<p className="text-muted small">Accede a páginas protegidas</p>
							</div>
							<div className="col-md-3 text-center">
								<div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
									<span className="text-white fw-bold fs-5">4</span>
								</div>
								<h6 className="fw-bold">Logout</h6>
								<p className="text-muted small">Cierra sesión de forma segura</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}; 