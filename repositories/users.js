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

        return attrs;
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

    async delete(id){
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs){
        const records = await this.getAll();
        const record = records.find(record => record.id === id );

        if(!record){
            throw new Error(`Record with id ${id} not found`);
        }

        else{
            Object.assign(record, attrs);
            await this.writeAll(records);
        }
    }

    async getOneBy(filters){
        const records = await this.getAll();
        for(let record of records){
            let found = true;
                for (let key in filters){
                    if (record[key] !== filters[key]){
                        found = false
                    }
                }
            if(found){
                return record;
            }
        }
    }
}

// Instead of exporting a class, we export an instance so
// that all the methods can be called immediately 
// more importantly all changes will be made to one file (users.json)
// which prevents multiple places of storage by accident
module.exports = new UsersRepository('users.json');





