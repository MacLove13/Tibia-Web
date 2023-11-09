class Item < ApplicationRecord
	belongs_to :item_template
	belongs_to :character


	private

end
