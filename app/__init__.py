from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://ankhzlucmonpey:zck2RZ2azwZlsQKwncurLCdMvy@ec2-46-137-159-123.eu-west-1.compute.amazonaws.com:5432/devclddqb1ap7b'
db = SQLAlchemy(app)

from app import views