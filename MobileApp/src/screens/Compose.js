import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, Keyboard } from 'react-native';
import { connect, useDispatch } from 'react-redux';

import ContainerView from '../UI/views/ContainerView';
import ComposeView from '../UI/views/ComposeView';
import FooterView from '../UI/views/footer/FooterView';
import ComposeControlsView from '../UI/views/footer/ComposeControlsView';
import SelectionModal from '../UI/modals/SelectionModal';
import TextInputModal from '../UI/modals/TextInputModal';

import { getGalleryFeed } from '../actions/galleries';
import { composePost } from '../actions/home';

import styles from './styles';

const arrowRightIcon = require('../../assets/icons/arrowRight.png');

const Compose = ({ route, navigation, galleryFeed }) => {
  const dispatch = useDispatch();

  const [media, setMedia] = useState(null);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showNewGalleryModal, setShowNewGalleryModal] = useState(false);
  const [showExistingGalleryModal, setShowExistingGalleryModal] = useState(
    false
  );
  const [showImageTypeModal, setShowImageTypeModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [description, setDescription] = useState('');
  const [caption, setCaption] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [preventContinue, setPreventContinue] = useState(false);
  const [saveToGalleryType, setSaveToGalleryType] = useState('');
  const [galleryName, setGalleryName] = useState(null);

  const alertOptions = {
    title: 'Please note',
    body: errorMessage,
    buttonStyle: 'horizontal',
    buttons: preventContinue
      ? [
          {
            title: 'Cancel',
            onPress: () => hideModal(),
          },
        ]
      : [
          {
            title: 'Cancel',
            onPress: () => hideModal(),
          },
          {
            title: 'Continue',
            onPress: () => handleComposeAction(),
          },
        ],
  };

  const imageTypeOptions = {
    title: 'Make your selection',
    body: 'Select photos from your album or take a picture',
    buttons: [
      {
        title: 'Select from album',
        icon: arrowRightIcon,
        onPress: () => handleSelectionPress('SELECT_FROM_ALBUM'),
      },
      {
        title: 'Take a picture',
        icon: arrowRightIcon,
        onPress: () => handleSelectionPress('TAKE_PICTURE'),
      },
    ],
  };

  const moreOptions = {
    title: 'Gallery Options',
    body: 'Select how you want to save your media',
    buttons:
      galleryFeed.length === 0
        ? [
            {
              title: 'Save to new gallery',
              icon: arrowRightIcon,
              onPress: () => {
                setShowMoreModal(false);
                setShowNewGalleryModal(true);
                setSaveToGalleryType('NEW_GALLERY');
              },
            },
          ]
        : [
            {
              title: 'Save to new gallery',
              icon: arrowRightIcon,
              onPress: () => {
                setShowMoreModal(false);
                setShowNewGalleryModal(true);
                setSaveToGalleryType('NEW_GALLERY');
              },
            },
            {
              title: 'Save to existing gallery',
              icon: arrowRightIcon,
              onPress: () => {
                setShowMoreModal(false);
                setShowExistingGalleryModal(true);
                setSaveToGalleryType('EXISTING_GALLERY');
              },
            },
          ],
  };

  const existingGalleryOptions = {
    title: 'Select a gallery',
    body: 'Which gallery do wish to upload your media item(s) to?',
    buttons: galleryFeed.map((item) => ({
      title: item.name,
      icon: arrowRightIcon,
      onPress: () => {
        setShowMoreModal(false);
        setShowExistingGalleryModal(false);
        setGalleryName(item.name);
      },
    })),
  };

  const handleCameraPress = () => {
    // EMPTY EXISTING PARAMS BEFORE SETTING NEW ONES
    navigation.setParams({
      ...route.params,
      photo: null,
      selection: null,
      video: null,
    });

    navigation.navigate('Camera', {
      fromScreen: 'Compose',
      type: 'CAMERA',
    });
  };

  const handleSelectionPress = (type) => {
    // EMPTY EXISTING PARAMS BEFORE SETTING NEW ONES
    navigation.setParams({
      ...route.params,
      photo: null,
      selection: null,
      video: null,
    });

    switch (type) {
      case 'SELECT_FROM_ALBUM':
        navigation.navigate('ImagePicker');
        setShowImageTypeModal(false);
        break;
      case 'TAKE_PICTURE':
        navigation.navigate('Camera', {
          fromScreen: 'Compose',
          type: 'PHOTO',
        });
        setShowImageTypeModal(false);
        break;
      default:
        break;
    }
  };

  const handleComposePress = () => {
    if (!media && /^ *$/.test(description)) {
      setErrorMessage(
        'Your post description is empty or contains empty spaces only. Please provide a relevant message.'
      );
      setPreventContinue(true);
      setShowAlertModal(true);
    } else if (!media && caption) {
      setErrorMessage(
        'You provided an caption without uploading any media. Your caption will stay hidden.'
      );
      setShowAlertModal(true);
    } else {
      handleComposeAction();
    }
  };

  const handleComposeAction = () => {
    dispatch(
      composePost({
        description,
        caption,
        media,
        gallery: { type: saveToGalleryType, name: galleryName },
      })
    );
    navigation.goBack();

    setShowAlertModal(false);
    setSaveToGalleryType('');
  };

  const handleGallerySavePress = () => {
    setShowMoreModal(false);
    setShowNewGalleryModal(false);
  };

  const hideModal = () => {
    setPreventContinue(false);
    setShowAlertModal(false);
    setShowImageTypeModal(false);
    setShowMoreModal(false);
    setShowNewGalleryModal(false);
    setShowExistingGalleryModal(false);
    setGalleryName(null);
  };

  useEffect(() => {
    // SET MEDIA STATE BASED ON UPLOADED MEDIA TYPE
    if (route.params) {
      // PREVENT SIMULTANEOUS PHOTO + VIDEO UPLOAD
      // ELSE SET MEDIA STATE
      if (
        route.params.selection &&
        route.params.selection.length > 1 &&
        route.params.selection.some((item) => item.file.mediaType === 'video')
      ) {
        setErrorMessage(
          'When composing a post with video type media, your post can contain no more than one item at a time'
        );
        setMedia(null);
        setPreventContinue(true);
        setShowAlertModal(true);
      } else if (route.params.photo) {
        setMedia({ type: 'photo', images: [{ file: route.params.photo }] });
      } else if (
        route.params.selection &&
        route.params.selection.some((item) => item.localUri.includes('MP4'))
      ) {
        setMedia({ type: 'video', images: route.params.selection });
      } else if (route.params.selection) {
        setMedia({ type: 'photo', images: route.params.selection });
      } else if (route.params.video) {
        setMedia({ type: 'video', video: route.params.video });
      }
    }
  }, [route]);

  useEffect(() => {
    // GET GALLERYFEED TO PREPARE FOR GALLERY SELECTION
    if (showMoreModal && galleryFeed.length === 0) {
      dispatch(getGalleryFeed());
    }
  }, [showMoreModal]);

  return (
    <ContainerView
      hasGradient
      onPress={() => Keyboard.dismiss()}
      headerHeight={route.params.headerHeight}
    >
      <SelectionModal
        showModal={showAlertModal}
        onModalDismissPress={hideModal}
        options={alertOptions}
      />
      <SelectionModal
        showModal={showImageTypeModal}
        onModalDismissPress={hideModal}
        options={imageTypeOptions}
      />
      <SelectionModal
        showModal={showMoreModal}
        onModalDismissPress={hideModal}
        options={moreOptions}
      />
      <SelectionModal
        showModal={showExistingGalleryModal}
        onModalDismissPress={hideModal}
        options={existingGalleryOptions}
      />
      <TextInputModal
        showModal={!showMoreModal && showNewGalleryModal}
        onSavePress={handleGallerySavePress}
        onCancelPress={hideModal}
        onModalDismissPress={hideModal}
        onChangeText={(text) => setGalleryName(text)}
        title="Create new gallery"
        body="Give your gallery a name and press 'Save'"
        placeholder="Give your gallery a name..."
        inputValue={galleryName}
      />
      <ComposeView
        media={media}
        onDescriptionChange={(text) => setDescription(text)}
        onCaptionChange={(text) => setCaption(text)}
        descriptionValue={description}
        captionValue={caption}
        galleryName={galleryName}
      />
      <View style={styles.emptyView} />
      <FooterView backgroundColor="white">
        <ComposeControlsView
          onPhotoPress={() => setShowImageTypeModal(true)}
          onCameraPress={handleCameraPress}
          onComposePress={handleComposePress}
          onMorePress={() => setShowMoreModal(true)}
        />
      </FooterView>
    </ContainerView>
  );
};

Compose.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.instanceOf(Object),
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { galleryFeed } = state.galleries;

  return {
    galleryFeed,
  };
};

export default connect(mapStateToProps)(Compose);
