import {View, Text, ScrollView, FlatList, Dimensions} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import SyncAll from './../partial/SyncAll';
import {SubmitButton} from '../../../../components/shared/SubmitButton';
import IndicatorDotScroller from '../../../../components/common/IndicatorDotScroller';
import Colors from '../../../../constants/Colors';
import Visits from '../partial/cards/Visits';
import {useSelector} from 'react-redux';
import {getApiRequest, postApiRequest} from '../../../../actions/api.action';
import ActivityCard from '../partial/cards/ActivityCard';
import {getLocalData, storeLocalValue} from '../../../../constants/Storage';
import {expireToken, getPostParameter} from '../../../../constants/Helper';
import {Constants, Strings} from '../../../../constants';
import OdometerReadingModal from './modal/OdometerReadingModal';
import {updateCurrentLocation} from '../../../../actions/google.action';
import {useDispatch} from 'react-redux';
import {Notification} from '../../../../components/modal/Notification';
import {showNotification} from '../../../../actions/notification.action';
import {CHECKIN} from '../../../../actions/actionTypes';
import {initializeDB} from '../../../../services/SyncDatabaseService/SyncTable';
import CheckOutViewContainer from '../../../../components/common/CheckOut/CheckOutViewContainer';

const MainPage = props => {
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const [isStart, setIsStart] = useState(true);
  const [startEndDayId, setStartEndDayId] = useState(0);
  const [pages, setPages] = useState(['', '']);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activityCard, setActivityCard] = useState(null);
  const [visitCard, setVisitCard] = useState(null);
  const pageWidth = Dimensions.get('screen').width - 20;
  const currentLocation = useSelector(state => state.rep.currentLocation);
  const odometerReadingModalRef = useRef(null);
  const features = useSelector(
    state => state.selection.payload.user_scopes.geo_rep.features,
  );
  const [currentCall, setCurrentCall] = useState('');
  const [checkinStatus, setCheckinStatus] = useState(false);
  const isCheckin = useSelector(state => state.location.checkIn);
  const navigation = props.navigation;
  const [isLoading, setIsLoading] = useState(false);
  let isSubscribed = true;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPage();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    loadPage();
    if (!isCheckin) {
      cleanLocationId();
    }
    return () => (isSubscribed = false);
  }, [isCheckin]);

  useEffect(() => {
    initializeDB().then(res => {
      console.log(' ----------------- initaliz db end ---------------- ');
      setRefresh(true);
    });
  }, []);

  const cleanLocationId = async () => {
    await storeLocalValue('@specific_location_id', '');
  };

  const loadPage = () => {
    if (currentLocation.latitude === undefined) {
      dispatch(updateCurrentLocation());
    }

    var param = {
      current_latitude:
        currentLocation.latitude != undefined ? currentLocation.latitude : 1,
      current_longitude:
        currentLocation.longitude != undefined ? currentLocation.longitude : 1,
    };
    if (isLoading == false) {
      setIsLoading(true);
      getApiRequest('home/main-dashboard', param)
        .then(async res => {
          setIsLoading(false);
          if (isSubscribed) {
            setVisitCard(res.items.visits_card);
            setActivityCard(res.items.activity_card);
            setCurrentCall(res.items.current_call);
            setCheckinStatus(res.items.checkin_state);
            if (res.items.checkin_state != '') {
              await storeLocalValue('@checkin', '1');
              await storeLocalValue(
                '@specific_location_id',
                res.items.checkin_state,
              );
              dispatch({type: CHECKIN, payload: true});
            } else {
              await storeLocalValue('@checkin', '0');
            }
            setIsStart(
              res.items.startEndDay_state ===
                Constants.homeStartEndType.START_MY_DAY
                ? true
                : false,
            );
            await storeLocalValue(
              'start_my_day',
              res.items.startEndDay_state ===
                Constants.homeStartEndType.START_MY_DAY
                ? '1'
                : '0',
            );
          }
        })
        .catch(e => {
          setIsLoading(false);
          expireToken(dispatch, e);
        });
    }
    initData();
  };

  const initData = async () => {
    var startMyDay = await getLocalData('start_my_day');
    setIsStart(startMyDay === null || startMyDay === '1' ? true : false);
  };

  const _callMyDay = () => {
    var userParam = getPostParameter(currentLocation);
    var postData = {
      startEndDay_type: isStart
        ? Constants.homeStartEndType.START_MY_DAY
        : Constants.homeStartEndType.END_MY_DAY,
      user_local_data:
        userParam.user_local_data != undefined
          ? userParam.user_local_data
          : {time_zone: '', latitude: 0, longitude: 0},
    };
    postApiRequest('home/startEndDay', postData)
      .then(async res => {
        if (res.status === Strings.Success) {
          setStartEndDayId(res.startEndDay_id);
          await storeLocalValue('start_my_day', isStart ? '0' : '1');
          setIsStart(!isStart);
          if (features.includes('odometer_reading')) {
            odometerReadingModalRef.current.showModal();
          }
        }
      })
      .catch(e => {
        expireToken(dispatch, e);
      });
  };

  const onCaptureAction = async ({type, value}) => {
    dispatch(
      showNotification({
        type: Strings.Success,
        message: value,
        buttonText: Strings.Ok,
      }),
    );
  };

  const renderCards = (item, index) => {
    if (index == 0) {
      return (
        <View key={index} style={{marginRight: 1, width: pageWidth}}>
          <Visits {...props} visitCard={visitCard} />
        </View>
      );
    } else if (index == 1) {
      return (
        <View key={index} style={{marginRight: 1, width: pageWidth}}>
          {activityCard && (
            <ActivityCard activityCard={activityCard}></ActivityCard>
          )}
        </View>
      );
    } else if (index == 2) {
      return (
        <View key={index} style={{marginRight: 1, width: pageWidth}}>
          <Text>dd</Text>
        </View>
      );
    }
  };

  return (
    <ScrollView style={{flex: 1, marginHorizontal: 10}}>
      <Notification></Notification>

      <View style={{marginTop: 5}}>
        <SubmitButton
          bgStyle={{
            backgroundColor: isStart ? Colors.disabledColor : Colors.redColor,
            borderRadius: 3,
          }}
          title={isStart ? Strings.Start_My_Day : Strings.End_My_Day}
          onSubmit={() => {
            _callMyDay();
          }}></SubmitButton>
      </View>

      <SyncAll refresh={refresh}></SyncAll>

      {isCheckin && (
        <CheckOutViewContainer
          type="home"
          checkinStatus={checkinStatus}
          currentCall={currentCall}></CheckOutViewContainer>
      )}

      <FlatList
        removeClippedSubviews={false}
        initialNumToRender={10}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        data={pages}
        onScroll={event => {
          if (event.nativeEvent.contentOffset.x % pageWidth == 0) {
            setSelectedIndex(event.nativeEvent.contentOffset.x / pageWidth);
          }
        }}
        renderItem={({item, index}) => renderCards(item, index)}
        keyExtractor={(item, index) => index.toString()}
      />

      <IndicatorDotScroller
        total={2}
        selectedIndex={selectedIndex}></IndicatorDotScroller>

      <OdometerReadingModal
        ref={odometerReadingModalRef}
        title={Strings.Home.Odometer_Reading}
        isStart={isStart}
        startEndDayId={startEndDayId}
        currentLocation={currentLocation}
        onButtonAction={onCaptureAction}
      />
    </ScrollView>
  );
};

export default MainPage;
