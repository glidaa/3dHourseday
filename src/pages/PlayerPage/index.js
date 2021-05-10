import React from 'react';
import ReactPlayer from 'react-player'

import bondi from '../../assets/videos/bondi.mp4';


const PlayerPage = ({ classes }) => {
  return (
      <ReactPlayer
        width="100%"
        height="44rem"
        playing
        muted
        loop
        url={bondi} />
  );
};

export default PlayerPage;
