import React, { useState, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { View, Keyboard } from 'react-native';
import { useDispatch, connect } from 'react-redux';
import { AnimatedFlatList, AnimationType } from 'flatlist-intro-animations';

import ContainerView from '../UI/views/ContainerView';
import SelectionModal from '../UI/modals/SelectionModal';
import CommentListItem from '../UI/lists/CommentListItem';
import FooterView from '../UI/views/footer/FooterView';
import CommentComposeView from '../UI/views/CommentComposeView';
import EmptyListText from '../UI/text/EmptyListText';

import {
  onLikePressHelper,
  onNewCommentHelper,
  onDeleteHelper,
} from '../helpers/socialHelpers';
import { useKeyboardState } from '../config/hooks';

import {
  getCommentFeed,
  likeCommentPress,
  composeNewComment,
  deleteComment,
} from '../actions/comments';

import styles from './styles';

// DISPLAYS THE COMMENTS SCREEN
// Applies the following props:
// route (contains params with all comments items)
// navigation (to navigate to the Profile screen on pressing
// the profile image)
// commentFeed (contains a list with all comments)
// updateReplyCheck (contains reply sceen update data)
// currentUser (contains app user data)
// fetching (boolean check for displaying loading view)

const Comments = ({
  route,
  navigation,
  commentFeed,
  updateReplyCheck,
  currentUser,
  fetching,
}) => {
  const dispatch = useDispatch();
  const { keyboardShowing } = useKeyboardState();

  const parentId = route.params.post
    ? route.params.post._id
    : route.params.image._id;

  const [feed, setFeed] = useState([]);
  const [comment, setComment] = useState('');
  const [showCommentOptions, setShowCommentOptions] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const commentOptions = {
    title: 'Delete comment',
    body: 'Are you sure you want to delete this comment?',
    buttonStyle: 'horizontal',
    buttons: [
      {
        title: 'Cancel',
        onPress: () => setShowCommentOptions(false),
      },
      {
        title: 'Delete',
        onPress: () => {
          const updatedFeed = onDeleteHelper(feed, currentItem);

          setFeed(updatedFeed);
          setShowCommentOptions(false);
        },
      },
    ],
  };

  const handleRemoveKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleProfilePress = ({ createdBy }) => {
    navigation.navigate('Profile', {
      ...route.params,
      user: createdBy,
    });
  };

  const handleComposePress = () => {
    if (comment.length === 0) {
      return;
    }

    dispatch(
      composeNewComment({
        type: route.params.type,
        fromScreen: route.params.fromScreen,
        parentId,
        description: comment,
        photo: null,
      })
    );

    setComment('');
    handleRemoveKeyboard();
  };

  const handleLikePress = (item) => {
    dispatch(likeCommentPress({ parentId, commentId: item._id }));

    const updatedFeed = onLikePressHelper(currentUser._id, feed, item);
    setFeed(updatedFeed);
  };

  const handleReplyPress = (item) => {
    navigation.navigate('Replies', {
      comment: item,
      post: route.params.post,
    });
  };

  const handleCommentOptionsPress = (item) => {
    setCurrentItem(item);
    setShowCommentOptions(true);
  };

  const handleDeleteComment = () => {
    dispatch(
      deleteComment({
        fromScreen: route.params.fromScreen,
        commentId: currentItem._id,
        postId: parentId,
        type: route.params.type,
      })
    );

    // REMOVE COMMENT FROM LOCAL FEED STATE
    const feedCopy = [...feed];
    const updatedFeed = feedCopy.filter((item) => item._id !== currentItem._id);
    setFeed(updatedFeed);

    setShowCommentOptions(false);
  };

  const updateReplyButtonView = () => {
    // UPDATE REPLY COUNT ON RETURN FROM 'REPLIES'
    const updatedFeed = onNewCommentHelper(
      currentUser._id,
      commentFeed,
      updateReplyCheck,
      true
    );

    dispatch({ type: 'RESET_UPDATE_REPLY_CHECK' });
    setFeed(updatedFeed);
  };

  const handleRefresh = () => {
    dispatch(
      getCommentFeed({
        parentId,
        feedType: route.params.type,
      })
    );
  };

  const renderEmptyListText = () => (
    <EmptyListText text="Be the first to leave a comment" />
  );

  useLayoutEffect(() => {
    // UPDATE HEADERTITLE (ALL HEADER TITLES ARE SET INSIDE ROUTES.JS)
    navigation.setParams({
      ...route.params,
      title: `${commentFeed.length} ${
        commentFeed.length === 1 ? 'COMMENT' : 'COMMENTS'
      }`,
    });
  }, [commentFeed]);

  useEffect(() => {
    dispatch(
      getCommentFeed({
        parentId,
        feedType: route.params.type,
      })
    );

    return () => dispatch({ type: 'RESET_COMMENT_FEED' });
  }, []);

  useEffect(() => {
    setFeed(commentFeed);

    // DO UPDATE CHECK AFTER RETURNING FROM COMMENT SCREEN
    if (updateReplyCheck !== null) {
      updateReplyButtonView();
    }
  }, [commentFeed, updateReplyCheck]);

  if (!currentUser) {
    return <View />;
  }

  return (
    <ContainerView
      onPress={handleRemoveKeyboard}
      headerHeight={route.params.headerHeight}
    >
      <SelectionModal
        showModal={showCommentOptions}
        onModalDismissPress={() => setShowCommentOptions(false)}
        options={commentOptions}
      />
      <AnimatedFlatList
        contentContainerStyle={styles.contentContainer}
        data={feed}
        animationType={
          currentUser.settings.enableIntroAnimations
            ? AnimationType.Dive
            : AnimationType.None
        }
        renderItem={({ item }) => (
          <CommentListItem
            item={item}
            currentUser={currentUser}
            onLikePress={() => handleLikePress(item)}
            onReplyPress={() => handleReplyPress(item)}
            onProfilePress={() => handleProfilePress(item)}
            enableOptions={item.createdBy._id === currentUser._id}
            onOptionsPress={() => handleCommentOptionsPress(item)}
            onDeletePress={() => handleDeleteComment()}
          />
        )}
        ListEmptyComponent={renderEmptyListText()}
        onRefresh={handleRefresh}
        refreshing={fetching}
        keyExtractor={(item) => item._id}
      />
      <FooterView
        color="transparent"
        hasGradient
        keyboardActive={keyboardShowing}
      >
        <CommentComposeView
          onComposePress={handleComposePress}
          onCommentChange={(text) => setComment(text)}
          commentValue={comment}
        />
      </FooterView>
    </ContainerView>
  );
};

Comments.defaultProps = {
  updateReplyCheck: null,
};

Comments.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.instanceOf(Object),
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  commentFeed: PropTypes.arrayOf(PropTypes.any).isRequired,
  updateReplyCheck: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
  fetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const { commentFeed, fetching } = state.comments;
  const { updateReplyCheck } = state.replies;
  const { user } = state.user;

  return {
    commentFeed,
    updateReplyCheck,
    currentUser: user,
    fetching,
  };
};

export default connect(mapStateToProps)(Comments);
