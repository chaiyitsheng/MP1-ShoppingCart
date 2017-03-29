var mongoose = require('mongoose');

// var OrderSchema = new mongoose.Schema({
//     odCode: String,
//     odUser: {},
//     odTotal: Number,
//     odController: {
//         odToken: String,
//         odStatus: String
//     },
//     odShip: {
//         odShipWayBillBarcode: String,
//         odShipWayBillDate: String,
//         odShipOutDate: String,
//         odTotalWeight: Number,
//         odCost: Number,
//         odWeightCode: String,
//         odZone: String,
//         odWeightBand: Number
//     },
//     odCart: [],
//     odCartTotalAmount: Number,
//     odPayStatus: {},
//     odPayObj: {
//         odDate: String,
//         odPayMethod: String,
//         odPayDate: String,
//         odCardType: String,
//         odCardNumber: String,
//         odCVVC: String
//     }
// });

var OrderSchema = new mongoose.Schema({
    odCode: String,
    uuidv1: String,
    odCreationDate: String,
    odUser: {},
    odTotal: Number,
    odCart: [],
    odCartTotalAmount: Number,
    controlObj: {
        odToken: String,
        odStatus: String
    },
    odShip: {
        odShipWayBillBarcode: String,
        odShipWayBillDate: String,
        odShipOutDate: String,
        odTotalWeight: Number,
        odCost: Number,
        odWeightCode: String,
        odZone: String,
        odWeightBand: Number
    },
    odPayObj: {}
});


// var OrderSchema = new mongoose.Schema({
// odStatus:String,
// odWayBill:{odBarcode:String,odWayBillDate:String},
// odUser:{},   
// odc:String,
// odcc:[],
// odccc:Number,
// odcccc:{
// odDate: String,
// odPayMethod:String,
// odPayDate:String,
// odCardType:String,
// odCardNumber:String,
// odCVVC:String    
// }
// });

OrderSchema.methods.toJSON = function() {
    var order = this.toObject();
    return order;
};

var OrderCounterSchema = new mongoose.Schema({
    incrementId: String,
    seq: Number
});

var Ordercounter = mongoose.model('OrderCounter', OrderCounterSchema);


OrderSchema.pre('save', function(next) {
    var doc= this;
    Ordercounter.findOneAndUpdate({
        'incrementId': 'order'
    }, {
        $inc: {
            seq: 1
        }
    }, function(err, item) {
     doc.odCode=item.seq;
     next();
    })
})


module.exports = mongoose.model('Order', OrderSchema);