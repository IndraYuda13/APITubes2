const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "admin123!@#secretkeyAwokawokawok";

function jwtRequired(req, res, next) {
  const auth = req.headers.authorization || "";
  const [scheme, token] = auth.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token tidak ada / format salah" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY);
    req.user = { id: Number(payload.sub), role: payload.role };
    return next();
  } catch {
    return res.status(401).json({ message: "Token tidak valid / kadaluarsa" });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak. Hanya Admin." });
  }
  return next();
}

function noCache(req, res, next) {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
}

module.exports = { jwtRequired, adminOnly, noCache };