import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, Platform, Keyboard, AppState } from 'react-native';

import IconButton from '../buttons/IconButton';
import { commentComposeViewStyles as styles } from './styles';

// DISPLAYS THE INPUT VIEW USED TO COMPOSE NEW COMMENTS.
// Takes the following props:
// onComposePress (to create the new comment)
// onCommentChange (transfers comment string to Comment parent screen)
// commentValue (controls the value of the comment TextInput)

const composeIcon = require('../../../assets/icons/compose.png');

const CommentComposeView = ({
  onComposePress,
  onCommentChange,
  commentValue,
  onKeyboardShow,
  onKeyboardHide,
}) => {
  useEffect(() => {
    const name = Platform.OS === 'ios' ? 'Will' : 'Did';

    AppState.addEventListener = Keyboard.addListener(
      `keyboard${name}Show`,
      onKeyboardShow
    );
    AppState.addEventListener = Keyboard.addListener(
      `keyboard${name}Hide`,
      onKeyboardHide
    );

    return () => {
      AppState.removeEventListener = Keyboard.removeListener(
        `keyboard${name}Show`,
        onKeyboardShow
      );
      AppState.removeEventListener = Keyboard.removeListener(
        `keyboard${name}Hide`,
        onKeyboardHide
      );
    };
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Write something..."
        style={styles.input}
        onChangeText={onCommentChange}
        value={commentValue}
        multiline
      />
      <IconButton icon={composeIcon} onPress={onComposePress} />
    </View>
  );
};

CommentComposeView.propTypes = {
  onComposePress: PropTypes.func.isRequired,
  onCommentChange: PropTypes.func.isRequired,
  commentValue: PropTypes.string.isRequired,
  onKeyboardShow: PropTypes.func.isRequired,
  onKeyboardHide: PropTypes.func.isRequired,
};

export default CommentComposeView;
