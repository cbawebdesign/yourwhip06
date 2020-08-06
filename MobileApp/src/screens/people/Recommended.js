import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

import EmptyListText from '../../UI/text/EmptyListText';
import PeopleListItem from '../../UI/lists/PeopleListItem';

import { followUserPress } from '../../actions/profile';
import { removeUserPress } from '../../actions/user';

import styles from './styles';

const Recommended = ({ navigation, recommendedFeed, currentUser }) => {
  const dispatch = useDispatch();

  const handleProfilePress = (user) => {
    navigation.navigate('Profile', {
      user,
    });
  };

  const handleRemovePress = (user) => {
    dispatch(removeUserPress(user));
  };

  const handleFollowPress = (user) => {
    dispatch(followUserPress(user));
  };

  const renderEmptyListText = () => (
    <EmptyListText text="Users are recommended to you based on your interests. Currently, there are no users recommended users that match your interests." />
  );

  useEffect(() => {}, [recommendedFeed, currentUser]);

  if (!currentUser) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: useSafeArea().bottom },
        ]}
        data={recommendedFeed}
        renderItem={({ item }) => (
          <PeopleListItem
            item={item}
            following={currentUser.following.some(
              (user) => user._id.toString() === item._id.toString()
            )}
            onProfilePress={() => handleProfilePress(item)}
            onDeletePress={() => handleRemovePress(item)}
            onFollowPress={() => handleFollowPress(item)}
          />
        )}
        ListEmptyComponent={renderEmptyListText()}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

Recommended.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { recommendedFeed, user } = state.user;

  return {
    recommendedFeed,
    currentUser: user,
  };
};

export default connect(mapStateToProps)(Recommended);
