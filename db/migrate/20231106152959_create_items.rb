class CreateItems < ActiveRecord::Migration[7.1]
  def change
    create_table :items do |t|
      t.uuid :uuid, default: 'uuid_generate_v4()', null: false
      t.references :character, null: true, foreign_key: true
      t.references :item_template, null: false, foreign_key: true
      t.integer :quantity, null: false, default: 0
      t.json :position, null: true
      t.uuid :inside_item, null: true

      t.timestamps
    end
  end
end
