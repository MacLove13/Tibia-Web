class ItemTemplate < ApplicationRecord
  self.inheritance_column = 'sti_type'

	enum type: [ :food, :backpack, :weapon, :potion ]
  enum vocation: { no_vocation: 0, knight: 1, paladin: 2, sorcerer: 3, druid: 4 }
end
