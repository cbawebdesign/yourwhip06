import PropTypes from 'prop-types';

import UserPropType from './user';

export default PropTypes.shape({
  createdBy: UserPropType,
  dateTime: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  description: PropTypes.string.isRequired,
  likes: PropTypes.arrayOf(PropTypes.any).isRequired,
  post: PropTypes.string,
  comment: PropTypes.string,
  image: PropTypes.string,
  replies: PropTypes.arrayOf(PropTypes.any).isRequired,
  _id: PropTypes.string.isRequired,
});
