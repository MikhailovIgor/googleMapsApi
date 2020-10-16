import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import _ from 'lodash';

import {URL, APIKEY} from '../constants/urlConstants';

const PlaceInput = ({latitude, longitude, showDirectionsOnMap}) => {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [destination, setDestination] = useState('');

  const getPlace = async (inputVal) => {
    setInputValue(inputVal);
    const result = await axios.get(
      `${URL}/place/autocomplete/json?key=${APIKEY}&input=${inputVal}&location=${latitude},${longitude}`,
    );
    setPredictions(result.data.predictions);
    console.log(result.data);
  };

  const getPlacesDebounced = _.debounce(getPlace, 1000);

  const showPredictions = predictions.map((prediction) => {
    const {place_id, structured_formatting} = prediction;

    return (
      <TouchableWithoutFeedback
        key={place_id}
        onPress={() => {
          setDestination(structured_formatting.main_text);
          setPredictions([]);
          showDirectionsOnMap(place_id);
          Keyboard.dismiss();
        }}>
        <View style={styles.suggestionStyle}>
          <Text>{structured_formatting.main_text}</Text>
          <Text style={styles.secondaryText}>
            {structured_formatting.secondary_text}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  });

  return (
    <View>
      <TextInput
        autoCorrect={false}
        autoCapitalize="none"
        style={styles.placeInputStyle}
        placeholder="Where to?"
        value={destination} //change destination to inputValue
        onChangeText={(input) => {
          setDestination(input); // change setDestination to setInputValue
          getPlacesDebounced(input);
        }}
      />
      {showPredictions}
    </View>
  );
};

const styles = StyleSheet.create({
  placeInputStyle: {
    height: 40,
    backgroundColor: '#fff',
    marginTop: 50,
    padding: 5,
  },
  suggestionStyle: {
    backgroundColor: '#fff',
    padding: 5,
  },
  secondaryText: {
    color: '#777',
  },
});
export default PlaceInput;
