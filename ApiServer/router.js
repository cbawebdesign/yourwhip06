const express = require('express');

const Authentication = require('./controllers/Authentication');
const Home = require('./controllers/Posts');
const Flagged = require('./controllers/Flagged');
const Detail = require('./controllers/Detail');
const Comments = require('./controllers/Comments');
const Replies = require('./controllers/Replies');
const Profile = require('./controllers/Profile');
const Timeline = require('./controllers/Timeline');
const Gallery = require('./controllers/Gallery');
const Users = require('./controllers/Users');
const Stats = require('./controllers/Stats');

const auth = require('./middleware/auth');
const uploads = require('./middleware/upload');

const app = express();

// AUTHENTICATION
app.post('/login/', Authentication.login);
app.post('/signup-step1/', Authentication.signupStep1);
app.post(
  '/signup-step2/',
  uploads.uploadProfileImage,
  Authentication.signupStep2
);
app.post('/logout/', Authentication.logout);
app.get('/request-code/:email', Authentication.requestCode);
app.get('/validate-code/:email/:code', Authentication.validateCode);
app.post('/reset-password/', Authentication.resetPassword);

// SOCIAL
app.post('/like-post-press', auth, Home.likePostPress);
app.post('/share-post', auth, Home.sharePost);
app.post('/follow-user-press/', auth, Profile.followUserPress);

// HOME
app.get('/get-home-feed/:skip/:limit/', auth, Home.getFeed);
app.post('/compose-post/', auth, uploads.uploadImage, Home.compose);
app.post('/edit-post', auth, uploads.uploadImage, Home.edit);
app.post('/delete-post/', auth, Home.deletePost);
app.post('/hide-post/', auth, Home.hidePost);
app.post('/hide-posts-by-user/', auth, Home.hidePostsByUser);

// FLAGGED
app.get(
  '/get-flagged-posts-feed/:skip/:limit/',
  auth,
  Flagged.getFlaggedPostsFeed
);
app.get('/get-flagged-comments-feed/', auth, Flagged.getFlaggedCommentsFeed);
app.post('/report-post/', auth, Flagged.reportPost);
app.post('/report-comment/', auth, Flagged.reportComment);
app.post('/unflag-post/', auth, Flagged.unflagPost);
app.post('/unflag-comment/', auth, Flagged.unflagComment);

// DETAIL
app.get('/get-detail-post/:parentId', auth, Detail.getOnePost);
app.post('/like-image-press', auth, Detail.likeImagePress);
app.post('/share-image', auth, Detail.shareImage);

// COMMENTS
app.get('/get-comment-feed/:parentId/:feedType', auth, (req, res, next) =>
  req.params.feedType === 'POST'
    ? Comments.getPostCommentFeed(req, res, next)
    : Comments.getImageCommentFeed(req, res, next)
);
app.post('/like-comment-press/', auth, Comments.likeCommentPress);
app.post('/compose-comment/', auth, uploads.uploadImage, (req, res, next) =>
  req.body.type === 'POST'
    ? Comments.composePostComment(req, res, next)
    : Comments.composeImageComment(req, res, next)
);
app.post('/edit-comment/', auth, uploads.uploadImage, Comments.editComment);
app.post('/delete-comment/', auth, Comments.deleteComment);
app.post('/hide-comment/', auth, Comments.hideComment);
app.post('/hide-comments-by-user/', auth, Comments.hideCommentsByUser);

// REPLIES
app.get('/get-reply-feed/:parentId', auth, Replies.getReplyFeed);
app.post('/like-reply-press/', auth, Replies.likeReplyPress);
app.post('/compose-reply/', auth, uploads.uploadImage, Replies.composeReply);
app.post('/delete-reply/', auth, Replies.deleteReply);

// GALLERY
app.get('/get-gallery-feed/', auth, Gallery.getFeed);
app.post('/delete-gallery', auth, Gallery.deleteGallery);

// PROFILE
app.get('/get-profile/:userId/:skip/:limit', auth, Profile.getProfile);

// TIMELINE
app.get('/get-timeline-feed/:skip/:limit', auth, Timeline.getFeed);

// PEOPLE / USER
app.get('/get-user-info/', auth, Users.getUserInfo);
app.post('/update-interests/', auth, Users.updateInterests);
app.post('/update-settings/', auth, Users.updateSettings);
app.post('/edit-profile/', auth, uploads.uploadProfileImage, Users.editProfile);
app.get('/get-recommended-users/', auth, Users.getRecommended);
app.post('/remove-user-press', auth, Users.removeUserPress);
app.get('/search-users/:searchInput', auth, Users.searchUsers);

// SETTINGS
app.post('/delete-account/', auth, Authentication.deleteAccount);

// STATS
app.get('/get-stats-for-month/:year/:month', auth, Stats.getMonthly);

module.exports = app;
