const HttpStatus = require('http-status-codes/index');

const galleryHelper = require('../helpers/galleries');

exports.getFeed = async (req, res) => {
  try {
    const galleries = await galleryHelper.getGalleriesFromRequest(req);

    res.status(HttpStatus.OK).send(galleries);
  } catch (error) {
    console.log('16', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
