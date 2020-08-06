import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TextInput,
  Image,
  AppState,
  Keyboard,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import MediaView from './listItemViews/MediaView';
import { CustomText as Text, TITLE_FONT } from '../text/CustomText';
import { composeMediaPropType } from '../../config/propTypes';

import { composeViewStyles as styles } from './styles';

// DISPLAYS CENTER COMPOSE VIEW INSIDE THE COMPOSE SCREEN
// Takes the following props:
// descriptionPlaceholder (sets the top TextInput placeholder)
// captionPlaceholder (sets the bottom TextInput placeholder)
// media (contains the array of image URIs)
// descriptionValue (controls the top TextInput value)
// onDescriptionChange (handles the top TextInput changes)
// onCaptionChange (handles the bottom TextInput changes)
// captionValue (controls the bottom TextInput value)

const templateImage = require('../../../assets/images/compose.png');

const ANIMATION_DURATION = 300;

const ComposeView = ({
  descriptionPlaceholder,
  captionPlaceholder,
  media,
  descriptionValue,
  onDescriptionChange,
  onCaptionChange,
  captionValue,
  galleryName,
}) => {
  const inputViewHeight = useRef(new Animated.Value(0)).current;
  const translate = inputViewHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 70],
  });

  const inputViewStyles = [
    styles.descriptionView,
    { transform: [{ translateY: translate }] },
  ];

  const keyboardShow = () => {
    Animated.timing(inputViewHeight, {
      toValue: 1,
      duration: 0,
      useNativeDriver: true,
    }).start();
  };

  const keyboardHide = () => {
    Animated.timing(inputViewHeight, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const name = Platform.OS === 'ios' ? 'Will' : 'Did';

    AppState.addEventListener = Keyboard.addListener(
      `keyboard${name}Show`,
      keyboardShow
    );
    AppState.addEventListener = Keyboard.addListener(
      `keyboard${name}Hide`,
      keyboardHide
    );

    return () => {
      AppState.removeEventListener = Keyboard.removeListener(
        `keyboard${name}Show`,
        keyboardShow
      );
      AppState.removeEventListener = Keyboard.removeListener(
        `keyboard${name}Hide`,
        keyboardHide
      );
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Animated.View style={inputViewStyles}>
          <TextInput
            style={[styles.input, styles.inputTop]}
            placeholder={descriptionPlaceholder}
            textAlignVertical="top"
            onChangeText={onDescriptionChange}
            value={descriptionValue}
            multiline
          />
        </Animated.View>
        <View style={styles.mediaView}>
          {galleryName !== null && (
            <LinearGradient
              style={styles.galleryView}
              colors={[styles.$gradientColorFrom, styles.$gradientColorTo]}
              start={[0, 1]}
              end={[1, 0]}
            >
              <Text
                text={galleryName}
                fontFamily={TITLE_FONT}
                numberOfLines={1}
              />
            </LinearGradient>
          )}
          {!media ? (
            <Image source={templateImage} style={styles.templateImage} />
          ) : (
            <MediaView
              media={media.video || media.images}
              caption={captionValue}
              enableAutoPlay
            />
          )}
        </View>
        <View
          style={[
            styles.captionView,
            media && media.type !== 'video' && styles.$captionviewHeight,
          ]}
        >
          {media && media.type !== 'video' && (
            <TextInput
              style={styles.input}
              placeholder={captionPlaceholder}
              onChangeText={onCaptionChange}
              value={captionValue}
            />
          )}
        </View>
      </View>
    </View>
  );
};

ComposeView.defaultProps = {
  descriptionPlaceholder: 'Write something...',
  media: null,
  captionPlaceholder: 'Add caption...',
  galleryName: null,
};

ComposeView.propTypes = {
  descriptionPlaceholder: PropTypes.string,
  media: composeMediaPropType,
  captionPlaceholder: PropTypes.string,
  descriptionValue: PropTypes.string.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  onCaptionChange: PropTypes.func.isRequired,
  captionValue: PropTypes.string.isRequired,
  galleryName: PropTypes.string,
};

export default ComposeView;
