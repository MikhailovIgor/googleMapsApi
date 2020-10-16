import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import PolyLine from '@mapbox/polyline';
import MapView, {Polyline, Marker} from 'react-native-maps';

// import MapScreen from './MapScreen';
import PlaceInput from './components/PlaceInput';
import {URL, APIKEY} from './constants/urlConstants';

const App: () => React$Node = () => {
  const [mapPermission, setMapPermission] = useState(false);
  const [userLatitude, setUserLatitude] = useState(0);
  const [userLongitude, setUserLongitude] = useState(0);
  const [destinationCoords, setDestinationCoords] = useState([]);

  const map = useRef();

  const getUserPosition = () => {
    setMapPermission(true);
    Geolocation.watchPosition(
      (pos) => {
        setUserLatitude(pos.coords.latitude);
        setUserLongitude(pos.coords.longitude);
      },
      (err) => console.warn(err),
      {enableHighAccuracy: true},
    );
  };

  const showDirectionsOnMap = async (placeId) => {
    try {
      const result = await axios.get(
        `${URL}/directions/json?origin=${userLatitude},${userLongitude}&destination=place_id:${placeId}&key=${APIKEY}`,
      );
      const points = PolyLine.decode(
        result.data.routes[0].overview_polyline.points,
      );

      const latLng = points.map((point) => ({
        latitude: point[0],
        longitude: point[1],
      }));
      setDestinationCoords(latLng);
      console.log(map);
      map.current.fitToCoordinates(latLng, {
        edgePadding: {top: 20, bottom: 20, left: 20, right: 20},
      });
    } catch (e) {
      console.log(e);
    }
  };

  const requestFineLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getUserPosition();
        }
      } else {
        getUserPosition();
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    requestFineLocation();
  }, []);

  // useEffect(() => () => Geolocation.clearWatch(null));

  let polyline =
    destinationCoords.length > 0 ? (
      <Polyline
        coordinates={destinationCoords}
        strokeWidth={5}
        strokeColor="#D70F0F"
      />
    ) : null;

  let marker =
    destinationCoords.length > 0 ? (
      <Marker coordinate={destinationCoords[destinationCoords.length - 1]} />
    ) : null;

  if (mapPermission) {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <MapView
            ref={map}
            showsUserLocation
            followsUserLocation
            style={styles.map}
            region={{
              latitude: userLatitude,
              longitude: userLongitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}>
            {polilyne}
            {marker}
          </MapView>
          <PlaceInput
            latitude={userLatitude}
            longitude={userLongitude}
            showDirectionsOnMap={showDirectionsOnMap}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default App;
