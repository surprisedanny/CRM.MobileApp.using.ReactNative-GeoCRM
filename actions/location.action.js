import GetLocation from 'react-native-get-location';
import axios from "axios";
import {
  CHANGE_LOGIN_STATUS,
  STATUS_PIN_KEY,
  STATUS_LOCATION_MAP,
  STATUS_LOCATION_FILTERS,
  STATUS_LOCATION_SEARCH_LISTS,
  STATUS_LOCATION_INFO,
  CHANGE_PIN_KEY,
  CHANGE_LOCATION_MAP,
  CHANGE_LOCATION_FILTERS,
  CHANGE_LOCATION_SEARCH_LISTS,
  CHANGE_CURRENT_LOCATION,
  STATUS_DISPOSITION_FIELDS_UPDATE
  
} from "./actionTypes";

import { getBaseUrl, getToken, getUserData, getUserId, setToken } from '../constants/Storage';

export const getLocationPinKey = () => (dispatch, getState) => {
  dispatch({ type: STATUS_PIN_KEY, payload: 'request' });
  axios
    .get(`${getState().selection.payload.user_scopes.geo_rep.base_url}/locations/location-pin-key`, {
      params: {
        user_id: getState().selection.payload.user_scopes.geo_rep.user_id,
      },
      headers: {
        Authorization: 'Bearer ' + getState().selection.token
      }
    })
    .then((res) => {
      if (res.data == undefined) {
        dispatch({ type: CHANGE_LOGIN_STATUS, payload: "failure" });

        return;
      }
      if (res.data.status == 'success') {
        console.log("pin data",  res.data.items );
        dispatch({ type: STATUS_PIN_KEY, payload: 'success' });
        dispatch({ type: CHANGE_PIN_KEY, payload: res.data.items });
      }
    })
    .catch((err) => {
      dispatch({ type: CHANGE_LOGIN_STATUS, payload: "failure" });
      console.log(err);
    })
}

export const getLocationsMap = () => (dispatch, getState) => {

  console.log("cal map");
  dispatch({ type: STATUS_LOCATION_MAP, payload: 'request' });
  GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 15000,
  })
    .then(location => {
      console.log("loc" , location);
      dispatch({
        type: CHANGE_CURRENT_LOCATION, payload: {          
           latitude: location.latitude,
           longitude: location.longitude,
        }
      })
      axios
        .get(`${getState().selection.payload.user_scopes.geo_rep.base_url}/locations/location-map`, {
          params: {
            user_id: getState().selection.payload.user_scopes.geo_rep.user_id,            
            current_latitude: location.latitude,
            current_longitude: location.longitude
          },
          headers: {
            Authorization: 'Bearer ' + getState().selection.token
          }
        })
        .then((res) => {
          
          if (res.data == undefined) {
            dispatch({ type: CHANGE_LOGIN_STATUS, payload: "failure" });
            return;
          }

          if(res.data.error){
            setToken(null);
            dispatch({ type: CHANGE_LOGIN_STATUS, payload: "failure" });
            return;
          }

          console.log("get location map data CHANGE_LOCATION_MAP");
          if (res.data.status == 'success') {
            dispatch({ type: STATUS_LOCATION_MAP, payload: 'success' });
            dispatch({ type: CHANGE_LOCATION_MAP, payload: res.data.locations })
          }
        })
        .catch((err) => {
          console.log("map errorw", err);  
          setToken(null);
          dispatch({ type: CHANGE_LOGIN_STATUS, payload: "failure" });
          console.log(err);
        })
    })
    .catch(error => {
      console.log("map error", error);  
      const { code, message } = error;
      console.warn(code, message);
    });

}

export const getLocationFilters = () => (dispatch, getState) => {
  dispatch({ type: STATUS_LOCATION_FILTERS, payload: 'request' });
  axios
    .get(`${getState().selection.payload.user_scopes.geo_rep.base_url}/locations/location-filters`, {
      params: {
        user_id: getState().selection.payload.user_scopes.geo_rep.user_id,
      },
      headers: {
        Authorization: 'Bearer ' + getState().selection.token
      }
    })
    .then((res) => {
      if (res.data == undefined) {

        dispatch({ type: CHANGE_LOGIN_STATUS, payload: "failure" });
        return;
      }
      if (res.data.status == 'success') {
        dispatch({ type: STATUS_LOCATION_FILTERS, payload: 'success' });
        dispatch({ type: CHANGE_LOCATION_FILTERS, payload: res.data.items })
      }
    })
    .catch((err) => {
      dispatch({ type: CHANGE_LOGIN_STATUS, payload: "failure" });
      console.log(err);
    })
}

