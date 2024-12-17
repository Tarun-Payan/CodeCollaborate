import mongoose from "mongoose";

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    isVarified: Boolean,
    varificationToken:String,
    varificationTokenExpiresAt: Date
}, {timestamps: true})

export const TempUser = mongoose.model("TempUser", schema)