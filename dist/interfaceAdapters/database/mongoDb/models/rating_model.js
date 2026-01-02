"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingModel = void 0;
const mongoose_1 = require("mongoose");
const rating_schema_1 = require("../schemas/rating_schema");
exports.RatingModel = (0, mongoose_1.model)("Ratings", rating_schema_1.RatingSchema);
