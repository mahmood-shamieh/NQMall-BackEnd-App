const MediaFailure = require('../exceptions/Mediafailure');
const CreateMediaFailure = require('../exceptions/CreateMediaFailure');
const media = require('../models/media.model');
const { all } = require('../routes/user.routes');
const MediaNotExist = require('../exceptions/MediaNotExist');


class MediaRepo {
    static async getProductMedia(productId) {
        try {
            const productMedia = await media.findAll({
                where: {
                    productId: productId
                }
            });

            if (productMedia && productMedia.length) {
                const data = new Array();
                productMedia.forEach(element => {
                    data.push({ ...element.dataValues });
                });
                return data;
            }
            else {
                throw new MediaNotExist()
            }
        } catch (error) {
            throw error
        }
    }
    static async addMedia(body) {
        try {
            const temp = await media.create(body);
            if (temp) {
                return { ...temp.dataValues };
            } else {
                throw new CreateMediaFailure()
            }
        } catch (error) {
            throw error
        }

    }
    static async getMediaDetails(id) {
        try {
            if (id) {
                const temp = await media.findAll({
                    where: {
                        Id: id
                    }
                });
                if (temp && temp.length !== 0) {
                    const returnedData = new Array();
                    temp.forEach(element => {
                        returnedData.push(element.dataValues);
                    });
                    return returnedData;
                } else {
                    throw new MediaNotExist()
                }
            }
            // else {
            //     const temp = await media.findAll();
            //     if (temp) {
            //         temp.forEach(element => {
            //             allMedia.push({ ...element.dataValues })
            //         });
            //         return allMedia;
            //     }
            //     else {
            //         throw new MediaFailure()
            //     }
            // }
        } catch (error) {
            throw error
        }
    }
    static async deleteMedia(id) {
        try {
            const temp = await media.destroy({
                where: {
                    Id: id
                }
            });
            if (temp) {
                return true;
            }
            else {
                throw new MediaNotExist()
            }
        } catch (error) {
            throw error
        }
    }

}

module.exports = MediaRepo;