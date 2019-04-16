const code = require('./codes.json')
const Airfader = require('./model.js')
let af = new Airfader

async function controller(req, res) {
    switch (req.body.command) {
        case "start": 
            res.send(await af.start())
            break
        case "stop":
            res.send(await af.stop())
            break
        case "restart":
            res.send(await af.restart())
            break
        case "status":
            res.send(await af.status())
            break
        default:
            res.send(code.unknown)
    }
}

module.exports = controller