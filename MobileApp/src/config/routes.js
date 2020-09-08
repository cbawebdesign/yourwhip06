import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, useHeaderHeight } from '@react-navigation/stack';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as SecureStore from 'expo-secure-store';

import { CustomText as Text, TITLE_FONT } from '../UI/text/CustomText';

import Login from '../screens/auth/Login';
import SignupStep1 from '../screens/auth/SignupStep1';
import SignupStep2 from '../screens/auth/SignupStep2';
import Help from '../screens/auth/Help';
import Code from '../screens/auth/Code';
import Password from '../screens/auth/Password';

import WalkthroughStep1 from '../screens/walkthrough/WalkthroughStep1';
import WalkthroughStep2 from '../screens/walkthrough/WalkthroughStep2';

import Explore from '../screens/explore/Explore';
import Gallery from '../screens/gallery/Gallery';
import GalleryDetail from '../screens/gallery/GalleryDetail';
import Profile from '../screens/Profile';
import People from '../screens/people/People';
import Timeline from '../screens/Timeline';
import Settings from '../screens/Settings';
import Stats from '../screens/stats/Stats';
import ExploreDetail from '../screens/explore/ExploreDetail';
import Replies from '../screens/Replies';

import Search from '../screens/Search';
import Navigation from '../screens/Navigation';
import Compose from '../screens/Compose';
import Comments from '../screens/Comments';
import Camera from '../screens/Camera';
import ImagePicker from '../screens/imagePicker/ImagePicker';
import ImagePickerDetail from '../screens/imagePicker/ImagePickerDetail';

import {
  getHeaderTitleHelper,
  getHeaderRightHelper,
  getHeaderLeftHelper,
} from '../helpers/routeHelpers';

import { storeToken, routeChecksComplete } from '../actions/auth';
import { getUserInfo, setWalkthroughComplete } from '../actions/user';

import { userPropType } from './propTypes';
import {
  LOGIN,
  SIGNUP_STEP_1,
  SIGNUP_STEP_2,
  HELP,
  CODE,
  PASSWORD,
  CAMERA,
  WALKTHROUGH,
  DISCOVER,
  MEDIA_ALBUMS,
  MEDIA,
  EXPLORE,
  GALLERY,
  GALLERY_DETAIL,
  PROFILE,
  PEOPLE,
  TIMELINE,
  SETTINGS,
  STATS,
  EXPLORE_DETAIL,
  COMPOSE,
  NAVIGATION,
  COMMENTS,
  SEARCH,
  REPLIES,
} from './constants';

// APP APPLIES 5 SEPERATE NAVIGATION STACKS
// 1) AuthNavigationStack (controls authentication screens)
// 2) WalkthroughNavigationStack (controls Walkthrough screens)
// 3) MainNavigationStack (controls all main app screens)
// 4) AppNavigationStack (controls display of and navigation between
// above three Navigation Stacks)
// 5) RootNavigationStack (controls navigation to PopUp Screens)

const AuthNavigationStack = createStackNavigator();
const WalkthroughNavigationStack = createStackNavigator();
const MainNavigationStack = createStackNavigator();
const ImagePickerStack = createStackNavigator();
const PopupNavigationStack = createStackNavigator();
const RootNavigationStack = createStackNavigator();

