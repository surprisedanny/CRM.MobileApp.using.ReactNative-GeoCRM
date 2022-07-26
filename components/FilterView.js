import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';
import {Button, Title, Modal, Portal, TextInput} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import Divider from './Divider';
import FilterButton from './FilterButton';
import Skeleton from './Skeleton';
import Colors, {BG_COLOR, whiteLabel} from '../constants/Colors';
import {
  MAP_FILTERS,
  PIPELINE_SEARCH_FILTERS,
  SEARCH_FILTERS,
  SLIDE_STATUS,
} from '../actions/actionTypes';
import Fonts from '../constants/Fonts';
import {
  clearFilterData,
  getFilterData,
  storeFilterData,
} from '../constants/Storage';
import FilterOptionsModal from './modal/FilterOptionsModal';
import StartEndDateSelectionModal from './modal/StartEndDateSelectionModal';
import {
  getLocationSearchList,
  getLocationsMap,
} from '../actions/location.action';
import {getPipelineFilters} from '../actions/pipeline.action';
import SelectionPicker from './modal/SelectionPicker';
import {DatetimePickerView} from './DatetimePickerView';

export default function FilterView({navigation, page, onClose, isModal}) {
  const dispatch = useDispatch();
  const statusLocationFilters = useSelector(
    state => state.location.statusLocationFilters,
  );
  const originaLocationlFilterData = useSelector(
    state => state.location.locationFilters,
  );
  const filterParmeterChanged = useSelector(state => state.selection.filters);
  const [modaVisible, setModalVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [originOptions, setOriginOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [fieldType, setFieldType] = useState('');
  const [filters, setFilters] = useState('');
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [customId, setCustomId] = useState('');
  const [dispositionId, setDispositionId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateType, setDateType] = useState('');
  const [key, setKey] = useState(0);
  const [isStartEndDateSelection, setIsStartEndDateSelection] = useState(false);
  const [locationFilters, setLocationFilters] = useState([]);
  const [opportunityId, setOpportunityId] = useState('');
  const [modalMode, setModalMode] = useState('single');
  const isShowDivider = isModal;
  useEffect(() => {
    console.log('opened ', page);
    loadFilterDataFromStorage();
    setLocationFilters(originaLocationlFilterData);
  }, [originaLocationlFilterData]);

  useEffect(() => {
    if (endDate !== undefined && endDate !== '') {
      saveFilter(0, true);
    }
  }, [endDate]);

  const loadFilterDataFromStorage = async () => {
    var filterData =
      page == 'pipeline'
        ? await getFilterData('@pipeline_filter')
        : await getFilterData('@filter');
    setFilters(filterData);
  };

  const getStartDate = key => {
    if (filters.dispositions !== undefined) {
      if (locationFilters[key].disposition_field_id !== undefined) {
        var data = [...filters.dispositions];
        var start_date = '';
        data.forEach((element, index) => {
          if (
            element.disposition_field_id ===
            locationFilters[key].disposition_field_id
          ) {
            start_date = element.start_date;
          }
        });
        if (start_date != '') {
          return start_date;
        }
      }
    }
  };

  const getEndDate = key => {
    if (filters.dispositions !== undefined) {
      if (locationFilters[key].disposition_field_id !== undefined) {
        var data = [...filters.dispositions];
        var end_date = '';
        data.forEach((element, index) => {
          if (
            element.disposition_field_id ===
            locationFilters[key].disposition_field_id
          ) {
            end_date = element.end_date;
          }
        });
        if (end_date != '') {
          return end_date;
        }
      }
    }
  };

  const getSubTitle = key => {
    if (
      filters.stage_id !== undefined &&
      filters.outcome_id !== undefined &&
      filters.customs !== undefined
    ) {
      if (locationFilters[key].filter_label === 'Pipeline') {
        console.log('----', filters);
        if (filters.pipeline) {
          var data = [...filters.pipeline];
          if (data.length != 0) {
            return data.length + ' Selected';
          }
        }
      } else if (locationFilters[key].filter_label === 'Stage') {
        if (filters.stage_id) {
          var data = [...filters.stage_id];
          if (data.length != 0) {
            return data.length + ' Selected';
          }
        }
      } else if (locationFilters[key].filter_label === 'Outcome') {
        if (filters.outcome_id) {
          var data = [...filters.outcome_id];
          if (data.length != 0) {
            return data.length + ' Selected';
          }
        }
      } else if (locationFilters[key].filter_label === 'Opportunity Status') {
        if (filters.opportunity_status_id) {
          var data = [...filters.opportunity_status_id];
          if (data.length != 0) {
            return data.length + ' Selected';
          }
        }
      } else if (locationFilters[key].disposition_field_id !== undefined) {
        if (filters.dispositions) {
          var data = [...filters.dispositions];
          if (data.length != 0) {
            return data.length + ' Selected';
          }
        }
      } else if (locationFilters[key].opportunity_field_id !== undefined) {
        if (filters.opportunity_fields) {
          var data = [...filters.opportunity_fields];
          if (data.length != 0) {
            return data.length + ' Selected';
          }
        }
      } else if (locationFilters[key].custom_field_id !== undefined) {
        if (filters.customs) {
          var data = [...filters.customs];
          var flag = false;
          data.forEach((element, index) => {
            if (
              element.custom_field_id === locationFilters[key].custom_field_id
            ) {
              flag = true;
            }
          });
          if (flag) {
            return '1 Selected';
          }
          // if (data.length != 0) {
          //   return data.length + " Selected"
          // }
        }
      }
    }
  };

  const initializeSelectedType = key => {
    setOriginOptions(locationFilters[key].options);
    setOptions(locationFilters[key].options);
    setFieldType(locationFilters[key].field_type);

    if (locationFilters[key].filter_label === 'Stage') {
      setSelectedType('stage');
    } else if (locationFilters[key].filter_label === 'Outcome') {
      setSelectedType('outcome');
    } else if (locationFilters[key].filter_label === 'Pipeline') {
      setSelectedType('pipeline');
    } else if (locationFilters[key].filter_label === 'Opportunity Status') {
      setSelectedType('opportunity_status');
    } else if (locationFilters[key].disposition_field_id !== undefined) {
      setSelectedType('disposition');
      setDispositionId(locationFilters[key].disposition_field_id);
    } else if (locationFilters[key].opportunity_field_id !== undefined) {
      setSelectedType('opportunity');
      setOpportunityId(locationFilters[key].opportunity_field_id);
    } else if (locationFilters[key].custom_field_id !== undefined) {
      setSelectedType('custom');
      setCustomId(locationFilters[key].custom_field_id);
    } else {
      setSelectedType(locationFilters[key].filter_label);
    }
  };

  const selectFilter = key => {
    setKey(key);
    if (filters.stage_id === undefined || filters.customs === undefined) {
      let value = {
        stage_id: [],
        outcome_id: [],
        dispositions: [],
        customs: [],
      };
      if (page == 'pipeline') {
        value.opportunity_status_id = [];
        value.opportunity_fields = [];
        value.campaign_id = '';
      }
      setFilters(value);
    }
    setModalVisible(true);
  };

  const saveFilter = async (value, isChecked) => {
    if (selectedType == 'stage') {
      var data = [...filters.stage_id];
      var index = data.indexOf(value);
      if (index !== -1) {
        if (!isChecked) {
          data.splice(index, 1);
        }
      } else {
        if (isChecked) {
          data.push(value);
        }
      }
      filters.stage_id = data;
    } else if (selectedType == 'outcome') {
      var data = [...filters.outcome_id];
      var index = data.indexOf(value);
      if (index !== -1) {
        if (!isChecked) {
          data.splice(index, 1);
        }
      } else {
        if (isChecked) {
          data.push(value);
        }
      }
      filters.outcome_id = data;
    } else if (selectedType == 'pipeline') {
      setModalVisible(false);
      dispatch(getPipelineFilters(value));
      filters.pipeline = value;
    } else if (selectedType == 'custom') {
      var data = [...filters.customs];
      console.log('my custom data', data);
      var flag = false;
      var indexOfCustom = -1;
      data.forEach((element, index) => {
        if (element.custom_field_id === customId) {
          flag = true;
          indexOfCustom = index;
          element.field_value = value;
        }
      });
      if (!isChecked && flag) {
        // remove
        data.splice(indexOfCustom, 1);
      }
      if (isChecked && !flag) {
        // add
        if (fieldType == 'date') {
          data.push({
            custom_field_id: customId,
            field_type: fieldType,
            start_date: startDate,
            end_date: endDate,
          });
        } else {
          data.push({
            custom_field_id: customId,
            field_type: fieldType,
            field_value: value,
          });
        }
      }
      filters.customs = data;
    } else if (selectedType == 'disposition') {
      var data = [...filters.dispositions];
      var flag = false;
      var indexOfDisposition = -1;
      data.forEach((element, index) => {
        if (element.disposition_field_id === dispositionId) {
          flag = true;
          indexOfDisposition = index;
          element.field_value = value;
        }
      });
      if (!isChecked && flag) {
        // remove
        data.splice(indexOfDisposition, 1);
      }
      if (isChecked && !flag) {
        if (fieldType == 'date') {
          data.push({
            disposition_field_id: dispositionId,
            field_type: fieldType,
            start_date: startDate,
            end_date: endDate,
          });
        } else {
          data.push({
            disposition_field_id: dispositionId,
            field_type: fieldType,
            field_value: value,
          });
        }
        console.log('data', data);
      } else {
        if (fieldType == 'date') {
          data.push({
            disposition_field_id: dispositionId,
            field_type: fieldType,
            start_date: startDate,
            end_date: endDate,
          });
        }
      }

      filters.dispositions = data;
    } else if (selectedType == 'opportunity') {
      var data = [...filters.opportunity_fields];
      var flag = false;
      var indexOfOpportunity = -1;
      data.forEach((element, index) => {
        if (element.opportunity_field_id === opportunityId) {
          flag = true;
          indexOfOpportunity = index;
          element.field_value = value;
        }
      });
      if (!isChecked && flag) {
        // remove
        data.splice(indexOfOpportunity, 1);
      }
      if (isChecked && !flag) {
        if (fieldType == 'date') {
          data.push({
            opportunity_field_id: opportunityId,
            field_type: fieldType,
            start_date: startDate,
            end_date: endDate,
          });
        } else {
          data.push({
            opportunity_field_id: opportunityId,
            field_type: fieldType,
            field_value: value,
          });
        }
      }
      filters.opportunity_fields = data;
    } else if (selectedType == 'opportunity_status') {
      var data = [...filters.opportunity_status_id];
      var index = data.indexOf(value);
      if (index !== -1) {
        if (!isChecked) {
          data.splice(index, 1);
        }
      } else {
        if (isChecked) {
          data.push(value);
        }
      }
      filters.opportunity_status_id = data;
    }

    if (filters !== undefined) {
      setFilters(filters);
      if (page == 'pipeline') {
        await storeFilterData('@pipeline_filter', filters);
      } else {
        await storeFilterData('@filter', filters);
      }
    }

    if (
      locationFilters[key] !== undefined &&
      locationFilters[key].options !== undefined
    ) {
      setOptions([]);
      setOriginOptions(locationFilters[key].options);
      // var tmp = [];
      // locationFilters[key].options.forEach((item, index) => {
      //   tmp.push(item.name);
      // });
      setOptions(locationFilters[key].options);
    }
  };

  const handleScheduleDate = date => {
    let datetime = date;
    let time = '';
    // datetime = String(date.getFullYear()) + "-" + getTwoDigit(date.getMonth() + 1) + "-" + String(date.getDate());
    // time = String(date.getHours()) + ":" + String(date.getMinutes());
    setIsDateTimePickerVisible(false);
    if (dateType === 'start') {
      setStartDate(datetime);
    } else {
      setEndDate(datetime);
      setIsStartEndDateSelection(false);
      console.log(selectedType);
      saveFilter(0, true);
    }
  };

  if (statusLocationFilters == 'request') {
    return (
      <ScrollView style={styles.container}>
        <View style={{padding: 10, justifyContent: 'center'}}>
          {Array.from(Array(6)).map((_, key) => (
            <Skeleton key={key} />
          ))}
        </View>
      </ScrollView>
    );
  }

  const submit = () => {};

  return (
    <ScrollView style={styles.container}>
      {isShowDivider && (
        <TouchableOpacity
          style={{padding: 6}}
          onPress={() => dispatch({type: SLIDE_STATUS, payload: false})}>
          <Divider />
        </TouchableOpacity>
      )}

      <DatetimePickerView
        visible={isDateTimePickerVisible}
        value={''}
        onModalClose={() => {
          setIsDateTimePickerVisible(true);
        }}
        close={value => {
          console.log('dd', value);
          handleScheduleDate(value.replace('/', '-').replace('/', '-'));
        }}></DatetimePickerView>

      <View style={styles.sliderHeader}>
        <Title style={{fontFamily: Fonts.primaryBold}}>
          Filter your search
        </Title>
        <Button
          labelStyle={{
            fontFamily: Fonts.primaryRegular,
            letterSpacing: 0.2,
          }}
          color={Colors.selectedRedColor}
          uppercase={false}
          onPress={async () => {
            let value = {
              stage_id: [],
              outcome_id: [],
              dispositions: [],
              customs: [],
            };

            if (page == 'pipeline') {
              value.opportunity_status_id = [];
              value.opportunity_fields = [];
              value.campaign_id = '';
            }

            setFilters(value);
            if (page == 'pipeline') {
              await clearFilterData('@pipeline_filter');
            } else {
              await clearFilterData('@filter');
            }

            if (page == 'map') {
              dispatch({type: MAP_FILTERS, payload: value});
            } else if (page == 'search') {
              dispatch({type: SEARCH_FILTERS, payload: value});
            } else if (page == 'pipeline') {
              dispatch({type: PIPELINE_SEARCH_FILTERS, payload: value});
            }
          }}>
          Clear Filters
        </Button>
      </View>

      {locationFilters.map((locationFilter, key) => (
        <FilterButton
          text={locationFilter.filter_label}
          key={key}
          subText={getSubTitle(key)}
          startDate={getStartDate(key)}
          endDate={getEndDate(key)}
          onPress={() => {
            console.log('locationFilter', locationFilter);
            if (locationFilter.field_type === 'dropdown') {
              initializeSelectedType(key);
              selectFilter(key);
            } else {
              initializeSelectedType(key);
              setIsStartEndDateSelection(true);
            }
          }}
        />
      ))}

      <Button
        mode="contained"
        color={whiteLabel().actionFullButtonBackground}
        uppercase={false}
        labelStyle={{
          fontSize: 18,
          fontFamily: Fonts.secondaryBold,
          letterSpacing: 0.2,
          color: whiteLabel().actionFullButtonText,
        }}
        onPress={() => {
          console.log('apply filters', filters);
          var cloneFilters = {...filters};
          if (page == 'map') {
            dispatch({type: MAP_FILTERS, payload: cloneFilters});
          } else if (page == 'search') {
            dispatch({type: SEARCH_FILTERS, payload: cloneFilters});
          } else if (page == 'pipeline') {
            dispatch({type: PIPELINE_SEARCH_FILTERS, payload: cloneFilters});
          }
          onClose();
        }}>
        Apply Filters
      </Button>

      <FilterOptionsModal
        title=""
        clearTitle="Close"
        modaVisible={modaVisible}
        options={options}
        filters={filters}
        selectedType={selectedType}
        fieldType={fieldType}
        onClose={() => {
          setModalVisible(false);
        }}
        onValueChanged={(id, value) => {
          if (
            selectedType == 'stage' ||
            selectedType == 'outcome' ||
            selectedType == 'pipeline' ||
            selectedType == 'opportunity_status'
          ) {
            saveFilter(id, value);
          } else {
            console.log('save filter', id);
            console.log('save filter', value);
            saveFilter(id, value);
          }
        }}></FilterOptionsModal>

      <Portal>
        <StartEndDateSelectionModal
          visible={isStartEndDateSelection}
          startDate={startDate}
          endDate={endDate}
          openDatePicker={type => {
            setIsDateTimePickerVisible(true);
            setDateType(type);
          }}
          onModalClose={() => {
            setIsStartEndDateSelection(false);
          }}></StartEndDateSelectionModal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BG_COLOR,
    padding: 10,
    alignSelf: 'stretch',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});
