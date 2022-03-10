import React, { useEffect , useState , useRef } from 'react';
import { SafeAreaView, Text, View, Dimensions, StyleSheet ,FlatList ,TouchableOpacity , Image , Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Paragraph } from 'react-native-paper';
import { cos } from 'react-native-reanimated';
import { getFormQuestions } from '../../../../actions/forms.action';
import { HeadingForm } from '../../../../components/shared/HeadingForm';
import { ParagraphForm } from '../../../../components/shared/ParagraphForm';
import { TextForm } from '../../../../components/shared/TextForm';
import { YesNoForm } from '../../../../components/shared/YesNoForm';
import { MultipleForm, SingleSelectForm } from '../../../../components/shared/SingleSelectForm';
import Colors from '../../../../constants/Colors';
import Fonts from '../../../../constants/Fonts';
import Images from '../../../../constants/Images';
import { style } from '../../../../constants/Styles';
import { GroupTitle } from './partial/GroupTitle';
import { Portal , Provider } from 'react-native-paper';
import MultipleOptionsModal from '../../../../components/modal/MultipleOptionsModal'
import { MultipleSelectForm } from '../../../../components/shared/MultipleSelectForm';
import { DateForm } from '../../../../components/shared/DateForm';
import TakePhotoForm from '../../../../components/shared/TakePhotoForm';
import { useSelector , useDispatch} from 'react-redux';
import { DatetimePickerView } from './partial/DatetimePickerView';
import { SLIDE_STATUS } from '../../../../actions/actionTypes';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getTwoDigit } from '../../../../constants/Consts';
import { SignatureForm } from '../../../../components/shared/SignatureForm';
import Sign  from './partial/Sign';
import GrayBackground from '../../../../components/GrayBackground';
import * as ImagePicker from 'react-native-image-picker'; 
import RNFS from 'react-native-fs';

