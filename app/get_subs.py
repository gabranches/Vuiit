import json
import requests
import os


def add_subs_to_list(subs, after, hdr, count):
	'''Creates a list of subreddits for the autofill drop-down.'''

	if after == '':
		url = 'http://www.reddit.com/subreddits/.json'
	else:
		url = 'http://www.reddit.com/subreddits/.json?after=' + after

	r = requests.get(url, headers=hdr)
	data = json.loads(r.content)

	for sub in data['data']['children']:
		subs.append(str(sub['data']['display_name']))

	if data['data']['after'] and count < 200:
		count += 1
		print count
		add_subs_to_list(subs, str(data['data']['after']), hdr, count)
	else:
		with open('static/suggestions.js', 'w') as f:
			f.write(str(subs).replace("'", '"'))
		print "Done."


if __name__ == "__main__":
	hdr = { 'User-Agent' : 'image-viewer by /u/gabranches', 'cookie' : '__cfduid=d149fc9757b8f25ec868d8b287fb7e4d01432135866; loid=oalVd5zTfldqn9gLwZ; loidcreated=2015-05-29T15:29:38.686Z; over18=1; _recentclicks2=t3_3l24dd%2C; reddit_session=35547958%2C2015-09-16T09%3A27%3A26%2Ce84fb8a808ed825356ffaea82f577cc08b02e0e4; secure_session=1; gabranches_recentclicks2=t3_35w2di%2Ct3_1kthy1%2C; _ga=GA1.2.1134378783.1434393129; pc=7d' }
	subs = []
	count = 0
	sub_list = add_subs_to_list(subs, '', hdr, count)
