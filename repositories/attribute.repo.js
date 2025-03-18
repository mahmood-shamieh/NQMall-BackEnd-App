const { where } = require('sequelize');
const attribute = require('../models/attribute.model')
const SystemUtil = require("../util/system");
const Values = require('../models/values.model');
const AttributesNotExist = require('../exceptions/AtrributesNotExist');
const CreateAtrributeFailure = require('../exceptions/CreateAttributeFailure');
const CreateAttributeFailure = require('../exceptions/CreateAttributeFailure');
const AttributeNotExist = require('../exceptions/AttributeNotExist');


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
                throw new AttributesNotExist()
            }
        } catch (error) {
            throw error
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

        try {
            const temp = await attribute.create(insertData);
            if (temp) {
                let createdAttributes = temp;
                createdAttributes.IsActive = !!createdAttributes.IsActive;
                createdAttributes.productId = parseInt(createdAttributes.productId);
                return createdAttributes;
            }
            else {
                throw new CreateAttributeFailure()
            }
        } catch (error) {
            throw error
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
            if (temp && temp.length !== 0) {
                const data = await attribute.update(insertData, {
                    where: {
                        Id: body.Id
                    }
                });
                console.log(data);
                
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
                } else {
                     return false }

            }
            else {
                throw new AttributesNotExist();
            }
        } catch (error) {
            throw error
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
                const haveNotHoverImage = isPlaceHolderFile(filesAr[index].path);
                localItemsAr.push({
                    "item": SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                        ? itemsAr[index].path.split("/").slice(1).join("\\") : itemsAr[index].path.split('\\').slice(1).join('\\'),
                    "hoverImage": haveNotHoverImage ? null : SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                        ? filesAr[index].path.split("/").slice(1).join("\\") : filesAr[index].path.split('\\').slice(1).join('\\'),
                });
            }
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
        try {
            const temp = await attribute.create(insertData);
            if (temp) {
                return { ...temp.dataValues };
            } else {
                throw new CreateAttributeFailure();
            }
        } catch (error) {
            throw error
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
            else throw new AttributeNotExist();
        } catch (error) {
            throw error
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
            else throw new AttributeNotExist();
        } catch (error) {
            throw error
        }

    }

}
module.exports = AttributeRepo