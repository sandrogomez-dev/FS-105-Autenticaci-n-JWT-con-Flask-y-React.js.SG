"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from functools import wraps
import re

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

def validate_email(email):
    """Valida el formato del email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Valida que la contraseña tenga al menos 6 caracteres"""
    return len(password) >= 6

def token_required(f):
    """Decorador para validar JWT token en rutas protegidas"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            # Remover 'Bearer ' del token si está presente
            if token.startswith('Bearer '):
                token = token[7:]
            
            payload = User.verify_token(token)
            if payload is None:
                return jsonify({'message': 'Token is invalid or expired'}), 401
            
            current_user = User.query.get(payload['user_id'])
            if not current_user or not current_user.is_active:
                return jsonify({'message': 'User not found or inactive'}), 401
                
        except Exception as e:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@api.route('/signup', methods=['POST'])
def signup():
    """Registro de nuevos usuarios"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validaciones
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        if not validate_email(email):
            return jsonify({'message': 'Invalid email format'}), 400
        
        if not validate_password(password):
            return jsonify({'message': 'Password must be at least 6 characters long'}), 400
        
        # Verificar si el usuario ya existe
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'message': 'User already exists with this email'}), 409
        
        # Crear nuevo usuario
        new_user = User(email=email)
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user': new_user.serialize()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Internal server error'}), 500

@api.route('/login', methods=['POST'])
def login():
    """Inicio de sesión de usuarios"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        # Buscar usuario
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'message': 'Account is deactivated'}), 401
        
        # Generar token
        token = user.generate_token()
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.serialize()
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Internal server error'}), 500

@api.route('/validate-token', methods=['GET'])
@token_required
def validate_token(current_user):
    """Valida si el token actual es válido"""
    return jsonify({
        'message': 'Token is valid',
        'user': current_user.serialize()
    }), 200

@api.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    """Obtiene el perfil del usuario autenticado"""
    return jsonify({
        'user': current_user.serialize()
    }), 200

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200
