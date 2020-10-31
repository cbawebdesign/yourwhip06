const HttpStatus = require('http-status-codes/index');

const galleryHelper = require('../helpers/galleries');

exports.getFeed = async (req, res) => {
  try {
    const galleries = await galleryHelper.getGalleriesFromRequest(req);

    res.status(HttpStatus.OK).send({ galleries });
  } catch (error) {
    console.log('16', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

exports.deleteGallery = async (req, res) => {
  try {
    const deleteResult = await galleryHelper.deleteOneGalleryFromRequest(req);

    if (deleteResult) {
      const galleries = await galleryHelper.getGalleriesFromRequest(req);

      res.status(HttpStatus.OK).send({ galleries });
    } else {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: 'An error occurred while deleting the gallery' });
    }

    return result;
  } catch (error) {
    console.log('46', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};
