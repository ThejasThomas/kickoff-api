"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDateTime = void 0;
const toDateTime = (date, time) => {
    return new Date(`${date}T${time}:00`);
};
exports.toDateTime = toDateTime;
