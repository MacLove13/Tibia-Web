class Character < ApplicationRecord
	validates :name, presence: true
	
	has_one :character_authentication
end
