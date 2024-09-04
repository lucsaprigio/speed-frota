import Realm from "realm";
import { CarSchema } from "./schemas/CarSchema";

export const getRealm = async () => await Realm.open({
    path: "speed-app",
    schema: [CarSchema]
});