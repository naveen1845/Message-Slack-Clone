
export default function crudRepository(model){
    return {
        create: async function(data){
            const user = await model.create(data);
            return user;
        },
        update: async function(id, data){
            const user = await model.findByIdAndUpdate(id, data, { new : true});
            return user;
        },
        getAll: async function () {
            const allDocs = await model.find();
            return allDocs;
        },
        getById: async function (id) {
            const doc = await model.findById(id);
            return doc;
        },
        delete: async function (id) {
            const response = await model.findByIdAndDelete(id);
            return response;
        }

    }
}