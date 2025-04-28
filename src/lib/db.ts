import { invalidateAll } from "$app/navigation";
import type { UserProgram } from "./schema";

export class Database {
    private static instance: Database;
    db: IDBDatabase | undefined;

    private constructor(resolve: (db: Database) => void) {
        const DBOpenRequest: IDBOpenDBRequest = indexedDB.open("gym", 1);
        DBOpenRequest.onerror = (event) => {
            console.error("DBOpenRequest.onerror", event);
        };

        DBOpenRequest.onsuccess = (event) => {
            this.db = DBOpenRequest.result;
            console.log("resolved");
            resolve(this)
        };

        DBOpenRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            this.db = DBOpenRequest.result;

            this.db.onerror = (event) => {
                console.log('Error loading database.');
            };
            this.migrate(DBOpenRequest.result, event.oldVersion, event.newVersion ?? undefined);
        };
    }

    public static getInstance(): Promise<Database> {
        return new Promise<Database>((resolve, reject) => {
            if (!Database.instance) {
                Database.instance = new Database(resolve);
            } else {
                resolve(Database.instance);
            }
        })
    }

    private migrate(db: IDBDatabase, oldVersion: number, newVersion?: number) {
        for (let start = oldVersion; start <= (newVersion ?? oldVersion); start++) {
            switch (start) {
                case 0:
                    this.initSchema(db);
                    break;
                case 1:
                default:
                    break;
            }
        }

    }

    private initSchema(db: IDBDatabase) {
        db.createObjectStore('user_programs', { keyPath: 'id', autoIncrement: true });
    }

}

export const userProgamsRepo = {
    getAllUserPrograms: async (db: IDBDatabase): Promise<UserProgram[]> => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("user_programs", "readonly");
            const objectStore = transaction.objectStore("user_programs").getAll();

            objectStore.onsuccess = () => {
                resolve(objectStore.result as UserProgram[]);
            };

            objectStore.onerror = (event) => {
                reject(new Error("Failed to fetch user programs: " + event.target));
            };
        });
    },


    insertUserProgram: (db: IDBDatabase, data: UserProgram) => {
        return new Promise((resolve, reject) => {
            console.log("INSERTING", JSON.parse(JSON.stringify(data)));
            const transaction = db.transaction("user_programs", "readwrite");
            const result = transaction.objectStore("user_programs").put(JSON.parse(JSON.stringify(data)));
            result.onerror = (event) => {
                console.log("Failed to insert user program...", event.target);
                reject(event);
            }
            result.onsuccess = () => {
                // console.log("User program inserted", event?.target.result);
                resolve("OK");
            }

        })
    },

    deleteUserProgram: (db: IDBDatabase, id: number) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("user_programs", "readwrite");
            const result = transaction.objectStore("user_programs").delete(id);
            result.onerror = (event) => {
                console.log("Failed to delete user program...", event);
                reject("NOT OK");
            }
            result.onsuccess = () => {
                console.log("User program deleted");
                resolve("OK")
            }
        });
    }
}