class Character < ApplicationRecord
	validates :name, presence: true
	
	has_one :character_authentication
	has_one :backpack, required: false

	after_create :create_initial_itens

	private

	def create_initial_itens
		backpack_template_id = ItemTemplate.find(1).id
		created_backpack ||= Backpack.create(
			slots: 20,
			dropped: false,
			character_id: self.id,
			item_template_id: backpack_template_id,
		)

		self.update(backpacks_id: created_backpack.id)
	end
end
