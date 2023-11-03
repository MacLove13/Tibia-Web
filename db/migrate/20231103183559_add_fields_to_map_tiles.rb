class AddFieldsToMapTiles < ActiveRecord::Migration[7.1]
  def change
    add_column :map_tiles, :safeZone, :boolean
    add_column :map_tiles, :owner, :integer
  end
end
