import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get token from header
      token = req.headers.authorization.split(" ")[1];

      //Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Get user from the token
      req.user = decoded.id;

      next();
    } catch (error) {
      res.send("Authorization failed: " + error.message);
    }
  }
  if (!token) {
    res.send("Not authorized, no token");
  }
};

export { protect };
