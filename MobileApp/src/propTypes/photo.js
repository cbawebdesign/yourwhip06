import PropTypes from 'prop-types';

export default PropTypes.shape({
  // id: PropTypes.number.isRequired,
  image: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // likes: PropTypes.number.isRequired,
  // comments: PropTypes.number.isRequired,
  // shares: PropTypes.number.isRequired,
});
