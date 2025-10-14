const http = require("http");
const bcrypt = require("bcrypt");
const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const holocron = require("./holocron.json");
const misiones = require("./misiones.json");
let users = require("./users.json");

const Port = process.env.PORT ?? 3000;

const app = express();
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let LoggedUser = "Invitado";

app.get("/", (req, res) => {
  res.send(`
    <h1>Bienvenido ${LoggedUser}</h1>
    <h4>Elige una ruta</h4>
    <a href="/consejos" style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">
        Ver Consejos
    </a>
    <a href="/planetas" style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">
        Buscar la Estrella de la Muerte
    </a>
    <a href="/divisa" style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">
        Convertir creditos espaciales
    </a>
    <a href="/misiones" style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">
        Ver misiones
    </a>
    <a href="/login" style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">
        Registrarse
    </a>
  `);
});

app.get("/consejos", (req, res) => {
  let character =
    holocron.character[Math.floor(Math.random() * holocron.character.length)];
  res.send(`<h1>Consejos</h1>
    <img src=${JSON.stringify(
      character.img
    )} style="width: auto; height: 100px;"/>
    <h3>${JSON.stringify(character.name)}</h3>
    <p>${JSON.stringify(character.quote)}</p>
    <a href='/consejos' style="text-decoration: none; color: black; padding: 5px; background-color: lightblue; margin: 5px;">Preguntar a otro</a>
    <a href='/' style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">Volver</a>`);
});

let planetIndex = 0;
let limit = holocron.planet.length - 1;
let visits = 0;
app.get("/planetas", (req, res) => {
  planetIndex = 0;
  visits = 0;
  res.redirect(`/planetas/${planetIndex}`);
});
app.get("/planetas/:index", (req, res) => {
  let index = parseInt(req.params.index);
  visits++;
  if (index == limit) {
    res.send(`<h1>Busca la Estrella de la Muerte</h1>
    <h2>Espacio Profundo</h2>
    <img src=${JSON.stringify(
      holocron.planet[limit].img
    )} style="width: auto; height: 100px;"/>
    <br/>
    <p>Visitas: ${visits}</p>
    <a href="/planetas/${limit}" 
       style="text-decoration: none; color: black; padding: 5px; background-color: lightblue; margin: 5px;">
      Saltar al hiperespacio
    </a>
    <a href='/' style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">Volver</a>`);
  } else {
    let planet = holocron.planet[index];

    res.send(`<h1>Busca la Estrella de la Muerte</h1>
    <h2>Planeta actual: <strong>${planet.name}</strong></h2>
    <img src=${JSON.stringify(planet.img)} style="width: auto; height: 100px;"/>
    <br/>
    ${
      planet.name === "Estrella de la Muerte"
        ? `<h3>Esa no es una Luna, es una estación espacial 😮</h3>`
        : ""
    }
    <p>Viajes: ${visits}</p>
    <a href="/planetas/${index + 1}" 
       style="text-decoration: none; color: black; padding: 5px; background-color: lightblue; margin: 5px;">
      Saltar al hiperespacio
    </a>
    <a href='/' style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">Volver</a>`);
  }
});

app.get("/divisa", (req, res) => {
  const cantidad = req.query.cantidad || 0;
  if (cantidad > 0) {
    return res.send(`<h1>Convertir creditos espaciales</h1>
      <form action="/divisa" method="GET">
        <input type="number" name="cantidad" id="cantidad" placeholder="Cantidad" value="${cantidad}" required>
      <button type="submit" style="background-color: lightblue; border: none; padding: 3px;">Convertir</button>
      </form>
      <h3>Son ${cantidad * 4} dolares</h3>
      <a href='/' style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">Volver</a>`);
  }
  res.send(`<h1>Convertir creditos espaciales</h1>
    <form action="/divisa" method="GET">
      <input type="number" name="cantidad" id="cantidad" placeholder="Cantidad" required>
      <button type="submit" style="background-color: lightblue; border: none; padding: 3px;">Convertir</button>
    </form>
    <a href='/' style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">Volver</a>`);
});

