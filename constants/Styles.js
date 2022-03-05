import { StyleSheet , Platform, Dimensions} from "react-native";
import Fonts from "./Fonts";
import { BG_COLOR, PRIMARY_COLOR } from "./Colors";

export const boxShadow = StyleSheet.create({
  shadowColor: '#808080',
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: Platform.OS == 'ios' ? 0.1 : 0.8,
  elevation: 1,
});

export const grayBackground = StyleSheet.create({
  backgroundColor: '#27272778',
  position: 'absolute',
  width: '100%',
  height: '100%',
  zIndex: 1,
  elevation: 1
});

export const style = StyleSheet.create({

  headerTitle: {
    fontFamily:Fonts.primaryRegular, 
    color:"#FFF" , 
    fontSize:20 , 
    fontWeight:"400",
    marginLeft:0,        
  },
  

  headerLeftStyle: {
    backgroundColor: PRIMARY_COLOR,
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: '100%'
  },

  headerTitleContainerStyle: {        
    flexDirection:'row',    
    justifyContent:'flex-start',
    alignItems:'center',    
  },

  plusButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1,
    elevation: 1,
  },
  
  innerPlusButton: {          

  },

  card: {    
    marginBottom: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
    padding: 8,        
    shadowColor:'#000',
    shadowOffset:{
      width: 0, 
      height: 1
    },
    shadowOpacity:0.27,
    shadowRadius:0.65,
    zIndex: 2
  },

  grey_bar: {    
    height: 12,
    borderRadius: 10,
    backgroundColor: '#d1d1d1',
    marginTop:3,
    marginBottom:3,
    marginRight:10,
  },
  numberBox: {
    width: 24,
    height: 24,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginRight: 4
  },
  
})


