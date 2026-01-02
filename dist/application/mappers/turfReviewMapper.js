"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapTurfReview = void 0;
const mapTurfReview = (review, userName) => ({
    _id: review._id.toString(),
    comment: review.comment,
    createdAt: review.createdAt,
    userName,
});
exports.mapTurfReview = mapTurfReview;
