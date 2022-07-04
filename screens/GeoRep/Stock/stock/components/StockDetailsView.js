

import { View} from 'react-native'
import React from 'react'
import CardView from '../../../../../components/common/CardView'
import { AppText } from '../../../../../components/common/AppText'
import { whiteLabel } from '../../../../../constants/Colors'
import { SubmitButton } from '../../../../../components/shared/SubmitButton'
import { getSubText } from '../../../../../helpers/viewHelper'
import StockDetailCard from './autom/StockDetailCard'

export default function StockDetailsView(props) {
    const {item} = props;    
    return (
        <View style={{marginBottom:30}}>

            <StockDetailCard item={item} />
            
            <View style={{marginHorizontal:10 , marginTop:20}}>
                <SubmitButton title="Sell to Trader" onSubmit={props.sellToTrader} ></SubmitButton>
                <SubmitButton title="Swop at Trader" onSubmit={props.swopAtTrader}  style={{marginTop:10}}></SubmitButton>
                <SubmitButton title="Transfer" onSubmit={props.trader} style={{marginTop:10}}></SubmitButton>
            </View>
                     
        </View>
    )
}