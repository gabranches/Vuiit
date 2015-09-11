from app import app, db
from flask import render_template

import requests
import json
from models import Url



@app.route('/')
def index():
	# url = Url('test4','test2','test3')
	# db.session.add(url)
	# db.session.commit()
	print 'index'
	return render_template('index.html')


@app.route('/r/<sub>')
def sub_page(sub):
	return render_template('index.html', sub=str(sub))

@app.route('/link/<link>')
def link_page(link):
	return render_template('index.html', link=str(link))