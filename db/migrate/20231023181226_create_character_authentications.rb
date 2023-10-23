class CreateCharacterAuthentications < ActiveRecord::Migration[7.1]
  def change
    create_table :character_authentications do |t|
      t.references :account, null: false, foreign_key: true
      t.references :character, null: false, foreign_key: true
      t.string :code, null: false, default: ""
      t.string :connected_ip

      t.timestamps
    end
  end
end
