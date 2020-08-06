import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { CustomText as Text, BODY_FONT } from '../text/CustomText';

import styles from './styles';

const EmptyListText = ({ text }) => (
  <View style={styles.container}>
    <Text text={text} fontFamily={BODY_FONT} style={styles.text} />
  </View>
);

// BlockButton.defaultProps = {
//   fontSize: 10,
//   color: '#020202',
// };

// BlockButton.propTypes = {
//   onPress: PropTypes.func.isRequired,
//   text: PropTypes.string.isRequired,
//   fontSize: PropTypes.number,
//   color: PropTypes.string,
// };

export default EmptyListText;
