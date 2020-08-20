import {
  GET_TIMELINE_FEED,
  TIMELINE_FEED_RESULT,
  TIMELINE_FEED_ERROR,
} from '../actions/timeline';

const initialState = {
  fetching: false,
  error: null,
  success: null,
  timelineFeed: [],
  endOfList: false,
};

const updateList = (list) => {
  const updatedList = [];
  let prevTitle;
  let prevData;

  list.forEach((item, index) => {
    let dataArray;

    if (prevTitle === item.title) {
      dataArray = [...prevData, ...item.data];
      updatedList[index - 1] = { title: item.title, data: dataArray };
    } else {
      dataArray = item.data;
      updatedList.push({ title: item.title, data: dataArray });
    }

    prevTitle = item.title;
    prevData = dataArray;
  });

  return updatedList;
};

const timelineState = (state = initialState, action) => {
  switch (action.type) {
    case GET_TIMELINE_FEED:
      return {
        ...state,
        fetching: true,
      };
    case TIMELINE_FEED_RESULT:
      return {
        ...state,
        fetching: false,
        timelineFeed:
          action.result.skip === '0'
            ? action.result.activities
            : updateList([...state.timelineFeed, ...action.result.activities]),
        endOfList: action.result.activities.length === 0,
        error: null,
      };
    case TIMELINE_FEED_ERROR:
      return {
        ...state,
        etching: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default timelineState;
