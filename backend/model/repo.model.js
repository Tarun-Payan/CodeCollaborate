import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    permissions: {
        type: Array,
        default: []
    }
}, {timestamps: true})

export const Repo = mongoose.model("Repo", userSchema)