app.get("/misiones", (req, res) => {
  res.send(
    `<h1>Misiones Rebeldes</h1>
    <h3>Añadir nueva mision</h3>
    <form action="/misiones" method="POST">
        <input type="text" name="title" placeholder="Titulo" required />
        <input type="text" name="description" placeholder="Descripcion" required />
        <input type="number" name="reward" placeholder="Recompensa" required />
        <input type="text" name="state" placeholder="Estado" required />
        <button type="submit" style="text-decoration: none; color: black; padding: 5px; background-color: lightblue; margin: 5px;border: none;">Enviar</button>
    </form>
    <a href='/' style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">Volver</a>
    <hr/>
    ${[...misiones]
      .reverse()
      .map((mision) => {
        return `<article data-id="${mision.id}">
              <h2>${mision.title}</h2>
              <p>${mision.description}</p>
              <p>Recompensa: ${mision.reward} créditos</p>
              <p>Estado: ${mision.state}</p>
              <form action='/misiones/${mision.id}?_method=PATCH' method='POST' style='display: inline;'>
              <button type='submit' style='border: none; background-color: lightgreen; padding: 5px; margin: 5px; cursor: pointer;'>Hecho</button>
              </form>
              <form action='/misiones/${mision.id}?_method=DELETE' method='POST' style='display: inline;'>
              <button type='submit' style='border: none; background-color: #ff6b6b; padding: 5px; margin: 5px; cursor: pointer;'>Borrar</button>
              </form>
            </article> 
            <hr/>`;
      })
      .join("")}`
  );
});

app.post("/misiones", (req, res) => {
  const { title, description, reward, state } = req.body;

  const nuevaMision = {
    id: misiones.length + 1,
    title,
    description,
    reward,
    state,
  };
  misiones.push(nuevaMision);
  res.redirect("/misiones");
});

app.patch("/misiones/:id", (req, res) => {
  const { id } = req.params;

  const indice = misiones.findIndex((mision) => mision.id === parseInt(id));
  if (indice !== -1) {
    misiones[indice].state = "Terminado";
    res.redirect("/misiones");
  }
});

app.delete("/misiones/:id", (req, res) => {
  const { id } = req.params;

  const indice = misiones.findIndex((mision) => mision.id === parseInt(id));
  if (indice !== -1) {
    misiones.splice(indice, 1);
    res.redirect("/misiones");
  }
});

app.get("/login", (req, res) => {
  res.send(
    `<h1>Ingreso de padawan</h1>
    <form action="/login" method="POST">
        <input type="text" name="username" placeholder="Nombre" required />
        <input type="password" name="password" placeholder="Contraseña" required />
        <button type="submit" style="text-decoration: none; color: black; padding: 5px; background-color: lightblue; margin: 5px;border: none;">Enviar</button>
    </form>
    <a href='/' style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">Volver</a>
    <a href='/register' style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">Crear usuario Padawan</a>`
  );
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);

  if (user) {
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if (isMatch) {
        LoggedUser = username;
        res.redirect("/");
      } else {
        res.send(
          `<h3>Contraseña incorrecta</h3>
          <a href='/login' style='text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;'>Volver</a>`
        );
      }
    } catch (error) {
      console.error("Error al verificar la contraseña:", error);
      res.status(500).send("Error interno del servidor");
    }
  } else {
    res.send(
      `<h3>Usuario no encontrado</h3>
      <a href='/login' style='text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;'>Volver</a>`
    );
  }
});

app.get("/register", (req, res) => {
  res.send(
    `<h1>Registro de padawan</h1>
    <form action="/register" method="POST">
        <input type="text" name="username" placeholder="Nombre" required />
        <input type="password" name="password" placeholder="Contraseña" required />
        <button type="submit" style="text-decoration: none; color: black; padding: 5px; background-color: lightblue; margin: 5px;border: none;">Enviar</button>
    </form>
    <a href='/' style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">Volver</a>
    <a href='/login' style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">Ingresar con usuario</a>`
  );
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username);

    if (user) {
      return res.send(
        `<h3>Usuario ya registrado</h3>
            <a href='/register' style='text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;'>Reintentar</a>
            <a href='/login' style='text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;'>Ingresar</a>`
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      username,
      password: hashedPassword,
      descodificado: password,
    };

    users.push(newUser);

    LoggedUser = username;
    res.redirect("/");
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).send("Error al registrar el usuario");
  }
});

app.use((req, res) => {
  res.status(404).send(`<h1>404</h1>
        <h4>Este no es el <del>androide</del> página que estas buscando</h4>
        <img src='https://img.icons8.com/?size=1200&id=46767&format=png' style="width: 100px; height: 100px;" />
        <a href='/' style="text-decoration: none; color: black; padding: 5px; background-color: lightgrey; margin: 5px;">Volver</a>`);
});

const server = http.createServer(app);

server.listen(Port, () => {
  console.log(`Servidor escuchando en http://localhost:${Port}`);
});
