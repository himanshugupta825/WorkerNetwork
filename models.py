from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = Column(String(36), primary_key=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    is_worker = Column(Boolean, default=False)
    is_employer = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_worker': self.is_worker,
            'is_employer': self.is_employer,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Worker(db.Model):
    __tablename__ = 'workers'
    
    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    skill = Column(String(100), nullable=False)
    location = Column(String(100), nullable=False)
    experience = Column(String(100), nullable=True)
    education = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'skill': self.skill,
            'location': self.location,
            'experience': self.experience,
            'education': self.education,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Job(db.Model):
    __tablename__ = 'jobs'
    
    id = Column(String(36), primary_key=True)
    business_name = Column(String(100), nullable=False)
    job_role = Column(String(100), nullable=False)
    payment = Column(String(100), nullable=False)
    contact_number = Column(String(20), nullable=False)
    location = Column(String(100), nullable=True)
    job_description = Column(Text, nullable=True)
    status = Column(String(20), default='open')
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'business_name': self.business_name,
            'job_role': self.job_role,
            'payment': self.payment,
            'contact_number': self.contact_number,
            'location': self.location,
            'job_description': self.job_description,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }