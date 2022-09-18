const FileController = require('./fileController');


const controller = new FileController(9)
;
(async() => {
    await controller.execute()
})()