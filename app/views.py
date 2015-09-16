from app import app, db
from flask import render_template, request
import url_shortener
from app.models import Url

import requests
import json


@app.route('/')
def index():
	return render_template('index.html')

@app.route('/r/<sub>')
def sub_page(sub):
	return render_template('index.html', sub=str(sub))

@app.route('/ajax/share', methods=['GET'])
def share_ajax():
	keygen_obj = url_shortener.KeyGenerator(request.args.get('link'))
	keygen_obj.write_to_db()
	return str(keygen_obj.key)

@app.route('/ajax/updatename', methods=['GET'])
def updatename_ajax():
	url_obj = Url.query.filter_by(key=request.args.get('key')).first()
	url_obj.name = request.args.get('name')
	db.session.commit()
	return url_obj.name

@app.route('/g/<key>')
def share_page(key):
	url_obj = Url.query.filter_by(key=key).first()
	link = url_obj.link.replace(',', '+')
	name = url_obj.name.replace(',', '+')
	return render_template('index.html', link=str(link), name=str(name))