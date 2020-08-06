const Activity = require('../models/Activity');

exports.getFeed = (req, res, next) => {
  const { user } = req;

  Activity.find({ user_receiver: user })
    .populate('user_action')
    .sort('-dateTime')
    .exec((err, timelineFeed) => {
      if (err) {
        return next(err);
      }

      const feedData = getFeedData(timelineFeed);

      res.send(feedData);
    });
};

const getFeedData = (feed) => {
  const feedDataList = [];
  let sectionDataList = [];
  let sectionDateString = '';

  feed.forEach((item, index) => {
    const dateObject = new Date(item.dateTime);
    const itemDateString = `${dateObject.getMonth()}-${dateObject.getDate()}`;

    if (sectionDateString !== itemDateString) {
      // UPDATE WITH COMPLETE SECTION
      if (index > 0) {
        feedDataList.push({
          title: getTitle(feed[index - 1].dateTime),
          data: sectionDataList,
        });
      }

      // PREPARE NEW SECTION
      sectionDateString = itemDateString;
      sectionDataList = [];
    }

    // ADD NEW DATA
    sectionDataList.push(item);

    // MAKE SURE TO PUSH THE LAST SECTION AFTER PROCESSING LAST ITEM
    if (index === feed.length - 1) {
      feedDataList.push({
        title: getTitle(item.dateTime),
        data: sectionDataList,
      });
    }
  });

  return feedDataList;
};

const getTitle = (dateTime) => {
  const todayDateObject = new Date(Date.now());
  const todayDateString = `${
    todayDateObject.getMonth() + 1
  }-${todayDateObject.getDate()}`;

  const yesterdayDateString = `${todayDateObject.getMonth() + 1}-${
    todayDateObject.getDate() - 1
  }`;

  const itemDateObject = new Date(dateTime);
  const itemDateString = `${
    itemDateObject.getMonth() + 1
  }-${itemDateObject.getDate()}`;

  if (itemDateString === todayDateString) {
    return 'Today';
  }

  if (itemDateString === yesterdayDateString) {
    return 'Yesterday';
  }

  return itemDateString;
};
