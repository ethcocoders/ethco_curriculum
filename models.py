# models.py

# Import 'db' and 'UserMixin' from the main app file
from app import db, UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'user' # Explicitly name the table 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(60), nullable=False)
    role = db.Column(db.String(10), nullable=False, default='user')

    def __repr__(self):
        return f"User('{self.username}', '{self.email}', '{self.role}')"