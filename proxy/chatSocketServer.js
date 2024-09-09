const express = require("express");
const app = express();
const cors = require("cors");
const {createProxyMiddleware} = require("http-proxy-middleware");

const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true
};

app.use(cors(corsOptions));

app.use("/", createProxyMiddleware({
  target: 'http://localhost:5265',
  changeOrigin: true,
  ws: true,
  secure: false,
  onProxyReq: (proxyReq, req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
}));

port = 3000;

app.listen(port, () => console.log('Proxy Hub Server started on port ' + port));