export const getLocationSearchList = () => (dispatch, getState) => {
  dispatch({ type: STATUS_LOCATION_SEARCH_LISTS, payload: 'request' });
  axios
    .get(`${getState().selection.payload.user_scopes.geo_rep.base_url}/locations/location-search-list`, {
      params: {
        user_id: getState().selection.payload.user_scopes.geo_rep.user_id,
      },
      headers: {
        Authorization: 'Bearer ' + getState().selection.token
      }
    })
    .then((res) => {
      if (res.data == undefined) {

        dispatch({ type: CHANGE_LOGIN_STATUS, payload: "failure" });
        return;
      }
      if (res.data.status == 'success') {
        dispatch({ type: STATUS_LOCATION_SEARCH_LISTS, payload: 'success' });
        dispatch({ type: CHANGE_LOCATION_SEARCH_LISTS, payload: res.data.items })
      }
    })
    .catch((err) => {
      dispatch({ type: CHANGE_LOGIN_STATUS, payload: "failure" });
      console.log(err);
    })
}

export const getLeadFields = async() => {
  var base_url = await getBaseUrl();
  var token = await getToken();
  var user_id = await getUserId();
  return new Promise(function(resolve, reject) {
      axios
      .get(`${base_url}/leadfields`, {
        params: {
          user_id : user_id          
        },
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then((res) => {              
        if (res.data == undefined) {            
          resolve([]);
        }
        if (res.data.status == 'success') {
          resolve(res.data.custom_master_fields);
        }else{
          resolve([]);
        }
      })
      .catch((err) => {        
        reject(err);          
      })
  });
}

export const postLeadFields = (postData, idempotencyKey) => (dispatch, getState) => {
  dispatch({ type: STATUS_DISPOSITION_FIELDS_UPDATE, payload: 'request' });
  console.log("idempotencyKey", idempotencyKey)
  axios
    .post(`${getState().selection.payload.user_scopes.geo_rep.base_url}/leadfields`, JSON.stringify(postData), {
      headers: {
        Authorization: 'Bearer ' + getState().selection.token,
        'Indempotency-Key': idempotencyKey
      }
    })
    .then((res) => {
      console.log("postleadfields", res)
      dispatch({type: STATUS_DISPOSITION_FIELDS_UPDATE, payload: 'success'});
    })
    .catch((err) => {
      console.log("error", err)
      dispatch({type: STATUS_DISPOSITION_FIELDS_UPDATE, payload: 'failure'});
      console.log(err.response);
    })
}


export const getLocationInfo = async(location_id) => {

  var base_url = await getBaseUrl();
  var token = await getToken();  
  var user_id = await getUserId();
  return new Promise(function(resolve, reject) {                             
      axios
      .get(`${base_url}/locations/location-info`, {
        params: {
          user_id : user_id,
          location_id: location_id
        },
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then((res) => {              
        if (res.data == undefined) {            
          resolve([]);
        }        
        resolve(res.data);        
      })
      .catch((err) => {        
        reject(err);          
      })
  });    
}



export const postStageOutcomUpdate = async(request) => {
    
    var base_url = await getBaseUrl();
    var token = await getToken();
    console.log("started ====");
    return new Promise(function(resolve, reject) {
      
      let requestPayload = {
        "location_id": request.location_id,
        "stage_id": request.stage_id,
        "outcome_id": request.outcome_id,
        "campaign_id": 1
      }
      axios
      .post(`${base_url}/location-info/updateStageOutcome`, requestPayload, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Indempotency-Key': request.indempotency_key
        }
      })
      .then((res) => {
        console.log("ended");
        if (res.data == undefined) {      
          resolve(0);
          return;
        }
        resolve(1);
        // dispatch({type: CHANGE_LOCATION_INFO, payload: res.data})
      })
      .catch((err) => {
        // dispatch({ type: CHANGE_LOGIN_STATUS, payload: "failure" });
        reject(err);
        console.log(err.response);
      })
    });
}


export const postDispositionFields = (postData, idempotencyKey) => (dispatch, getState) => {
  dispatch({ type: STATUS_DISPOSITION_FIELDS_UPDATE, payload: 'request' });
  console.log("idempotencyKey", idempotencyKey)
  axios
    .post(`${getState().selection.payload.user_scopes.geo_rep.base_url}/location-info/updateDispositionFields`, postData, {
      headers: {
        Authorization: 'Bearer ' + getState().selection.token,
        'Indempotency-Key': idempotencyKey
      }
    })
    .then((res) => {
      dispatch({type: STATUS_DISPOSITION_FIELDS_UPDATE, payload: 'success'});
    })
    .catch((err) => {
      console.log("error", err)
      dispatch({type: STATUS_DISPOSITION_FIELDS_UPDATE, payload: 'failure'});
      console.log(err.response);
    })
}



export const reverseGeocoding = async(latitude, longitude) => {
  
  return new Promise(function(resolve, reject) {
    
    let data = {
      result_type: "street_address",
      latlng: [latitude, longitude],
      key: "AIzaSyBtgcNrNTOftpHM44Qk9BVzhUdKIZEfvJw"
    }
    axios
      .post('https://maps.googleapis.com/maps/api/geocode/json', data)
      .then((res) => {
        console.log("geocodeing");
        console.log(res.data)
    })

  });
}
