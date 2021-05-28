const Hapi = require("@hapi/hapi");
const path = require("path");
const inert = require("inert");
const vision = require("@hapi/vision");
const handlebars = require("handlebars");
const User = require("./models/User");
//database
require("./database");

async function init() {
  console.log("server works");
  const server = Hapi.Server({
    port: process.env.PORT || 3000,
    host: "localhost",
    routes: {
      files: {
        relativeTo: path.join(__dirname, "/public"),
      },
    },
  });

  await server.register(inert);
  await server.register(vision);

  server.views({
    engines: {
      html: handlebars,
    },
    relativeTo: __dirname,
    path: "templates",
    isCached: process.env.NODE_ENV === "production",
  });
  await server.start();
  console.log("server running on", server.info.uri);

  server.route({
    method: "GET",
    path: "/",
    handler(request, h) {
      return "<h1>SEXOO</h1>";
    },
  });

  server.route({
    method: "GET",
    path: "/about",
    handler(request, h) {
      return "about";
    },
  });

  server.route({
    method: "GET",
    path: "/page",
    handler(request, h) {
      return h.view("index.html");
    },
  });

  server.route({
    method: "GET",
    path: "/hello/{user}",
    handler(request, h) {
      console.log(request.params);
      return `Hello ${request.params.user}`;
    },
  });

  server.route({
    method: "GET",
    path: "/text.txt",
    handler(request, h) {
      return h.file("text.txt");
    },
  });

  server.route({
    method: "GET",
    path: "/name",
    handler(request, h) {
      return h.view("namepages.html", {
        name: "yeyeyeye",
      });
    },
  });

  server.route({
    method: "GET",
    path: "/products",
    handler(request, h) {
      return h.view("products.html", {
        products: [{ name: "laptop" }, { name: "laptop 2" }],
      });
    },
  });

  server.route({
    method: "GET",
    path: "/users",
    handler: async (request, h) => {
      const users = await User.find();
      console.log(users);
      return h.view("users", {
        users: users,
      });
    },
  });

  server.route({
    method: "POST",
    path: "/users",
    handler: async (request, h) => {
      const username = request.payload.username;
      const newUser = new User({ username });
      await newUser.save();
      return h.redirect().location("users");
    },
  });
}

init();
