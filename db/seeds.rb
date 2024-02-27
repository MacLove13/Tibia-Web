# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end


ItemTemplate.find_by(name: 'Mochila')&.delete
Map::Tile.where("x = 0 AND y = 0")&.delete_all

ItemTemplate.create(
	name: 'Mochila',
	description: 'Mochila comum de um viajante.',
	type: 1,
	vocation: 0,
	image: 'Backpacks/Default.gif'
)

Map::Tile.create(
	x: 0,
	y:0,
	walkable: true,
	tile_type: '2',
	safe_zone: true,
	layer: 0
)

Map::Tile.create(
	x: 0,
	y:0,
	walkable: true,
	tile_type: '2',
	safe_zone: true,
	layer: 1
)
