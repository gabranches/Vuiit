from app import app, db
from flask import render_template, request, redirect, session
from config import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SECRET_KEY
import url_shortener
from app.models import Url
import get_subs

import requests
import requests.auth
import json


app.secret_key = SECRET_KEY

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

@app.route('/login')
def reddit_login():
	return redirect(create_auth_url()) 

@app.route('/mysubreddits')
def load_mysubreddits():
	error = request.args.get('error', '')
	if error:
		return "Error: " + error
	code = request.args.get('code')
	if session.get('token'):
		session.clear()
		return render_template('index.html')
	else:
		access_token = get_token(code)

	return render_template('index.html', subs=get_subscribed_subs(access_token))

def create_auth_url():
	from uuid import uuid4
	state = str(uuid4())
	params = {"client_id": CLIENT_ID,
				"response_type": "code",
				"state": state,
				"redirect_uri": REDIRECT_URI,
				"duration": "permanent",
				"scope": "mysubreddits"}
	import urllib
	url = "https://ssl.reddit.com/api/v1/authorize?" + urllib.urlencode(params)
	return url

def get_token(code):
	client_auth = requests.auth.HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
	post_data = {"grant_type": "authorization_code",
					"code": code,
					"redirect_uri": REDIRECT_URI}
	response = requests.post("https://ssl.reddit.com/api/v1/access_token",
								auth=client_auth,
								data=post_data,
								headers = { 'User-Agent' : 'image-viewer by /u/gabranches' }
								)
	token_json = response.json()
	session['token'] = token_json["access_token"]
	return session['token']

def get_subscribed_subs(access_token):
	headers = {"Authorization": "bearer " + access_token, 'User-Agent' : 'image-viewer by /u/gabranches' }
	response = requests.get("https://oauth.reddit.com/subreddits/mine/subscriber/.json?limit=100", headers=headers)
	data = json.loads(response.content)
	subs = []
	for sub in data['data']['children']:
		subs.append(str(sub['data']['display_name']))
	return ",".join(subs).lower()



