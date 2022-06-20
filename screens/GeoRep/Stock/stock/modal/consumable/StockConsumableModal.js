
import { View, Text , StyleSheet , TextInput} from 'react-native'
import React , { useState , useEffect, useRef} from 'react'
import CModal from '../../../../../../components/common/CModal';
import { Constants } from '../../../../../../constants';
import StockConsumableContainer from '../../container/StockConsumableContainer';

const StockConsumableModal = React.forwardRef((props, ref) => {

    const onButtonAction = data => {
        if (props.onButtonAction) {
          props.onButtonAction(data);
        }
        if (ref) {
          ref.current.hideModal();
        }
    };        
    const openSellToTrader = (value) => {  
        onButtonAction({ type: Constants.actionType.ACTION_NEXT , value: value });
    }
    const openTransfer = (value) => {
        onButtonAction({ type: Constants.actionType.ACTION_NEXT , value: value });
    }

    return (
        <CModal
            ref={ref}            
            modalType={Constants.modalType.MODAL_TYPE_BOTTOM}
            closableWithOutsideTouch
            onClear={() => {
                onButtonAction({ type: Constants.actionType.ACTION_FORM_CLEAR });
            }}
            {...props}>
            <StockConsumableContainer
                openSellToTrader={openSellToTrader}            
                openTransfer={openTransfer}                
                {...props} />
        </CModal>        
    )

});

export default StockConsumableModal;
