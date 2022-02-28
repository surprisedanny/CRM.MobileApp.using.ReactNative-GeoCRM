import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { parse, setWidthBreakpoints } from 'react-native-extended-stylesheet-breakpoints';
import { useDispatch, useSelector } from 'react-redux';
import { getPipelineFilters, getPipelines } from '../../actions/pipeline.action';
import SvgIcon from '../../components/SvgIcon';
import Colors, { BG_COLOR, DISABLED_COLOR, PRIMARY_COLOR, TEXT_COLOR } from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { breakPoint } from '../../constants/Breakpoint';
import { Provider } from 'react-native-paper';

import { getBaseUrl, getToken } from '../../constants/Storage';
import { boxShadow, grayBackground, style } from '../../constants/Styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SLIDE_STATUS, SUB_SLIDE_STATUS } from '../../actions/actionTypes';
import FilterView from '../../components/FilterView';
import SearchBar from '../../components/SearchBar';

export default function SalesPipelineScreen(props) {
  const dispatch = useDispatch();
  const navigation = props.navigation;
  const currentLocation = useSelector(state => state.rep.currentLocation);
  const pipelineFilters = useSelector(state => state.selection.pipelineFilters);
  const crmStatus = useSelector(state => state.rep.crmSlideStatus);

  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState('0');
  const [showItem, setShowItem] = useState(0);

  const [allOpportunities, setAllOpportunities] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [canShowArrow, setShowArrow] = useState(true);

  useEffect(() => {
    if (props.screenProps) {
      props.screenProps.setOptions({
        title: "Pipeline"
      });
    }
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPipeLineData();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (pipelineFilters !== undefined) {
      loadPipeLineData(pipelineFilters);
    }

  }, [pipelineFilters])

  const loadPipeLineData = async (filters = '') => {
    var base_url = 'https://www.dev.georep.com/local_api_old';//await getBaseUrl();
    var token = await getToken();

    getPipelines(base_url, token, filters).then(res => {
      let stageItems = [];

      stageItems.push({ stage_id: '0', stage_name: 'All' });
      stageItems.push(...res.stages);
      setStages(stageItems);
      setAllOpportunities(res.opportunities);
      setOpportunities(res.opportunities);
      setSearchList(res.opportunities);
      setSelectedStage('0');
    })
  }

  const onSearchList = (searchKey) => {
    let list = [];
    opportunities.map((item, index) => {
      if (searchKey === '') {
        list.push(item);
      } else {
        if (item.opportunity_name.toLowerCase().includes(searchKey.toLowerCase())
          || item.location_name.toLowerCase().includes(searchKey.toLowerCase())) {
          list.push(item);
        }
      }
    });

    setSearchList(list);
  }

  const onTabSelection = (item) => {
    setSelectedStage(item.stage_id);
    let data = [];
    allOpportunities.map((opportunity, index) => {
      if (item.stage_id == '0') {
        data.push(opportunity);
      } else if (opportunity.stage_id == item.stage_id) {
        data.push(opportunity);
      }
    });

    setOpportunities(data);
    setSearchList(data);
  }

  const hexToRgbA = (hex, opacity) => {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + `,${opacity})`;
    }
    return hex;
  }

  const animation = (name) => {
    dispatch({ type: SLIDE_STATUS, payload: true });
    switch (name) {
      case "filter":
        dispatch(getPipelineFilters());
        setShowItem(1);
        return;
      default:
        return;
    }
  }

  const renderOpportunity = (item, index) => {
    return (
      <TouchableOpacity>
        <View style={styles.itemContainer}>
          <View style={styles.opportunityStyle}>
            <View style={[styles.dotIndicator, { backgroundColor: item.opportunity_status_color }]}></View>
            <View style={{ marginHorizontal: 5 }}>
              <Text style={styles.opportunityTitle}>{item.opportunity_name}</Text>
              <Text style={{ fontFamily: Fonts.secondaryMedium, fontSize: 12 }}>{item.location_name}</Text>
            </View>
          </View>
          <View style={[styles.stageItemBg, { backgroundColor: hexToRgbA(item.stage_color, 0.32) }]}>
            <Text style={{
              color: TEXT_COLOR,
              fontFamily: Fonts.secondaryRegular,
              fontSize: 12,
              textAlign: 'center', zIndex: 0
            }}>{item.stage_name}</Text>
          </View>
          <Text style={{ flex: 0.9, textAlign: 'right', fontFamily: Fonts.secondaryMedium, fontSize: 13 }}>{item.value}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderSeparator = () => (
    <View
      style={{
        backgroundColor: '#70707045',
        height: 0.5,
      }}
    />
  );

  const renderListHeading = () => {
    return <View style={{ paddingHorizontal: 0 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[styles.listheadingText, { flex: 2.2 }]}>Opportunity</Text>
        <Text style={[styles.listheadingText, { flex: 1.1 }]}>Stage</Text>
        <Text style={[styles.listheadingText, { textAlign: 'right', marginRight: 10 }]}>Value</Text>
      </View>
      <View style={{ backgroundColor: PRIMARY_COLOR, height: 2, marginVertical: 10 }}></View>
    </View>
  }

  const renderSearchBox = () => {
    return <View style={{ marginHorizontal: -10, marginTop: -10 }}>
      <SearchBar
        isFilter={true}
        animation={() => animation("filter")}
        onSearch={(text) => {
          onSearchList(text);
        }} />
    </View>
  }

  return (
    <Provider>
      <SafeAreaView>

        {crmStatus && showItem == 1 && <TouchableOpacity
          activeOpacity={1}
          style={grayBackground}
          onPress={() => {

            dispatch({ type: SUB_SLIDE_STATUS, payload: false })
            dispatch({ type: SLIDE_STATUS, payload: false });
            setShowItem(0);

          }}>

        </TouchableOpacity>
        }

        {crmStatus && showItem == 1 && <View
          style={[styles.transitionView, showItem == 0 ? { transform: [{ translateY: Dimensions.get('window').height + 100 }] } : { transform: [{ translateY: 0 }] }]}
        >
          <FilterView navigation={navigation} page={"pipeline"} onClose={() => {
            dispatch({ type: SLIDE_STATUS, payload: false });
            setShowItem(0);
          }} />
        </View>}

        <View style={styles.container}>
          <View style={[styles.tabContainer, boxShadow, { alignItems: 'center' }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ marginRight: 10, alignItems: 'center' }}
              onMomentumScrollEnd={(e) => {
                if (e.nativeEvent.contentOffset.x == 0) {
                  setShowArrow(true);
                } else {
                  setShowArrow(false);
                }
              }}>


              {stages.map((item, index) => {
                // console.log(item.stage_name);
                return <TouchableOpacity onPress={() => { onTabSelection(item) }}>
                  <Text key={index} style={[
                    styles.tabText, selectedStage === item.stage_id ? styles.tabActiveText : {}
                  ]}>{item.stage_name}</Text>
                </TouchableOpacity>
              })}

            </ScrollView>
            {canShowArrow && <SvgIcon icon="Arrow_Right_Btn" width='20px' height='25px' />}
          </View>
          {renderSearchBox()}
          {renderListHeading()}
          <FlatList
            data={searchList}
            renderItem={
              ({ item, index }) => renderOpportunity(item, index)
            }
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: 7, marginTop: 0 }}
            ItemSeparatorComponent={renderSeparator}
          />

        </View>
        <View style={styles.plusButtonContainer}>
          <TouchableOpacity style={style.innerPlusButton} onPress={() => {
            
          }}>
            <SvgIcon icon="Round_Btn_Default_Dark" width='70px' height='70px' />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Provider>
  )
}

