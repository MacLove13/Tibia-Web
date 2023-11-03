import React, { useState, useEffect } from 'react';
import './PlayerInfos.scss';

import Equipment from '../components/Equipment/Equipment';
import ItemMenu from '../components/ItemMenu/ItemMenu';

import Battle from 'bundles/GameJS/PlayerInfos/components/ItemMenu/Content/Battle/Battle'
import Skills from 'bundles/GameJS/PlayerInfos/components/ItemMenu/Content/Skills/Skills'
import Backpack from 'bundles/GameJS/PlayerInfos/components/ItemMenu/Content/Backpack/Backpack';


import GameInstance, { EventType } from 'bundles/GameJS/store/GameInit';


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

  const socket = GameInstance.init.networkSystem.GetSocket();

  useEffect(() => {
	  socket.on("character:showBag", (data) => {
		  // console.log(data);

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
	}, []);

	return (
		<div className="player-infos">
			<Equipment />

			{ openedWindows.map((wind, index) => {

				if (wind.type == 'Battle') {
					return (
						<ItemMenu key={`wind-battle-${index}`} maxHeight={wind.maxHeight}>
							<Battle />
						</ItemMenu>
					)
				}

				else if (wind.type == 'Skills') {
					return (
						<ItemMenu key={`wind-battle-${index}`} maxHeight={wind.maxHeight}>
							<Skills />
						</ItemMenu>
					)
				}

				else if (wind.type == 'Backpack') {
					return (
						<ItemMenu key={`wind-backpack-${index}`} maxHeight={wind.maxHeight}>
							<Backpack slots={wind.slots} items={wind.items} uuid={wind.uuid} />
						</ItemMenu>
					)
				}

			})}
			
		</div>
	);
};

export default PlayerInfos;