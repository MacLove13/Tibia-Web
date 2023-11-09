class Character < ApplicationRecord
	validates :name, presence: true
	
	has_one :character_authentication
	has_many :item

	after_create :create_initial_itens

	private

	def create_initial_itens
		
	end
end
