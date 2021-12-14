import * as React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import {
  Button,
  Title
} from 'react-native-paper';
import { useDispatch } from 'react-redux';

import Divider from './Divider';
import FilterButton from './FilterButton';
import { PRIMARY_COLOR, BG_COLOR } from '../constants/Colors';
import { SLIDE_STATUS } from '../actions/actionTypes';

const filterButtonList = [
  "Stage",
  "Outcome",
  "Outcome Modified Date",
  "Lead Status"
];

export default function FilterView({navigation}) {
  const dispatch = useDispatch();
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={{padding: 6}} onPress={() => dispatch({type: SLIDE_STATUS, payload: false})}>
        <Divider />
      </TouchableOpacity>
      <View style={styles.sliderHeader}>
        <Title style={{fontFamily: 'Product Sans-Bold'}}>Filter your search</Title>
        <Button 
          labelStyle={{
            fontFamily: 'Product Sans-Regular', 
            letterSpacing: 0.2
          }}
          color="#DC143C" 
          uppercase={false} 
          onPress={() => console.log('Pressed')}
        >
          Clear Filters
        </Button>
      </View>
      {filterButtonList.map((list, key) => (
        <FilterButton text={list} key={key} />
      ))}
      <Button 
        mode="contained" 
        color={PRIMARY_COLOR} 
        uppercase={false} 
        labelStyle={{
          fontSize: 18, 
          fontFamily: 'Gilroy-Bold', 
          letterSpacing: 0.2
        }} 
        onPress={() => console.log("pressed")}>
        Apply Filters
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BG_COLOR
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
})