import React from 'react';
import './Skills.scss';

import MenuIcon from './Images/icon.svg';

const Skills = () => {

	return (
		<>
			<div className="menu-title">
				<img width="14" src={MenuIcon} alt="/images/skills.svg" />
				<span>Skills</span>
			</div>
			<div className="menu-body">
				<div className="skills">
					<div className="inline">
						<p>Experience</p>
						<p id="player-experience">0</p>
					</div>
					<div className="inline">
						<p>Level</p>
						<p id="player-level">1</p>
					</div>
					<div className="experience">
						<div id="experience-bar" style={{ width: '0%' }} className="progressbar"></div>
					</div>

					<div className="inline">
						<p>Health</p>
						<p id="health">0/0</p>
					</div>
					<div className="experience">
						<div id="health-bar" style={{ width: '0%' }} className="progressbar health"></div>
					</div>
				</div>
			</div>
		</>
	)
};

export default Skills;