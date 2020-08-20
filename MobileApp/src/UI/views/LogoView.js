import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Image, Animated } from 'react-native';

import { CustomText as Text, TITLE_FONT } from '../text/CustomText';

import { useKeyboardState } from '../../config/hooks';

import { logoViewStyles as styles } from './styles';

const Logo = require('../../../assets/images/logo.png');

const ANIMATION_DURATION = 300;

const LogoView = ({ title }) => {
  const { onKeyboardShow } = useKeyboardState();
  const logoViewScale = useRef(new Animated.Value(styles.$viewScaleLarge))
    .current;

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
    if (onKeyboardShow) {
      keyboardShow();
    } else {
      keyboardHide();
    }
  }, [onKeyboardShow]);

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
