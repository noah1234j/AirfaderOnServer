const { exec } = require('child_process')
const find = require('find-process')
const code = require('./codes.json')
const fkill = require('fkill')

////////////////////////////////SETTINGS/////////////////////////////////

let airfader = 'C:/ProgramData/Microsoft/Windows/"Start Menu"/Programs/AirFader/airfader.lnk'
let startCmd = `start ${airfader}`
let cmd = "AirFader.exe"

//////////////////////////////////MODEL//////////////////////////////////

class AirFader {
    async on() {
        //If not started
        if (!(await started())) {

            //start it
            if (await execSync(startCmd) == "success") {

                // Check its started
                if ( await status() ) {
                    return code.started
                }
            }

            // Handle unable to start error
            return code.error
        } else {

            //Handle already running
            return code.running
        }

    }
    
    async off() {

        //if running
        if (await started()) {

            //Killing the process
            await fkill("AirFader.exe", {
                tree: true,
                force: true
            })

            //Checking that it's killed
            if (!(await started())) {
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
        if (await started()) {
            return code.running
        } else {
            return code.notRunning
        }
    }
}

////////////////////////////FUNCTIONS//////////////////////

async function started() {
    if ((await find('name', 'AirFader.exe')).length) {
        return true
    } else {
        return false
    }
}

function delay(time) {
    setTimeout(()=>{
        return true
    }, time)
}

function execSync(cmd) {
    //returns the error or true if no error
    return new Promise((resolve, reject) => {
        exec(cmd, (err) => {
            if (err) {
                reject(err)
            } else {
                //Waits a sec to give airfader a chance to start
                setTimeout(() => { resolve('success') }, 1500);
            }
        })
    })
}

module.exports = AirFader