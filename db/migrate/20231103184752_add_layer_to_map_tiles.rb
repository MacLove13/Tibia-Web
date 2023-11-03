class AddLayerToMapTiles < ActiveRecord::Migration[7.1]
  def change
    add_column :map_tiles, :layer, :integer, default: 0
  end
end
