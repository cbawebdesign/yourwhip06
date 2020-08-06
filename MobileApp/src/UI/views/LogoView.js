import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Image, Keyboard, AppState, Animated, Platform } from 'react-native';

import { CustomText as Text, TITLE_FONT } from '../text/CustomText';

import { logoViewStyles as styles } from './styles';

const Logo = require('../../../assets/images/logo.png');

const ANIMATION_DURATION = 300;

let logoViewScale;

const LogoView = ({ title }) => {
  logoViewScale = useRef(new Animated.Value(styles.$viewScaleLarge)).current;

  const keyboardShow = () => {
    Animated.timing(logoViewScale, {
      toValue: 0.65,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  };

  const keyboardHide = () => {
    Animated.timing(logoViewScale, {
      toValue: 1,
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
    <Animated.View
      style={[styles.container, { transform: [{ scale: logoViewScale }] }]}
    >
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
      <Text text={title} fontFamily={TITLE_FONT} style={styles.title} />
    </Animated.View>
  );
};

LogoView.prototype = {
  title: PropTypes.string.isRequired,
};

export default LogoView;
