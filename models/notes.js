// Import packages
const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');;
const timestamp = require('mongoose-timestamp');

// Setting mongoose
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const schema = mongoose.Schema

// Notes schema
const notesSchema = new schema({
    userId: { type: mongoose.Schema.Types.ObjectId },
    agentId: { type: mongoose.Schema.Types.ObjectId },
    containerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    channelId: { type: mongoose.Schema.Types.ObjectId },
    text: { type: String }
}, {
        minimize: true
    }
)

// Add plugins
notesSchema.plugin(paginate)
notesSchema.plugin(timestamp)

// Notes model
const notesModel = mongoose.model('notes', notesSchema, 'raychat-notes');

module.exports = notesModel;