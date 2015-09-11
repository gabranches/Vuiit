from app import app, db


class Url(db.Model):
	__tablename__ = "urls"
	key = db.Column(db.String, primary_key=True)
	link = db.Column(db.String)
	name = db.Column(db.String)

	def __init__(self, key, link, name):
		self.key = key
		self.link = link
		self.name = name