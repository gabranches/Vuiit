from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import setup

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = setup.SQLALCHEMY_DATABASE_URI
db = SQLAlchemy(app)

from app import views