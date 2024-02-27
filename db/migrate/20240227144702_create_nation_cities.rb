class CreateNationCities < ActiveRecord::Migration[7.1]
  def change
    create_table :nation_cities do |t|
      t.string :name

      t.integer :nation_id, null: false, default: 0

      t.integer :king_id, null: false, default: 0
      t.integer :king_npc_id, null: false, default: 0
      t.integer :king_guild_id, null: false, default: 0
      t.integer :ownership_type, null: false, default: 0

      t.json :position_x, null: false, default: { x: 60, y: 50 }
      t.json :position_y, null: false, default: { x: 60, y: 50 }
      t.json :position_spawn, null: false, default: { x: 60, y: 50 }
      t.json :position_revive, null: false, default: { x: 60, y: 50 }
      t.integer :upgrade_points, null: false, default: 0
      t.integer :citizens_count, null: false, default: 0
      t.integer :citizens_npc_count, null: false, default: 0
      t.integer :homes_count, null: false, default: 0
      t.integer :shops_count, null: false, default: 0
      t.integer :guards_count, null: false, default: 0

      t.integer :prosperity, null: false, default: 0
      t.integer :gold, null: false, default: 0
      t.integer :food, null: false, default: 0
      t.integer :wood, null: false, default: 0
      t.integer :iron, null: false, default: 0
      t.integer :water, null: false, default: 0
      t.integer :stone, null: false, default: 0

      t.integer :farm_fields, null: false, default: 0

      t.integer :water_points, null: false, default: 0
      t.integer :stone_points, null: false, default: 0
      t.integer :fire_points, null: false, default: 0

      t.float :defense_power, null: false, default: 0.0

      t.timestamps
    end

    add_index :nation_cities, :ownership_type
  end
end
