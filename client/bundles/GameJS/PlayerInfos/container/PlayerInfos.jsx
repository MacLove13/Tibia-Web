import React, { useState, useEffect } from 'react';
import './PlayerInfos.scss';

import Equipment from '../components/Equipment/Equipment';
import ItemMenu from '../components/ItemMenu/ItemMenu';

import Battle from 'bundles/GameJS/PlayerInfos/components/ItemMenu/Content/Battle/Battle'
import Skills from 'bundles/GameJS/PlayerInfos/components/ItemMenu/Content/Skills/Skills'
import Backpack from 'bundles/GameJS/PlayerInfos/components/ItemMenu/Content/Backpack/Backpack';


import Game, { EventType } from 'bundles/GameJS/store/GameInit';


const PlayerInfos = ({ Init }) => {
	const [openedWindows, setOpenedWindows] = useState([
		{
			type: 'Battle',
			maxHeight: 200	
		},
		{
			type: 'Skills',
			maxHeight: 100
		}
	]);

  const gameInstance = new Game();

  const socket = gameInstance.init.networkSystem.GetSocket();

  socket.on("character:showBag", (data) => {
	  console.log(data);

	  setOpenedWindows(prevWinds => {
		  const existingWindowIndex = prevWinds.findIndex(wind => wind.uuid === data.uuid);
		    
		  if (existingWindowIndex > -1) {
		    return prevWinds.map((wind, index) => {
		      if (index === existingWindowIndex) {
		        return {
		          ...wind,
		          items: data.Data,
		          slots: data.slots,
		        };
		      }
		      return wind;
		    });
		  }
		    
		  return [
		    ...prevWinds,
		    {
		      uuid: data.uuid,
		      slots: data.slots,
		      type: 'Backpack',
		      maxHeight: 176,
		      items: data.Data
		    }
		  ];
		});
	});

	return (
		<div className="player-infos">
			<Equipment />

			{ openedWindows.map(wind => {

				if (wind.type == 'Battle') {
					return (
						<ItemMenu maxHeight={wind.maxHeight}>
							<Battle />
						</ItemMenu>
					)
				}

				else if (wind.type == 'Skills') {
					return (
						<ItemMenu maxHeight={wind.maxHeight}>
							<Skills />
						</ItemMenu>
					)
				}

				else if (wind.type == 'Backpack') {
					return (
						<ItemMenu maxHeight={wind.maxHeight}>
							<Backpack slots={wind.slots} items={wind.items} />
						</ItemMenu>
					)
				}

			})}
			
		</div>
	);
};

export default PlayerInfos;