import { isSpoofedBot } from "@arcjet/inspect";
import aj from "../arcjet.js";


export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req)
        if (decision.isDenied()) {

            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: "Limit Exceeded try again later" })
            }
            else if (decision.reason.isBot) {
                return res.status(403).json({ message: "Bot access denied" })

            } else {
                return res.status(403).json({ message: "Access Denied" })

            }
        }

        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({ message: "Spoof bot detected" })
        }
        next()

    } catch (
    e
    ) {
        console.log("Arc jet error", e)
        next();
    }

}

