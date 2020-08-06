import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Month from './Month';
import ContainerView from '../../UI/views/ContainerView';

const Stats = ({ route, fetching }) => (
  <ContainerView
    touchEnabled={false}
    headerHeight={route.params.headerHeight}
    loadingOptions={{ loading: fetching }}
  >
    <Month />
  </ContainerView>
);

Stats.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.instanceOf(Object),
  }).isRequired,
  fetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const { fetching } = state.stats;

  return {
    fetching,
  };
};

export default connect(mapStateToProps)(Stats);
