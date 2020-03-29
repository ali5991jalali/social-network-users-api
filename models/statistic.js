// Packages
const mongoose = require('mongoose');
const paginate = require('mongoose-paginate')
const timestamp = require('mongoose-timestamp');

// Setting mongoose
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const schema = mongoose.Schema;

const statisticSchema = new schema({
    containerId: { type: mongoose.Schema.Types.ObjectId },
    channelId: { type: mongoose.Schema.Types.ObjectId },
    userId: { type: mongoose.Schema.Types.ObjectId },
    interaction: { type: Number },
    lead: { type: Date },
    user: { type: Date },
    changes: [{
        from: { type: Number },
        to: { type: Number },
        time: { type: Date }
    }],
    type: { type: Number }
},
    {
        minimize: false
    }
)

// Add plugins
statisticSchema.plugin(paginate)
statisticSchema.plugin(timestamp)

const statisticModel = mongoose.model('statistic', statisticSchema, 'raychat-users-statistic');

// Index fields
statisticModel.ensureIndexes(function (err) {
    if (err)
        console.log(err);
    else
        console.log(`create statistic's indexes successfully`);
});

module.exports = statisticModel;