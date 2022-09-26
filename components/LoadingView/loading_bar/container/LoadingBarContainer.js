
import { View ,StyleSheet } from 'react-native'
import React , {useEffect, useState } from 'react'
import { AppText } from '../../../common/AppText'
import { style } from '../../../../constants/Styles';
import { ActivityIndicator } from 'react-native-paper';
import { whiteLabel } from '../../../../constants/Colors';

export default function LoadingBarContainer(props) {
    
    const { title } = props;
    return (
        <View style={{alignSelf:'stretch', alignItems:'center', paddingVertical:15}}>
            <AppText size="medium" title={'Please Wait,'}></AppText>
            <AppText size="medium" style={{marginBottom:10}} title={title? title : 'your form is being submitted'}></AppText>

            <View style={styles.divider}></View>
            <ActivityIndicator style={{marginTop:10}}  color={whiteLabel().mainText} />

        </View>
    )
}

const styles = StyleSheet.create({
    divider:{
        height:1,
        width: '100%',
        backgroundColor:'#eee',        
    }
})