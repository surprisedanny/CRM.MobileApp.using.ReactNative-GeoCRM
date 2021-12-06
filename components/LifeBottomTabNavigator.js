import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { Fragment, useState } from 'react';
import ToggleSwitch from 'toggle-switch-react-native';

import HomeLifeScreen from '../screens/GeoLife/HomeLifeScreen';
import NewsScreen from '../screens/GeoLife/NewsScreen';
import LocationsLifeScreen from '../screens/GeoLife/LocationsLifeScreen';
import CheckInScreen from '../screens/GeoLife/CheckInScreen';
import LifeMoreScreen from '../screens/GeoLife/LifeMoreScreen';

import SvgIcon from './SvgIcon';
import { PRIMARY_COLOR } from '../constants/Colors';

const BottomTab = createBottomTabNavigator();

export default function RepBottomTabNavigator({ navigation }) {
  return (
    <BottomTab.Navigator
      initialRouteName="HomeLife"
      screenOptions={{
        tabBarActiveTintColor: "#fff",
        tabBarHideOnKeyboard: true,
        headerStyle: {
          backgroundColor: PRIMARY_COLOR,
        },
        tabBarShowLabel: true,
        headerTitleStyle:  {
          color: "#fff",
          fontFamily: 'Product Sans-Regular'
        },
        tabBarIconStyle: {
          color: "#fff",
        },
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 60,
          paddingTop: 10,
          paddingBottom: 10
        }
      }}>
      <BottomTab.Screen
        name="HomeLife"
        component={HomeLifeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Home_Black_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Home_Black" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />
      <BottomTab.Screen
        name="News"
        component={NewsScreen}
        options={{
          title: 'News',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Location_Arrow_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Location_Arrow" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />
      <BottomTab.Screen
        name="LocationsLife"
        component={LocationsLifeScreen}
        options={{
          title: 'Locations',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Calendar_Event_Fill_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Calendar_Event_Fill" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />
      <BottomTab.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={{
          title: 'Check In',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Pipeline_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Pipeline" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />
      <BottomTab.Screen
        name="LifeMore"
        component={LifeMoreScreen}
        options={{
          title: 'More',
          tabBarIcon: ({focused}) => (
            <Fragment>
              {!focused && <SvgIcon icon="Android_More_Horizontal_Gray" width='20px' height='20px' />}
              {focused && <SvgIcon icon="Android_More_Horizontal" width='20px' height='20px' />}
            </Fragment>
          ),
          headerRight: () => (
            <HeaderRightView navigation={navigation}/>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: 'Gilroy-Medium'
          },
          tabBarActiveTintColor: PRIMARY_COLOR,
        }}
      />
    </BottomTab.Navigator>
  );
}

function HeaderRightView() {
  const [toggleSwitch, setToggleSwitch] = useState(true);

  const toggleSwitchStyle = {
    marginRight: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }

  const labelStyle = {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Gilroy-Medium'
  }
  return (
    <ToggleSwitch
      style={toggleSwitchStyle}
      label={toggleSwitch ? "Online" : "Offline"}
      labelStyle={labelStyle}
      onColor="#fff"
      offColor="#a3c0f9"
      size="small"
      thumbOnStyle={{ backgroundColor: PRIMARY_COLOR }}
      thumbOffStyle={{ backgroundColor: PRIMARY_COLOR }}
      isOn={toggleSwitch}
      onToggle={toggleSwitch => {
        setToggleSwitch(toggleSwitch);
      }}
    />
  )
}