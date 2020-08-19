const Post = require('../models/Post');
const User = require('../models/User');
const Activity = require('../models/Activity');

exports.getPostsFromRequest = async (req) => {
  const skip = Number(req.params.skip);
  const limit = Number(req.params.limit) || Number(req.body.limit);

  console.log('limit', req.homeFeedItemsCount);

  const posts = await Post.find({}, null, {
    skip,
    limit,
  })
    .populate('createdBy')
    .populate('comments')
    .populate('images')
    .populate('likes')
    .populate('shares')
    .populate({
      path: 'images',
      populate: {
        path: 'likes',
      },
    })
    .populate({
      path: 'images',
      populate: {
        path: 'comments',
      },
    })
    // SHARED POST
    .populate('sharedPost')
    .populate({
      path: 'sharedPost',
      populate: {
        path: 'images',
      },
    })
    .populate({
      path: 'sharedPost',
      populate: {
        path: 'createdBy',
      },
    })
    .populate({
      path: 'sharedPost',
      populate: {
        path: 'shares',
      },
    })
    // SHARED IMAGE
    .populate('sharedImage')
    .populate({
      path: 'sharedImage',
      populate: {
        path: 'createdBy',
      },
    })
    .populate({
      path: 'sharedImage',
      populate: {
        path: 'likes',
      },
    })
    .populate({
      path: 'sharedImage',
      populate: {
        path: 'comments',
      },
    })
    .populate({
      path: 'sharedImage',
      populate: {
        path: 'shares',
      },
    })
    .sort('-dateTime');

  if (!posts) {
    throw new Error(
      'An error occurred while retrieving posts for supplied user id'
    );
  }

  return posts;
};

exports.buildPostFromRequest = async (req) => {
  const { user, images, sharedPost, sharedImage } = req;
  const { description, caption, shouldExpire } = req.body;

  const post = new Post({
    createdBy: user._id,
    description,
    caption,
    images,
    sharedPost,
    sharedImage,
    shouldExpire,
  });

  const result = await post.save();

  if (!result) {
    throw new Error('An error occurred saving the new post');
  }

  return post;
};

exports.getOnePostFromRequest = async (req) => {
  const postId =
    req.params && req.params.parentId ? req.params.parentId : req.body.parentId;

  const post = await Post.findById(postId)
    .populate('createdBy')
    .populate('comments')
    .populate('images')
    .populate('likes')
    .populate('shares')
    .populate({
      path: 'images',
      populate: {
        path: 'likes',
      },
    })
    .populate({
      path: 'images',
      populate: {
        path: 'comments',
      },
    })
    .populate({
      path: 'images',
      populate: {
        path: 'shares',
      },
    })
    // SHARED POST
    .populate('sharedPost')
    .populate({
      path: 'sharedPost',
      populate: {
        path: 'images',
      },
    })
    .populate({
      path: 'sharedPost',
      populate: {
        path: 'createdBy',
      },
    })
    .populate({
      path: 'sharedPost',
      populate: {
        path: 'shares',
      },
    })
    // SHARED IMAGE
    .populate('sharedImage')
    .populate({
      path: 'sharedImage',
      populate: {
        path: 'createdBy',
      },
    });

  if (!post) {
    throw new Error(
      'An error occured while retrieving the post from supplied id'
    );
  }

  return post;
};

exports.getPostsByUserFromRequest = async (req) => {
  const userId = req.body.userId ? req.body.userId : req.params.userId;
  const skip = Number(req.params.skip);
  const limit = Number(req.params.limit);

  try {
    const posts = await Post.find({ createdBy: { _id: userId } }, null, {
      skip,
      limit,
    })
      .populate('createdBy')
      .populate('comments')
      .populate('images')
      .populate('likes')
      .populate({
        path: 'images',
        populate: {
          path: 'likes',
        },
      })
      .populate({
        path: 'images',
        populate: {
          path: 'comments',
        },
      })
      .populate('shares')
      .populate('sharedPost')
      .populate({
        path: 'sharedPost',
        populate: {
          path: 'createdBy',
        },
      })
      .populate({
        path: 'sharedPost',
        populate: {
          path: 'images',
        },
      })
      .populate('sharedImage')
      .populate({
        path: 'sharedImage',
        populate: {
          path: 'createdBy',
        },
      })
      .sort('-dateTime');

    if (!posts) {
      throw new Error(
        'An error occurred while retrieving posts for supplied user id'
      );
    }

    return posts;
  } catch (error) {
    console.log('37', error);
  }
};

exports.getCountFromRequest = async (req) => {
  const { userId } = req.params;

  try {
    const count = await Post.countDocuments({ createdBy: { _id: userId } });

    if (!count && count !== 0) {
      throw new Error(
        'An error occured while retrieving number of posts for user'
      );
    }

    return count;
  } catch (error) {
    console.log('38', error);
  }
};

exports.deleteOnePostFromRequest = async (req) => {
  const { postId } = req.body;

  try {
    const result = await Post.findByIdAndDelete(postId);

    if (!result) {
      throw new Error('An error occured while deleting the post');
    }
  } catch (error) {
    console.log('39', error);
  }
};

exports.deletePostsFromRequest = async (req) => {
  const { userId } = req.body;

  try {
    const result = await Post.deleteMany({ createdBy: { _id: userId } });

    return result;
  } catch (error) {
    console.log('40', error);
  }
};
