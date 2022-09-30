import {View, StyleSheet, Keyboard} from 'react-native';
import React, {useRef} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {Constants} from '../../../../../constants';
import SimScanChildView from './SimScanChildView';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import SimViewListsModal from '../modal/sim/SimViewListsModal';
import ScanView from '../../../../../components/common/ScanView';

export default function SimScanView(props) {
  const {count} = props;
  const simViewListModalRef = useRef(null);
  const onSuccess = e => {
    /// From Camera
    const {data} = e;
    props.onButtonAction({
      type: Constants.actionType.ACTION_CAPTURE,
      value: data,
    });
  };

  const onSubmit = value => {
    // Manual Input
    props.onButtonAction({
      type: Constants.actionType.ACTION_CAPTURE,
      value: value,
    });
  };

  const addStock = () => {
    props.onButtonAction({type: Constants.actionType.ACTION_DONE, value: 0});
  };

  const changeNetwork = () => {
    props.onButtonAction({type: Constants.actionType.ACTION_CLOSE, value: 0});
  };

  const viewLists = () => {
    simViewListModalRef.current.showModal();
  };

  const onSimViewListClosed = ({type, value}) => {
    if (type == Constants.actionType.ACTION_CHANGE_NETWORK) {
      changeNetwork();
    }
    if (type == Constants.actionType.ACTION_REMOVE) {
      props.onButtonAction({
        type: Constants.actionType.ACTION_REMOVE,
        value: value,
      });
    }
    if (type == Constants.actionType.ACTION_CLOSE) {
      simViewListModalRef.current.hideModal();
    }
    if (type == Constants.actionType.ACTION_DONE) {
      addStock();
    }
  };

  const renderCustomerMarker = () => {
    return (
      <View style={styles.cameraMarker}>
        <View style={{alignSelf: 'stretch', flexDirection: 'row'}}>
          <View
            style={{
              borderColor: Colors.green2Color,
              borderTopWidth: 4,
              borderLeftWidth: 4,
              width: 80,
              height: 80,
            }}
          />
          <View
            style={{
              width: 70,
              height: 80,
            }}
          />
          <View
            style={{
              borderColor: Colors.green2Color,
              borderTopWidth: 4,
              borderRightWidth: 4,
              width: 80,
              height: 80,
            }}
          />
        </View>
        <View
          style={{
            alignSelf: 'stretch',
            flexDirection: 'row',
            height: 70,
          }}
        />
        <View style={{alignSelf: 'stretch', flexDirection: 'row'}}>
          <View
            style={{
              borderColor: Colors.green2Color,
              borderBottomWidth: 4,
              borderLeftWidth: 4,
              width: 80,
              height: 80,
            }}
          />
          <View
            style={{
              width: 70,
              height: 80,
            }}
          />
          <View
            style={{
              borderColor: Colors.green2Color,
              borderBottomWidth: 4,
              borderRightWidth: 4,
              width: 80,
              height: 80,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <ScanView
      onButtonAction={props.onButtonAction}
      isPartialDetect={true}
      showClose={true}
      onClose={() => {
        if (props.onButtonAction) {
          props.onButtonAction({
            type: Constants.actionType.ACTION_CLOSE,
            value: 0,
          });
        }
      }}
      renderLastScanResultView={() => {
        return (
          <>
            <SimScanChildView
              onClose={() => {
                Keyboard.dismiss();
              }}
              title={'Items ' + count}
              isAdded={props.isAdded}
              addStock={addStock}
              changeNetwork={changeNetwork}
              viewLists={viewLists}
              onSubmit={value => onSubmit(value)}></SimScanChildView>

            <SimViewListsModal
              ref={simViewListModalRef}
              lists={props.codeLists}
              type="add_stock_view_lists"
              onButtonAction={onSimViewListClosed}
            />
          </>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraMarker: {
    width: 230,
    height: 230,
  },
});
