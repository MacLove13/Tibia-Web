class CreateMobSpawns < ActiveRecord::Migration[7.1]
  def change
    create_table :mob_spawns do |t|
      t.json :position, null: false, default: {}
      t.integer :created_by, null: false, default: 0
      t.integer :spawn_mobs, null: false, default: 0
      t.string :mobs_template, array: true, default: []
      t.integer :min_mob_level, null: false, default: 1
      t.integer :max_mob_level, null: false, default: 1
      t.boolean :enabled, null: false, default: true

      t.timestamps
    end
  end
end
