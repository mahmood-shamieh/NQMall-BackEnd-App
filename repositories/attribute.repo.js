const { where } = require('sequelize');
const attribute = require('../models/attribute.model')


function isPlaceHolderFile(path) {
    // Use a combination of `lastIndexOf` to find the position of the last dot
    // and `slice` to extract the part of the string after the last dot.
    const lastDotIndex = path.lastIndexOf('.');

    // If there's no dot or it's the first character, there's no extension
    if (lastDotIndex === -1 || lastDotIndex === 0) return null;

    // Extract the extension without the dot
    return path.slice(lastDotIndex + 1) === "empty";
}


class AttributeRepo {
    static async getProductAttributes(productId) {
        try {
        const productAttributes = await attribute.findAll({
            where: {
                productId: productId
            }
        });
        if (productAttributes && productAttributes.length) {
            const data = new Array();
            productAttributes.forEach(element => {
                data.push({ ...element.dataValues });
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
    static async create(body, filesAr, filesEn) {
        const insertData = {
            "NameAr": body.NameAr,
            "NameEn": body.NameEn,
            "IsActive": body.IsActive,
            "productId": body.productId,
            "Type": body.Type,
        };
        let localItemsAr = [];
        let localItemsEn = [];

        for (let index = 0; index < body.itemsAr.length; index++) {
            const element = body.itemsAr[index];
            const haveNotHoverImage = isPlaceHolderFile(filesAr[index].path)
            localItemsAr.push({
                "item": element,
                "hoverImage": haveNotHoverImage ? null : filesAr[index].path.split('\\').slice(1).join('\\'),
            });

        }
        for (let index = 0; index < body.itemsEn.length; index++) {
            const element = body.itemsEn[index];
            const haveNotHoverImage = isPlaceHolderFile(filesEn[index].path)
            localItemsEn.push({
                "item": element,
                "hoverImage": haveNotHoverImage ? null : filesEn[index].path.split('\\').slice(1).join('\\'),
            });

        }
        insertData["ContentAr"] = localItemsAr;
        insertData["ContentEn"] = localItemsEn;
        try {

            const temp = await attribute.create(insertData);
            if (temp) {
                let createdAttributes = temp;
                createdAttributes.IsActive = !!createdAttributes.IsActive;
                createdAttributes.productId = parseInt(createdAttributes.productId);
                return createdAttributes;
            }
            else {
                return false;
            }
        } catch (error) {
            return null;
        }
    }
    static async createImageAttribute(body, filesAr, itemsAr, filesEn, itemsEn) {
        const insertData = {
            "NameAr": body.NameAr,
            "NameEn": body.NameEn,
            "IsActive": body.IsActive,
            "productId": body.productId,
            "Type": body.Type,
        };
        let localItemsAr = new Array();
        let localItemsEn = new Array();
        if (itemsAr)
            for (let index = 0; index < itemsAr.length; index++) {
                const element = itemsAr[index];
                const haveNotHoverImage = isPlaceHolderFile(filesAr[index].path);
                localItemsAr.push({
                    "item": itemsAr[index].path.split('\\').slice(1).join('\\'),
                    "hoverImage": haveNotHoverImage ? null : filesAr[index].path.split('\\').slice(1).join('\\'),
                });
            }
        if (itemsEn)
            for (let index = 0; index < itemsEn.length; index++) {
                const element = itemsEn[index];
                const haveNotHoverImage = isPlaceHolderFile(filesEn[index].path);
                localItemsEn.push({
                    "item": itemsEn[index].path.split('\\').slice(1).join('\\'),
                    "hoverImage": haveNotHoverImage ? null : filesEn[index].path.split('\\').slice(1).join('\\'),
                });
            }
        insertData['ContentAr'] = localItemsAr;
        insertData['ContentEn'] = localItemsEn;
        try {
            const temp = await attribute.create(insertData);
            if (temp) {
                return { ...temp.dataValues };
            } else {
                return false;
            }
        } catch (error) {
            return null;

        }
    }
    static async deleteImageAttribute(id) {
        try {
            const deletedItem = await attribute.destroy(
                {
                    where: {
                        Id: id
                    }
                }
            );
            if (deletedItem) {
                return true;
            }
            else return false;
        } catch (error) {
            return null;
        }

    }
    static async deleteAttribute(id) {
        try {
            const deletedItem = await attribute.destroy(
                {
                    where: {
                        Id: id
                    }
                }
            );
            if (deletedItem) {
                return true;
            }
            else return false;
        } catch (error) {
            return null;
        }

    }

}
module.exports = AttributeRepo