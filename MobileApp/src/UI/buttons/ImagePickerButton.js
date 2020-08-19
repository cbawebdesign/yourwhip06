import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity } from 'react-native';

import { CustomText as Text, TITLE_FONT } from '../text/CustomText';

import { imagePickerButtonStyles as styles } from './styles';

const ImagePickerButton = ({
  onPress,
  uri,
  selected,
  mediaType,
  videoDuration,
}) => {
  const getDuration = () => {
    const minutes = Math.floor(videoDuration / 60);
    const seconds = Math.ceil(videoDuration - minutes * 60);

    return `${minutes}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri }}
        style={[
          styles.imagePickerImage,
          {
            opacity: selected ? 0.3 : 1,
          },
        ]}
      />
      {mediaType === 'video' && (
        <Text
          text={`${getDuration()}`}
          fontFamily={TITLE_FONT}
          style={styles.videoDuration}
        />
      )}
    </TouchableOpacity>
  );
};

ImagePickerButton.defaultProps = {
  videoDuration: null,
};

ImagePickerButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  uri: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  mediaType: PropTypes.string.isRequired,
  videoDuration: PropTypes.number,
};

export default ImagePickerButton;
