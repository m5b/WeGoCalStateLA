import usernameGenerator from "../util/usernameGenerator.mjs";

const LOW_STOCK = 200;
const REFILL_STOCK = 1000;
const GEN_MULTIPLIER = 1.3;

export async function refillLow(db) {
    const [[countRow]] = await db.query(
        "SELECT COUNT(*) AS available FROM anonymous_name WHERE taken = 0"
    );

    if (countRow.available >= LOW_STOCK) return;

    const [[lockRow]] = await db.query(
        "SELECT GET_LOCK('anon_name_refill', 0) AS got_lock"
    );
    if (lockRow.got_lock !== 1) return;

    try {
        let insertedTotal = 0;

        while (insertedTotal < REFILL_STOCK) {
            const remaining = REFILL_STOCK - insertedTotal;
            const toGenerate = Math.ceil(remainin * GEN_MULTIPLIER);

            const names = [];
            for (let i = 0; i < toGenerate; i++) {
                names.push(usernameGenerator());
            }

            const values = names.map((n) => [null, n, 0]);
            const [result] = await db.query(
                "INSERT IGNORE INTO anonymous_name (user_id, anonymous_name, taken) VALUES ?",
                [values]
            );

            insertedTotal += result.affectedRows;
        }
    } finally {
        await db.query("SELECT RELEASE_LOCK('anon_name_refill')");
    }
}

export async function assignAnonymous(userId) {
    const connection = await connectionPool.getConnection();

    try {
        await connection.beginTransaction();

        const nameRow = await anonymousRepo.getAvailableAnonymousName(connection);

        if (!nameRow) {
            throw new Error("No anonymous names available");
        }

        await anonymousRepo.assignAnonymousNameToUser(connection, nameRow.id, userId);

        await connection.commit();

        return nameRow.anonymous_name;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}
