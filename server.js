const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://guest-list.firebaseio.com'
});

const packageDefinition = protoLoader.loadSync('./audience.proto');
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const audienceService = protoDescriptor.audience.AudienceService;

function createAudience(call, callback) {
  const data = call.request;
  const collection = admin.firestore().collection('audiences');
  collection.add(data)
    .then((doc) => {
      callback(null, { id: doc.id });
    })
    .catch((err) => {
      callback(err);
    });
}

function getAudience(call, callback) {
  const id = call.request.id;
  const collection = admin.firestore().collection('audiences');
  collection.doc(id).get()
    .then((doc) => {
      if (doc.exists) {
        callback(null, doc.data());
      } else {
        callback({ code: grpc.status.NOT_FOUND, details: 'Not found' });
      }
    })
    .catch((err) => {
      callback(err);
    });
}

function updateAudience(call, callback) {
  const data = call.request;
  const collection = admin.firestore().collection('audiences');
  collection.doc(data.id).update(data)
    .then(() => {
    callback(null, {});
  })
  .catch((err) => {
    callback(err);
  });
}

function deleteAudience(call, callback) {
  const id = call.request.id;
  const collection = admin.firestore().collection('audiences');
  collection.doc(id).delete()
    .then(() => {
    callback(null, {});
  })
  .catch((err) => {
    callback(err);
  });
}

function main() {
const server = new grpc.Server();
server.addService(audienceService.service, {
  createAudience: createAudience,
  getAudience: getAudience,
  updateAudience: updateAudience,
  deleteAudience: deleteAudience
});

server.bindAsync(
    "127.0.0.1:50051",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      console.log("Server running at http://127.0.0.1:50051");
      server.start();
    }
  )
}

main();