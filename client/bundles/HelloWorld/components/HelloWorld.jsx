import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import style from './HelloWorld.module.css';

import cable from '../../../cable';

import WorldMap from '../../Game/Map/WorldMap/containers/WorldMap';

const HelloWorld = (props) => {
  

  return (
    <div>
      <WorldMap />
    </div>
  );
};

HelloWorld.propTypes = {
  name: PropTypes.string.isRequired, // this is passed from the Rails view
};

export default HelloWorld;
