import nodemailer from "nodemailer";
import express from 'express';
import fs, { readFileSync } from "fs";
import bodyParser from 'body-parser';
import cors from 'cors';



const app = express();
const contactTemplate = fs.readFileSync('template/contacto.html', 'utf-8');

app.use(cors({
    origin: '*', // Permitir todas las solicitudes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Permitir los métodos especificados
    allowedHeaders: ['Content-Type', 'Authorization'], // Permitir los encabezados especificados
    credentials: true // Permitir cookies
}));

app.use(bodyParser.json());

const readData = () => {

    try {
        const data = readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};
app.get("/", (req, res) => {
    res.send("welcome to my first API with node js!");
});


app.get("/books", (req, res) => {
    const data = readData();
    res.json(data.books);
});

app.get("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const book = data.books.find((book) => book.id === id);
    res.json(book);
});


app.post("/books", (req, res) => {
    const data = readData();
    const body = req.body;
    const newBook = {
        id: data.books.length + 1,
        ...body,
    };
    data.books.push(newBook);
    writeData(data);
    res.json(newBook);
});


app.post("/contacto", (req, res) => {
    console.log(req.body);
    const content = contactTemplate
    .replace('@{nombre}', req.body.nombre)
    .replace('@{email}', req.body.email)
    .replace('@{celular}', req.body.celular)
    .replace('@{mensaje}', req.body.mensaje);
    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'zamguio2623@gmail.com',
            pass: 'uhhp apny bnrf xckd'
        }
    }

    const mensaje = {
        from: 'distribuidorapc2022@gmail.com',
        to: 'distribuidorapc2022@gmail.com',
        subject: 'Cotización Urgente¡',
        html: content
    }

    const transport = nodemailer.createTransport(config);

    //const info = await transport.sendMail(mensaje);
    transport.sendMail(mensaje, function(error,info){
        if(error){
            console.log(error);
        }
        else {
            console.log('correo enviado exitosamente');
        }
    });

    //console.log(info);
    res.json({codigo: 1, mensaje: 'correo enviado'})
})


app.put("/books/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books[bookIndex] = {
        ...data.books[bookIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "Libro agregado con exito" });
});

app.delete("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books.splice(bookIndex, 1);
    writeData(data);
    res.json({ message: "Libro borrado con exito" })
});

let port = process.env.PORT || 80;

app.listen(port, () => {
    console.log('server listening on port: ' + port);
});


