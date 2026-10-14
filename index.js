const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (_req, res) =>
  res.json({ status: "ok", service: "kubero-demo-api", version: "1.0.0" })
);

app.get("/api/hello", (req, res) =>
  res.json({ message: `Hello from Kubero on GKE, ${req.query.name || "world"}!` })
);

app.get("/api/time", (_req, res) => res.json({ now: new Date().toISOString() }));

app.post("/api/echo", (req, res) => res.json({ youSent: req.body }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`kubero-demo-api listening on port ${port}`));
