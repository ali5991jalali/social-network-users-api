// Packages
const mongoose = require('mongoose');
const paginate = require('mongoose-paginate')
const timestamp = require('mongoose-timestamp');

// Setting mongoose
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const schema = mongoose.Schema;

const raychatSchema = new schema({
    email: { type: String },
    name: { type: String },
    type: { type: Number },
    status: {
        type: Number,
        default: 2
    },
    channelId: { type: mongoose.Schema.Types.ObjectId },
    hidden: { type: Number },
    containerId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    conversationId: { type: Array, default: [] },
    tags: { type: Array },
    notes: { type: Array },
    options: { type: 'Mixed' },
    meta: { type: 'Mixed' }
},
    {
        minimize: false
    }
)

// Add plugins
raychatSchema.plugin(paginate)
raychatSchema.plugin(timestamp)

const raychatModel = mongoose.model('raychat', raychatSchema, 'raychat-users');

// Index fields
raychatModel.ensureIndexes(function (err) {
    if (err)
        console.log(err);
    else
        console.log(`create user's indexes successfully`);
});

module.exports = raychatModel;