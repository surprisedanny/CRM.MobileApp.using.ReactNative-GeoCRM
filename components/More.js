import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

import SvgIcon from './SvgIcon';
import { BG_COLOR, PRIMARY_COLOR, TEXT_COLOR, whiteLabel } from '../constants/Colors';
import { 
  CHANGE_MORE_STATUS, 
  SHOW_MORE_COMPONENT, 
  CHANGE_PROFILE_STATUS,
  CHANGE_LIBRARY_CHILD_STATUS,
  CHANGE_LOGIN_STATUS
} from '../actions/actionTypes';
import { setToken } from '../constants/Storage';
import { white } from 'react-native-paper/lib/typescript/styles/colors';

const lists = {
  0: [
    {
      icon: "Home_Black",
      name: "Home",
      navigator: "Home",
      navOrder: "home_geo"
    },
    {
      icon: "Location_Arrow",
      name: "CRM",
      navigator: "CRM",
      navOrder: "crm_locations"
    },
    {
      icon: "Travel_Explore",
      name: "Web Links",
      navigator: "RepWebLinks",
      navOrder: "web_links"
    },
    {
      icon: "Calendar_Event_Fill",
      name: "Calendar",
      navigator: "Calendar",
      navOrder: "calendar"
    },
    {
      icon: "Form",
      name: "Forms",
      navigator: "RepForms",
      navOrder: "forms"
    },
    {
      icon: "Ballot",
      name: "Content Library",
      navigator: "RepContentLibrary",
      navOrder: "content_library"
    },
    {
      icon: "Sale",
      name: "Sales",
      navigator: "ProductSales",
      navOrder: "product_sales"
    },
    {
      icon: "ChatBoxes",
      name: "Notifications",
      navigator: "Notifications",
      navOrder: "notifications"
    },
    {
      icon: "ChatBoxes",
      name: "Messages",
      navigator: "RepMessages",
      navOrder: "messages"
    },
    {
      icon: "Cloud_Off",
      name: "Offline Sync Items",
      navigator: "OfflineSync",
      navOrder: "offline_sync"
    },
    {
      icon: "Account_Circle",
      name: "Recorded Sales",
      navigator: "RecordedSales",
      navOrder: "recorded_sales"
    },
    {
      icon: "Pipeline",
      name: "Pipeline",
      navigator: "RepSalesPipeline",
      navOrder: "sales_pipeline"
    },
    // {
    //   icon: "Support_Agent",
    //   name: "Support",
    //   navigator: "RepSupport",
    //   navOrder: "support"
    // }
  ],
  1: [
    {
      icon: "Account_Circle",
      name: "Home",
      navigator: "HomeLife",
      navOrder: "home_life"
    },
    {
      icon: "Account_Circle",
      name: "News",
      navigator: "News",
      navOrder: "news"
    },
    {
      icon: "Account_Circle",
      name: "Locations",
      navigator: "LocationsLife",
      navOrder: "locations_life"
    },
    {
      icon: "Account_Circle",
      name: "Check In",
      navigator: "CheckIn",
      navOrder: "check_in"
    },
    {
      icon: "Account_Circle",
      name: "Access Control",
      navigator: "Access",
      navOrder: "access"
    },
    {
      icon: "Account_Circle",
      name: "Club",
      navigator: "Club",
      navOrder: "club"
    },
    {
      icon: "Account_Circle",
      name: "FlashBook",
      navigator: "Flashbook",
      navOrder: "flashbook"
    },
    {
      icon: "Account_Circle",
      name: "Business Directory",
      navigator: "BusinessDirectory",
      navOrder: "business_directory"
    },
    {
      icon: "Ballot",
      name: "Content Library",
      navigator: "LifeContentLibrary",
      navOrder: "content_library"
    },
    {
      icon: "Account_Circle",
      name: "Forms",
      navigator: "LifeForms",
      navOrder: "forms"
    },
    {
      icon: "Account_Circle",
      name: "Loyalty Cards",
      navigator: "LoyaltyCards",
      navOrder: "loyalty_cards"
    },
    {
      icon: "Account_Circle",
      name: "Lunch Orders",
      navigator: "LunchOrders",
      navOrder: "lunch_orders"
    },
    {
      icon: "Account_Circle",
      name: "Messages",
      navigator: "LifeMessages",
      navOrder: "messages"
    },
    {
      icon: "Account_Circle",
      name: "Report Fraud",
      navigator: "ReportFraud",
      navOrder: "report_fraud"
    },
    {
      icon: "Travel_Explore",
      name: "Web Links",
      navigator: "LifeWebLinks",
      navOrder: "web_links"
    },
    {
      icon: "Account_Circle",
      name: "Well-being",
      navigator: "WellBeing",
      navOrder: "well_being"
    },
    // {
    //   icon: "Support_Agent",
    //   name: "Support",
    //   navigator: "LifeSupport",
    //   navOrder: "support"
    // }
  ],
  2: [
    {
      icon: "Ballot",
      name: "Content Library",
      navigator: "CRMContentLibrary",
      navOrder: "content_library"
    },
    {
      icon: "Location_Arrow",
      name: "CRM",
      navigator: "CRMLocations",
      navOrder: "crm_locations"
    },
    {
      icon: "Account_Circle",
      name: "Pipeline",
      navigator: "CRMSalesPipeline",
      navOrder: "sales_pipeline"
    }
  ]
}