const perWidth = setWidthBreakpoints(breakPoint);
const styles = EStyleSheet.create(parse({
  container: {
    padding: 10,
    minHeight: '100%',
    backgroundColor: BG_COLOR
  },
  tabText: {
    fontFamily: Fonts.secondaryMedium,
    fontSize: 15,
    color: DISABLED_COLOR,
    marginHorizontal: 10
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 7,
    backgroundColor: '#fff',
    marginBottom: 8
  },
  tabActiveText: {
    color: PRIMARY_COLOR,
    fontFamily: Fonts.secondaryBold,
    borderBottomColor: PRIMARY_COLOR,
    borderBottomWidth: 2,
    paddingBottom: 2,
  },
  listheadingText: {
    color: PRIMARY_COLOR,
    // marginHorizontal: 10,
    fontSize: 15,
    fontFamily: Fonts.secondaryMedium,
    // fontWeight: '600'
  },
  plusButtonContainer: {
    position: 'absolute',
    flexDirection: "row",
    bottom: 20,
    right: 20,
    zIndex: 1,
    elevation: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: Fonts.secondaryMedium,
    color: PRIMARY_COLOR
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10
  },
  opportunityStyle: {
    flex: 2.2,
    flexDirection: 'row',
    marginLeft: -5
  },
  dotIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  opportunityTitle: {
    fontFamily: 'Gilroy-Bold',
    fontSize: 14,
    color: 'black'
  },
  stageItemBg: {
    flex: 1.0,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5
  },
  searchBox: {
    position: perWidth('absolute', 'relative'),
    // width: '100%',
    padding: 10,
    // zIndex: 1,
    // elevation: 1
  },
  searchInput: {
    paddingLeft: 36,
    paddingRight: 50,
    color: '#5d5d5d',
    fontSize: 12,
    backgroundColor: Colors.whiteColor,
    borderRadius: 7,
    fontFamily: Fonts.secondaryMedium,
    height: 45,
  },
  searchIcon: {
    position: 'absolute',
    top: 24,
    left: 20,
  },
  filterImageButton: {
    position: 'absolute',
    top: 18,
    right: 20,
  },

  transitionView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BG_COLOR,
    elevation: 2,
    zIndex: 2,
    padding: 0,
  },

}));
