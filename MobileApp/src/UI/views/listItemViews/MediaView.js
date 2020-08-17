import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

import {
  CustomText as Text,
  TITLE_FONT,
  BODY_FONT,
} from '../../text/CustomText';
import {
  imagePropType,
  libraryImagePropType,
  photoPropType,
} from '../../../config/propTypes';

import { mediaViewStyles as styles } from './styles';

// DISPLAYS THE POST'S IMAGES OR VIDEO
// FOR EACH ITEM INSIDE THE EXPLORE SCREEN
// Takes the following props:
// media (contains all media display information)
// caption (contains the caption content)

// NOTE: media can be either array of objects (for single or multiple images)
// or a single object (for video);

const MediaView = ({ media, caption, itemInView, enableAutoPlay }) => {
  let remoteVideoUri;
  let localVideoUri;

  const videoRef = useRef();

  // CHECK IF URL TO DISPLAY IS LOCAL FOLDER VIDEO
  if (
    media.uri ||
    (media[0] && media[0].file && media[0].file.mediaType === 'video')
  ) {
    localVideoUri = media.uri || media[0].file.uri;
  }

  // CHECK IF URL TO DISPLAY REMOTE RESOURCE VIDEO
  if (media[0] && media[0].image && media[0].resourceType === 'video') {
    const isMovVideo = media[0].image.includes('mov');

    // CHANGE URL END TO 'MP4' AS 'MOV' FORMAT IS NOT SUPPORTED
    if (isMovVideo) {
      remoteVideoUri = `${media[0].image.slice(
        0,
        media[0].image.length - 3
      )}mp4`;
    }
    remoteVideoUri = media[0].image;
  }

  const images = media && media.length > 0 ? media : [];

  const getImageWidth = (index) => {
    if (images.length === 1) {
      return styles.$singleLargeImageWidth;
    }

    if (images.length === 2) {
      return styles.$doubleImageWidth;
    }

    if (index === 0) {
      return styles.$multipleLargeImageWidth;
    }

    return styles.$smallImageWidth;
  };

  const getImageHeight = (index) => {
    if (images.length === 1) {
      return styles.$singleLargeImageHeight;
    }

    if (images.length === 2) {
      return styles.$doubleImageHeight;
    }

    if (index === 0) {
      return styles.$multipleLargeImageHeight;
    }

    return styles.$smallImageHeight;
  };

  const getSource = (item) => {
    if (item.uri) {
      return { uri: item.uri };
    }

    if (item.file && item.file.uri) {
      return { uri: item.file.uri };
    }

    return { uri: item.image };
  };

  const renderImage = (item, index) => (
    <View key={index.toString()}>
      <Image
        source={getSource(item)}
        style={[
          styles.image,
          {
            width: getImageWidth(index),
            height: getImageHeight(index),
          },
        ]}
      />
      {images.length > 3 && index === 2 && (
        <View style={styles.photoNumberView}>
          <Text
            text={`+${images.length - 3}`}
            fontFamily={TITLE_FONT}
            style={styles.photoNumber}
          />
        </View>
      )}
    </View>
  );

  useEffect(() => {
    if (!remoteVideoUri) return;

    if (itemInView) {
      videoRef.current.playAsync();
    } else {
      videoRef.current.pauseAsync();
    }
  }, [itemInView]);

  return (
    <View style={styles.container}>
      {remoteVideoUri || localVideoUri ? (
        <Video
          ref={videoRef}
          source={{ uri: remoteVideoUri || localVideoUri }}
          rate={1.0}
          volume={1.0}
          resizeMode="cover"
          isMuted
          isLooping
          style={styles.video}
          useNativeControls
          shouldPlay={enableAutoPlay}
        />
      ) : (
        images.map((item, index) => {
          if (index < 3) {
            return renderImage(item, index);
          }

          return null;
        })
      )}
      {!(remoteVideoUri || localVideoUri) && caption !== '' && (
        <LinearGradient
          pointerEvents="none"
          style={styles.captionGradientView}
          colors={['black', 'transparent']}
          start={[0, 1]}
          end={[0, 0]}
        >
          <Text
            text={caption}
            fontFamily={BODY_FONT}
            style={styles.caption}
            numberOfLines={1}
          />
        </LinearGradient>
      )}
    </View>
  );
};

MediaView.defaultProps = {
  media: null,
  caption: '',
  enableAutoPlay: false,
};

MediaView.propTypes = {
  media: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        imagePropType,
        photoPropType,
        libraryImagePropType,
        PropTypes.shape({
          image: PropTypes.string,
        }),
      ])
    ),
    PropTypes.shape({
      uri: PropTypes.string.isRequired,
    }),
  ]),
  caption: PropTypes.string,
  enableAutoPlay: PropTypes.bool,
};

export default MediaView;
