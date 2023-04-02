const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});  

const packageDefinition = protoLoader.loadSync('./audience.proto');
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const audienceService = protoDescriptor.audience.AudienceService;

const client = new audienceService('localhost:50051', grpc.credentials.createInsecure());

function createAudience(name, email, phoneNum, tickets) {
    const request = { name, email, phoneNum, tickets };
    return new Promise((resolve, reject) => {
      client.createAudience(request, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.id);
        }
      });
    });
}

function getAudience(id) {
  const request = { id };
  return new Promise((resolve, reject) => {
    client.getAudience(request, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

function updateAudience(id, name, email, phoneNum) {
  const request = { id, name, email, phoneNum };
  return new Promise((resolve, reject) => {
    client.updateAudience(request, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

function deleteAudience(id) {
  const request = { id };
  return new Promise((resolve, reject) => {
    client.deleteAudience(request, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function displayMenu() {
    console.log('\na. Register new audience');
    console.log('b. Read audience data');
    console.log('c. Update audience data');
    console.log('d. Delete audience data');
}

async function main() {
  try {
    console.log('Beyond Live Ticket');
    rl.question('Enter your choice: ', (choice) => {
        switch (choice) {
          case 'a':
            rl.question('Enter name: ', (name) => {
              rl.question('Enter email: ', (email) => {
                rl.question('Enter phone number: ', (phoneNum) => {
                 rl.question('Enter the number of tickets: ', (tickets) => {
                  createAudience(name, email, phoneNum, tickets)
                    .then((id) => {
                      console.log(`Audience created with ID ${id}`);
                      rl.close();
                    })
                    .catch((err) => {
                      console.error(err);
                      rl.close();
                    });
                });
              });
            });
            });
            break;
          case 'b':
            rl.question('Enter ID: ', (id) => {
              getAudience(id)
                .then((audience) => {
                  console.log(`Audience data:\n${JSON.stringify(audience, null, 2)}`);
                  rl.close();
                })
                .catch((err) => {
                  console.error(err);
                  rl.close();
                });
            });
            break;
          case 'c':
            rl.question('Enter ID: ', (id) => {
              rl.question('Enter new name: ', (name) => {
                rl.question('Enter new email: ', (email) => {
                  rl.question('Enter new phone number: ', (phoneNum) => {
                    updateAudience(id, name, email, phoneNum)
                      .then(() => {
                        console.log(`Audience with ID ${id} has been updated`);
                        rl.close();
                      })
                      .catch((err) => {
                        console.error(err);
                        rl.close();
                      });
                  });
                });
              });
            });
            break;
            case 'd':
                rl.question('Enter ID: ', (id) => {
                    deleteAudience(id)
                    .then(() => {
                      console.log(`Audience with ID ${id} has been deleted`);
                      rl.close();
                    })
                    .catch((err) => {
                      console.error(err);
                      rl.close();
                    });
                });
                break;
              default:
                console.log('Invalid choice');
                rl.close();
            }
        });
        displayMenu();
  } catch (err) {
    console.error(err);
  }
}

main();