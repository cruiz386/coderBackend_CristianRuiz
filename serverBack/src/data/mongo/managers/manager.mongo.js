import { Types } from "mongoose";

class Manager {
    constructor(model) {
        this.model = model;
    }

    create = async (data) => {
        try {
            const response = await this.model.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    readAll = async () => {
        try {
            const response = await this.model.find().lean();
            return response;
        } catch (error) {
            throw error;
        }
    }

    read = async (id) => {
        try {
            const response = await this.model.findById(id).lean();
            return response;
        } catch (error) {
            throw error;
        }
    }

    update = async (id, data) => {
        try {
            const response = await this.model.findByIdAndUpdate(id, data, { new: true });
            return response;
        } catch (error) {
            throw error;
        }
    }

    destroy = async (userId, productId) => {
        try {
            console.log(`Eliminando producto: user_id=${userId}, product_id=${productId}`);
            const response = await this.model.findOneAndDelete({ user_id: userId, product_id: productId });
            console.log('Respuesta de eliminación:', response);
            return response;
        } catch (error) {
            throw error;
        }
    };

    destroyAll = async (userId) => {
        try {
            const response = await this.model.deleteMany({ user_id: userId });
            return response;
        } catch (error) {
            throw error;
        }
    }

    readCartsByUserId = async (userId) => {
        try {
            const response = await this.model.find({ user_id: userId });
            if (!response || response.length === 0) {
                console.log('No carts found for this user');
                return response;
            }
            return response;
        } catch (error) {
            console.error('Error in readByUserId:', error);
            throw error;
        }
    }


    calculateTotal = async (id) => {
        // sólo va a funcionar para carts!!!
        try {
            const total = await this.model.aggregate([
                // el método aggregate recibe como parametro un array de pasos/stages
                // cada paso es un objeto con las propiedades/operadores correspondientes a la operacion que necesito hacer en el paso
                // 1 $match productos de un usuario en el carrito
                { $match: { user_id: new Types.ObjectId(id) } },
                // 2 $lookup para popular los productos
                {
                    $lookup: {
                        foreignField: "_id",
                        from: "products",
                        localField: "product_id",
                        as: "product_id"
                    }
                },
                // 3 $replaceRoot para mergear el objeto con el objeto cero del array populado
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                { $arrayElemAt: ["$product_id", 0] },
                                "$$ROOT"
                            ]
                        }
                    }
                },
                // 4 $set para agregar la propiedad subtotal = price*quantity
                { $set: { subtotal: { $multiply: ["$quantity", "$price"] } } },
                // 5 $group para agrupar por user_id y sumar los subtotales
                { $group: { _id: "$user_id", total: { $sum: "$subtotal" } } },
                // 6 $project para limpiar el objeto (dejar sólo user_id, total y date)
                { $project: { _id: 0, user_id: "$_id", total: "$total", date: new Date() } },
                // 7 $lookup para popular los productos
                {
                    $lookup: {
                        foreignField: "_id",
                        from: "users",
                        localField: "user_id",
                        as: "user_id"
                    }
                },
                // 8 $replaceRoot para mergear el objeto con el objeto cero del array populado
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                { $arrayElemAt: ["$user_id", 0] },
                                "$$ROOT"
                            ]
                        }
                    }
                },
                // 9 $project para limpiar el objeto
                { $project: { _id: 0, user_id: 0, password: 0, age: 0, role: 0, __v: 0 } },
            ])
            return total.length > 0 ? total[0].total : 0;
        } catch (error) {
            throw error
        }
    }

    async updateItemQuantity(productId, quantity) {

        await this.model.updateOne(
            { product_id: new Types.ObjectId(productId) },
            { $set: { quantity } }
        );
    }


}

export default Manager;