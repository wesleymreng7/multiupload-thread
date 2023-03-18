const ThreadController = require('./threadController');


const controller = new ThreadController(9)
    ;
(async () => {
    await controller.execute()
})()