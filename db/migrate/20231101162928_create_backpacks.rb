class CreateBackpacks < ActiveRecord::Migration[7.1]
  def change
    create_table :backpacks do |t|
      t.uuid :uuid, default: 'uuid_generate_v4()', null: false
      t.integer :slots, null: false, default: 1
      t.boolean :dropped, null: false, default: false
      t.json :position, null: false, default: { x: 0, y: 0 }
      t.string :image, null: false, default: 'Backpacks/Default.gif'

      t.references :character, null: false, default: 0
      t.references :item_template, null: false

      t.timestamps
    end

    add_reference :characters, :backpacks, foreign_key: true
  end
end
