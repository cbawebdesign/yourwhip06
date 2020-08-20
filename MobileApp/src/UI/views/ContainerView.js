import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import LoadingView from './LoadingView';

import { containerViewStyles as styles } from './styles';

// DISPLAYS THE OUTER VIEW FOR MOST SCREENS.
// Takes the following props:
// backgroundColor (to set background)
// onPress (i.e. to hide keyboard)
// hasGradient (to enable gradient background color)
// touchEnabled (must be set to false when view takes
// ScrollView or FlatList component(s))
// loadingOptions (to display the loading view and
// enable/disable loading spinner)
// headerHeight (sets the header margin for all screens with
// transparent options set to 'true')
// onKeyboardHide (called when keyboard disappears)

const ContainerView = ({
  children,
  onPress,
  hasGradient,
  touchEnabled,
  backgroundColor,
  loadingOptions,
  headerHeight,
}) => {
  const BG_COLOR = hasGradient
    ? [styles.$gradientColorFrom, styles.$gradientColorTo]
    : [backgroundColor, backgroundColor];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback
        onPress={onPress}
        disabled={!touchEnabled}
        style={styles.container}
      >
        <LinearGradient
          style={[styles.gradientView, { paddingTop: headerHeight }]}
          colors={BG_COLOR}
          start={[0, 0]}
          end={[1, 1]}
        >
          {loadingOptions && loadingOptions.loading && (
            <LoadingView hideSpinner={loadingOptions.hideSpinner} />
          )}
          {children}
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

ContainerView.defaultProps = {
  children: null,
  onPress: () => null,
  hasGradient: false,
  touchEnabled: true,
  backgroundColor: '#DDDDDD',
  loadingOptions: null,
  headerHeight: 0,
};

ContainerView.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
  onPress: PropTypes.func,
  hasGradient: PropTypes.bool,
  touchEnabled: PropTypes.bool,
  backgroundColor: PropTypes.string,
  loadingOptions: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    hideSpinner: PropTypes.bool,
  }),
  headerHeight: PropTypes.number,
};

export default ContainerView;
