

const Product = require('../models/product.model');
const userRepo = require('../repositories/user.repo')


class UserController {
    static async create(req, res) {
        const body = req.body;
        const addedUser = await userRepo.addUser(body);
        if (addedUser) {
            res.status(200).json(addedUser);
        }
        else { res.status(500).json({ message: 'Error creating user' }); }
    }
    static async getUserDetails(req, res) {
        const id = req.params.id;
        const returnedUser = await userRepo.getUserDetails(id);
        if (returnedUser) {
            res.status(200).json(returnedUser);
        } else {
            res.status(500).json({ message: 'Error creating user' });
        }
    }
    static async updateUser(req, res) {
        const body = req.body;
        const updatedUser = await userRepo.updateUserDetails(body);
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(500).send({ "errorMessage": "Unknown error happened" });
        }
    }
    static async deleteUser(req, res) {
        const id = req.params.id;
        const userDeleted = await userRepo.deleteUser(id);
        if (userDeleted) {
            res.status(200).send({
                status: true,
                message: "Element Was Deleted Successfully"
            })
        }
        else if (userDeleted === false) {
            res.status(404).json(
                {
                    status: false,
                    message: "Element Was Not Found"
                }
            )
        }
        else {
            res.status(500).json({ message: 'Error creating user' });
        }
    }
    static async getFormat(req, res) {
        res.status(200).send({
            "Email": "",
            "PasswordHash": "",
            "FullName": "",
            "Address": "",
            "PhoneNumber": "",
            "IsActive": "",
            "Role": ""
        });
    }

}
module.exports = UserController;