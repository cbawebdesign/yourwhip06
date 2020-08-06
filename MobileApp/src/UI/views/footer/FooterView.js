import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeArea } from 'react-native-safe-area-context';

import { footerViewStyles as styles } from './styles';

// DISPLAYS THE FOOTER VIEW
// Takes the following props:
// isLarge (renders the larger 85 points variant of the footer)
// hasGradient (renders a gradient background color)
// backgroundColor (renders a non-gradient background color)
// keyboardActive (registers whether the keyboard is active
// if the view contains a TextInput child view)

const FooterView = ({
  children,
  isLarge,
  hasGradient,
  backgroundColor,
  keyboardActive,
}) => {
  const HEIGHT =
    (isLarge ? 85 : 60) + (keyboardActive ? 0 : useSafeArea().bottom);
  const BG_COLOR = hasGradient
    ? [styles.$gradientColorFrom, styles.$gradientColorTo]
    : [backgroundColor, backgroundColor];

  return (
    <LinearGradient colors={BG_COLOR} start={[0, 0]} end={[1, 1]}>
      <View style={{ height: HEIGHT }}>{children}</View>
    </LinearGradient>
  );
};

FooterView.defaultProps = {
  isLarge: false,
  hasGradient: false,
  backgroundColor: '#020202',
  keyboardActive: false,
};

FooterView.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element])
    .isRequired,
  isLarge: PropTypes.bool,
  hasGradient: PropTypes.bool,
  backgroundColor: PropTypes.string,
  keyboardActive: PropTypes.bool,
};

export default FooterView;