export const FormQuestions = (props) =>{

    const form = props.route.params.data;
    const [formQuestions, setFormQuestions] = useState(null);
    const [modaVisible, setModalVisible] = useState(false);
    const [options, setOptions] = useState([]);
    const [index, setIndex] = useState(-1);
    const [key, setKey] = useState(-1);
    const [mode, setMode] = useState("single");
    const crmStatus = useSelector(state => state.rep.crmSlideStatus);
    const [isDateTimeView , setIsDateTimeView] = useState(false);
    const [isSign, setIsSign] = useState(false);
    const [isInfo, setIsInfo] = useState(false);
    const [locationX, setLocationX] = useState(0);
    const [locationY, setLocationY] = useState(0);
    const [x,setX] = useState(0);
    const [y, setY] = useState(0);
    const [bubbleText, setBubleText] = useState("");
    const takePhotoFormRef = useRef();
    

    const dispatch = useDispatch()

    useEffect(() => {    
        if (props.screenProps) {
          props.screenProps.setOptions({            
            headerTitle:() =>{
              return(<TouchableOpacity                     
                 onPress={
                () =>{
                  if(props.navigation.canGoBack()){              
                    props.navigation.goBack();              
                  }
                }}> 
                <View style={style.headerTitleContainerStyle}>                                
                    <Image
                      resizeMethod='resize'
                      style={{width:15,height:20, marginRight:5}}
                      source={Images.backIcon}
                    />
                  <Text style={style.headerTitle} >Forms</Text>
              </View></TouchableOpacity>)
            }
          });
        }         
    });

    useEffect(() => {
      _callFormQuestions()
    },[]);
    
    
    const _callFormQuestions = () => {
      getFormQuestions(form.form_id).then((res) => {                
        groupByQuestions(res);
      }).catch((e) => {
      })
    }

    const groupByQuestions = (data) => {
      var newData = [];      
      data.forEach(element => {        
        if( !isInNewData(newData, element) ){
          var ques = [element];
          newData.push( { question_group_id: element.question_group_id , question_group: element.question_group, questions: ques } );
        }else{
          var tmp = newData.find(item => item.question_group_id === element.question_group_id);          
          var newTmp = [...tmp.questions, element];          
          tmp.questions = [...newTmp];
        }        
      });      
      setFormQuestions(newData);
    }
    const isInNewData = (data, value) =>{
      return data.find(item => item.question_group_id === value.question_group_id) ? true : false
    }


    const _onTouchStart = (e , text) => {            
      setX(e.pageX);
      setY(e.pageY);
      setLocationX(e.locationX);
      setLocationY(e.locationY);
      setBubleText(text);
      setTimeout(() =>{
        setIsInfo(true);            
      },100)
    }
    const getShift  = () =>{
      if(Platform.OS === 'ios'){
        return 65;
      }
      return 35;
    }

    const confirmDateTime = () =>{
      let datetime = "";      
      datetime = String(date.getFullYear()) + "-" + getTwoDigit(date.getMonth() + 1) + "-" + String(date.getDate());      
      var tmp = [...formQuestions];                  
      tmp[key].questions[index].value = datetime ;
      setFormQuestions(tmp);
      setIsDateTimeView(false);
    }
    
    const handleSignature = (signature) => {
      //console.log("signature", signature.replace("data:image/png;base64,", ""));
      console.log("signature");
    }

    selectPicker = (title, description) => {
        return Alert.alert(
          title,
          description,
          [
            // The "Yes" button
            {
              text: "Gallery",
              onPress: () => {
                launchImageLibrary();
              },
            },
            // The "No" button        
            {
              text: "Camera",
              onPress: () => {
                launchCamera();
              }
            },
          ]
        );
    }

  const launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary (options, (response)  => {      
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);        
      } else {                                                  
        if(response.assets != null && response.assets.length > 0){                     
          takePhotoFormRef.current.updateImage(response.assets[0].uri);          
        }
      }
    });
  }

  const launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {        
        if(response.assets != null && response.assets.length > 0){         
            //setSelectedPhotos([...selectedPhotos, response.assets[0].uri ]);             
        }
        
      }
    });

  }


    const renderQuestion = (item , key, index) =>{
      if(item.question_type === "text"){
        return (
          <TextForm key={ "question" +  index} item={item} type="text" onTouchStart={(e, text) => {
            _onTouchStart( e, text);
          }}></TextForm>
        );
      }else if(item.question_type === "yes_no"){
        return (
          <YesNoForm  key={ "question" +  index} item={item} onTouchStart={(e, text) => { _onTouchStart(e, text); } } ></YesNoForm>
        );
      }else if(item.question_type === "heading"){
        return (
          <HeadingForm key={ "question" + index} item={item}></HeadingForm>
        );
      }else if(item.question_type === "paragraph"){
        return (
          <ParagraphForm key={ "question" +  index} item={item}></ParagraphForm>
        );
      }else if(item.question_type === "multiple"){
        
        return (
          <SingleSelectForm  key={ "question" +  index}           
          onTouchStart={(e, text) => { _onTouchStart(e, text); } }
          onPress={(item) => {        
            setMode("single");
            setOptions(item.options);
            setModalVisible(true);
            setKey(key);
            setIndex(index);            
          }} item={item}></SingleSelectForm>
        );
      }else if(item.question_type === "multi_select"){
        
        return (
          <MultipleSelectForm  key={ "question" +  index} 
          onTouchStart={(e, text) => { _onTouchStart(e, text); } }
          onPress={(item) => {        
            setMode("multiple");
            setOptions(item.options);
            setModalVisible(true);
            setKey(key);
            setIndex(index);
          }} item={item}></MultipleSelectForm>
        );
      }else if(item.question_type === "numbers") {
        return (
          <TextForm key={ "question" + index} item={item} type="numeric" onTouchStart={(e, text) => { _onTouchStart(e, text); } } ></TextForm>
        );
      }else if(item.question_type === "date"){
        return (
          <DateForm key={ "question" + index} item={item}  
          onTouchStart={(e, text) => { _onTouchStart(e, text); } }
          onPress={() => {            
            setKey(key);
            setIndex(index);
            setIsDateTimeView(true);
          }} ></DateForm>
        );
      }else if(item.question_type === "signature"){
        return (
          <SignatureForm key={ "question" + index} item={item}  
          onTouchStart={(e, text) => { _onTouchStart(e, text); } } 
          onPress={() => {            
            setKey(key);
            setIndex(index);
            setIsSign(true);
            dispatch({type: SLIDE_STATUS, payload: true});
          }} ></SignatureForm>
        );
      }else if(item.question_type === "take_photo"){
        return (
          <TakePhotoForm           
          key={ "question" + index} item={item}           
          onTouchStart={(e, text) => { _onTouchStart(e, text); } } 
          ></TakePhotoForm>
        );
      }

      return <View key={"question" + index} ><Text>{item.question_type}</Text></View>
    }

    return (
        <Provider>
        <View style={styles.container}  onTouchStart={(e) => { setIsInfo(false); }}>

            <GrayBackground></GrayBackground>

            {
              isDateTimeView &&
              <DateTimePickerModal
                isVisible={true}
                mode={'date'}
                onConfirm={ (date) => { confirmDateTime(date); }}
                onCancel={() => {  setIsDateTimeView(false) }}
              />
            }
             
            {
               crmStatus && isSign &&
              <Sign onOK={handleSignature} text={"text"}  onClose={() => {
                 dispatch({type: SLIDE_STATUS, payload: false});                
                 setIsSign(false);
              }}></Sign>
            }
            
            <View style={styles.titleContainerStyle}>
              <View style={{flex:1}}>
                <Text style={styles.formTitleStyle}>{form.form_name}</Text>
              </View>
              <TouchableOpacity style={{alignItems:'flex-end', padding:5}}>
                <Text style={styles.clearTextStyle}>Clear All Answers</Text>
              </TouchableOpacity>                         
            </View>

                                                
            <ScrollView style={{padding:5}}>
              {
                formQuestions && formQuestions.map((form , key) => {
                  return (
                    <View key={"form" + key}>
                      <GroupTitle title={form.question_group}></GroupTitle>                      
                      {
                        form.questions.map((item , index) => {
                          return renderQuestion(item , key, index);
                        })
                      }
                    </View>
                  )
                })
              }
            </ScrollView>

            {
              isInfo &&
              <View style={{
                  top: y - locationY - getShift(),
                  position:'absolute',                                
                  borderRadius: 5,         
                  width:Dimensions.get("screen").width,  
                  borderRadius: 20,                
                }} key={1}>
                    
                  <View  style={{ backgroundColor: "#DDD", padding:10, marginLeft:20,marginRight:10,borderRadius:10, fontSize: 16, color: "#fff", }} key={1}><Text>{bubbleText}</Text></View>  
                  <View style={[style.triangle, {marginLeft:x - locationX + 3 }]}></View>                                              
              </View>
            }


            <Portal> 
                <MultipleOptionsModal
                    mode = {mode}
                    modaVisible={modaVisible}
                    options={options}                
                    onClose={() =>{
                        var tmp = [...formQuestions];                        
                        tmp[key].questions[index].value = null; 
                        setFormQuestions(tmp);
                        setModalVisible(false);
                    }}
                    onSave={() => {
                      setModalVisible(false);
                    }}
                    onValueChanged={( value ) =>{                      
                      var tmp = [...formQuestions];
                      if(mode === "single"){
                        tmp[key].questions[index].value = value;
                      }else{
                        tmp[key].questions[index].value = tmp[key].questions[index].value === null ? value : tmp[key].questions[index].value + "," + value;
                      }                      
                      setFormQuestions(tmp);
                      
                    }} >
                </MultipleOptionsModal> 
            </Portal>    

            
            
        </View>

        </Provider>
    );
}

const styles = StyleSheet.create({
    container:{
      flex:1,      
    },

    titleContainerStyle:{
      flexDirection:'row', padding:10 , alignItems:'center'
    },

    formTitleStyle:{
      fontSize:16,
      color:Colors.blackColor,
      fontFamily: Fonts.primaryBold
    },

    clearTextStyle:{
      fontSize:14,
      fontFamily:Fonts.primaryRegular,
      color:Colors.selectedRedColor
    }

})
