"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasEmail = hasEmail;
function hasEmail(entity) {
    return typeof entity.email === 'string';
}
