import React, { useState, useRef, useEffect , createRef} from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import EStyleSheet from 'react-native-extended-stylesheet';
import { setWidthBreakpoints, parse } from 'react-native-extended-stylesheet-breakpoints';
import { useSelector,useDispatch } from 'react-redux';
import uuid from 'react-native-uuid';
import SvgIcon from '../../../components/SvgIcon';
import { PRIMARY_COLOR, TEXT_COLOR, BG_COLOR, BLUE_COLOR, GREEN_COLOR } from '../../../constants/Colors';
import { breakPoint } from '../../../constants/Breakpoint';
import CustomPicker from '../../../components/CustomPicker';
import { postStageOutcomUpdate, postDispositionFields } from '../../../actions/location.action';
import CustomLoading from '../../../components/CustomLoading';
import Images from '../../../constants/Images';
import { CHANGE_DISPOSITION_INFO, LOCATION_CONFIRM_MODAL_VISIBLE, SLIDE_STATUS, CHANGE_LOCATION_ACTION, CHANGE_BOTTOM_TAB_ACTION } from '../../../actions/actionTypes';
import { style } from '../../../constants/Styles';
import Fonts from '../../../constants/Fonts';

export default function LocationInfoInputTablet({navigation, screenProps, statusSubmit, showLoopSlider , infoInput }) {

  const dispatch = useDispatch();  
  const [locationInfo, setLocationInfo] = useState(infoInput);
  const locationConfirmModalVisible = useSelector(state => state.rep.locationConfirmModalVisible);
  const locationAction = useSelector(state => state.rep.locationAction);
  const bottomTabAction = useSelector(state => state.rep.bottomTabAction);
  const dispositionRef = useRef([]);
  const [dispositionValue, setDispositionValue] = useState([]);
  const [datePickerMode, setDatePickerMode] = useState("date");
  const [isDateTimePickerVisible, setDateTimePickerVisibility] = useState(false);
  const [dateTimeKey, setDateTimeKey] = useState(null);
  const statusStageOutcomeUpdate = useSelector(state => state.location.statusStageOutcomeUpdate);
  const [stageModalVisible, setStageModalVisible] = useState(false);
  const [outComeModalVisible, setOutComeModalVisible] = useState(false);    
  var outcomes = locationInfo.outcomes.find(xx =>  xx.outcome_id != null && locationInfo.current_outcome_id && xx.outcome_id == locationInfo.current_outcome_id );  
  const [selectedOutcomeId, setSelectedOutComeId] = useState(outcomes ? outcomes.outcome_id : 0);
  const [selectedStageId, setSelectedStageId] = useState(locationInfo.stages.find(x => x.stage_id == locationInfo.current_stage_id).stage_id);
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);
  const [idempotencyKey, setIdempotencyKey] = useState(uuid.v4());
  const [submitKey, setSubmitKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //const [isBelowStage, setIsBelowStage] = useState(false);
  var isBelowStage = false;
  console.log("LO", locationInfo);

  useEffect(() => {
    setSubmitKey(false);
    dispatch({type: CHANGE_DISPOSITION_INFO, payload: false});
    dispatch({type: CHANGE_LOCATION_ACTION, payload: null});
    dispatch({type: CHANGE_BOTTOM_TAB_ACTION, payload: null});
  }, []);

  useEffect(() => {
    if(!locationInfo.disposition_fields) return;
    let items = [];
    locationInfo.disposition_fields.forEach(element => {
      items.push(element.value)
    });
    setDispositionValue(items);

    setSelectedOutcomes(locationInfo.outcomes.filter(outcome => outcome.linked_stage_id == selectedStageId));
  }, [locationInfo])

  useEffect(() => {
    if (!submitKey) {
      setSubmitKey(true);
      return;
    }
    handleSubmit();
  }, [statusSubmit]);
  
  const updateOutcomes = () => {
    let request = {
      "location_id": locationInfo.location_id,
      "stage_id": selectedStageId,
      "outcome_id": selectedOutcomeId,
      "campaign_id": 1,
      "indempotency_key":uuid.v4()
    }             
    postStageOutcomUpdate(request)
    .then((res) => {      
      setIsLoading(false);
    })
    .catch((e) => {
      setIsLoading(false);
    })
  }

  const handleSubmit = () => {
    let postData = {
      "location_id": locationInfo.location_id,
      "campaign_id": 1,
      "disposition_fields": []
    }
    locationInfo.disposition_fields.forEach((item, key) => {
      console.log(item, key)
      postData.disposition_fields.push({
        "disposition_field_id": item.disposition_field_id,
        "value": dispositionValue[key]
      })
    });
    //setIdempotencyKey(uuid.v4());
    dispatch(postDispositionFields(postData, idempotencyKey));

    dispatch({type: CHANGE_DISPOSITION_INFO, payload: false});
  }

  const handleChangeText = (text, field, key) => {
    dispatch({type: CHANGE_DISPOSITION_INFO, payload: true});
    if (field.field_type == "date" || field.field_type == "datetime") {
      //hide keybard 
      Keyboard.dismiss();
    }

    if (field.rule_characters.split(',')[0] == "<" && text.length > Number(field.rule_characters.split(',')[1])) {
      return;
    }
    if (
      (field.field_type == "alphanumeric" && (
        text[text.length - 1].charCodeAt() < 48 ||
        (text[text.length - 1].charCodeAt() > 57 && text[text.length - 1].charCodeAt() < 65) ||
        (text[text.length - 1].charCodeAt() > 90 && text[text.length - 1].charCodeAt() < 97) ||
        text[text.length - 1].charCodeAt() > 122
      )) || (field.field_type == "numeric" && (text[text.length - 1].charCodeAt() < 48 || text[text.length - 1].charCodeAt() > 57))
    ) return;
    setDispositionValue([...dispositionValue.slice(0, key), text, ...dispositionValue.slice(key + 1, dispositionValue.length)])
  }

  const handleFocus = (fieldType, key, isEditable) => {
    setDateTimeKey(key);
    if (fieldType == "date") {    
      Keyboard.dismiss();      
      if(isEditable == 1){
        setDatePickerMode("date");      
        setDateTimePickerVisibility(true);
      }      
    }
    if (fieldType == "datetime") {
      Keyboard.dismiss();
      console.log("hide keybard");
      if( isEditable == 1){
        setDatePickerMode("datetime");
        setDateTimePickerVisibility(true);
      }      
    }
  };

  const handleEmpty = () => {

  }

  getDisableStatus = (filedType, isEditable) =>{
    if(filedType == 'date' || filedType == 'datetime'){
      return true;
    }
    if(isEditable == 0){
      return true;
    }
    return false;
  } 

  const handleConfirm = (date) => {
    setChangeValue(true);
    let datetime = "";
    if (datePickerMode == "date") {
      datetime = String(date.getFullYear()) + "-" + String(date.getMonth() + 1) + "-" + String(date.getDate());
    } else if (datePickerMode == "datetime") {
      datetime = String(date.getFullYear()) + "-" + String(date.getMonth() + 1) + "-" + String(date.getDate()) + " " + String(date.getHours()) + ":" + String(date.getMinutes());
    }
    setDispositionValue([...dispositionValue.slice(0, dateTimeKey), datetime, ...dispositionValue.slice(dateTimeKey + 1, dispositionValue.length)])
    setDateTimePickerVisibility(false)
  };

  const discard = () => {
    dispatch({type: SLIDE_STATUS, payload: false});
    if (locationAction) {
      navigation.navigate(locationAction);
    }
    if (bottomTabAction) {
      if (bottomTabAction == "CRM") {
        screenProps.navigate(bottomTabAction, { screen: 'Root' });
      } else {
        screenProps.navigate(bottomTabAction);
      }
    }
    dispatch({type: LOCATION_CONFIRM_MODAL_VISIBLE, payload: false});
  }

  const confirmModal = () => {
    return (
      <CustomPicker visible={locationConfirmModalVisible} onModalClose={() => dispatch({type: LOCATION_CONFIRM_MODAL_VISIBLE, payload: false})} renderItems = {
        <View>
          <Text style={styles.confirmModalTitle}>Please note</Text>
          <Text style={styles.confirmModalDesc}>Returning to previous page will discard any changes made to this location.</Text>
          <View  style={styles.confirmModalButtonBar}>
            <TouchableOpacity style={styles.confirmModalButton} onPress={() => dispatch({type: LOCATION_CONFIRM_MODAL_VISIBLE, payload: false})}>
              <Text styles={styles.confirmModalCancelButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmModalButton} onPress={discard}>
              <Text style={styles.confirmModalDiscardButton}>Discard</Text>
            </TouchableOpacity>
          </View>
        </View>
      } />
    )
  }

  const stagesModal = () => {
    return (
      <CustomPicker visible={stageModalVisible} onModalClose={() => setStageModalVisible(!stageModalVisible)} renderItems={
        locationInfo.stages.map((stage, key) => (
          <View style={styles.pickerItem} key={key}>
            <TouchableOpacity onPress={() => {
              setSelectedStageId(stage.stage_id);
              setSelectedOutComeId(null);
              setSelectedOutcomes(locationInfo.outcomes.filter(outcome => outcome.linked_stage_id == stage.stage_id));
              setStageModalVisible(!stageModalVisible);
            }} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.pickerItemText}>{stage.stage_name}</Text>
              {stage.stage_id == selectedStageId && <SvgIcon icon="Check" width='23px' height='23px' />}
            </TouchableOpacity>

          </View>
        ))
      } />
    )
  }

  const renderOutcomesItem = () => {
  }

  const outComesModal = () => {
    return (
      <CustomPicker 
        visible={outComeModalVisible}         
        renderItems= {
        selectedOutcomes.map((outcome, key) => (
          <TouchableOpacity style={[styles.pickerItem]} key={key}
          onPress={() => { 
            setSelectedOutComeId(outcome.outcome_id);
            setOutComeModalVisible(!outComeModalVisible);
            setIsLoading(true);
          }}>            
              <Text style={styles.pickerItemText}>{outcome.outcome_name}</Text>
              {outcome.outcome_id == selectedOutcomeId && <SvgIcon icon="Check" width='23px' height='23px' />}           
          </TouchableOpacity>
        ))
      } />
    )
  }

  return (
    <View style={styles.container}>

      <View style={styles.stageContainer}>
          <View style={styles.refreshBox}>                        
                <Text style={styles.stageTitle}> Stage </Text>
                {
                  locationInfo.stages.map((stage, index) => {                    
                    if(stage.stage_id == selectedStageId){
                      isBelowStage = true;
                    }
                    return (
                      <TouchableOpacity style={ stage.stage_id == selectedStageId  ? styles.selectedStageBox : isBelowStage? styles.belowStageBox :styles.stageBox } 
                          onPress={() => {                            
                            setSelectedStageId(stage.stage_id);
                            setSelectedOutComeId(null);
                            setSelectedOutcomes(locationInfo.outcomes.filter(outcome => outcome.linked_stage_id == stage.stage_id));                            
                          }}>
                        <Text style={styles.stageText}>{stage.stage_name}</Text>                        
                      </TouchableOpacity>
                    )
                  })
                }              
          </View>                              
      </View>

      <View style={styles.formContainer}>        

          <ScrollView behavior="padding" style={{flex:1}}>

            <View style={[styles.refreshBox, {flexDirection:'row'}]}>                    
                <View style={{flex:1}}>
                  <Text style={styles.stageTitle}> Outcome </Text>                
                  <View style={styles.outcomesBoxRow}>
                  {
                    locationInfo.outcomes.map((item, index) => {
                      if(item.linked_stage_id == selectedStageId){
                        return (                                                                    
                          <TouchableOpacity style={item.outcome_id == selectedOutcomeId ? styles.selectedOutcomesColumn : styles.outcomesColumn }
                          onPress={() =>{                                              
                            setSelectedOutComeId(item.outcome_id);
                            setIsLoading(true);                            
                          }}
                          >
                            <Text style={styles.stageText}>{item.outcome_name}</Text>                        
                          </TouchableOpacity>                                              
                        )
                      }                      
                    })
                  }
                  </View>
                </View>  

                <View style={{justifyContent:'center'}}>
                  <TouchableOpacity onPress={showLoopSlider}>
                    <Image style={styles.refreshImage} source={Images.loopButton} />
                  </TouchableOpacity>
                </View>                                      
            </View> 


            <Text style={styles.boldText}>Campaign: Quill Test</Text>
            {
              locationInfo.disposition_fields &&
              <View style={styles.inputBox}>

                  {locationInfo.disposition_fields.map((field, key) => (
                    <TouchableOpacity
                      key={key}
                      style={(Number(field.disposition_field_id) >= 5 && Number(field.disposition_field_id) <= 8) ? styles.textInputWidthTwo : styles.textInputWidthOne}
                      activeOpacity={1}
                      onPress={() => {                           
                      }}
                    >
                      <View>
                        <TextInput
                          type={field.field_type}
                          ref={(element) => { dispositionRef.current[key] = element }}
                          // autoFocus={true}
                          keyboardType={field.field_type === "numeric" ? 'number-pad' : 'default'}
                          returnKeyType={field.field_type === "numeric" ? 'done' : 'next'}
                          style={styles.textInput}
                          label={<Text style={{ backgroundColor: BG_COLOR }}>{field.field_name}</Text>}
                          mode="outlined"
                          outlineColor="#133C8B"
                          activeOutlineColor="#9D9FA2"
                          value={dispositionValue[key]}
                          disabled = {getDisableStatus(field.field_type, field.rule_editable)}
                          onChangeText={text => handleChangeText(text, field, key)}
                          //blurOnSubmit={false}
                          onSubmitEditing={()=>{                          
                          }}
                          onPressIn={field.field_type == "date" || field.field_type == "datetime" ? handleFocus.bind(null, field.field_type, key, field.rule_editable) : handleEmpty.bind(null) }
                          left={field.add_prefix && <TextInput.Affix textStyle={{marginTop: 8}} text={field.add_prefix} />}
                          right={field.add_suffix && <TextInput.Affix textStyle={{marginTop: 8}} text={field.add_suffix} />}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            }
            
          </ScrollView>
          
      </View>

      

  
      <DateTimePickerModal
        isVisible={isDateTimePickerVisible}
        mode={datePickerMode}
        onConfirm={handleConfirm}
        onCancel={() => setDateTimePickerVisibility(false)}
      />
      
      {outComesModal()}
      {confirmModal()}

      {/* visible={statusStageOutcomeUpdate=='request' */}
      {<CustomLoading closeOnTouchOutside={false} 
       onCompleted={() =>{         
        updateOutcomes();
       }}
      message='Updating please wait.' visible={isLoading}/>}

    </View>
  )
}

const perWidth = setWidthBreakpoints(breakPoint);

const styles = EStyleSheet.create(parse({

  container:{
    flex:1,
    flexDirection:'row',
  },
  stageContainer:{
    flex:2,
  },
  formContainer:{
    flex:5,
  },

  stageTitle: {
    fontSize: 18,
    color: TEXT_COLOR,
    fontFamily: Fonts.secondaryBold,
    marginBottom: 8    
  },

  stageBox: {   
    padding:8,      
    backgroundColor: GREEN_COLOR,
    shadowColor: '#00000014',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: Platform.OS == 'ios' ? 1 : 0.5,    
    borderRadius: 4,
    marginTop:10,
    marginRight:10,
  },

  selectedStageBox: {    
    padding:8,      
    backgroundColor: BLUE_COLOR,
    shadowColor: '#00000014',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: Platform.OS == 'ios' ? 1 : 0.5,    
    borderRadius: 4,
    marginTop:10,
    marginRight:10,
  },

  belowStageBox: {    
    padding:8,      
    backgroundColor: "#FFF",
    shadowColor: '#00000014',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: Platform.OS == 'ios' ? 1 : 0.5,    
    borderRadius: 4,
    marginTop:10,
    marginRight:10,
  },


  stageText: {
    fontSize: 13,  
    color: TEXT_COLOR,
    fontFamily: Fonts.secondaryMedium
  },

  outcomesBoxRow: {
    display: "flex",
    flexDirection:'row',
    flexWrap:"wrap",    
    // width:'100%'
  },
  
  outcomesColumn: {
    display: "flex",
    flexDirection:"column",    
    width:'45%',
    borderRadius:3,
    borderWidth:1,
    borderColor:"#eee",
    padding:8,    
    marginLeft:'2%',
    marginRight:'2%',
    marginTop:10,
    //flex-basis: 100%;
    //flex: 1
  },
  
  selectedOutcomesColumn: {
    display: "flex",
    flexDirection:"column",    
    width:'45%',
    borderRadius:3,
    borderWidth:1,
    borderColor:"#eee",
    backgroundColor:BLUE_COLOR,
    padding:8,    
    marginLeft:'2%',
    marginRight:'2%',
    marginTop:10,
    //flex-basis: 100%;
    //flex: 1
  },

  refreshBox: {      
    flex:1,        
    marginBottom: 8,
  },
  refreshImage: {
    width: 45,
    height: 45,
    marginLeft: 10,
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  textInput: {
    height: 40,
    fontSize: 14,
    lineHeight: 30,
    backgroundColor: BG_COLOR,
    fontFamily: 'Gilroy-Medium',
    marginBottom: 8
  },
  textInputWidthOne: {
    width: '100%'
  },
  textInputWidthTwo: {
    width: '47%'
  },
  button: {
    backgroundColor: 'rgba(21, 90, 161, 0.31)',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    minWidth: 60,
    textAlign: 'center',
    borderRadius: 7
  },
  buttonText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
    letterSpacing: 0.2,
  },
  boldText: {
    
    fontSize: 18,
    fontFamily: 'Gilroy-Bold',
    color: TEXT_COLOR,
    marginBottom: 8,
    paddingLeft: 10
  },
  pickerItemText: {
    fontSize: 18,
    color: 'black'
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 8,
  },
  pickerContent: {
    backgroundColor: BG_COLOR,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: '#00000055'
  },
  modalView: {
    margin: 20,
    width: '90%',
    backgroundColor: "white",
    borderRadius: 7,
    padding: 20,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  plusButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    zIndex: 1,
    elevation: 1,
  },
  confirmModalTitle: {
    fontSize: 18,
    textAlign: 'center',
    color: PRIMARY_COLOR,
    marginBottom: 8
  },
  confirmModalDesc: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
    marginBottom: 16
  },
  confirmModalButtonBar: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  confirmModalButton: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  confirmModalCancelButton: {
    color: 'gray',
    fontSize: 16
  },
  confirmModalDiscardButton: {
    color: PRIMARY_COLOR,
    fontSize: 16
  },
}));
