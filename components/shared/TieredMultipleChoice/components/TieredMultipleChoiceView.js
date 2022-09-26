import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import TieredMultipleChoiceInput from '../../../common/TieredMutipleChoiceInput';
import {SubmitButton} from '../../SubmitButton';
import {Constants, Strings} from '../../../../constants';
import {useDispatch} from 'react-redux';
import {showNotification} from '../../../../actions/notification.action';

export default function TieredMultipleChoiceView(props) {
  const {item} = props;
  const [dropdownLabels, setDropdownLabels] = useState([]);
  const [selectedDropdownLists, setSelectedDropdownLists] = useState([]);
  const [level, setLevel] = useState(0);
  const [showError, setShowError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    var tmp = [];
    if (item.dropdown_labels != undefined) {
      for (let value of Object.keys(item.dropdown_labels)) {
        tmp.push(item.dropdown_labels[value]);
      }
      setDropdownLabels(tmp);
    }
    if (item.value != null && item.value != undefined) {
      var splits = item.value.split(' - ');
      tmp = [];
      splits.forEach(item => {
        tmp.push({label: item});
      });
      setSelectedDropdownLists(tmp);
    }
  }, [item, item.value]);

  useEffect(() => {}, [selectedDropdownLists]);

  const filterData = (objects, recursiveIndex, level) => {
    if (objects != undefined) {
      var tmp = [];
      var objKey = '';

      if (
        selectedDropdownLists[recursiveIndex] &&
        selectedDropdownLists[recursiveIndex] != undefined
      ) {
        objKey = selectedDropdownLists[recursiveIndex].label;
      }

      for (let value of Object.keys(objects)) {
        if (!isNaN(Number(value))) {
          tmp.push({label: objects[value]});
        } else {
          tmp.push({label: value});
        }
      }

      if (recursiveIndex === level) {
        return tmp;
      } else {
        if (objKey != '') {
          objects = objects[objKey];
          return filterData(objects, recursiveIndex + 1, level);
        } else {
          return [];
        }
      }
    } else {
      return [];
    }
  };

  const getLists = index => {
    var lists = filterData(item.options, 0, index);
    return lists;
  };

  const onSubmit = () => {
    var lists = getLists(level + 1);
    if (
      lists.length === 0 ||
      dropdownLabels.length == selectedDropdownLists.length
    ) {
      var value = '';
      selectedDropdownLists.forEach((element, index) => {
        if (index === 0) {
          value = element.label;
        } else {
          value = value + ' - ' + element.label;
        }
      });
      props.onButtonAction({
        type: Constants.actionType.ACTION_FORM_SUBMIT,
        value: value,
      });
    } else {
      setShowError(true);
      dispatch(
        showNotification({
          type: 'success',
          message: Strings.Complete_All_Fields,
          buttonText: 'Ok',
        }),
      );
    }
  };

  return (
    <View
      style={{
        alignSelf: 'stretch',
        marginHorizontal: 10,
        marginTop: 7,
        marginBottom: 7,
      }}>
      {dropdownLabels.map((element, index) => {
        return (
          <TieredMultipleChoiceInput
            hasError={showError && index === level + 1 ? true : false}
            key={index}
            selectedItem={selectedDropdownLists[index]}
            renderDropdownItem={props.renderDropdownItem}
            onItemSelected={item => {
              if (!props.renderDropdownItem) {
                setSelectedDropdownLists([...selectedDropdownLists, item]);
              }
            }}
            header={element}
            lists={getLists(index)}
          />
        );
      })}

      <SubmitButton title="Save" onSubmit={onSubmit} />
    </View>
  );
}