"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookinModel = void 0;
const mongoose_1 = require("mongoose");
const booking_schema_1 = require("../schemas/booking_schema");
exports.BookinModel = (0, mongoose_1.model)('Bookings', booking_schema_1.BookingSchema);
