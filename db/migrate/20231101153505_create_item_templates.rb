class CreateItemTemplates < ActiveRecord::Migration[7.1]
  def change
    create_enum :item_type, ["Common", "Backpack", "Food", "Potion", "Sword"]
    create_enum :item_vocation, ["Any", "Knight", "Paladin"]

    create_table :item_templates do |t|
      t.uuid :uuid, default: 'uuid_generate_v4()', null: false
      t.string :name
      t.string :type, enum_type: 'item_type', default: 'Common', null: false
      t.string :description, null: false, default: ''
      t.integer :min_level, null: false, default: 0
      t.integer :vocation, enum_type: 'item_vocation', default: 'Any', null: false
      t.boolean :two_hands, null:false, default: false
      t.integer :attack, null: false, default: false
      t.float :weight, null: false, default: 0.0
      t.boolean :mergeable, null: false, default: false
      t.integer :heal_hp, null: false, default: 0
      t.string :image, null: false, default: 'none.gif'
      t.integer :defense, null: false, default: 0
      t.integer :slots, null: false, default: 0

      t.timestamps
    end

    add_index :item_templates, :name, unique: true
    add_index :item_templates, :uuid, unique: true
  end
end
