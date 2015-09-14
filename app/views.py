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
	url_obj = url_shortener.KeyGenerator(request.args.get('link'))
	key = url_obj.check_if_link_in_db()

	if key:
		return str(url_obj.key)
	else:
		url_obj.write_to_db()
	return str(url_obj.key)

@app.route('/g/<key>')
def share_page(key):
	url_obj = Url.query.filter_by(key=key).first()
	link = url_obj.link.replace(',', '+')
	return render_template('index.html', link=str(link))