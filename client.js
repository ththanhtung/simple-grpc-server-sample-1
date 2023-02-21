const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('todo.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObj.todoPackage;

const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure())
client.createTodo({
    "id": -1,
    "text": "coding"
}, (err, resp)=>{
    console.log("received from server", JSON.stringify(resp));
})

client.readTodos({}, (err, resp) => {
//   console.log('received from server 2', JSON.stringify(resp));
    if (!resp.items){
        resp.items.forEach(todo => {
          console.log(todo.text);
        });
    }
});

const call = client.readTodosStream()

call.on('data', item => {
    console.log('received from server', JSON.stringify(item));
})

call.on('end', (e)=>{
    console.log('server done');
})