const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(301, `https://${req.hostname}${req.url}`);
  }
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  next();
});
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: process.env.NODE_ENV === "production" ? "30d" : "0",
    etag: true,
    lastModified: true,
  }),
);
app.use((req, res, next) => {
  if (req.path.slice(-1) === "/" && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    return res.redirect(301, req.path.slice(0, -1) + query);
  }
  next();
});
app.get("/", (req, res) => {
  res.render("index");
});
app.use((req, res) => {
  res.status(404).render("index");
});
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`[SERVER] 🚀 Server jalan di http://localhost:${PORT}`);
    console.log(`[SEO]    📋 Sitemap: http://localhost:${PORT}/sitemap.xml`);
    console.log(`[SEO]    🤖 Robots:  http://localhost:${PORT}/robots.txt`);
  });
}
module.exports = app;
