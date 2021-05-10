import React from 'react';

// components
import LocThreeComponent from '../../components/LocThreeComponent';

// import cottageFbx from '../../assets/fbx/dFiles/cottage.fbx';
import bondiGlb from '../../assets/glb/dFiles/bondi2.glb';

// styling
import './index.css';

const LocationPage = () => {
  return (
    <div className={['tertiary-bg', 'layout']}>
      <LocThreeComponent
        glbFile={bondiGlb}
        onError={(e) => console.log(`Error: Wrong response type: ${e}`)}
        />
    </div>
  );
};

export default LocationPage;
