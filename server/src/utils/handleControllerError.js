/**
 * Global controller error handler
 */
function handleControllerError(err, res, context = "Unknown error") {

    console.error(`${context}:`, err);

    // 🟢 Known business errors
    if (err instanceof Error && err.message) {
        return res.status(err.status || 400).json({
            error: err.message
        });
    }

    // 🔴 Unexpected / system errors
    return res.status(500).json({
        error: "Server error"
    });
}

module.exports = handleControllerError;