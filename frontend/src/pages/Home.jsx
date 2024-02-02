import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Snackbar,
    TextField,
    Typography,
    Divider,
    Stack
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCurriculums,
    addCurriculum,
    removeCurriculum,
    modifyCurriculum,
    changeStateTrue,
    changeStateFalse,
} from "../features/curriculumSlice";
import { useEffect } from "react";
import { imageDb } from "../config/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Home() {
    const dispatch = useDispatch();
    const { loading, curriculumList, error, updateState, response } = useSelector(
        (state) => state.curriKey
    );
    const [id, setId] = useState("");

    const [previewUrl, setPreviewUrl] = useState(null);

    const fileInput = useRef(null);

    const [image, setImage] = useState("");

    const storage = getStorage();

    const [aboutMeData, setAboutMeData] = useState({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        fotografia: null,
        designacion: "",
        direccion: "",
        email: "",
        numeroTelefono: "",
        informacionAdicional: "",
    });

    const [certificationData, setCertificationData] = useState({
        titulo: "",
        descripcion: ""
    });

    const [experienceData, setExperienceData] = useState({
        titulo: "",
        compania: "",
        ubicacion: "",
        fechaInicio: "",
        fechaTermino: "",
        descripcion: ""
    });

    const [educationData, setEducationData] = useState({
        escuela: "",
        certificado: "",
        ciudad: "",
        fechaInicio: "",
        fechaTermino: "",
        descripcion: ""
    });

    const [informationData, setInformationData] = useState({
        web: "",
        numeroContacto: "",
        ciudad: "",
    });

    const [redesData, setRedesData] = useState({
        facebook: "",
        linkedin: "",
        insta: "",
        twitter: "",
        github: "",
    })

    const [showTable, setShowTable] = useState(true);

    useEffect(() => {
        dispatch(fetchCurriculums());
    }, [dispatch]);

    const handleClick = async (e) => {
        e.preventDefault();
        console.log(aboutMeData);
        console.log(certificationData);
        console.log(experienceData);
        console.log(educationData);

        dispatch(
            addCurriculum({
                aboutMe: aboutMeData,
                certifications: certifications,
                experience: experiences,
                education: [educationData],
                information: [informationData],
                redes: [redesData],
            })
        );

        await handleUploadImage(aboutMeData.nombre);

        handleClickSnackbar();
        setAboutMeData({ /* reset values */ });
        setCertificationData({ /* reset values */ });
        setExperienceData({ /* reset values */ });
        setEducationData({ /* reset values */ });
        setInformationData({});
        setRedesData({});
        setCertifications([{ titulo: "", descripcion: "" }]);
        setExperiences([{
            titulo: "",
            compania: "",
            ubicacion: "",
            fechaInicio: "",
            fechaTermino: "",
            descripcion: ""
        }]);
        setShowTable(true);
    };

    const updateCurriculum = async (item) => {
        setId(item._id);
        setAboutMeData(item.aboutMe);
        try {
            const fileRef = ref(storage, "images/" + item.aboutMe.nombre + ".jpg");
            const url = await getDownloadURL(fileRef);
            console.log(url);
            setPreviewUrl(url);
        } catch (error) {
            console.error(error);
            setPreviewUrl(null);
        }

        setCertificationData(item.certifications);
        setExperienceData(item.experience);
        setEducationData(item.education[0]);
        setInformationData(item.information[0]);
        setRedesData(item.redes[0]);
        setShowTable(false);
        dispatch(changeStateTrue());
        setCertifications(item.certifications);
        setExperiences(item.experience);
    };


    const updateForm = () => {
        dispatch(modifyCurriculum({
            id: id,
            aboutMe: aboutMeData,
            certifications: certifications,
            experience: experiences,
            education: [educationData],
            information: [informationData],
            redes: [redesData],
        }));
        dispatch(changeStateFalse());
        handleClickSnackbar();
        setId("");
        setAboutMeData({ /* reset values */ });
        setCertificationData({ /* reset values */ });
        setExperienceData({ /* reset values */ });
        setEducationData({ /* reset values */ });
        setInformationData({});
        setRedesData({});
        setCertifications([{ titulo: "", descripcion: "" }]);
        setExperiences([{
            titulo: "",
            compania: "",
            ubicacion: "",
            fechaInicio: "",
            fechaTermino: "",
            descripcion: ""
        }]);
        setShowTable(true);
        console.log(certifications);
    };


    const deleteCurriculum = (id) => {
        dispatch(removeCurriculum(id));
        handleClickSnackbar();
    };

    const [open, setOpen] = useState(false);
    const handleClickSnackbar = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeImage = async (event) => {
        const file = event.target.files[0];
        setImage(event.target.files[0]);
        const reader = new FileReader();

        reader.onloadend = () => {
            const arrayBuffer = reader.result;
            setAboutMeData({
                ...aboutMeData,
                fotografia: arrayBuffer,
            });
        };

        reader.readAsArrayBuffer(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUploadImage = async (name) => {
        try {
            const fileRef = ref(storage, "images/" + name + ".jpg");

            const response = await uploadBytes(fileRef, image);
            const imageUrl = await response.ref.getDownloadURL();

            setPreviewUrl(imageUrl);

            // Guarda la URL de la imagen en la base de datos
            // (Modifica esta parte según tu lógica de guardado en la base de datos)
            await dispatch(updateCurriculum({ ...aboutMeData }));
        } catch (error) {
            console.error(error);
            // Maneja el error de la subida
        }
    };

    const handleClickImage = () => {
        fileInput.current.click();
    };

    const [certifications, setCertifications] = useState([{ titulo: "", descripcion: "" }]);

    const handleAddCertification = () => {
        setCertifications([...certifications, { titulo: "", descripcion: "" }]);
    };

    const handleCertificationChange = (index, field, value) => {
        const newCertifications = [...certifications];
        newCertifications[index][field] = value;
        setCertifications(newCertifications);
    };

    const handleRemoveCertification = (index) => {
        const newCertifications = [...certifications];
        newCertifications.splice(index, 1);
        setCertifications(newCertifications);
    };


    const [experiences, setExperiences] = useState([{
        titulo: "",
        compania: "",
        ubicacion: "",
        fechaInicio: "",
        fechaTermino: "",
        descripcion: ""
    }]);

    const handleExperienceChange = (index, field, value) => {
        const newExperiences = [...experiences];
        newExperiences[index][field] = value;
        setExperiences(newExperiences);
    };

    const handleAddExperience = () => {
        setExperiences([...experiences, {
            titulo: "",
            compania: "",
            ubicacion: "",
            fechaInicio: "",
            fechaTermino: "",
            descripcion: ""
        }]);
    };

    const handleRemoveExperience = (index) => {
        const newExperiences = [...experiences];
        newExperiences.splice(index, 1);
        setExperiences(newExperiences);
    };

    console.log(previewUrl);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 1,
                    color: "white",
                }}
            >
                <Box
                    sx={{
                        width: "55%",
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >

                    {showTable ? (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                                setShowTable(false)
                                setAboutMeData({
                                    nombre: "",
                                    apellidoPaterno: "",
                                    apellidoMaterno: "",
                                    fotografia: null, // Asegúrate de restablecer la fotografía a null
                                    designacion: "",
                                    direccion: "",
                                    email: "",
                                    numeroTelefono: "",
                                    informacionAdicional: "",
                                });
                                setPreviewUrl(null);
                                setCertificationData({ /* reset values */ });
                                setExperienceData({ /* reset values */ });
                                setEducationData({ /* reset values */ });
                                setInformationData({});
                                setRedesData({});
                                setCertifications([{ titulo: "", descripcion: "" }]);
                                setExperiences([{
                                    titulo: "",
                                    compania: "",
                                    ubicacion: "",
                                    fechaInicio: "",
                                    fechaTermino: "",
                                    descripcion: ""
                                }]);
                                dispatch(changeStateFalse());
                            }}
                        >
                            Agregar nuevo curriculum
                        </Button>
                    ) : (
                        <Button variant="contained" size="small" onClick={() => setShowTable(true)}>Volver</Button>
                    )}

                    {showTable ? (
                        <TableContainer component={Paper} sx={{ marginTop: "16px" }}>
                            <Table sx={{ minWidth: 659 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "black" }}>
                                        <TableCell align="left">
                                            <Typography sx={{ fontWeight: 600, color: "white" }}>
                                                No
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Typography sx={{ fontWeight: 600, color: "white" }}>
                                                Nombre
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Typography sx={{ fontWeight: 600, color: "white" }}>
                                                Puesto
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Typography sx={{ fontWeight: 600, color: "white" }}>
                                                Acciones
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? <TableCell> Loading... </TableCell> : null}
                                    {!loading && curriculumList.length == 0 ? (
                                        <TableCell> Sin resultados </TableCell>
                                    ) : null}
                                    {!loading && error ? <TableCell> {error} </TableCell> : null}
                                    {curriculumList &&
                                        curriculumList.map((item, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                    "&:last-child td, &:last-child th": { border: 0 },
                                                }}
                                            >
                                                <TableCell align="left">
                                                    <Typography> {index + 1} </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography> {item?.aboutMe?.nombre} </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography> {item?.aboutMe?.designacion} </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Box sx={{ display: "flex", cursor: "pointer" }}>
                                                        <Box
                                                            sx={{ color: "black", mr: 1 }}
                                                            onClick={() => updateCurriculum(item)}
                                                        >
                                                            <EditIcon />
                                                        </Box>
                                                        <Box
                                                            sx={{ color: "red" }}
                                                            onClick={() => deleteCurriculum(item._id)}
                                                        >
                                                            <DeleteIcon />
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <form onSubmit={handleClick}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-end",
                                    gap: "8px",
                                    mt: 2,
                                }}
                            >
                                <Box>
                                    <Typography sx={{ color: "black", fontSize: "20px" }}>
                                        Sobre mi:
                                    </Typography>

                                    <input
                                        ref={fileInput}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="raised-button-file"
                                        multiple
                                        onChange={(event) => {
                                            handleChangeImage(event);
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "flex-end",
                                            alignItems: "center"
                                        }}
                                    >

                                    </Box>
                                    <Stack sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                        <Avatar
                                            sx={{
                                                width: "120px",
                                                height: "120px",
                                                mt: "10px",
                                                mb: "15px"
                                            }}
                                            src={previewUrl || ""}
                                        />
                                        <Button sx={{ height: "30px", ml: "10px" }} variant="contained" onClick={handleClickImage}>{previewUrl ? "Cambiar imagen" : "Subir imagen"}</Button>
                                    </Stack>


                                    <TextField
                                        sx={{ color: "white", mr: "10px", mb: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Nombre"
                                        value={aboutMeData?.nombre}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, nombre: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Apellido paterno"
                                        value={aboutMeData?.apellidoPaterno}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, apellidoPaterno: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Apellido materno"
                                        value={aboutMeData?.apellidoMaterno}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, apellidoMaterno: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Puesto"
                                        value={aboutMeData?.designacion}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, designacion: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Direccion"
                                        value={aboutMeData?.direccion}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, direccion: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Email"
                                        value={aboutMeData?.email}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, email: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Numero de telefono"
                                        value={aboutMeData?.numeroTelefono}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, numeroTelefono: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px", mt: "1px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Datos adicionales"
                                        value={aboutMeData?.informacionAdicional}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, informacionAdicional: e.target.value });
                                        }}
                                    />
                                </Box>

                                <Box mt="1rem">
                                    <Typography sx={{ color: "black", fontSize: "20px", mb: "10px" }}>
                                        Certificaciones:
                                    </Typography>

                                    {certifications.map((certification, index) => (
                                        <div key={index}>
                                            <TextField
                                                sx={{ color: "white", mr: "10px", mb: "12px" }}
                                                variant="outlined"
                                                size="small"
                                                placeholder="Titulo"
                                                value={certification?.titulo}
                                                onChange={(e) => handleCertificationChange(index, 'titulo', e.target.value)}
                                            />
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                placeholder="Descripcion"
                                                value={certification?.descripcion}
                                                onChange={(e) => handleCertificationChange(index, 'descripcion', e.target.value)}
                                            />
                                            {certifications?.length > 1 && <Button onClick={() => handleRemoveCertification(index)} color="error" variant="contained" sx={{ ml: "1rem" }}>Eliminar</Button>}
                                            {index !== certifications?.length - 1 && <Divider sx={{ borderWidth: "1px", borderColor: "#445473", mb: "20px" }} />}
                                        </div>
                                    ))}
                                    <Button onClick={handleAddCertification} variant="contained">Agregar mas</Button>
                                </Box>

                                <Box mt="1rem">
                                    <Typography sx={{ color: "black", fontSize: "20px", mb: "10px" }}>
                                        Experiencia:
                                    </Typography>

                                    {experiences.map((experience, index) => (
                                        <div key={index}>
                                            <TextField
                                                sx={{ color: "white", mr: "10px", mb: "10px" }}
                                                variant="outlined"
                                                size="small"
                                                placeholder="Titulo"
                                                value={experience?.titulo}
                                                onChange={(e) => handleExperienceChange(index, 'titulo', e.target.value)}
                                            />
                                            <TextField
                                                sx={{ color: "white", mr: "10px", mb: "10px" }}
                                                variant="outlined"
                                                size="small"
                                                placeholder="Compañia"
                                                value={experience?.compania}
                                                onChange={(e) => handleExperienceChange(index, 'compania', e.target.value)}
                                            />
                                            <TextField
                                                sx={{ color: "white", mr: "10px", mb: "10px" }}
                                                variant="outlined"
                                                size="small"
                                                placeholder="Ubicación"
                                                value={experience?.ubicacion}
                                                onChange={(e) => handleExperienceChange(index, 'ubicacion', e.target.value)}
                                            />
                                            <TextField
                                                sx={{ color: "white", mr: "10px", mb: "10px" }}
                                                variant="outlined"
                                                size="small"
                                                placeholder="Fecha de inicio"
                                                value={experience?.fechaInicio}
                                                onChange={(e) => handleExperienceChange(index, 'fechaInicio', e.target.value)}
                                            />
                                            <TextField
                                                sx={{ color: "white", mr: "10px", mb: "10px" }}
                                                variant="outlined"
                                                size="small"
                                                placeholder="Fecha de terminación"
                                                value={experience?.fechaTermino}
                                                onChange={(e) => handleExperienceChange(index, 'fechaTermino', e.target.value)}
                                            />
                                            <TextField
                                                sx={{ color: "white", mr: "10px", mb: "10px" }}
                                                variant="outlined"
                                                size="small"
                                                placeholder="Descripción"
                                                value={experience?.descripcion}
                                                onChange={(e) => handleExperienceChange(index, 'descripcion', e.target.value)}
                                            />
                                            {experiences?.length > 1 && <Button onClick={() => handleRemoveExperience(index)} color="error" variant="contained">Eliminar</Button>}
                                            {index !== experiences?.length - 1 && <Divider sx={{ borderWidth: "1px", borderColor: "#445473", mb: "20px" }} />}
                                        </div>
                                    ))}
                                    <Button onClick={handleAddExperience} variant="contained">Agregar más</Button>
                                </Box>

                                <Box mt="1rem">
                                    <Typography sx={{ color: "black", fontSize: "20px", mb: "10px" }}>
                                        Educacion:
                                    </Typography>

                                    <TextField
                                        sx={{ color: "white", mr: "10px", mb: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Escuela"
                                        value={educationData?.escuela}
                                        onChange={(e) => {
                                            setEducationData({ ...educationData, escuela: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Certificado"
                                        value={educationData?.certificado}
                                        onChange={(e) => {
                                            setEducationData({ ...educationData, certificado: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Ciudad"
                                        value={educationData?.ciudad}
                                        onChange={(e) => {
                                            setEducationData({ ...educationData, ciudad: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Fecha de inicio"
                                        value={educationData?.fechaInicio}
                                        onChange={(e) => {
                                            setEducationData({ ...educationData, fechaInicio: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Fecha de finalizacion"
                                        value={educationData?.fechaTermino}
                                        onChange={(e) => {
                                            setEducationData({ ...educationData, fechaTermino: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Descripcion"
                                        value={educationData?.descripcion}
                                        onChange={(e) => {
                                            setEducationData({ ...educationData, descripcion: e.target.value });
                                        }}
                                    />
                                </Box>

                                <Box mt="1rem">
                                    <Typography sx={{ color: "black", fontSize: "20px", mb: "10px" }}>
                                        Informacion de contacto:
                                    </Typography>

                                    <TextField
                                        sx={{ color: "white", mr: "10px", mb: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Sitio web personal"
                                        value={informationData?.web}
                                        onChange={(e) => {
                                            setInformationData({ ...informationData, web: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Numero de contacto"
                                        value={informationData?.numeroContacto}
                                        onChange={(e) => {
                                            setInformationData({ ...informationData, numeroContacto: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Ciudad"
                                        value={informationData?.ciudad}
                                        onChange={(e) => {
                                            setInformationData({ ...informationData, ciudad: e.target.value });
                                        }}
                                    />
                                </Box>


                                <Box mt="1rem">
                                    <Typography sx={{ color: "black", fontSize: "20px", mb: "10px" }}>
                                        Redes sociales:
                                    </Typography>

                                    <TextField
                                        sx={{ color: "white", mr: "10px", mb: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Facebook"
                                        value={redesData?.facebook}
                                        onChange={(e) => {
                                            setRedesData({ ...redesData, facebook: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="LinkedIn"
                                        value={redesData?.linkedin}
                                        onChange={(e) => {
                                            setRedesData({ ...redesData, linkedin: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Instagram"
                                        value={redesData?.insta}
                                        onChange={(e) => {
                                            setRedesData({ ...redesData, insta: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Twitter"
                                        value={redesData?.twitter}
                                        onChange={(e) => {
                                            setRedesData({ ...redesData, twitter: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="GitHub"
                                        value={redesData?.github}
                                        onChange={(e) => {
                                            setRedesData({ ...redesData, github: e.target.value });
                                        }}
                                    />
                                </Box>

                                {updateState ? (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={(e) => {
                                            updateForm(e);
                                        }}
                                        sx={{ width: "40%", alignSelf: "center", justifyContent: "center", display: "flex", mt: 3 }}
                                    >
                                        Actualizar
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        // size="small"
                                        // onClick={(e) => {
                                        //     handleClick(e);
                                        // }}
                                        type="submit"
                                        sx={{ width: "40%", alignSelf: "center", justifyContent: "center", display: "flex", mt: 3 }}
                                    >
                                        Guardar
                                    </Button>
                                )}
                            </Box>
                        </form>
                    )}

                </Box>

                <Snackbar
                    open={open}
                    autoHideDuration={5000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
                        {response === "add"
                            ? "Curriculum added successfully"
                            : response === "delete"
                                ? "Curriculum delete successfully"
                                : response === "update"
                                    ? "Curriculum update successfully"
                                    : null}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
}