const styles = EStyleSheet.create({
  $tintColor: '$black',
  $background: '$backgroundGray',

  header: {
    fontSize: 14,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 12,
    textAlign: 'center',
  },
  headerRightView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const AuthStackScreen = () => {
  const headerHeight = useHeaderHeight();

  return (
    <AuthNavigationStack.Navigator>
      <AuthNavigationStack.Screen
        name={LOGIN}
        component={Login}
        initialParams={{ headerHeight }}
      />
      <AuthNavigationStack.Screen
        name={SIGNUP_STEP_1}
        component={SignupStep1}
        initialParams={{ headerHeight }}
      />
      <AuthNavigationStack.Screen
        name={SIGNUP_STEP_2}
        component={SignupStep2}
        initialParams={{ headerHeight }}
      />
      <AuthNavigationStack.Screen
        name={HELP}
        component={Help}
        initialParams={{ headerHeight }}
      />
      <AuthNavigationStack.Screen
        name={CODE}
        component={Code}
        initialParams={{ headerHeight }}
      />
      <AuthNavigationStack.Screen
        name={PASSWORD}
        component={Password}
        initialParams={{ headerHeight }}
      />
      <AuthNavigationStack.Screen name={CAMERA} component={Camera} />
    </AuthNavigationStack.Navigator>
  );
};

const WalkthroughStackScreen = () => {
  const headerHeight = useHeaderHeight();

  return (
    <WalkthroughNavigationStack.Navigator>
      <WalkthroughNavigationStack.Screen
        name={WALKTHROUGH}
        component={WalkthroughStep1}
        initialParams={{ headerHeight }}
      />
      <WalkthroughNavigationStack.Screen
        name={DISCOVER}
        component={WalkthroughStep2}
        initialParams={{ headerHeight }}
      />
    </WalkthroughNavigationStack.Navigator>
  );
};

const ImagePickerStackStackScreen = ({ route }) => {
  const { headerHeight } = route.params;

  return (
    <ImagePickerStack.Navigator>
      <ImagePickerStack.Screen
        name={MEDIA_ALBUMS}
        component={ImagePicker}
        initialParams={{ headerHeight }}
      />
      <ImagePickerStack.Screen
        name={MEDIA}
        component={ImagePickerDetail}
        initialParams={{ headerHeight }}
      />
    </ImagePickerStack.Navigator>
  );
};

const MainStackScreen = ({ route }) => {
  const { headerHeight } = route.params;

  return (
    <MainNavigationStack.Navigator>
      <MainNavigationStack.Screen
        name={EXPLORE}
        component={Explore}
        initialParams={{ headerHeight }}
      />
      <MainNavigationStack.Screen
        name={GALLERY}
        component={Gallery}
        initialParams={{ headerHeight }}
      />
      <MainNavigationStack.Screen
        name={GALLERY_DETAIL}
        component={GalleryDetail}
        initialParams={{ headerHeight }}
      />
      <MainNavigationStack.Screen
        name={PROFILE}
        component={Profile}
        initialParams={{ headerHeight }}
      />
      <MainNavigationStack.Screen
        name={PEOPLE}
        component={People}
        initialParams={{ headerHeight }}
      />
      <MainNavigationStack.Screen
        name={TIMELINE}
        component={Timeline}
        initialParams={{ headerHeight }}
      />
      <MainNavigationStack.Screen
        name={SETTINGS}
        component={Settings}
        initialParams={{ headerHeight }}
      />
      <MainNavigationStack.Screen
        name={STATS}
        component={Stats}
        initialParams={{ headerHeight }}
      />
      <MainNavigationStack.Screen
        name={EXPLORE_DETAIL}
        component={ExploreDetail}
        initialParams={{ headerHeight }}
      />
      <AuthNavigationStack.Screen
        name={PASSWORD}
        component={Password}
        initialParams={{ headerHeight }}
      />
      <MainNavigationStack.Screen
        name={SIGNUP_STEP_2}
        component={SignupStep2}
        initialParams={{ headerHeight }}
      />
    </MainNavigationStack.Navigator>
  );
};

const PopupStackScreen = () => {
  const headerHeight = useHeaderHeight();

  return (
    <PopupNavigationStack.Navigator mode="modal">
      <PopupNavigationStack.Screen
        name="Main"
        component={MainStackScreen}
        initialParams={{ headerHeight }}
      />
      <PopupNavigationStack.Screen
        name={COMPOSE}
        component={Compose}
        initialParams={{ headerHeight }}
      />
      <PopupNavigationStack.Screen
        name={NAVIGATION}
        component={Navigation}
        initialParams={{ headerHeight }}
      />
      <PopupNavigationStack.Screen
        name={COMMENTS}
        component={Comments}
        initialParams={{ headerHeight }}
      />
      <PopupNavigationStack.Screen
        name={CAMERA}
        component={Camera}
        initialParams={{ headerHeight }}
      />
      <PopupNavigationStack.Screen
        name={SEARCH}
        component={Search}
        options={{
          headerLeft: () => null,
        }}
        initialParams={{ headerHeight }}
      />
      <PopupNavigationStack.Screen
        name="ImagePicker"
        component={ImagePickerStackStackScreen}
        initialParams={{ headerHeight }}
      />
      <PopupNavigationStack.Screen
        name={REPLIES}
        component={Replies}
        initialParams={{ headerHeight }}
      />
    </PopupNavigationStack.Navigator>
  );
};

const RootStackScreen = ({ authToken, walkthroughComplete, currentUser }) => {
  const dispatch = useDispatch();

  const getToken = async () => {
    const tokenString = await SecureStore.getItemAsync('token');
    const isWalkthroughComplete = await SecureStore.getItemAsync(
      'walkthroughComplete'
    );

    // FOR DEV PURPOSES ONLY
    // const tokenString = await SecureStore.deleteItemAsync('token');
    // await SecureStore.deleteItemAsync('walkthroughComplete');
    // END FOR DEV PURPOSES ONLY

    if (tokenString) {
      dispatch(storeToken(tokenString));
    }
    if (isWalkthroughComplete) {
      dispatch(setWalkthroughComplete());
    }

    // DISABLE LOADER
    dispatch(routeChecksComplete());
  };

  useEffect(() => {
    if (authToken === null) {
      getToken();
    } else {
      dispatch(getUserInfo(authToken));
    }
  }, [authToken]);

  return (
    <RootNavigationStack.Navigator>
      {!authToken && (
        <RootNavigationStack.Screen
          name="Auth"
          component={AuthStackScreen}
          options={({ route, navigation }) => ({
            headerTransparent: true,
            headerLeft: () => getHeaderLeftHelper(route, navigation),
            headerTitle: () => {
              if (getHeaderTitleHelper(route, navigation).view) {
                return getHeaderTitleHelper(route, navigation).view;
              }

              return (
                <Text
                  text={getHeaderTitleHelper(route, navigation).text}
                  fontFamily={TITLE_FONT}
                  style={styles.header}
                />
              );
            },
          })}
        />
      )}
      {!walkthroughComplete && (
        <RootNavigationStack.Screen
          name="Walkthrough"
          component={WalkthroughStackScreen}
          options={({ route, navigation }) => ({
            headerTransparent: true,
            headerLeft: () => getHeaderLeftHelper(route, navigation),
            headerTitle: () => (
              <Text
                text={getHeaderTitleHelper(route, navigation).text}
                fontFamily={TITLE_FONT}
                style={styles.header}
              />
            ),
          })}
        />
      )}
      {authToken && walkthroughComplete && (
        <RootNavigationStack.Screen
          name="Popup"
          component={PopupStackScreen}
          options={({ route, navigation }) => ({
            headerTransparent: true,
            headerLeft: () => getHeaderLeftHelper(route, navigation),
            headerRight: () =>
              getHeaderRightHelper(route, navigation, currentUser),
            headerTitle: () => {
              if (!getHeaderTitleHelper(route, navigation)) {
                return null;
              }
              if (getHeaderTitleHelper(route, navigation).view) {
                return getHeaderTitleHelper(route, navigation).view;
              }

              return (
                <Text
                  text={getHeaderTitleHelper(route, navigation).text}
                  fontFamily={TITLE_FONT}
                  style={styles.header}
                />
              );
            },
          })}
        />
      )}
    </RootNavigationStack.Navigator>
  );
};

const NavigationContainerStack = ({
  authToken,
  walkthroughComplete,
  currentUser,
}) => {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: styles.$background,
    },
  };

  return (
    <NavigationContainer theme={theme}>
      <RootStackScreen
        authToken={authToken}
        walkthroughComplete={walkthroughComplete}
        currentUser={currentUser}
      />
    </NavigationContainer>
  );
};

NavigationContainerStack.defaultProps = {
  authToken: null,
  currentUser: null,
};

NavigationContainerStack.propTypes = {
  authToken: PropTypes.string,
  walkthroughComplete: PropTypes.bool.isRequired,
  currentUser: userPropType,
};

const mapStateToProps = (state) => {
  const { authToken } = state.auth;
  const { walkthroughComplete, user } = state.user;

  return {
    authToken,
    walkthroughComplete,
    currentUser: user,
  };
};

export default connect(mapStateToProps)(NavigationContainerStack);
