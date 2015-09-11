import random
from app import app, db, models
from app.models import Url


class KeyGenerator():

	def __init__(self, pairs, link):
		self.pairs = pairs
		self.link = link

	letters = ['a','b','c','d','e','f','g','h',
	              'i','j','k','l','m','n','o','p',
	              'q','r','s','t','u','v','w','x',
	              'y','z']

	nums = range(0,10)

	def write_to_db(self):
		result = True
		while result is True:
			try:
				temp_key = self.generate_key()
				result = self.check_key_in_db(temp_key)
			except:
				pass

		entry = Url(temp_key, self.link, 'text')
		db.session.add(entry)
		db.session.commit()


	def pick_letter(self):
		return random.choice(self.letters)

	def pick_number(self):
		return random.choice(self.nums)

	def generate_key(self):
		temp_key = ''
		for _ in xrange(0, self.pairs):
			temp_key += self.pick_letter()
			temp_key += str(self.pick_number())
		return temp_key
		
	def __repr__(self):
		return self.key

	def check_key_in_db(self, temp_key):
		print temp_key
		resp = Url.query.filter_by(key=temp_key).first()
		if resp:
			return True
		else:
			return False

