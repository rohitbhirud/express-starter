'use strict';

/**
 * Map of HTTP Status codes.
 */
var Status = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    UNSUPPORTED_ACTION: 405,
    VALIDATION_FAILED: 422,
    SERVER_ERROR: 500
};

/**
 * Helper for returning the approriate HTTP error string
 * @param status
 * @returns {string}
 */
function statusMessage(status) {
    switch (status) {
        case Status.BAD_REQUEST:
            return 'Bad Request';
        case Status.UNAUTHORIZED:
            return 'Unauthorized';
        case Status.NOT_FOUND:
            return 'Not Found';
        case Status.UNSUPPORTED_ACTION:
            return 'Unsupported Action';
        case Status.VALIDATION_FAILED:
            return 'Validation Failed';
        case Status.SERVER_ERROR:
            return 'Internal Server Error';
    }
}

/**
 * Helper for sending JSON responses
 * @param res
 * @param body
 * @param options
 */
function jsonResponse(res, body, options) {
    options = options || {};
    options.status = options.status || Status.OK;
    res.status(options.status).json(body || {msg:9'success'});
}

module.exports = function(){

    return function(req, res, next) {


        /**
         * Respond with `200 OK` and JSON-encoded data.
         * @param data Object
         */
        res.ok = function (data) {
            jsonResponse(res, data, {
                status: Status.OK
            });
        };


        /**
         * Respond with `400 Bad Request` and JSON-encoded error object, `{message:String,errors:Array}`.
         * @param errors Array (of String) or String
         */
        res.badRequest = function (errors) {
            errors = Array.isArray(errors) ? errors : [errors];

            res.Boom.badRequest(
                statusMessage(Status.BAD_REQUEST),
                errors
            );
        };


        /**
         * Respond with `401 Unauthorized` and JSON-encoded error object, `{message:String}`.
         */
        res.unauthorized = function () {

            res.Boom.unauthorized(
                statusMessage(Status.UNAUTHORIZED),
            );

        };

        /**
         * Respond with `404 Not Found` and JSON-encoded error object, `{message:String}`.
         */
        res.notFound = function () {

            res.Boom.notFound(
                statusMessage(Status.NOT_FOUND),
            );
        };

        /**
         * Respond with `405 Method Not Allowed` and JSON-encoded error object, `{message:String}`.
         */
        res.unsupportedAction = function () {

            res.Boom.methodNotAllowed(
                statusMessage(Status.UNSUPPORTED_ACTION),
            );

        };

        /**
         * Respond with `422 Unprocessable Entity` and JSON-encoded error object, `{message:String,errors:Array}`.
         * @param errors Array (of String) or String
         */
        res.invalid = function (errors) {
            errors = Array.isArray(errors) ? errors : [errors];

            res.Boom.badData(
                statusMessage(Status.VALIDATION_FAILED),
                errors
            );

        };

        /**
         * Respond with `500 Internal Server Error` and JSON-encoded error object, `{message:String,error:Object}`.
         * @param error Object
         */
        res.serverError = function (error) {
            if (error instanceof Error) {
                error = {
                    message: error.message,
                    // only send a stacktrace in development
                    stacktrace: ('development' === res.app.get('env')) ? error.stack : {}
                };
            }

            res.Boom.badImplementation(
                statusMessage(Status.SERVER_ERROR),
                error
            );

        };

        next();

    }
};