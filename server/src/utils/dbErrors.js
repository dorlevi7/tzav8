/**
 * Handle database errors (PostgreSQL)
 */
function handleDbError(err) {

    // 🔴 UNIQUE constraint (duplicate values)
    if (err.code === "23505") {

        const constraintMap = {
            users_username_key: "Username already exists",
            users_email_key: "Email already exists",
            users_personal_number_key: "Personal number already exists",
        };

        const message =
            constraintMap[err.constraint] || "Duplicate value";

        throw new Error(message);
    }

    // 🔴 FOREIGN KEY constraint
    if (err.code === "23503") {
        throw new Error("Invalid reference data");
    }

    // 🔴 NOT NULL constraint
    if (err.code === "23502") {
        throw new Error("Missing required field");
    }

    // 🔴 Default fallback
    throw err;
}

module.exports = handleDbError;