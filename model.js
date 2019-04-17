const { exec } = require('child_process')
const find = require('find-process')
const code = require('./codes.json')
const fkill = require('fkill')

////////////////////////////////SETTINGS/////////////////////////////////

let airfader = 'C:/ProgramData/Microsoft/Windows/"Start Menu"/Programs/AirFader/airfader.lnk'
let DME = 'C:/Windows/SysWOW64/"DME-N Network Driver.exe"'
let startCmd = `start ${airfader}`
let cmd = "AirFader.exe"

//////////////////////////////////MODEL//////////////////////////////////

class AirFader {
    async start() {
        //If not started
        if (!(await running('AirFader.exe'))) {

            //Restarting the dme driver
            await restartDme()

            //start it
            if (await execSync(startCmd)) {

                // Check its started
                if ( await running(cmd) ) {
                    return code.started
                } else {
                    return code.error
                }
            }

            // Handle unable to start error
            return code.error
        } else {

            //Handle already running
            return code.running
        }

    }
    
    async stop() {

        //if running
        if (await running(cmd)) {

            //Killing the process
            await fkill("AirFader.exe", {
                tree: true,
                force: true
            })

            //Checking that it's killed
            if (!(await running(cmd))) {
                return code.stopped
            } else {
                return code.error
            }

        } else {

            //If not running already
            return code.notRunning
        }
    }

    async restart() {
        await this.off()
        await this.on()
        return code.restarted
    }

    async status() {
        if (await running(cmd)) {
            return code.running
        } else {
            return code.notRunning
        }
    }
}

////////////////////////////FUNCTIONS//////////////////////

function delay(time) {
    setTimeout(() => {
        return true
    }, time);
}

async function running(name) {
    if ((await find('name', name)).length) {
        return true
    } else {
        return false
    }
}

async function restartDme() {
    if (await running('DME-N Network Driver.exe')) {

        //Kill DME Driver
        await fkill('DME-N Network Driver.exe', {
            tree: true,
            force: true
        })
        
        //Start DME Driver
        exec(`start ${DME}`)

        return true
    } else {
        await execSync(`start ${DME}`)
        
        return true
    }
}

function execSync(cmd) {
    //returns the error or true if no error
    return new Promise((resolve, reject) => {
        exec(cmd, (err) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                resolve(true)
            }
        })
    })
}

module.exports = AirFader