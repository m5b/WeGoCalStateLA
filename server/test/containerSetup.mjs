import {MySqlContainer} from "@testcontainers/mysql";
import {createPool} from "mysql2/promise";
import {runMigrations} from "./migrateContainer.mjs";

export async function setupSQL(){
    let sqlContainer = await new MySqlContainer('mysql:8.0.36')
        .withDatabase("wegoapp")
        .withUsername("tester")
        .withUserPassword("123456")
        .start()
    const connectionURL = sqlContainer.getConnectionUri()
    await runMigrations(connectionURL, 'up')
    let connectionPool = await createPool({
        uri: connectionURL
    })
    return connectionPool

}