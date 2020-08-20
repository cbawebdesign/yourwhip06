const HttpStatus = require('http-status-codes/index');

const activityHelper = require('../helpers/activities');

exports.getFeed = async (req, res) => {
  const { skip } = req.params;

  try {
    const timelineFeed = await activityHelper.getActivitiesFromRequest(req);

    if (!timelineFeed) {
      throw new Error('An error occurred getting the timeline feed');
    }

    const activities = getFeedData(timelineFeed);

    res.status(HttpStatus.OK).send({ activities, skip });
  } catch (error) {
    console.log(error);
  }
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
