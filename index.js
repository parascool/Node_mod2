const fs = require('fs');
const yargs = require('yargs');


const dir = './files';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}


function writeToFile(filename) {
    fs.writeFile(`./files/${filename}`, 'You are awesome', (err) => {
        if (err) {
            console.log("Fails to create files", err);
        }
        console.log(`File ${filename} created successfully.`);
        fs.appendFile('./filenames.txt', `${filename}\n`, (err) => {
            if (err) throw err;
            console.log('Filename appended to the list.');
        });
    });
}


function readFilenames(callback) {
    fs.readFile('./filenames.txt', 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.writeFile('./filenames.txt', '', (err) => {
                    if (err) throw err;
                });
                callback([]);
            } else {
                throw err;
            }
        } else {
            const filenames = data.trim().split('\n');
            callback(filenames);
        }
    });
}

yargs.command({
    command: 'create',
    describe: 'Create a new file with a given filename',
    builder: {
        filename: {
            describe: 'Name of the file to create',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        readFilenames((filenames) => {
            if (filenames.includes(argv.filename)) {
                console.log('File already exists. Please provide a new filename.');
            } else {
                writeToFile(argv.filename);
            }
        });
    }
});

yargs.parse();

// Posted on Github sucessfully.
// use :- node index.js create --filename project.html