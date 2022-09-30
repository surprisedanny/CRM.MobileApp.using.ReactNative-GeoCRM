import React from 'react';
import CModal from '../../../../../components/common/CModal';
import {Colors, Constants} from '../../../../../constants';
import FormQuestionContainer from '../containers/FormQuestionContainer';

const FormQuestionModal = React.forwardRef((props, ref) => {
  const onButtonAction = data => {
    if (props.onButtonAction) {
      props.onButtonAction(data);
    }
    if (data.type == Constants.actionType.ACTION_DONE) {
      if (ref) {
        ref.current.hideModal();
      }
    }
    if (data.type == Constants.actionType.ACTION_CLOSE) {
      if (ref) {
        props.onButtonAction(data);
      }
    }
  };

  return (
    <CModal
      ref={ref}
      modalType={Constants.modalType.MODAL_TYPE_FULL}
      {...props}>
      <FormQuestionContainer
        {...props}
        style={{marginTop: 14}}
        onButtonAction={onButtonAction}
      />
    </CModal>
  );
});

export default FormQuestionModal;
