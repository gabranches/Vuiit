from app import app, db
from flask import render_template, request
import url_shortener

import requests
import json


@app.route('/')
def index():
	return render_template('index.html')


@app.route('/r/<sub>')
def sub_page(sub):
	return render_template('index.html', sub=str(sub))


@app.route('/share', methods=['GET'])
def share_ajax():
	key_obj = url_shortener.KeyGenerator(request.args.get('link'))
	key_obj.write_to_db()
	return str(key_obj.key)