import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

import ListItemContainerView from '../views/listItemViews/ListItemContainerView';
import { CustomText as Text, TITLE_FONT, BODY_FONT } from '../text/CustomText';
import IconButton from '../buttons/IconButton';

import { settingsListItemStyles as styles } from './styles';

const arrowRightIcon = require('../../../assets/icons/arrowRight.png');

const SettingsListItem = ({ item, onPress, bottomMargin }) => (
  <ListItemContainerView
    onPress={onPress}
    height={styles.$containerHeight}
    marginTop={0}
    marginBottom={bottomMargin ? 10 : 0}
    disabled={item.navigateTo === null}
    row
  >
    <Image source={item.icon} style={styles.icon} />
    <Text text={item.title} fontFamily={BODY_FONT} style={styles.title} />
    {item.isSocial ? (
      <Text
        text={item.isLinked ? 'YES' : 'NO'}
        fontFamily={TITLE_FONT}
        style={[styles.linked, { opacity: item.isLinked ? 1 : 0.2 }]}
      />
    ) : (
      <IconButton icon={arrowRightIcon} onPress={onPress} />
    )}
  </ListItemContainerView>
);

SettingsListItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.number.isRequired,
    navigateTo: PropTypes.string,
    isLinked: PropTypes.bool,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

export default SettingsListItem;
