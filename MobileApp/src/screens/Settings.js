import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, SectionList } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';

import ContainerView from '../UI/views/ContainerView';
import SettingsListItem from '../UI/lists/SettingsListItem';
import { CustomText as Text, TITLE_FONT } from '../UI/text/CustomText';
import FooterView from '../UI/views/footer/FooterView';
import TextButton from '../UI/buttons/TextButton';
import SelectionModal from '../UI/modals/SelectionModal';

import { SETTINGS_ITEMS } from '../helpers/dataHelper';

import { userPropType } from '../config/propTypes';

import { logout, deleteAccount, resetMessages } from '../actions/auth';
import { enableSuggestions } from '../actions/user';

import styles from './styles';

const Settings = ({
  route,
  navigation,
  currentUser,
  appSettings,
  fetching,
}) => {
  const dispatch = useDispatch();
  const paddingBottom = useSafeArea().bottom;

  const [showModal, setShowModal] = useState(false);

  const modalOptions = {
    title: 'Delete Account',
    body: 'You are about to delete your account. Do you want to continue?',
    buttonStyle: 'horizontal',
    buttons: [
      {
        title: 'Continue',
        onPress: () => {
          setShowModal(false);
          dispatch(deleteAccount(currentUser._id));
        },
      },
      {
        title: 'Cancel',
        onPress: () => {
          setShowModal(false);
        },
      },
    ],
  };

  const handlePress = (item) => {
    if (item.title === 'Remove Account') {
      setShowModal(true);
    } else {
      if (item.title === 'Edit Profile') {
        // RESET SUCCESS / ERROR STATE OTHERWISE WE GET IMMEDIATELY
        // NAVIGATED BACK TO THIS SCREEN FROM EDIT PROFILE (SIGNUP STEP 2) SCREEN
        dispatch({ type: 'RESET_PROFILE' });
      }
      navigation.navigate(item.navigateTo, { fromScreen: 'SETTINGS' });
    }
  };

  const handleLogout = () => {
    dispatch(resetMessages());
    dispatch(logout());
  };

  const handleToggleSuggestions = (value) => {
    dispatch(enableSuggestions(value));
  };

  if (!currentUser) {
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
      <SelectionModal
        showModal={showModal}
        options={modalOptions}
        timeout={500}
        onModalDismissPress={() => setShowModal(false)}
      />
      <SectionList
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: paddingBottom + 25 },
        ]}
        sections={SETTINGS_ITEMS}
        renderItem={({ item, index, section }) => (
          <SettingsListItem
            bottomMargin={section.data.length === index + 1}
            item={item}
            onPress={() => handlePress(item)}
            toggleSuggestions={handleToggleSuggestions}
            enableSuggestionsValue={currentUser.enableSuggestions}
            hide={
              item.display === 'ENABLE_SUGGESTIONS' &&
              !appSettings.enableSuggestionsControl
            }
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionTitleView}>
            <Text
              text={title}
              fontFamily={TITLE_FONT}
              style={styles.sectionTitleSmall}
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      <FooterView hasGradient>
        <TextButton
          text="Logout"
          onPress={handleLogout}
          color="black"
          uppercase
          opacity={1}
        />
      </FooterView>
    </ContainerView>
  );
};

Settings.defaultProps = {
  currentUser: null,
};

Settings.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.instanceOf(Object),
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: userPropType,
  appSettings: PropTypes.shape({
    enableSuggestionsControl: PropTypes.bool.isRequired,
  }),
  fetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const { user, appSettings } = state.user;
  const { fetching } = state.auth;

  return {
    currentUser: user,
    appSettings,
    fetching,
  };
};

export default connect(mapStateToProps)(Settings);
