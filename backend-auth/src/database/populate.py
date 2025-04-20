import requests
import sys
import sqlite3

API_BASE_URL = 'http://localhost:8081/api/user'
DATABASE_PATH = '../../database.sqlite'

def error_code(msg: str, code: int) -> None:
	print(f"[ ERROR ] {msg}: code {code}")
	sys.exit(1)

def add_user(name: str, avatar_url: str) -> dict:
	email = f"{name}@hollowknight.slk"
	response = requests.post(
		f"{API_BASE_URL}/",
		json={
			'name': name,
			'email': email,
			'avatar_url': avatar_url
		},
		headers={
			'Content-Type': 'application/json'
		}
	)
	if response.status_code != 201:
		error_code(
			f"Error while inserting ({name}, {email}, {avatar_url}) on the database",
			response.status_code
		)

	return response.json()

def create_relation(id_from: int, id_to: int, mutual: bool =False) -> None:

	def send_relation_request(first_id: int, second_id: int) -> requests.Response:
		return requests.post(
			f"{API_BASE_URL}/friend",
			json={
				'from': first_id,
				'to': second_id
			},
			headers={
				'Content-Type': 'application/json'
			}
		)
	
	response = send_relation_request(id_from, id_to)
	if response.status_code != 201:
		error_code(
			f"Error while creating relation between ({id_from}, {id_to})",
			response.status_code
		)

	if mutual:
		response = send_relation_request(id_to, id_from)
		if response.status_code != 200:
			error_code(
				f"Error while accepting the request {id_from} -> {id_to}",
				response.status_code
			)

def delete_data() -> None:
	conn = sqlite3.connect(DATABASE_PATH)
	cursor = conn.cursor()

	try:
		cursor.execute("PRAGMA foreign_keys = OFF;")

		cursor.execute("DELETE FROM friends;")
		cursor.execute("DELETE FROM users;")

		cursor.execute("DELETE FROM sqlite_sequence WHERE name='friends';")
		cursor.execute("DELETE FROM sqlite_sequence WHERE name='users';")

		conn.commit()
	finally:
		cursor.execute("PRAGMA foreign_keys = ON;")
	
	cursor.close()
	conn.close()

def main():
	# Create users
	knight = add_user(
		'Knight',
		'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2018/07/hollow-knight.jpg?tf=1200x1200'
	)

	hornet = add_user(
		'Hornet',
		'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/11/Hollow-Knight-Silksong-Hornet-Information.jpg'
	)

	grimm = add_user(
		'Grimm',
		'https://i.scdn.co/image/ab67616d0000b273077f5b41064486840a18a923'
	)

	quirel = add_user(
		'Quirel',
		'https://images.steamusercontent.com/ugc/947348317608994032/5DD83A08AA99638626CEA67618A18A9884F8F3D9/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
	)

	grimmkin = add_user(
		'Grimmkin',
		'https://cdna.artstation.com/p/assets/videos/images/027/863/710/smaller_square/brandon-ehrman-maxresdefault.jpg?1592793503'
	)

	zote = add_user(
		'Zote',
		'https://images2.alphacoders.com/866/thumb-1920-866192.jpg'
	)

	elderbug = add_user(
		'Elderbug',
		'https://ih1.redbubble.net/image.4388836791.3682/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg'
	)

	iselda = add_user(
		'Iselda',
		'https://ih1.redbubble.net/image.1669508398.6362/st,small,507x507-pad,600x600,f8f8f8.jpg'
	)

	grimmchild = add_user(
		'Grimmchild',
		'https://swebtoon-phinf.pstatic.net/20201002_182/1601576829529orVxW_JPEG/thumbnail.jpg'
	)

	mato = add_user(
		'Mato',
		'https://cdnb.artstation.com/p/assets/images/images/076/051/325/large/retratosanime-547.jpg?1716049252'
	)
	# Create the relations
	create_relation(knight['id'], hornet['id'])
	create_relation(knight['id'], iselda['id'], True)
	create_relation(hornet['id'], grimm['id'])
	create_relation(grimm['id'], quirel['id'])
	create_relation(grimm['id'], grimmkin['id'], True)
	create_relation(grimm['id'], grimmchild['id'], True)
	create_relation(quirel['id'], grimmkin['id'])
	create_relation(quirel['id'], elderbug['id'], True)
	create_relation(grimmkin['id'], zote['id'])
	create_relation(zote['id'], elderbug['id'])
	create_relation(zote['id'], grimmchild['id'], True)
	create_relation(elderbug['id'], iselda['id'], True)
	create_relation(iselda['id'], grimm['id'])
	create_relation(grimmchild['id'], mato['id'])
	create_relation(grimmchild['id'], quirel['id'])
	create_relation(mato['id'], elderbug['id'], True)

if __name__ == '__main__':
	delete_data()
	main()
