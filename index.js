const find = require('find-process')
const fkill = require('fkill')
const opn = require('opn')

//Settings
let exe = "AirFader.exe"
let ploc = `C:\\Users\\noaha\\Desktop\\${exe}`

class AirFader {
    status() {
        return new Promise((res, rej) => {
            find("name", exe)
            .then((list) => {
                if (list[0]) {
                    console.log( `${exe} is running` )
                    res("on")
                } else {
                    console.log(`${exe} is off`)
                    res("off")
                }
            })
            .catch ((err) => {
                rej(err)
            })
        })
    }

    on() {
        opn(ploc)
        return "on"
    }
    
    off() {
        return new Promise ((res, rej) => {
            fkill(exe)
            .then(() => {
                console.log(`killed ${exe}`)
                res(true)
            }) 
            .catch ((err) => {
                console.log("Error or process not running")
                rej(false)
            })
        })
    }

    async restart() {
        try {
            await this.on()
            await this.off()
            return true
        } catch (err) {
            return err
        }
    }
}

async function main() {
    let af = new AirFader
    console.log( await af.off() )
}

main()