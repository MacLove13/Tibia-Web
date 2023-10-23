class CreateCharacters < ActiveRecord::Migration[7.1]
  def change
    create_table :characters do |t|
      t.references :account, null: false, foreign_key: true
      t.string :name,         null: false, default: ''
      t.integer :level,       null: false, default: 1
      t.integer :experience,  null: false, default: 1
      t.string  :skin_name,   null: false, default: 'default'

      t.timestamps
    end

    add_index :characters, :name, unique: true
  end
end
