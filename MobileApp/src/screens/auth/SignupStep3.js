import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, Keyboard, ImageBackground, ScrollView } from 'react-native';

import ContainerView from '../../UI/views/ContainerView';
import FooterView from '../../UI/views/footer/FooterView';
import TextButton from '../../UI/buttons/TextButton';
import {
  CustomText as Text,
  BODY_FONT,
  TITLE_FONT,
} from '../../UI/text/CustomText';

import { signupStep3 } from '../../actions/auth';

import styles from '../styles';

import {
  termsPar0,
  termsPar1,
  termsPar1_1,
  termsPar2,
  termsPar3,
  termsPar4,
  termsPar5,
  termsPar6,
  termsPar7,
  termsPar8,
  termsPar9,
} from '../../helpers/dataHelper';

const paragraphStyle = {
  paddingBottom: 12,
  fontSize: 15,
};

const SignupStep3 = ({ route }) => {
  const dispatch = useDispatch();

  const handleAgree = () => {
    dispatch(signupStep3());
  };

  return (
    <ContainerView
      headerHeight={route.params.headerHeight}
      touchEnabled={false}
      backgroundColor={styles.$background}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 12,
          paddingBottom: 48,
          paddingTop: 48,
        }}
      >
        <Text
          text="App Terms of Use"
          fontFamily={TITLE_FONT}
          style={{ fontSize: 24 }}
        />
        <Text
          text="By tapping 'I Agree', you agree to our Terms of Use"
          fontFamily={BODY_FONT}
          style={{ paddingBottom: 48, fontSize: 15 }}
        />
        <Text text={termsPar0} fontFamily={BODY_FONT} style={paragraphStyle} />
        <Text text={termsPar1} fontFamily={BODY_FONT} style={paragraphStyle} />
        <Text
          text={termsPar1_1}
          fontFamily={BODY_FONT}
          style={paragraphStyle}
        />
        <Text text={termsPar2} fontFamily={BODY_FONT} style={paragraphStyle} />
        <Text text={termsPar3} fontFamily={BODY_FONT} style={paragraphStyle} />
        <Text text={termsPar4} fontFamily={BODY_FONT} style={paragraphStyle} />
        <Text text={termsPar5} fontFamily={BODY_FONT} style={paragraphStyle} />
        <Text text={termsPar6} fontFamily={BODY_FONT} style={paragraphStyle} />
        <Text text={termsPar7} fontFamily={BODY_FONT} style={paragraphStyle} />
        <Text text={termsPar8} fontFamily={BODY_FONT} style={paragraphStyle} />
        <Text text={termsPar9} fontFamily={BODY_FONT} style={paragraphStyle} />
      </ScrollView>
      <FooterView backgroundColor="white">
        <TextButton
          text="I Agree"
          onPress={handleAgree}
          color="black"
          uppercase
          opacity={1}
        />
      </FooterView>
    </ContainerView>
  );
};

export default SignupStep3;
