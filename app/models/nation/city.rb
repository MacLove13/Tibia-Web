class Nation::City < ApplicationRecord
	enum ownership_type: {
	  no_owner: 0,
	 	player: 1,
	  npc: 2,
	  guild: 3
	}
end
