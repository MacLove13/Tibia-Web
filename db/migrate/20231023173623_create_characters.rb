class CreateCharacters < ActiveRecord::Migration[7.1]
  def change
    create_table :characters do |t|
      t.uuid :uuid, default: 'uuid_generate_v4()', null: false
      t.references :account, null: false, foreign_key: true
      t.string :name,         null: false, default: ''
      t.integer :level,       null: false, default: 1
      t.integer :experience,  null: false, default: 1
      t.string  :skin_name,   null: false, default: 'Hero'
      t.string  :u_class,   null: false, default: 'Warrior'

      t.integer :health,  null: false, default: 15
      t.integer :max_health,  null: false, default: 15
      t.integer :speed,  null: false, default: 100
      t.json :equipments, null: false, default: {}
      t.json :position, null: false, default: { x: 60, y: 50 }

      t.timestamps
    end

    add_index :characters, :name, unique: true
    add_index :characters, :uuid, unique: true
  end
end
