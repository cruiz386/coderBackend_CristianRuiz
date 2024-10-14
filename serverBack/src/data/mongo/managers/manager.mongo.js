import mongoose from 'mongoose';
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
            const response = await this.model.find();
            return response;
        } catch (error) {
            throw error;
        }

    }

    read = async (id) => {
        try {
            const response = await this.model.findById(id);
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

    /*     destroy = async (id) => {
            try {
                const response = await this.model.findByIdAndDelete(id);
                return response;
            } catch (error) {
                throw error;
            } */

    // Este método elimina un producto específico del carrito del usuario
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
    



readCartsByUserId = async (userId) => {
    try {
        const response = await this.model.find({ user_id: userId });
        if (!response || response.length === 0) {
            console.log('No carts found for this user');
            return response;
            //throw new Error('No carts found for this user');

        }
        return response;
    } catch (error) {
        console.error('Error in readByUserId:', error);
        throw error;
    }
}
      

}


export default Manager;