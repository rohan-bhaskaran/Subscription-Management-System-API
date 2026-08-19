const error = (err ,req, res, next) => {
    if (err.name === "ValidationError") {
        res.status(400).json({message: "Invalid input", error: err.message});
    } else if (err.name === "CastError") {
        res.status(404).json({message: "Resource not found", error: err.message});
    } else if (err.code === 11000) {
        res.status(409).json({message: "Duplicate value", error: err.message});
    } else if (err.name === "JsonWebTokenError") {
        res.status(401).json({message: "Invalid token", error: err.message});
    } else if (err.name === "TokenExpiredError") {
        return res.status(401).json({message: 'TokenExpired',code: 'TOKEN_EXPIRED',error: err.message});
    } else {
        res.status(500).json({message: "Server Error", error: err.message});
    }
}

export default error;