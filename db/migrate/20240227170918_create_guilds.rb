class CreateGuilds < ActiveRecord::Migration[7.1]
  def change
    create_table :guilds do |t|
      t.string :name

      t.string :points, null: false, default: 0
      t.integer :created_by, null: false, default: 0
      t.boolean :accept_new_members, null: false, default: 0
      t.integer :base_city_id, null: false, default: 0

      t.timestamps
    end
  end
end
