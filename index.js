const server = require("./server");

const port = 4444;
server.listen(port, () => console.log(`server running on ${port}`));
