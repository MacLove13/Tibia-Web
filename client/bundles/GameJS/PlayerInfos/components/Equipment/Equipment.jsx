import React from 'react';
import './Equipment.scss';

import EmptyAmulet from './Images/item/empty_amulet.gif';
import EmptySword from './Images/item/empty_sword.gif';
import EmptyRing from './Images/item/empty_ring.gif';
import EmptyHelmet from './Images/item/empty_helmet.gif';
import EmptyArmor from './Images/item/empty_armor.gif';
import EmptyLegs from './Images/item/empty_legs.gif';
import EmptyBoots from './Images/item/empty_boots.gif';
import Backpack from './Images/backpack/default.gif';
import EmptyShield from './Images/item/empty_shield.gif';
import EmptyAmmo from './Images/item/empty_ammo.gif';

const Equipment = () => {

	return (
		<div className="background equipment">
			<div className="column">
				<div className="slot">
					<img src={EmptyAmulet} alt="necklace" />
				</div>
				<div className="slot">
					<img src={EmptySword} alt="left-hand" />
				</div>
				<div className="slot">
					<img src={EmptyRing} alt="ring" />
				</div>
			</div>
			<div className="column">
				<div className="slot">
					<img src={EmptyHelmet} alt="helmet" />
				</div>
				<div className="slot">
					<img src={EmptyArmor} alt="armos" />
				</div>
				<div className="slot">
					<img src={EmptyLegs} alt="legs" />
				</div>
				<div className="slot">
					<img src={EmptyBoots} alt="boots" />
				</div>
			</div>

			<div className="column">
				<div className="slot">
					<img src={Backpack} alt="backpack" />
				</div>
				<div className="slot">
					<img src={EmptyShield} alt="shield" />
				</div>
				<div className="slot">
					<img src={EmptyAmmo} alt="ammo" />
				</div>
			</div>
		</div>
	)
};

export default Equipment;