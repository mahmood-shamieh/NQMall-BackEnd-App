const media = require('../models/media.model');
const { all } = require('../routes/user.routes');


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
                    data.push({...element.dataValues});
                });
                return data;
            }
            else {
                return false;
            }
        } catch (error) {
            return null;
        }
    }
    static async addMedia(body) {
        try {
            const temp = await media.create(body);
            if (temp) {
                return { ...temp.dataValues };
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return null;
        }

    }
    static async getMediaDetails(id) {
        try {
            let allMedia = [];
            if (id) {
                const temp = await media.findAll({
                    where: {
                        productId: id
                    }
                });
                if (temp) {
                    const returnedData = new Array();
                    temp.forEach(element => {
                        returnedData.push(element.dataValues);
                    });
                    return returnedData;
                } else {
                    return false;
                }
            }
            else {
                const temp = await media.findAll();
                if (temp) {
                    temp.forEach(element => {
                        allMedia.push({ ...element.dataValues })
                    });
                    return allMedia;
                }
                else {
                    return false;
                }
            }


        } catch (error) {
            return null;
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
                return false;
            }
        } catch (error) {
            return null;
        }
    }

}

module.exports = MediaRepo;