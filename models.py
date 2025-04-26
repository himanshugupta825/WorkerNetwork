from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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