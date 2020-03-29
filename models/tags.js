// Import packages
const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');;
const timestamp = require('mongoose-timestamp');

// Setting mongoose
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const schema = mongoose.Schema

// Notes schema
const tagsSchema = new schema({
    agentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    containerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    channelId: { type: mongoose.Schema.Types.ObjectId },
    title: { type: String },
    tc: { type: String },
    conversationCount: { type: Number, default: 0 },
    contactCount: { type: Number, default: 0 },
    isArchived: { type: Boolean }
}, {
        minimize: true
    }
)

// Add plugins
tagsSchema.plugin(paginate)
tagsSchema.plugin(timestamp)

// Notes model
const tasgModel = mongoose.model('tags', tagsSchema, 'raychat-tags');

module.exports = tasgModel;