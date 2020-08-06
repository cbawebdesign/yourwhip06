import React from 'react';
import { Provider } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import NavigationContainer from './config/routes';
import { COLORS } from './config/constants';

import store from './config/store';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}

EStyleSheet.build({
  $primary1: COLORS.primary1,
  $primary2: COLORS.primary2,
  $backgroundGray: COLORS.backgroundGray,
  $black: COLORS.black,
  $white: COLORS.white,
  $searchBar: COLORS.lightGray,
});
