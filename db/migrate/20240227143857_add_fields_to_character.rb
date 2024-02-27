class AddFieldsToCharacter < ActiveRecord::Migration[7.1]
  def change
    add_column :characters, :actual_city, :integer, null: false, default: 0
    add_column :characters, :nation, :integer, null: false, default: 0
    add_column :characters, :nation_class, :integer, null: false, default: 1
    add_column :characters, :nation_exp, :integer, null: false, default: 0

    add_column :characters, :traits, :string, array: true, default: []
    add_column :characters, :skill, :integer, null: false, default: 0
    add_column :characters, :sub_skill, :integer, null: false, default: 0

    add_column :characters, :guild_id, :integer, null: false, default: 0
  end
end
