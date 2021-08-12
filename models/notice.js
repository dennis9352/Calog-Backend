import mongoose from 'mongoose'
import {conn} from './index.js'

export const noticeSchema = new mongoose.Schema({
    title: {
      type: String,
    },
    contents: {
      type: String,
    },
    date: {
      type: String,
    }
});
noticeSchema.virtual("noticeId").get(function () {
    return this._id.toHexString();
  });
noticeSchema.set("toJSON", {
    virtuals: true,
  });
export default conn.model('Notice', noticeSchema)