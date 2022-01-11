import React, { useEffect } from 'react';
import { SafeAreaView, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import { setWidthBreakpoints, parse } from 'react-native-extended-stylesheet-breakpoints';

import LocationInfoInput from '../../components/LocationInfoInput';
import Skeleton from '../../components/Skeleton';
import { PRIMARY_COLOR, BG_COLOR, TEXT_COLOR } from '../../constants/Colors';
import { boxShadow } from '../../constants/Styles';
import FilterButton from '../../components/FilterButton';
import SvgIcon from '../../components/SvgIcon';
import MarkerIcon from '../../components/Marker';
import { breakPoint } from '../../constants/Breakpoint';
import { SLIDE_STATUS, SUB_SLIDE_STATUS } from '../../actions/actionTypes';
import Fonts from '../../constants/Fonts';
import Images from '../constants/Images';


const Rectangle = ({style, text, backgroundColor, borderColor, icon}) => (
  <View style={[styles.rectangle, style, {backgroundColor, borderColor}, borderColor ? {borderWidth: 1} : {}]}>
    <Text style={styles.text}>{text}</Text>
    {icon && <MarkerIcon icon={icon} width="20px" height="20px" />}
  </View>
);

export default function LocationSpecificInfoScreen(props) {
  const dispatch = useDispatch();
  const locationInfo = useSelector(state => state.location.locationInfo);

  useEffect(() => {
    dispatch({type: SLIDE_STATUS, payload: false});
    dispatch({type: SUB_SLIDE_STATUS, payload: false});

    console.log(" start LocationSpecificInfoScreen");
  });

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View style={styles.headerBox}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={styles.headerTitleBox}>
              <View style={styles.subtitleBox}>
                <SvgIcon style={styles.headerIcon} icon="Person_Sharp_White" width='14px' height='14px' />
                <Text style={styles.subtitle}>{locationInfo ? locationInfo.location_name.custom_field_name : ''}</Text>
              </View>
              <Text style={styles.title}>{locationInfo ? locationInfo.location_name.value : ''}</Text>
            </View>
            <View style={styles.subtitleBox}>
              <SvgIcon style={styles.headerIcon} icon="Insert_Invitation" width='16px' height='16px' />
              <Text style={styles.subtitle}>Last Interaction: { locationInfo ? locationInfo.last_interaction : ''}</Text>
            </View>
          </View>
          <View style={styles.headerTitleBox}>
            <View style={styles.subtitleBox}>
              <SvgIcon style={styles.headerIcon} icon="Location_Arrow_White" width='14px' height='14px' />
              <Text style={styles.subtitle}>Address:</Text>
            </View>
            <Text style={styles.title}>{ locationInfo ? locationInfo.address : ''}</Text>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Check out</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.filterButton}>
            <FilterButton text="Contact: Jack Reacher" />
          </View>
        </View>
        <View style={styles.innerContainer}>
          <View style={styles.locationInfoBox}>
            <View style={[styles.cardBox, boxShadow]}>
              <Text style={styles.boldText}>Outcome</Text>
              <View style={{ flexDirection: 'row', position: 'relative' }}>
                {
                  locationInfo && 
                  <View style={styles.outComeBox}>
                    {locationInfo.outcomes && locationInfo.outcomes.map((item, key) => (
                      <Rectangle key={key} style={{ width: '48%' }} text={item.outcome_name} icon="Red_X" backgroundColor="#155AA14F" />
                    ))}                  
                  </View>
                }
                
                <TouchableOpacity>
                  <Image style={styles.refreshImage} source={Images.loopButton} />
                </TouchableOpacity>
              </View>
            </View>
            <LocationInfoInput />
          </View>
          <View style={styles.cardContainer}>
            {
              locationInfo &&
              <View style={[styles.cardBox, boxShadow]}>
                <Text style={styles.boldText}>Stage</Text>
                {locationInfo.stages.map((item, key) => (
                  <Rectangle key={key} text={item.stage_name} backgroundColor="#15A1234F" />
                ))}              
              </View>
            }                        
          </View>
        </View>
        <View style={{height: 60}}></View>
      </ScrollView>
      <TouchableOpacity style={styles.plusButton}>
        <SvgIcon icon="Round_Btn_Default_Dark" width='70px' height='70px' />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const perWidth = setWidthBreakpoints(breakPoint);

const styles = EStyleSheet.create(parse({
  container: {
    backgroundColor: BG_COLOR,
    padding: 10,
  },
  headerBox: {
    backgroundColor: PRIMARY_COLOR,
    padding: 10,
    paddingBottom: 0,
    marginBottom: 8
  },
  headerTitleBox: {
    flexDirection: perWidth('row', 'column'),
    alignItems: 'flex-start',
    marginBottom: 8
  },
  subtitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    marginBottom: 8,
    marginRight: 8
  },
  subtitle: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'left',
    fontFamily: 'Gilroy-Medium',
  },
  dateText: {
    color: '#0AD10A',
    fontFamily: 'Gilroy-Medium',
  },
  title: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Gilroy-Bold',
    lineHeight: 22,
    maxWidth: 300
  },
  headerIcon: {
    marginRight: 8
  },
  innerContainer: {
    justifyContent: 'space-between',
    flexDirection: perWidth('row-reverse', 'column')
  },
  locationInfoBox: {
    width: perWidth('63%', '100%')
  },
  cardContainer: {
    width: perWidth('33%', '100%'),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  cardBox: {
    display: perWidth('flex', 'none'),
    width: '100%',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  boldText: {
    fontSize: 18,
    color: TEXT_COLOR,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 8
  },
  text: {
    fontSize: 16,
    color: TEXT_COLOR,
    fontFamily: 'Gilroy-Medium'
  },
  card: {
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginBottom: 8,
    width: perWidth('100%', '48%'),
    padding: 12,
    height: 80,
    borderRadius: 10,
  },
  cardTitleBox: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  cardIcon: {
    marginRight: 6
  },
  cardTitle: {
    color: TEXT_COLOR,
    fontFamily: 'Gilroy-Bold',
  },
  cardTextBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    color: '#9D9FA2',
    fontSize: 12,
    fontFamily: Fonts.primaryRegular
  },
  plusButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    zIndex: 1,
    elevation: 1,
  },
  rectangle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 7,
    marginBottom: 8,
  },
  refreshImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 68,
    height: 68
  },
  outComeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginRight: 88,
  },
  filterButton: {
    display: perWidth('none', 'flex')
  },
  checkoutButton: {
    display: perWidth('flex', 'none'),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: 'auto',
    width: 160,
    height: 40,
    borderRadius: 20
  },
  checkoutButtonText: {
    fontSize: 16,
    color: PRIMARY_COLOR,
    fontFamily: Fonts.primaryMedium,
  }
}));