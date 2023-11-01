class BackpackItem < ApplicationRecord
  belongs_to :backpack
  belongs_to :item_template
end
