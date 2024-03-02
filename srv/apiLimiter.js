import rateLimit from "express-rate-limit"

export default rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: {
    status: "fail",
    message: "Too many requests, please try again later",
  },
})
