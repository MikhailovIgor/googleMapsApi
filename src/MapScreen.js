import React from 'react';
import {StyleSheet} from 'react-native';

import MapView from 'react-native-maps';

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const MapScreen = (props) => {
  return (
    <MapView
      showsUserLocation
      followsUserLocation
      style={styles.map}
      region={{
        latitude: props.userLatitude,
        longitude: props.userLongitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}
    >
      {props.children}
    </MapView>
  );
};

export default React.forwardRef((props, ref) => (
  <MapScreen innerRef={ref} {...props} />
));
