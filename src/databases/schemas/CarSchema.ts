import { ObjectSchema } from "realm";

export const CarSchema: ObjectSchema = {
    name: "Car",
    properties: {
        _id: "string",
        placa: "string",
        cnpj: "string",
        email: "string"
    },

    primaryKey: "_id",
}