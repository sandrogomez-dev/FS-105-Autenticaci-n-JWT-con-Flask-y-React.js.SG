from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from flask_bcrypt import Bcrypt
import jwt
from datetime import datetime, timedelta
import os

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)

    def set_password(self, password):
        """Encripta la contraseña usando bcrypt"""
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        """Verifica si la contraseña es correcta"""
        return bcrypt.check_password_hash(self.password, password)
    
    def generate_token(self):
        """Genera un JWT token para el usuario"""
        payload = {
            'user_id': self.id,
            'email': self.email,
            'exp': datetime.utcnow() + timedelta(hours=24)  # Token expira en 24 horas
        }
        return jwt.encode(payload, os.environ.get('JWT_SECRET_KEY', 'default-secret-key'), algorithm='HS256')
    
    @staticmethod
    def verify_token(token):
        """Verifica y decodifica un JWT token"""
        try:
            payload = jwt.decode(token, os.environ.get('JWT_SECRET_KEY', 'default-secret-key'), algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None  # Token expirado
        except jwt.InvalidTokenError:
            return None  # Token inválido

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active
            # do not serialize the password, its a security breach
        }