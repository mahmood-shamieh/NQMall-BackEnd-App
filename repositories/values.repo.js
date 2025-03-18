const { where } = require('sequelize');
const attribute = require('../models/attribute.model')
const SystemUtil = require("../util/system");
const Values = require('../models/values.model');
const ValueNotExist = require('../exceptions/ValueNotExist');
const CreateValueFailure = require('../exceptions/CreateValueFailure');
const ValueFailure = require('../exceptions/ValueFailure');


// function isPlaceHolderFile(path) {
//     // Use a combination of `lastIndexOf` to find the position of the last dot
//     // and `slice` to extract the part of the string after the last dot.
//     const lastDotIndex = path.lastIndexOf('.');

//     // If there's no dot or it's the first character, there's no extension
//     if (lastDotIndex === -1 || lastDotIndex === 0) return null;

//     // Extract the extension without the dot
//     return path.slice(lastDotIndex + 1) === "empty";
// }


class ValuesRepo {
    static async getProductAttributeValues(attributeId) {
        try {
            const attributesValues = await Values.findAll({
                where: {
                    attributeId: attributeId
                }
            });
            if (attributesValues && attributesValues.length) {
                const data = new Array();
                attributesValues.forEach(element => {
                    data.push({ ...element.dataValues });
                });
                return data;
            }
            else {
                throw new ValueNotExist()
            }
        } catch (error) {
            throw error
        }

    }
    static async create(body, hoverImageAr, hoverImageEn) {
        let insertData = {
            "ValueAr": body.ValueAr,
            "ValueEn": body.ValueEn,
            "attributeId": body.attributeId
        };
        if (hoverImageAr) {
            insertData['HoverImageAr'] = SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                ? hoverImageAr[0].path.split("/").slice(1).join("\\") : hoverImageAr[0].path.split('\\').slice(1).join('\\');
        }
        if (hoverImageEn) {
            insertData['HoverImageEn'] = SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                ? hoverImageEn[0].path.split("/").slice(1).join("\\") : hoverImageEn[0].path.split('\\').slice(1).join('\\');
        }

        try {

            const temp = await Values.create(insertData);
            if (temp) {
                let createdValues = temp;
                createdValues.IsActive = !!createdValues.IsActive;
                createdValues.attributeId = parseInt(createdValues.attributeId);
                return createdValues;
            }
            else {
                throw new CreateValueFailure()
            }
        } catch (error) {
            throw error
        }
    }
    static async edit(body, hoverImageAr, hoverImageEn) {
        let insertData = {
            "ValueAr": body.ValueAr,
            "ValueEn": body.ValueEn,
            "attributeId": body.attributeId
        };
        if (hoverImageAr) {
            insertData['HoverImageAr'] = SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                ? hoverImageAr[0].path.split("/").slice(1).join("\\") : hoverImageAr[0].path.split('\\').slice(1).join('\\');
        }
        if (hoverImageEn) {
            insertData['HoverImageEn'] = SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                ? hoverImageEn[0].path.split("/").slice(1).join("\\") : hoverImageEn[0].path.split('\\').slice(1).join('\\');
        }
        try {

            const temp = await Values.findOne({
                where: {
                    Id: body.Id
                }
            });
            if (temp && temp.length !== 0) {
                const updatedData = await Values.update(insertData, {
                    where: {
                        Id: body.Id
                    }
                });
                if (updatedData) {
                    const newData = await Values.findOne({
                        where: {
                            Id: body.Id
                        }
                    });
                    let createdValues = newData.dataValues;
                    createdValues.IsActive = !!createdValues.IsActive;
                    createdValues.attributeId = parseInt(createdValues.attributeId);
                    return createdValues;
                } else {
                    throw new ValueFailure()
                }
            }
            else {
                throw new ValueNotExist()
            }
        } catch (error) {
            throw error
        }
    }
    static async createImageValues(attributeId, fileAr, fileEn, hoverImageAr, hoverImageEn) {

        let insertData = {
            "attributeId": attributeId,
            "IsActive": true,
        };
        if (fileAr) {
            insertData['ValueAr'] = SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                ? fileAr[0].path.split("/").slice(1).join("\\") : fileAr[0].path.split('\\').slice(1).join('\\');
        }
        if (fileEn) {
            insertData['ValueEn'] = SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                ? fileEn[0].path.split("/").slice(1).join("\\") : fileEn[0].path.split('\\').slice(1).join('\\');
        }
        if (hoverImageAr) {
            insertData['HoverImageAr'] = SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                ? hoverImageAr[0].path.split("/").slice(1).join("\\") : hoverImageAr[0].path.split('\\').slice(1).join('\\');
        }
        if (hoverImageEn) {
            insertData['HoverImageEn'] = SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                ? hoverImageEn[0].path.split("/").slice(1).join("\\") : hoverImageEn[0].path.split('\\').slice(1).join('\\');
        }
        try {
            const temp = await Values.create(insertData);
            if (temp) {
                return { ...temp.dataValues };
            } else {
                throw new CreateValueFailure()
            }
        } catch (error) {
            throw error
        }
    }
    static async editImageValues(id, attributeId, fileAr, fileEn, hoverImageAr, hoverImageEn) {

        let insertData = {
            "attributeId": attributeId,
            "IsActive": true,
        };
        if (fileAr) {
            insertData['ValueAr'] = SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                ? fileAr[0].path.split("/").slice(1).join("\\") : fileAr[0].path.split('\\').slice(1).join('\\');
        }
        if (fileEn) {
            insertData['ValueEn'] = SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                ? fileEn[0].path.split("/").slice(1).join("\\") : fileEn[0].path.split('\\').slice(1).join('\\');
        }
        if (hoverImageAr) {
            insertData['HoverImageAr'] = SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                ? hoverImageAr[0].path.split("/").slice(1).join("\\") : hoverImageAr[0].path.split('\\').slice(1).join('\\');
        }
        if (hoverImageEn) {
            insertData['HoverImageEn'] = SystemUtil.detectOS() === SystemUtil.OS_TYPE.MACOS
                ? hoverImageEn[0].path.split("/").slice(1).join("\\") : hoverImageEn[0].path.split('\\').slice(1).join('\\');
        }
        try {
            const temp = await Values.findOne({
                where: {
                    Id: id
                }
            })
            if (temp && temp.length !== 0) {
                const update = await Values.update(insertData, {
                    where: {
                        Id: id
                    }
                });
                if (update) {
                    const updatedData = await Values.findOne({
                        where: {
                            Id: id
                        }
                    })
                    return { ...updatedData.dataValues };
                } else {
                    throw new ValueFailure()
                }

            } else {
                throw new ValueNotExist()
            }
        } catch (error) {
            throw error
        }
    }
    static async deleteImageValue(id) {
        try {
            const deletedItem = await Values.destroy(
                {
                    where: {
                        Id: id
                    }
                }
            );
            if (deletedItem) {
                return true;
            }
            else {
                throw new ValueNotExist()

            }
        } catch (error) {
            throw error
        }

    }
    static async deleteValue(id) {
        try {
            const deletedItem = await Values.destroy(
                {
                    where: {
                        Id: id
                    }
                }
            );
            if (deletedItem) {
                return true;
            }
            else {
                throw new ValueNotExist()
            }
        } catch (error) {
            throw error
        }

    }

}
module.exports = ValuesRepo