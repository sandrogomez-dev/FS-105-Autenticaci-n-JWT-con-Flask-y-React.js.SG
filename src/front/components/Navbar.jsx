import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const handleLogout = () => {
		actions.logout();
		navigate('/');
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light navbar-custom">
			<div className="container">
				{/* Logo/Brand */}
				<Link to="/" className="navbar-brand navbar-brand-custom">
					JWT Auth App
				</Link>

				{/* Toggler for mobile */}
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				{/* Navigation Links */}
				<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav me-auto">
						<li className="nav-item">
							<Link to="/demo" className="nav-link">
								Demo
							</Link>
						</li>
					</ul>

					{/* Authentication Links */}
					<div className="d-flex align-items-center">
						{store.isAuthenticated ? (
							<>
								<Link to="/private" className="nav-link me-3">
									Área Privada
								</Link>
								<span className="text-muted me-3 small">
									{store.user?.email}
								</span>
								<button
									onClick={handleLogout}
									className="btn btn-primary-custom btn-sm"
								>
									Cerrar sesión
								</button>
							</>
						) : (
							<>
								<Link to="/login" className="nav-link me-2">
									Iniciar sesión
								</Link>
								<Link to="/signup" className="btn btn-primary-custom btn-sm">
									Registrarse
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};