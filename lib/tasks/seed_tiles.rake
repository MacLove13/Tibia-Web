namespace :db do
  desc "Seed map tiles"
  task seed_tiles: :environment do
    tiles_data = [
      { x: 0, y: 0, walkable: true, tileType: 'grass' },
      { x: 0, y: 1, walkable: true, tileType: 'grass' },
      { x: 0, y: 2, walkable: true, tileType: 'grass' },
      { x: 0, y: 3, walkable: true, tileType: 'grass' },
      { x: 0, y: 4, walkable: true, tileType: 'grass' },
      { x: 0, y: 5, walkable: true, tileType: 'grass' },
      { x: 1, y: 0, walkable: true, tileType: 'grass' },
      { x: 1, y: 1, walkable: true, tileType: 'grass' },
      { x: 1, y: 2, walkable: true, tileType: 'grass' },
      { x: 1, y: 3, walkable: true, tileType: 'grass' },
      { x: 1, y: 4, walkable: true, tileType: 'grass' },
      { x: 1, y: 5, walkable: true, tileType: 'grass' },
      { x: 2, y: 2, walkable: true, tileType: 'grass' },
      { x: 3, y: 3, walkable: true, tileType: 'grass' },
      { x: 5, y: 2, walkable: false, tileType: 'water' },
    ]

    tiles_data.each do |tile_data|
      Map::Tile.create!(tile_data)
    end
  end
end
