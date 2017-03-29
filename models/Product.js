var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    uuidv1: String,
    pdCode: String,
    pdOptions:[],
    controlObj: {},
    // pdChanged:Boolean,
    infoObj: {
        pdName: String,
        pdCodeUpc: String,
        pdCategory: String,
        pdSubCategory: String,
        pdAvailableQty: Number,
        pdRetailPrice: Number,
        pdSellingPrice: Number,
        pdCostPrice: Number,
        pdShipWeight: {
            actual: Number,
            length: Number,
            width: Number,
            height: Number
        },
        pdSize: {
            measure: {
                weight: String,
                volume: String,
                size: String
            },
            measureOptions: {}
        },
        pdExpiryDate: String,
        pdMfgDate: String,
        pdCreationDate: String,
        pdCreatorId: String,
        pdImages: {
            pdImg1: String,
            pdImg2: String,
            pdImg3: String,
            pdImg4: String,
            pdImg5: String,
            pdImg6: String,
            pdImg7: String,
            pdImg8: String
        },
        pdDescription: {
            text: String
        },
        pdFinePrint: {
            text: String
        },
        pdShippingInfo: {
            text: String
        },
        pdCollectionInfo: {
            text: String
        },
        pdWarranty: {
            text: String
        },
        pdOverview: {
            text: String
        },
        pdOptions: []
    }
});

ProductSchema.methods.toJSON = function() {
    var product = this.toObject();
    return product;
};

var ProductCounterSchema = new mongoose.Schema({
    incrementId: String,
    seq: Number
});

var Productcounter = mongoose.model('ProductCounter', ProductCounterSchema);


ProductSchema.pre('save', function(next) {
    var doc= this;
    Productcounter.findOneAndUpdate({
        'incrementId': 'product'
    }, {
        $inc: {
            seq: 1
        }
    }, function(err, item) {
     doc.pdCode=item.seq;
     next();
    })
})


module.exports = mongoose.model('Product', ProductSchema);