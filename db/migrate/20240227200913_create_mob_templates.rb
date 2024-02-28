class CreateMobTemplates < ActiveRecord::Migration[7.1]
  def change
    create_table :mob_templates do |t|
      t.string :name, null: false, default: "Mob"
      t.string :alive_sprites, array: true, default: []
      t.string :dead_sprites, array: true, default: []
      t.string :max_damage_attack, null: false, default: 2
      t.integer :speed, null: false, default: 80
      t.integer :experience, null: false, default: 0
      t.integer :hp, null: false, default: 50
      t.boolean :hostile, null: false, default: false
      t.boolean :run_away_when_attacked, null: false, default: false
      t.json :possible_drops, null: false, default: {}
      t.integer :level_min, null: false, default: 1
      t.integer :level_max, null: false, default: 1
      t.integer :decompose_ticks_frame, null: false, default: 4000
      t.integer :element_base, null: false, default: 0

      t.timestamps
    end
  end
end
