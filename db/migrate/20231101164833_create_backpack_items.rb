class CreateBackpackItems < ActiveRecord::Migration[7.1]
  def change
    create_table :backpack_items do |t|
      t.references :backpack, null: false, foreign_key: true
      t.references :item_template, null: false, foreign_key: true
      t.integer :quantity, null: false, default: 0

      t.timestamps
    end
  end
end
