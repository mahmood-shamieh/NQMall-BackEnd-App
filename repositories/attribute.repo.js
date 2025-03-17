const { where } = require('sequelize');
const attribute = require('../models/attribute.model')
const SystemUtil = require("../util/system");
const Values = require('../models/values.model');


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
                }, include: [Values]
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
    static async create(body) {
        const insertData = {
            "NameAr": body.NameAr,
            "NameEn": body.NameEn,
            "IsActive": body.IsActive,
            "productId": body.productId,
            "Type": body.Type,
        };
        // let localItemsAr = [];
        // let localItemsEn = [];

        // for (let index = 0; index < body.itemsAr.length; index++) {
        //     const element = body.itemsAr[index];
        //     const haveNotHoverImage = isPlaceHolderFile(filesAr[index].path)
        //     localItemsAr.push({
        //         "item": element,
        //         "hoverImage": haveNotHoverImage ? null : SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
        //             ? filesAr[index].path.split("/").slice(1).join("\\") : filesAr[index].path.split('\\').slice(1).join('\\'),
        //     });

        // }
        // for (let index = 0; index < body.itemsEn.length; index++) {
        //     const element = body.itemsEn[index];
        //     const haveNotHoverImage = isPlaceHolderFile(filesEn[index].path)
        //     localItemsEn.push({
        //         "item": element,
        //         "hoverImage": haveNotHoverImage ? null : SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
        //             ? filesEn[index].path.split("/").slice(1).join("\\") : filesEn[index].path.split('\\').slice(1).join('\\'),
        //     });

        // }
        // insertData["ContentAr"] = localItemsAr;
        // insertData["ContentEn"] = localItemsEn;
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
    static async edit(body) {
        const insertData = {
            "NameAr": body.NameAr,
            "NameEn": body.NameEn,
            "IsActive": body.IsActive,
            "productId": body.productId,
            "Type": body.Type,
            "Id": body.Id,
        };

        try {

            const temp = await attribute.findOne({
                where: {
                    Id: body.Id
                }
            });
            if (temp) {
                const data = await attribute.update(insertData, {
                    where: {
                        Id: body.Id
                    }
                });
                if (data) {
                    const updatedAttribute = await attribute.findOne({
                        where: {
                            Id: body.Id
                        }
                    });
                    let createdAttributes = updatedAttribute.dataValues;
                    createdAttributes.IsActive = !!createdAttributes.IsActive;
                    createdAttributes.productId = parseInt(createdAttributes.productId);
                    return createdAttributes;
                } else { return false }

            }
            else {
                return false;
            }
        } catch (error) {
            return null;
        }
    }
    static async createImageAttribute(body, filesAr, itemsAr, filesEn, itemsEn) {
        // console.log(itemsAr);
        // console.log(filesAr);
        // console.log(itemsEn);
        // console.log(filesEn);
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
                // const element = itemsAr[index];
                // console.log(itemsAr[index].path);
                // console.log(itemsAr[index].originalname);
                const haveNotHoverImage = isPlaceHolderFile(filesAr[index].path);
                localItemsAr.push({
                    "item": SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                        ? itemsAr[index].path.split("/").slice(1).join("\\") : itemsAr[index].path.split('\\').slice(1).join('\\'),
                    "hoverImage": haveNotHoverImage ? null : SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                        ? filesAr[index].path.split("/").slice(1).join("\\") : filesAr[index].path.split('\\').slice(1).join('\\'),
                });
            }
        // console.log(localItemsAr);
        if (itemsEn)
            for (let index = 0; index < itemsEn.length; index++) {
                const element = itemsEn[index];
                const haveNotHoverImage = isPlaceHolderFile(filesEn[index].path);
                localItemsEn.push({
                    "item": SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                        ? itemsEn[index].path.split("/").slice(1).join("\\") : itemsEn[index].path.split('\\').slice(1).join('\\'),
                    "hoverImage": haveNotHoverImage ? null : SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                        ? filesEn[index].path.split("/").slice(1).join("\\") : filesEn[index].path.split('\\').slice(1).join('\\'),
                });
            }
        insertData['ContentAr'] = localItemsAr;
        insertData['ContentEn'] = localItemsEn;
        // console.log(insertData['ContentAr']);
        // return 

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