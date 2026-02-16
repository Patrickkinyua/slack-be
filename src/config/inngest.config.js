
import { Inngest } from "inngest";
import { connectDB } from "./db.config.js";
import { User } from "../models/user.model.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "slack-clone" });

const syncUser  = inngest.createFunction(
    {id: "sync-user", name: "Sync User"},
    {event: "clerk/user.created" },
    async ({event}) => {
        console.log("Syncing user", event.data)

        connectDB()

        const {id , email_addresses, first_name ,last_name ,image_url} = event.data

        const newuser = {clerkId:id,
            email:email_addresses[0]?.email_address,
            name:`${first_name || ''} ${last_name || ""}`,
            image:image_url,
        }

        await User.create(newuser); 
    }
);

const deleteUserFromDB = inngest.createFunction(
    {id:"delete-user-from-db"},
    {event: "clerk/user.deleted"},
    async ({event} ) => {
        connectDB()
        const {id} = event.data
        await User.deleteOne({clerkId:id});
    }
);


// Create an empty array where we'll export future Inngest functions
export const functions = [syncUser,deleteUserFromDB];