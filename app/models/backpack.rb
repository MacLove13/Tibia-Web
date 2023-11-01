class Backpack < ApplicationRecord
	has_many :backpack_item
	belongs_to :item_template
end
