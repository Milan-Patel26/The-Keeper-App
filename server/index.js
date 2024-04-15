import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(express.json());
app.use(cors());
const prisma = new PrismaClient();

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send('Access Denied');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).send('Invalid Token');
    }
};

app.get('/api/notes', verifyToken, async (req, res) => {

    const notes = await prisma.note.findMany();

    res.json(notes);
});


app.post('/api/notes', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).send('Missing fields');
    }

    try {
        const createdNote = await prisma.note.create({
            data: { title, content }
        });

        res.json(createdNote);
    } catch (err) {
        return res.status(500).send('Error creating the note');
    }

    
})

app.delete('/api/notes/:id', async (req, res) =>{
    const id = parseInt(req.params.id);

    if(!id || isNaN(id)){
        return  res.status(400).send("Invalid ID");
    }

    try{
        await prisma.note.delete({
            where: { id }
        });
        res.status(204).send();
    } catch (err) {
        return res.status(500).send('Error deleting the note');
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password){
        return res.status(400).send('Missing Fields');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const token = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).send('Incorrect password');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred while finding the user');
    }
});


app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Missing Fields');
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).send('User with this email already exists');
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
            },
        });

        console.log(`User created: name - ${name}, email - ${email}`);
        res.send("Success");

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// Keeper App by Milan Patel