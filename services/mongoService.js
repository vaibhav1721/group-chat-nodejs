const Promise                   = require('bluebird');

exports.mongoInsert             = mongoInsert;
exports.mongoEdit               = mongoEdit;
exports.mongoDelete             = mongoDelete;
exports.mongoFind               = mongoFind;

function mongoInsert(apiReference,opts) {
    return new Promise((resolve, reject) =>{
        db.collection(opts.collectionName).insertOne(opts.insertObj,function (err, result) {
            console.log("result of " + apiReference + " : >>>>> " + err ,result);
            if(err)
                reject(err);
            resolve(result);
        })
    })
}

function mongoFind(apiReference, opts) {
    return new Promise((resolve, reject) => {
        db.collection(opts.collectionName).find(opts.findObj).toArray(function (err, result) {
            console.log("result of " + apiReference + " : >>>>> " + err, result ,opts.findObj );
            if (err)
                reject(err)
            resolve(result);
        })
    })
}

function mongoEdit(apiReference, opts) {
    return new Promise((resolve, reject) => {
        console.log("opts" , opts);
        let updateObj = {}
        let upsert = false;
        if(opts.pushData != undefined){
            Object.assign(updateObj, {$push : opts.pushData})
        }else{
            updateObj = {
                $set : opts.updateData
            }
        }
        if(opts.upsert){
            upsert = true
;        }
        db.collection(opts.collectionName).updateOne(opts.query , updateObj,{upsert : upsert}, function (err, result) {
            console.log("result of " + apiReference + " : >>>>> " + err, result);
            if(err)
                reject(err)
            resolve(result);
        })
    })
}


function mongoDelete(apiReference, opts) {
    return new Promise((resolve, reject)=>{
        db.collection(opts.collectionName).deleteOne(opts.deleteObj, function (err, result) {
            if(err)
                reject(err)
            resolve(result)
        })
    })
}
