import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

import EmptyListText from '../../UI/text/EmptyListText';
import PeopleListItem from '../../UI/lists/PeopleListItem';

import { followUserPress } from '../../actions/profile';

import styles from './styles';

const Following = ({ navigation, currentUser }) => {
  const dispatch = useDispatch();

  const handleProfilePress = (user) => {
    navigation.navigate('Profile', {
      user,
    });
  };

  const handleFollowPress = (user) => {
    dispatch(followUserPress(user));
  };

  const renderEmptyListText = () => (
    <EmptyListText text="This screen shows a list of all users followed by you. You are currently not following any users." />
  );

  useEffect(() => {}, [currentUser]);

  if (!currentUser) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{ paddingBottom: useSafeArea().bottom }}
        data={currentUser.following}
        renderItem={({ item }) => (
          <PeopleListItem
            disableSwipe
            item={item}
            onProfilePress={() => handleProfilePress(item)}
            onFollowPress={() => handleFollowPress(item)}
          />
        )}
        ListEmptyComponent={renderEmptyListText()}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

Following.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { user } = state.user;

  return {
    currentUser: user,
  };
};

export default connect(mapStateToProps)(Following);
