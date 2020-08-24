import React from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';

import { CustomText as Text, TITLE_FONT } from '../../text/CustomText';
import ProfileImageView from '../ProfileImageView';
import IconButton from '../../buttons/IconButton';

import { getTimeHelper } from '../../../helpers/dateTimeHelper';

import { headerViewStyles as styles } from './styles';

// DISPLAYS HEADER SECTION IN A NUMBER OF LISTITEM VIEWS
// Takes the following props:
// profileImage (to display the profile image)
// name (to display the name and/or name initials)
// number (to display the photo count number)
// time (in seconds to calculate the time of creation)
// onProfilePress (to navigate to the Profile screen)
// enableOptions (display the post options button)
// onOptionsPress (handle the post options onPress)
// onPressDisabled (to disable navigation to the Profile screen)
// isSharedItem (controls styling of shared items)

const timeIcon = require('../../../../assets/icons/time.png');
const moreIcon = require('../../../../assets/icons/more.png');

const HeaderView = ({
  profileImage,
  name,
  showName,
  number,
  dateTime,
  onProfilePress,
  onPressDisabled,
  isSharedItem,
  enableOptions,
  onOptionsPress,
}) => (
  <View style={styles.container}>
    <ProfileImageView
      profileImage={profileImage}
      name={name}
      number={number}
      onPress={onProfilePress}
      onPressDisabled={onPressDisabled}
    />
    <View
      style={[
        styles.titleView,
        isSharedItem && { width: styles.$sharedItemViewWidth },
      ]}
    >
      <View>
        {showName && (
          <Text text={name} fontFamily={TITLE_FONT} style={styles.name} />
        )}
        {dateTime && (
          <View style={styles.timeView}>
            <Image source={timeIcon} style={styles.timeIcon} />
            <Text
              text={getTimeHelper(dateTime)}
              fontFamily={TITLE_FONT}
              style={styles.time}
            />
          </View>
        )}
      </View>

      {enableOptions && !isSharedItem && (
        <IconButton icon={moreIcon} size={18} onPress={onOptionsPress} />
      )}
    </View>
  </View>
);

HeaderView.defaultProps = {
  profileImage: null,
  showName: true,
  name: '',
  number: '',
  dateTime: null,
  onProfilePress: null,
  onOptionsPress: null,
  onPressDisabled: false,
  isSharedItem: false,
  enableOptions: false,
};

HeaderView.propTypes = {
  profileImage: PropTypes.node,
  name: PropTypes.string,
  dateTime: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showName: PropTypes.bool,
  number: PropTypes.string,
  onProfilePress: PropTypes.func,
  enableOptions: PropTypes.bool,
  onOptionsPress: PropTypes.func,
  onPressDisabled: PropTypes.bool,
  isSharedItem: PropTypes.bool,
};

export default HeaderView;
