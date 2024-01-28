const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://Admin:12345@cluster0.xzob5cq.mongodb.net/Users";

const connectDB = async () => {
    try {
        const db = await mongoose.connect(uri);
        console.log(`mongodb connected ${db.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};
connectDB();

const AboutMeSchema = new mongoose.Schema({
    nombre: String,
    apellidoPaterno: String,
    apellidoMaterno: String,
    fotografia: String,
    designacion: String,
    direccion: String,
    email: String,
    numeroTelefono: String,
    informacionAdicional: String
},  { _id: false });

const CertificationSchema = new mongoose.Schema({
    titulo: String,
    descripcion: String
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
    titulo: String,
    compania: String,
    ubicacion: String,
    fechaInicio: Date,
    fechaTermino: Date,
    descripcion: String
}, { _id: false });

const EducationSchema = new mongoose.Schema({
    escuela: String,
    certificado: String,
    ciudad: String,
    fechaInicio: Date,
    fechaTermino: Date,
    descripcion: String
}, { _id: false });

const ResumeSchema = new mongoose.Schema({
    aboutMe: AboutMeSchema,
    certifications: [CertificationSchema],
    experience: [ExperienceSchema],
    education: [EducationSchema]
});

const Resume = mongoose.model('Curriculum', ResumeSchema);

app.get("/api", (req, res) => {
    res.status(200).send({ response: "api worked.." });
});

app.get("/api/curriculums", async (req, res) => {
    try {
        await Resume.find()
            .then((response) => {
                console.log(response);
                res.status(200).send({ response: response });
            })
            .catch((err) => {
                res.status(500).send({ response: err.message });
            });
    } catch (err) {
        res.status(500).send({ response: err.message });
    }
});

app.post("/api/curriculums", async (req, res) => {
    try {
        const newResume = new Resume(req.body);
        newResume.markModified('aboutMe');
        newResume.markModified('certifications');
        newResume.markModified('experience');
        newResume.markModified('education');
        console.log(newResume);
        await newResume
            .save()
            .then((response) => {
                res.status(200).send({ response: response });
            })
            .catch((err) => {
                res.status(500).send({ response: err.message });
            })
    } catch(err) {
        res.status(500).send({ response: err.message });
    }
})

app.put("/api/curriculums/:id", async (req, res) => {
    try {
        const updatedResume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).send({ response: updatedResume });
    } catch (err) {
        res.status(500).send({ response: err.message });
    }
});

app.delete("/api/curriculums/:id", async (req, res) => {
    try {
        await Resume.findByIdAndDelete(req.params.id).then((response) => {
            res.status(200).send({ response: req.params.id });
        });
    } catch (err) {
        res.status(500).send({ response: err.message });
        console.log(err);
    }
});

app.listen(8000, () => {
    console.log(`Server is running on PORT ${8000}`);
});