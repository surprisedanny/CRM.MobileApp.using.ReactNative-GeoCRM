import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {showNotification} from '../../../actions/notification.action';
import {Colors, Constants, Fonts, Values} from '../../../constants';
import CardView from '../../common/CardView';
import CCheckBox from '../../common/CCheckBox';
import CTabSelector from '../../common/CTabSelector';
import {SubmitButton} from '../SubmitButton';
import CounterItemList from './components/CounterItemList';
import {constructFormData, getValueFromFormData} from './helper';

const SKUCountForm = props => {
  const dispatch = useDispatch();
  const {item, questionType} = props;
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState();
  const [formData, setFormData] = useState({});
  let countStep = 1;
  let countNumberFixed = 0;
  if (questionType == Constants.questionType.FORM_TYPE_SKU_SHELF_SHARE) {
    countStep = 0.1;
    countNumberFixed = 1;
  }
  let countItems = [];
  let isSegmentNotInStore = false;
  if (formData[selectedCategory]) {
    countItems = formData[selectedCategory].competitors;
    isSegmentNotInStore = formData[selectedCategory].noSegment;
  }
  const data = item;
  const categories = data.categories.map(category => {
    return {
      title: category,
      category: category,
    };
  });
  const validateForm = () => {
    const invalidCategories = [];
    for (category in formData) {
      const categoryFormData = formData[category];
      const hasSegment = categoryFormData.competitors.find(x => x.count > 0);
      if (!categoryFormData.noSegment && !hasSegment) {
        invalidCategories.push(category);
      }
    }
    if (invalidCategories.length > 0) {
      const errorMessage = `Please make an input/selection for categories: ${invalidCategories.join(
        ', ',
      )}`;
      dispatch(
        showNotification({
          type: 'error',
          message: errorMessage,
          buttonText: 'Okay',
        }),
      );
      return false;
    }
    return true;
  };
  const onSubmit = () => {
    if (!validateForm()) {
      return;
    }
    const submitValueData = getValueFromFormData(formData, item);
    if (props.onButtonAction) {
      props.onButtonAction({
        type: Constants.actionType.ACTION_FORM_SUBMIT,
        value: submitValueData,
      });
    }
  };
  useEffect(() => {}, [selectedCategory, item]);
  useEffect(() => {
    const formData = constructFormData(item);
    setFormData(formData);
    if (categories.length > 0) {
      setSelectedTabIndex(0);
      setSelectedCategory(categories[0].category);
    }
  }, [item]);

  const onCounterItemAction = ({type, item, nextCount}) => {
    const _formData = {...formData};
    const _countItems = _formData[selectedCategory].competitors;
    const itemIndex = _countItems.findIndex(x => x.name == item.name);
    if (itemIndex < 0) {
      return false;
    }
    _countItems[itemIndex].count = nextCount;
    setFormData(_formData);
  };

  const setIsSegmentNotInStore = (_category, _value) => {
    const _formData = {...formData};
    if (_formData[_category]) {
      _formData[_category].noSegment = _value;
    }
    setFormData(_formData);
  };
  return (
    <View style={[styles.container, props.style]}>
      <CardView>
        <CTabSelector
          items={categories}
          selectedIndex={selectedTabIndex}
          onSelectTab={(item, index) => {
            setSelectedTabIndex(index);
            setSelectedCategory(item.category);
          }}
        />
      </CardView>
      <CardView style={styles.checkBoxContainer}>
        <Text style={[styles.text, {marginRight: 32}]}>
          {'Segment not in store'}
        </Text>
        <CCheckBox
          value={isSegmentNotInStore}
          onValueChange={value => {
            setIsSegmentNotInStore(selectedCategory, !isSegmentNotInStore);
          }}
        />
      </CardView>
      {!isSegmentNotInStore && (
        <CardView style={styles.boxContainer}>
          <CounterItemList
            items={countItems}
            step={countStep}
            fixed={countNumberFixed}
            onItemAction={onCounterItemAction}
          />
        </CardView>
      )}

      <SubmitButton
        title={'Submit'}
        style={{marginVertical: 16}}
        onSubmit={() => {
          onSubmit();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingHorizontal: 8,
  },
  text: {
    fontFamily: Fonts.primaryMedium,
    fontSize: Values.fontSize.xSmall,
    color: Colors.textColor,
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBoxContainer: {
    marginTop: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  boxContainer: {
    marginTop: 8,
    paddingVertical: 8,
    alignSelf: 'stretch',
  },
});

export default SKUCountForm;