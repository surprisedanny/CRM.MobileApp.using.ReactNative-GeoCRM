import { View, Text ,StyleSheet } from 'react-native'
import React from 'react'
import { Constants } from '../../../constants';
import BaseForm from '../BaseForm';
import EmailInputView from './EmailInputView';

export default function EmailPdf(props) {
        
    const {item, questionType, formIndex} = props;
    const isCompleted = item.completed_data != false && item.completed_data != null;
    const questionButtonType = item.value != null ? Constants.questionButtonType.QUESTION_BUTTON_DONE : ''
    
    const renderContent = formCompleted => {
        if (formCompleted) {
          return <Text>completed</Text>
        }
        return (
          <EmailInputView />
        );
      };
             
    return (        
      <BaseForm
          item={item}
          style={[styles.container, props.style]}
          onItemAction={props.onFormAction}>
          {renderContent(isCompleted)}                
      </BaseForm>
    );

}


const styles = StyleSheet.create({
    container: {
      alignSelf: 'stretch',
    },
});
