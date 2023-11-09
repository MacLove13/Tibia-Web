class CreateMapTiles < ActiveRecord::Migration[7.1]
  def change
    create_table :map_tiles do |t|
      t.integer :x
      t.integer :y
      t.boolean :walkable, null: false, default: false
      t.string :tile_type
      t.boolean :safe_zone, null: false, default: false
      t.integer :owner, null: false, default: 0
      t.integer :layer, null: false, default: 0

      t.timestamps
    end
  end
end
