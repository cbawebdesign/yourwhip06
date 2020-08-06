import { GET_PROFILE, PROFILE_RESULT, PROFILE_ERROR } from '../actions/profile';

const initialState = {
  error: null,
  success: null,
  fetching: false,
  userData: { user: null, profileFeed: [] },
  socialData: {
    likesCount: 0,
    followersCount: 0,
    postsCount: 0,
  },
};

const profileState = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE:
      return {
        ...state,
        fetching: true,
      };
    case 'RESET_PROFILE':
      return {
        ...state,
        userData: { user: null, profileFeed: [] },
      };
    case PROFILE_RESULT:
      return {
        ...state,
        userData: {
          ...state.userData,
          user: action.result.user,
          profileFeed:
            action.result.skip === 0
              ? action.result.feed
              : [...state.userData.profileFeed, ...action.result.feed],
        },
        socialData: {
          ...state.socialData,
          likesCount: action.result.likesCount,
          followersCount: action.result.followersCount,
          postsCount: action.result.postsCount,
        },
        fetching: false,
        error: null,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default profileState;
