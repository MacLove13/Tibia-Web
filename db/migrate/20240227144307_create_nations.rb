class CreateNations < ActiveRecord::Migration[7.1]
  def change
    create_table :nations do |t|
      t.string :name
      t.integer :members_count, null: false, default: 0
      t.float :power, null: false, default: 0.0

      t.timestamps
    end
  end
end
