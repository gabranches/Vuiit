import random

class KeyGenerator():

	def __init__(self, pairs):
		self.key = self.generate_key(pairs)

	letters = ['a','b','c','d','e','f','g','h',
	              'i','j','k','l','m','n','o','p',
	              'q','r','s','t','u','v','w','x',
	              'y','z']

	nums = range(0,10)

	def pick_letter(self):
		return random.choice(self.letters)

	def pick_number(self):
		return random.choice(self.nums)

	def generate_key(self, pairs):
		key = ''
		for _ in xrange(0,pairs):
			key += self.pick_letter()
			key += str(self.pick_number())
		return  key

	def __repr__(self):
		return self.key


url = KeyGenerator(3)
print url