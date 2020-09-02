import { combineReducers } from 'redux';
import auth from './auth';
import user from './user';
import likes from './likes';
import home from './posts';
import detail from './detail';
import comments from './comments';
import replies from './replies';
import timeline from './timeline';
import profile from './profile';
import galleries from './gallieries';
import stats from './stats';

const reducers = () =>
  combineReducers({
    auth,
    user,
    likes,
    home,
    detail,
    comments,
    replies,
    timeline,
    profile,
    galleries,
    stats,
  });

export default reducers;
