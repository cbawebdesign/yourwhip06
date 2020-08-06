import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import ContainerView from '../../UI/views/ContainerView';
import SelectionScrollView from '../../UI/views/SelectionScrollView';
import FooterView from '../../UI/views/footer/FooterView';
import TitleBodyTextView from '../../UI/views/TitleBodyTextView';
import DualTextButtonView from '../../UI/views/footer/DualTextButtonView';
import { CustomText as Text, TITLE_FONT } from '../../UI/text/CustomText';
import { SELECTIONS } from '../../helpers/dataHelper';

import { walkthroughComplete } from '../../actions/user';

import styles from './styles';

// DISPLAYS THE SECOND WALKTHROUGH SCREEN (A.K.A 'DISCOVER')
// Navigation is handled by dispatching the 'SET_WALKTHROUGH_COMPLETE'
// action. This prevents having to visit the Walkthrough section
// each time following login.

const WalkthroughStep2 = ({ route }) => {
  const dispatch = useDispatch();

  const [selections, setSelections] = useState(SELECTIONS);

  const handleSkip = () => {
    dispatch(walkthroughComplete());
  };

  const handleNext = () => {
    dispatch(walkthroughComplete());
  };

  const handleItemPress = (item) => {
    const arrayCopy = [...selections];

    selections.forEach((section, i) => {
      section.forEach((sectionItem, j) => {
        if (sectionItem.title === item.title) {
          selections[i][j].selected = !sectionItem.selected;
        }
      });
    });

    setSelections(arrayCopy);
  };

  return (
    <ContainerView
      hasGradient
      touchEnabled={false}
      headerHeight={route.params.headerHeight}
    >
      <View style={styles.titleView}>
        <TitleBodyTextView
          title="Discover"
          body="Pick your favorite categories so that we can recommend you people with shared interests"
        />
      </View>
      <View style={styles.selectionView}>
        <SelectionScrollView
          items={selections[0]}
          onItemPress={handleItemPress}
        />
        <SelectionScrollView
          items={selections[1]}
          onItemPress={handleItemPress}
        />
        <SelectionScrollView
          items={selections[2]}
          onItemPress={handleItemPress}
        />
      </View>
      <View style={styles.emptyView} />
      <View
        style={[
          styles.numberView,
          { bottom: styles.$bottomMargin + useSafeArea().bottom },
        ]}
      >
        <Text text="02" fontFamily={TITLE_FONT} style={styles.number} />
      </View>
      <FooterView backgroundColor={styles.$footerColor}>
        <DualTextButtonView
          leftButtonTitle="SKIP"
          leftButtonPress={handleSkip}
          rightButtonTitle="NEXT"
          rightButtonPress={handleNext}
        />
      </FooterView>
    </ContainerView>
  );
};

WalkthroughStep2.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
};

export default WalkthroughStep2;
