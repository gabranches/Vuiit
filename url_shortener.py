import random
from app import app, db, models
from app.models import Url


class KeyGenerator():

	def __init__(self, link):
		self.link = link

	letters = ['a','b','c','d','e','f','g','h',
	              'i','j','k','l','m','n','o','p',
	              'q','r','s','t','u','v','w','x',
	              'y','z']

	nums = range(0,10)
	pairs = 3

	def write_to_db(self):
		result = True
		while result is True:
			try:
				temp_key = self.generate_key()
				result = self.check_key_in_db(temp_key)
			except:
				pass

		entry = Url(temp_key, self.link)
		db.session.add(entry)
		db.session.commit()
		self.key = temp_key

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
		url_obj = Url.query.filter_by(key=temp_key).first()
		if url_obj:
			self.key = temp_key
			return True
		else:
			return False

	def check_if_link_in_db(self):
		url_obj = Url.query.filter_by(link=self.link).first()
		if url_obj:
			self.key = url_obj.key
			return self.key
		else:
			return False


