import mongoose from "mongoose";

export const ConnectDB = async () => {
    try {

        const { MONGO_URI } = process.env;
        if (!MONGO_URI) throw new Error("MONGO_URI not set")
        const cont = await mongoose.connect(process.env.MONGO_URI)

        console.log("Mongo DB connected" + cont.connection.host)
    } catch (e) {
        console.log("Error Mongo")
        process.exit(1);///1 means failed 0 means success

    }
}