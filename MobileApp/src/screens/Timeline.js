import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, SectionList } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import ContainerView from '../UI/views/ContainerView';
import TimelineListItem from '../UI/lists/TimelineListItem';
import { CustomText as Text, TITLE_FONT } from '../UI/text/CustomText';
import EmptyListText from '../UI/text/EmptyListText';

import { getTimelineFeed } from '../actions/timeline';

import styles from './styles';
import { userPropType } from '../config/propTypes';

const Timeline = ({
  route,
  navigation,
  timelineFeed,
  currentUser,
  fetching,
}) => {
  const dispatch = useDispatch();

  const [getFeed, setGetFeed] = useState(false);

  const handleProfilePress = (item) => {
    navigation.navigate('Profile', {
      user: item.user_action,
    });
  };

  const renderEmptyListText = () => (
    <EmptyListText text="Once people start interacting with your posts, an overview of their actions will appear on this screen" />
  );

  useEffect(() => {
    if (!getFeed) {
      dispatch(getTimelineFeed());
      setGetFeed(true);
    }
  }, [timelineFeed]);

  if (!currentUser) {
    return <View />;
  }

  return (
    <ContainerView
      touchEnabled={false}
      headerHeight={route.params.headerHeight}
      loadingOptions={{ loading: fetching }}
    >
      <SectionList
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: useSafeArea().bottom },
        ]}
        sections={timelineFeed || []}
        renderItem={({ item }) => (
          <TimelineListItem
            item={item}
            onProfilePress={() => handleProfilePress(item)}
            currentUser={currentUser}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionTitleView}>
            <Text
              text={title}
              fontFamily={TITLE_FONT}
              style={styles.sectionTitle}
            />
          </View>
        )}
        ListEmptyComponent={renderEmptyListText()}
        keyExtractor={(item) => item._id}
      />
    </ContainerView>
  );
};

Timeline.defaultProps = {
  currentUser: null,
};

Timeline.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.instanceOf(Object),
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  timelineFeed: PropTypes.arrayOf(PropTypes.any).isRequired,
  currentUser: userPropType,
  fetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const { timelineFeed, fetching } = state.timeline;
  const { user } = state.user;

  return {
    timelineFeed,
    currentUser: user,
    fetching,
  };
};
export default connect(mapStateToProps)(Timeline);
