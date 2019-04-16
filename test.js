let Airfader = require('./index.js')

async function main() {
    let af = new Airfader
    console.log( await af.off() )
}

main()