export default function Profile() {
  const dispatch = useDispatch();
  const payload = useSelector(state => state.selection.payload);
  const selectProject = useSelector(state => state.selection.selectProject);
  const userInfo = useSelector(state => state.auth.userInfo);

  const [ componentListOne, setComponentListOne ] = useState([]);
  const [ componentListTwo, setComponentListTwo ] = useState([]);
  const [ componentListThree, setComponentListThree ] = useState([]);

  useEffect(() => {
    if (payload.user_scopes.geo_rep) {
      setComponentListOne([
        payload.user_scopes.geo_rep.modules_nav_order[4],
        payload.user_scopes.geo_rep.modules_nav_order[5],
        payload.user_scopes.geo_rep.modules_nav_order[6],
        payload.user_scopes.geo_rep.modules_nav_order[7],
        payload.user_scopes.geo_rep.modules_nav_order[8],
        payload.user_scopes.geo_rep.modules_nav_order[9],
        payload.user_scopes.geo_rep.modules_nav_order[10],
        payload.user_scopes.geo_rep.modules_nav_order[11],
        payload.user_scopes.geo_rep.modules_nav_order[12],
      ]);
    }
    if (payload.user_scopes.geo_life) {
      setComponentListTwo([
        payload.user_scopes.geo_life.modules_nav_order[4],
        payload.user_scopes.geo_life.modules_nav_order[5],
        payload.user_scopes.geo_life.modules_nav_order[6],
        payload.user_scopes.geo_life.modules_nav_order[7],
        payload.user_scopes.geo_life.modules_nav_order[8],
        payload.user_scopes.geo_life.modules_nav_order[9],
        payload.user_scopes.geo_life.modules_nav_order[10],
        payload.user_scopes.geo_life.modules_nav_order[11],
        payload.user_scopes.geo_life.modules_nav_order[12],
        payload.user_scopes.geo_life.modules_nav_order[13],
        payload.user_scopes.geo_life.modules_nav_order[14],
        payload.user_scopes.geo_life.modules_nav_order[15],
        payload.user_scopes.geo_life.modules_nav_order[16],
        payload.user_scopes.geo_life.modules_nav_order[17]
      ]);
    }
    if (payload.user_scopes.geo_crm) {
      setComponentListThree([
        payload.user_scopes.geo_crm.modules_nav_order[4]
      ]);
    };
  }, [payload]);

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View style={styles.avatarBox}>
          <TouchableOpacity style={styles.closeButton} onPress={() => dispatch({type: CHANGE_MORE_STATUS, payload: 1})}>
            <SvgIcon icon="Close" width='20px' height='20px' />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarLabel}>
              {userInfo.user_name.split(' ')[0] && userInfo.user_name.split(' ')[0][0].toUpperCase()}
              {userInfo.user_name.split(' ')[1] && userInfo.user_name.split(' ')[1][0].toUpperCase()}
            </Text>
          </View>
          <View style={{ width: '48%' }}>
            <Text style={styles.boldText}>{userInfo.user_name}</Text>
            <Text style={styles.text}>{userInfo.user_email}</Text>
            <Text style={styles.text}>+27 81 691 7262</Text>
          </View>
        </View>
        <View style={styles.selectBox}>
        <TouchableOpacity 
          style={styles.selectButton} 
          onPress={() => {
            dispatch({type: CHANGE_MORE_STATUS, payload: 1});
            setTimeout(() => {
              dispatch({type: CHANGE_PROFILE_STATUS, payload: 0});
            })
          }}>
          <SvgIcon style={{ marginRight: 8 }} icon="Account_Circle" width='22px' height='22px' />
          <Text style={styles.selectName}>Profile</Text>
          <SvgIcon icon="Angle_Left" width='18px' height='18px' />
        </TouchableOpacity>

          {selectProject == 'geo_rep' && lists[0].map((list, index) => (
            <Fragment key={index}>
              {componentListOne.includes(list.navOrder) && <TouchableOpacity 
                style={styles.selectButton} 
                onPress={() => {
                  dispatch({type: CHANGE_MORE_STATUS, payload: 1});
                  dispatch({type: CHANGE_LIBRARY_CHILD_STATUS, payload: false});
                  dispatch({type: SHOW_MORE_COMPONENT, payload: list.navigator});
                }}>
                <SvgIcon style={{ marginRight: 8 }} icon={list.icon} width='22px' height='22px' />
                <Text style={styles.selectName}>{list.name}</Text>
                <SvgIcon icon="Angle_Left" width='18px' height='18px' />
              </TouchableOpacity>}
            </Fragment>
          ))}

          {selectProject == 'geo_life' && lists[1].map((list, index) => (
            <Fragment key={index}>
              {componentListTwo.includes(list.navOrder) && <TouchableOpacity 
                style={styles.selectButton} 
                onPress={() => {
                  dispatch({type: CHANGE_MORE_STATUS, payload: 1});
                  dispatch({type: CHANGE_LIBRARY_CHILD_STATUS, payload: false});
                  dispatch({type: SHOW_MORE_COMPONENT, payload: list.navigator});
                }}>
                <SvgIcon style={{ marginRight: 8 }} icon={list.icon} width='22px' height='22px' />
                <Text style={styles.selectName}>{list.name}</Text>
                <SvgIcon icon="Angle_Left" width='18px' height='18px' />
              </TouchableOpacity>}
            </Fragment>
          ))}

          {selectProject == 'geo_crm' && lists[2].map((list, index) => (
            <Fragment key={index}>
              {componentListThree.includes(list.navOrder) && <TouchableOpacity 
                style={styles.selectButton} 
                onPress={() => {
                  dispatch({type: CHANGE_MORE_STATUS, payload: 1});
                  dispatch({type: CHANGE_LIBRARY_CHILD_STATUS, payload: false});
                  dispatch({type: SHOW_MORE_COMPONENT, payload: list.navigator});
                }}>
                <SvgIcon style={{ marginRight: 8 }} icon={list.icon} width='22px' height='22px' />
                <Text style={styles.selectName}>{list.name}</Text>
                <SvgIcon icon="Angle_Left" width='18px' height='18px' />
              </TouchableOpacity>}
            </Fragment>
          ))}

          <TouchableOpacity 
            style={styles.selectButton} 
            onPress={() => {
              dispatch({type: CHANGE_MORE_STATUS, payload: 1});
              dispatch({type: CHANGE_LIBRARY_CHILD_STATUS, payload: false});
              dispatch({type: SHOW_MORE_COMPONENT, payload: "RepSupport"});
            }}>
            <SvgIcon style={{ marginRight: 8 }} icon="Support_Agent" width='22px' height='22px' />
            <Text style={styles.selectName}>Support</Text>
            <SvgIcon icon="Angle_Left" width='18px' height='18px' />
          </TouchableOpacity>

          <TouchableOpacity style={styles.selectButton} onPress={() => {
            dispatch({type: CHANGE_LOGIN_STATUS, payload: "logout"});
            setToken(null);
          }}>
            <Text style={styles.selectName}>Logout</Text>
            <SvgIcon icon="Logout" width='20px' height='20px' />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    marginLeft: 'auto',
    backgroundColor: BG_COLOR,
    padding: 12,
    paddingTop: 70,
    borderWidth: 1,
    borderColor: '#70707070',
  },
  avatarBox: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomColor: whiteLabel().mainText,
    borderBottomWidth: 2
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: whiteLabel().mainText,
    borderWidth: 2,
    paddingTop:Platform.OS ==  'ios' ? 4 : 0,
    width: 56,
    height: 56,
    borderRadius: 30,
    marginRight: 12,
  },
  avatarLabel: {
    color: whiteLabel().mainText,
    fontFamily: 'Gilroy-Bold',
    fontSize: 32
  },
  boldText: {
    color: TEXT_COLOR,
    fontSize: 17,
    fontFamily: 'Gilroy-Bold'
  },
  text: {
    fontSize: 14,
    color: TEXT_COLOR,
    fontFamily: 'Gilroy-Medium',
    marginBottom: 2
  },
  selectBox: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 100,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomColor: '#70707045',
    borderBottomWidth: 2
  },
  selectName: {
    flexGrow: 1,
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    color: TEXT_COLOR
  }
});