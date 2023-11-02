# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2023_11_01_164833) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "item_type", ["Common", "Backpack", "Food", "Potion", "Sword"]
  create_enum "item_vocation", ["Any", "Knight", "Paladin"]

  create_table "accounts", force: :cascade do |t|
    t.string "username", default: "", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.uuid "uuid", default: -> { "uuid_generate_v4()" }, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["confirmation_token"], name: "index_accounts_on_confirmation_token", unique: true
    t.index ["email"], name: "index_accounts_on_email", unique: true
    t.index ["reset_password_token"], name: "index_accounts_on_reset_password_token", unique: true
    t.index ["username"], name: "index_accounts_on_username", unique: true
    t.index ["uuid"], name: "index_accounts_on_uuid", unique: true
  end

  create_table "backpack_items", force: :cascade do |t|
    t.uuid "uuid", default: -> { "uuid_generate_v4()" }, null: false
    t.bigint "backpack_id", null: false
    t.bigint "item_template_id", null: false
    t.integer "quantity", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["backpack_id"], name: "index_backpack_items_on_backpack_id"
    t.index ["item_template_id"], name: "index_backpack_items_on_item_template_id"
  end

  create_table "backpacks", force: :cascade do |t|
    t.uuid "uuid", default: -> { "uuid_generate_v4()" }, null: false
    t.integer "slots", default: 1, null: false
    t.boolean "dropped", default: false, null: false
    t.json "position", default: {"x"=>0, "y"=>0}, null: false
    t.string "image", default: "Backpacks/Default.gif", null: false
    t.bigint "character_id", default: 0, null: false
    t.bigint "item_template_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["character_id"], name: "index_backpacks_on_character_id"
    t.index ["item_template_id"], name: "index_backpacks_on_item_template_id"
  end

  create_table "character_authentications", force: :cascade do |t|
    t.bigint "account_id", null: false
    t.bigint "character_id", null: false
    t.string "code", default: "", null: false
    t.string "connected_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_character_authentications_on_account_id"
    t.index ["character_id"], name: "index_character_authentications_on_character_id"
  end

  create_table "characters", force: :cascade do |t|
    t.uuid "uuid", default: -> { "uuid_generate_v4()" }, null: false
    t.bigint "account_id", null: false
    t.string "name", default: "", null: false
    t.integer "level", default: 1, null: false
    t.integer "experience", default: 1, null: false
    t.string "skin_name", default: "Hero", null: false
    t.string "u_class", default: "Warrior", null: false
    t.integer "health", default: 15, null: false
    t.integer "max_health", default: 15, null: false
    t.integer "speed", default: 100, null: false
    t.json "equipments", default: {}, null: false
    t.json "position", default: {"x"=>60, "y"=>50}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "backpacks_id"
    t.index ["account_id"], name: "index_characters_on_account_id"
    t.index ["backpacks_id"], name: "index_characters_on_backpacks_id"
    t.index ["name"], name: "index_characters_on_name", unique: true
    t.index ["uuid"], name: "index_characters_on_uuid", unique: true
  end

  create_table "item_templates", force: :cascade do |t|
    t.uuid "uuid", default: -> { "uuid_generate_v4()" }, null: false
    t.string "name"
    t.string "type", default: "Common", null: false
    t.string "description", default: "", null: false
    t.integer "min_level", default: 0, null: false
    t.integer "vocation", null: false
    t.boolean "two_hands", default: false, null: false
    t.integer "attack", default: 0, null: false
    t.float "weight", default: 0.0, null: false
    t.boolean "mergeable", default: false, null: false
    t.integer "heal_hp", default: 0, null: false
    t.string "image", default: "none.gif", null: false
    t.integer "defense", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_item_templates_on_name", unique: true
    t.index ["uuid"], name: "index_item_templates_on_uuid", unique: true
  end

  create_table "map_tiles", force: :cascade do |t|
    t.integer "x"
    t.integer "y"
    t.boolean "walkable"
    t.string "tileType"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "backpack_items", "backpacks"
  add_foreign_key "backpack_items", "item_templates"
  add_foreign_key "character_authentications", "accounts"
  add_foreign_key "character_authentications", "characters"
  add_foreign_key "characters", "accounts"
  add_foreign_key "characters", "backpacks", column: "backpacks_id"
end
