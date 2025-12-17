const mangoose=require('mongoose');
const connectionrequestSchema=new mangoose.Schema({
    fromUserId:{
        type:mangoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    toUserId:{
        type:mangoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        enum:{
            values:['pending','intrested','rejected','accepted','ignored'],
            Message:'status can be pending, intrested or rejected',
        }
    }
},{timestamps:true});               


connectionrequestSchema.pre('save',async function(next){
    const connectionrequest=this;   
    if(connectionrequest.fromUserId.equals(connectionrequest.toUserId)){
        throw new Error('Cannot send connection request to yourself');
    }
    next();
});

module.exports=mangoose.model('ConnectionRequest',connectionrequestSchema);