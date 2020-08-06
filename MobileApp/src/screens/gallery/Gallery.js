import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { FlatList } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

import ContainerView from '../../UI/views/ContainerView';
import GalleryListItem from '../../UI/lists/GalleryListItem';
import EmptyListText from '../../UI/text/EmptyListText';

import { getGalleryFeed } from '../../actions/galleries';
import { galleryItemPropType } from '../../config/propTypes';

import styles from '../styles';

const Gallery = ({ route, navigation, galleryFeed, fetching }) => {
  const dispatch = useDispatch();

  const paddingBottom = useSafeArea().bottom;

  const [getFeed, setGetFeed] = useState(false);
  const [feed, setFeed] = useState(null);

  const handlePress = (item) => {
    navigation.navigate('GalleryDetail', {
      items: item.images,
      name: item.name,
    });
  };

  const renderEmptyListText = () => (
    <EmptyListText text="Create new galleries, or select from existing galeries, by composing new posts. An overview of your galeries will appear on this screen" />
  );

  useEffect(() => {
    if (!getFeed) {
      dispatch(getGalleryFeed());
      setGetFeed(true);
    } else if (galleryFeed && !feed) {
      setFeed(galleryFeed);
    }
  }, [galleryFeed]);

  if (!feed) {
    return (
      <ContainerView
        touchEnabled={false}
        headerHeight={route.params.headerHeight}
        loadingOptions={{ loading: fetching }}
      />
    );
  }

  return (
    <ContainerView
      touchEnabled={false}
      headerHeight={route.params.headerHeight}
      loadingOptions={{ loading: fetching }}
    >
      <FlatList
        contentContainerStyle={[styles.contentContainer, { paddingBottom }]}
        data={feed}
        renderItem={({ item }) => (
          <GalleryListItem item={item} onPress={() => handlePress(item)} />
        )}
        ListEmptyComponent={renderEmptyListText()}
        keyExtractor={(item) => item._id}
      />
    </ContainerView>
  );
};

Gallery.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.instanceOf(Object),
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  galleryFeed: PropTypes.arrayOf(galleryItemPropType).isRequired,
  fetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const { galleryFeed, fetching } = state.galleries;
  const { user } = state.user;

  return {
    galleryFeed,
    currentUser: user,
    fetching,
  };
};

export default connect(mapStateToProps)(Gallery);
