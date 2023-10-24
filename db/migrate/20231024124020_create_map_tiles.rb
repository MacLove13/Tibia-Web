class CreateMapTiles < ActiveRecord::Migration[7.1]
  def change
    create_table :map_tiles do |t|
      t.integer :x
      t.integer :y
      t.boolean :walkable
      t.string :tileType

      t.timestamps
    end
  end
end
