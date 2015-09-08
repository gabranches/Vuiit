from app import app
from flask import render_template
import requests
import json


class RedditApi(object):
	def __init__(self, sub):
		self.sub = sub

	def get_posts(self):
		url = 'http://www.reddit.com/r/' + self.sub + '/.json'
		r = requests.get(url)
		self.data = json.loads(r.text)


@app.route('/')
@app.route('/index')
def index():
	return render_template('index.html')


@app.route('/test')
def test():
	reddit = RedditApi('girlsinyogapants')
	reddit.get_posts()
	return json.dumps(reddit.data)
