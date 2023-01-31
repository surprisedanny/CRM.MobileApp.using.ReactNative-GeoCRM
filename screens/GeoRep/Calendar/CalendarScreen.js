import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleDoubleRight} from '@fortawesome/free-solid-svg-icons';
import SvgIcon from '../../../components/SvgIcon';
import Colors, {whiteLabel} from '../../../constants/Colors';
import {boxShadow, style} from '../../../constants/Styles';
import Fonts from '../../../constants/Fonts';
import {checkFeatureIncludeParam} from '../../../constants/Storage';
import {updateCalendar} from '../../../actions/calendar.action';
import {useSelector, useDispatch, connect} from 'react-redux';
import {CalendarItem} from './partial/CalendarItem';
import DraggableFlatList, {
  ScaleDecorator,
  useOnCellActiveAnimation,
} from 'react-native-draggable-flatlist';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  IS_CALENDAR_SELECTION,
  LOCATION_LOOP_LISTS,
} from '../../../actions/actionTypes';
import moment from 'moment';
import {
  expireToken,
  getPostParameter,
  showOfflineDialog,
} from '../../../constants/Helper';
import {Notification} from '../../../components/modal/Notification';
import {useIsFocused} from '@react-navigation/native';
import {checkConnectivity} from '../../../DAO/helper';
import GetRequestCalendarScheduleList from '../../../DAO/GetRequestCalendarScheduleList';
import LoadingProgressBar from '../../../components/modal/LoadingProgressBar';
var selectedIndex = 2;

