class ResponseModel {
    constructor(code, message, data = null) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    toJSON() {
        return {
            code: this.code,
            message: this.message,
            data: this.data
        };
    }
    static getSuccessResponse = (message, data) => new ResponseModel(200, message, data);
    static getBadRequestResponse = () => new ResponseModel(400, "Bad Request", null);
    static getServerSideError = (message,data) => new ResponseModel(500, message, data);
    static getDataConflictError = (message,data) => new ResponseModel(409, message, data);
    static getNotFoundResponse = (message,data) => new ResponseModel(204, message, data);
}

module.exports = ResponseModel