class CustomError extends Error {
    statusCode = null;
    message = null;

    constructor(statusCode, message ) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = CustomError;