export default function CalendarScreen(props) {
  
  const dispatch = useDispatch();
  const navigation = props.navigation;
  const currentLocation = useSelector(state => state.rep.currentLocation);
  const isFocused = useIsFocused();
  const [tabIndex, setTabIndex] = useState(2);
  const [lists, setLists] = useState([]);
  const [todayList, setTodayList] = useState([]);
  const [isOptimize, setIsOptimize] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    var screenProps = props.screenProps;
    if (screenProps === undefined) {
      screenProps = props.navigation;
    }
    if (screenProps) {
      screenProps.setOptions({
        headerTitle: () => {
          return (
            <TouchableOpacity onPress={() => {}}>
              <View style={style.headerTitleContainerStyle}>
                <Text style={style.headerTitle}>Calendar</Text>
              </View>
            </TouchableOpacity>
          );
        },
      });
    }
  });

  useEffect(() => {
    onRefresh();
  }, [isFocused]);
  const onRefresh = () => {
    if (selectedIndex === 1) {
      if (lists.length === 0) {
        loadList('last_week');
      }
    } else if (selectedIndex === 2 || selectedIndex === 0) {
      if (todayList.length === 0) {
        selectedIndex = 2;
        loadList('today');
      }
    } else if (selectedIndex === 3) {
      if (lists.length === 0) {
        loadList('week_ahead');
      }
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (selectedIndex === 2 || selectedIndex === 0) {
        selectedIndex = 2;
        loadList('today');
      }
    });
    return unsubscribe;
  }, [navigation]);
  console.log('isLoading', isLoading);
  const loadList = async (type, isOptimize = false) => {
    setIsOptimize(await checkFeatureIncludeParam('calendar_optimize'));
    setIsAdd(await checkFeatureIncludeParam('calendar_add'));

    setIsLoading(true);
    const param = {period: type};
    if (type == 'today' && isOptimize) {
      param.optimize = 1;
      param.current_time = moment().format('hh:mm:ss');
      param.user_coordinates_latitude = currentLocation.latitude;
      param.user_coordinates_longitude = currentLocation.longitude;
    }
    console.log('GetRequestCalendarScheduleList: param', param);
    GetRequestCalendarScheduleList.find(param)
      .then(res => {
        console.log('GetRequestCalendarScheduleList: res', res.items);
        if (selectedIndex == 2 || selectedIndex == 0) {
          setTodayList(res.items);
        } else {
          updateListForWeek(res.items);
        }
        setIsLoading(false);
      })
      .catch(e => {
        setLists([]);
        setTodayList([]);
        expireToken(dispatch, e);
        setIsLoading(false);
      });
  };

  const updateListForWeek = res => {
    let schedules = [];
    schedules = res;
    let schedule_dates = [];
    schedules.forEach(item => {
      let date = schedule_dates.find(a => a === item.schedule_date);
      if (!date) {
        schedule_dates.push(item.schedule_date);
      }
    });
    let sorted_schedule_dates = schedule_dates.sort(
      (a, b) => new Date(a) - new Date(b),
    );
    let sectionList = [];
    sorted_schedule_dates.forEach(item => {
      let data = schedules.filter(schedule => schedule.schedule_date === item);
      sectionList.push({
        title: item,
        data: data,
      });
    });

    setLists(sectionList);
  };

  const updateTodayLocationLists = async data => {
    var userParam = getPostParameter(currentLocation);
    var postData = {
      schedules: data,
      user_local_data: userParam.user_local_data,
    };
    updateCalendar(postData)
      .then(res => {})
      .catch(e => {
        expireToken(dispatch, e);
      });
  };

  const renderCalendarItem = (item, index, tabIndex) => {
    return (
      <View style={{marginTop: 10}}>
        <CalendarItem
          key={index}
          navigation={props.navigation}
          item={item}
          current={currentLocation}
          tabIndex={tabIndex}
          onRefresh={onRefresh}
          onItemSelected={() => {}}></CalendarItem>
      </View>
    );
  };

  const renderTodayItem = ({item, drag}) => {
    const {isActive} = useOnCellActiveAnimation();
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[
            isActive ? {} : {marginTop: 10},
            {backgroundColor: isActive ? '#eee' : Colors.bgColor},
          ]}>
          <CalendarItem
            onItemSelected={() => {
              dispatch({type: LOCATION_LOOP_LISTS, payload: todayList});
            }}
            key={item.schedule_id}
            navigation={props.navigation}
            item={item}
            current={currentLocation}
            tabIndex={tabIndex}>
            {' '}
          </CalendarItem>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  const onTabChanged = tabIndex => {
    setTabIndex(tabIndex);
    selectedIndex = tabIndex;
    var weekName = 'last_week';
    if (tabIndex == 2) {
      weekName = 'today';
    } else if (tabIndex == 3) {
      weekName = 'week_ahead';
    }
    loadList(weekName);
  };
  const onOptimize = () => {
    loadList('today', true);
  };

  const addLocationToCalendar = () => {
    dispatch({
      type: IS_CALENDAR_SELECTION,
      payload: true,
    });

    props.navigation.navigate('CRM', {
      screen: 'LocationSearch',
      params: {calendar_type: 'optimize'},
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Notification></Notification>
        <LoadingProgressBar/>
        <View style={[styles.tabContainer, boxShadow]}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => {
              onTabChanged(1);
            }}>
            <Text
              style={[
                styles.tabText,
                tabIndex === 1 ? styles.tabActiveText : {},
              ]}>
              Last Week
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => {
              onTabChanged(2);
            }}>
            <Text
              style={[
                styles.tabText,
                tabIndex === 2 ? styles.tabActiveText : {},
              ]}>
              Today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => {
              onTabChanged(3);
            }}>
            <Text
              style={[
                styles.tabText,
                tabIndex === 3 ? styles.tabActiveText : {},
              ]}>
              Week Ahead
            </Text>
          </TouchableOpacity>
        </View>

        {false && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => console.log('pressed')}>
            <Text style={[styles.startButtonText]}>Start My Day</Text>
            <FontAwesomeIcon
              style={styles.startButtonIcon}
              size={25}
              color="#fff"
              icon={faAngleDoubleRight}
            />
          </TouchableOpacity>
        )}

        <View style={{flex: 1}}>
          {(tabIndex == 1 || tabIndex == 3) && (
            <SectionList
              keyExtractor={(item, index) => index.toString()}
              sections={lists}
              renderItem={({item, index}) => {
                return renderCalendarItem(item, index, tabIndex);
              }}
              refreshing={isLoading}
              renderSectionHeader={({section}) => {
                console.log(section);
                return (
                  <Text
                    style={[
                      styles.itemTitle,
                      {textDecorationLine: 'underline', fontWeight: '700'},
                    ]}>
                    {moment(section.title).format('dddd DD MMM YYYY')}
                  </Text>
                );
              }}
            />
          )}
          {tabIndex == 2 && (
            <GestureHandlerRootView>
              <DraggableFlatList
                data={todayList}
                onDragEnd={({data}) => {
                  var tmp = [];
                  var newlists = [];
                  data.forEach((item, index) => {
                    item.schedule_order = (index + 1).toString();
                    newlists.push(item);
                    tmp.push({
                      schedule_order: (index + 1).toString(),
                      location_id: item.location_id,
                      schedule_id: item.schedule_id,
                      schedule_date: item.schedule_date,
                      schedule_time: item.schedule_time,
                    });
                  });
                  setTodayList(newlists);
                  updateTodayLocationLists(tmp);
                }}
                refreshing={isLoading}
                keyExtractor={item => item.schedule_id}
                renderItem={renderTodayItem}
              />
            </GestureHandlerRootView>
          )}
        </View>
      </View>

      <View style={styles.plusButtonContainer}>
        {isOptimize && tabIndex == 2 && (
          <TouchableOpacity
            style={style.innerPlusButton}
            onPress={() => {
              /*props.navigation.navigate('CRM', {
                screen: 'LocationSearch',
                params: {calendar_type: 'add'},
              });*/
              onOptimize();
            }}>
            <SvgIcon icon="Calendar_Optimize" width="70px" height="70px" />
          </TouchableOpacity>
        )}

        {isAdd && (
          <TouchableOpacity
            style={style.innerPlusButton}
            onPress={() => {
              checkConnectivity().then(isConnected => {
                if (isConnected) {
                  addLocationToCalendar();
                } else {
                  showOfflineDialog(dispatch);
                }
              });
            }}>
            <SvgIcon icon="Round_Btn_Default_Dark" width="70px" height="70px" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    minHeight: '100%',
    backgroundColor: Colors.bgColor,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 7,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  tabText: {
    fontFamily: Fonts.secondaryMedium,
    fontSize: 15,
    color: Colors.disabledColor,
  },
  tabActiveText: {
    color: whiteLabel().activeTabText,
    fontFamily: Fonts.secondaryBold,
    borderBottomColor: whiteLabel().activeTabUnderline,
    borderBottomWidth: 2,
    paddingBottom: 2,
  },
  startButton: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
    borderRadius: 7,
    backgroundColor: Colors.disabledColor,
    marginBottom: 16,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: Fonts.primaryRegular,
  },
  startButtonIcon: {
    position: 'absolute',
    right: 10,
  },
  plusButtonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 20,
    right: 20,
    zIndex: 1,
    elevation: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: Fonts.secondaryMedium,
    color: whiteLabel().mainText,
  },
});
