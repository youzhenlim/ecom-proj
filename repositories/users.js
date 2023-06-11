const fs = require('fs');
const crypto = require('crypto');

class UsersRepository {
    constructor(filename){
        if(!filename){
            throw new Error('Creating a repository requires a filename');
        }
        this.filename = filename;
        try{
            fs.accessSync(this.filename);
        } catch (err){
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll(){
        const contents = await fs.promises.readFile(this.filename, {encoding: 'utf8'});
        const data = JSON.parse(contents);
        return data;
    }

    async create(attrs){
        attrs.id = this.randomId();

        const records = await this.getAll();
        records.push(attrs);

        await this.writeAll(records);
    }

    randomId(){
        return crypto.randomBytes(4).toString('hex');
    }

    async writeAll(records){
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }

    async getOne(id){
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }
}


