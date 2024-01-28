import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
    Alert,
    Box,
    Button,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useState } from "react";
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

export default function Home() {
    const dispatch = useDispatch();
    const { loading, curriculumList, error, updateState, response } = useSelector(
        (state) => state.curriKey
    );
    const [id, setId] = useState("");

    const [aboutMeData, setAboutMeData] = useState({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        fotografia: "",
        designacion: "",
        direccion: "",
        email: "",
        numeroTelefono: "",
        informacionAdicional: ""
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

    const [showTable, setShowTable] = useState(true);

    useEffect(() => {
        dispatch(fetchCurriculums());
    }, [dispatch]);

    const handleClick = (e) => {
        e.preventDefault();
        console.log(aboutMeData);
        console.log(certificationData);
        console.log(experienceData);
        console.log(educationData);

        dispatch(
            addCurriculum({
                aboutMe: aboutMeData,
                certifications: [certificationData],
                experience: [experienceData],
                education: [educationData]
            })
        );
        handleClickSnackbar();
        setAboutMeData({ /* reset values */ });
        setCertificationData({ /* reset values */ });
        setExperienceData({ /* reset values */ });
        setEducationData({ /* reset values */ });
        setShowTable(true);
    };

    const updateCurriculum = (item) => {
        setId(item._id);
        setAboutMeData(item.aboutMe);
        setCertificationData(item.certifications[0]);
        setExperienceData(item.experience[0]);
        setEducationData(item.education[0]);
        setShowTable(false);
        dispatch(changeStateTrue());
    };

    const updateForm = () => {
        dispatch(modifyCurriculum({
            id: id,
            aboutMe: aboutMeData,
            certifications: [certificationData],
            experience: [experienceData],
            education: [educationData]
        }));
        dispatch(changeStateFalse());
        handleClickSnackbar();
        setId("");
        setAboutMeData({ /* reset values */ });
        setCertificationData({ /* reset values */ });
        setExperienceData({ /* reset values */ });
        setEducationData({ /* reset values */ });
        setShowTable(true);
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
                                setAboutMeData({ /* reset values */ });
                                setCertificationData({ /* reset values */ });
                                setExperienceData({ /* reset values */ });
                                setEducationData({ /* reset values */ });
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

                                    <TextField
                                        sx={{ color: "white", mr: "10px", mb: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Nombre"
                                        value={aboutMeData.nombre}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, nombre: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Apellido paterno"
                                        value={aboutMeData.apellidoPaterno}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, apellidoPaterno: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Apellido materno"
                                        value={aboutMeData.apellidoMaterno}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, apellidoMaterno: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Fotografia"
                                        value={aboutMeData.fotografia}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, fotografia: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Puesto"
                                        value={aboutMeData.designacion}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, designacion: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Direccion"
                                        value={aboutMeData.direccion}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, direccion: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Email"
                                        value={aboutMeData.email}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, email: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Numero de telefono"
                                        value={aboutMeData.numeroTelefono}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, numeroTelefono: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px", mt: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Datos adicionales"
                                        value={aboutMeData.informacionAdicional}
                                        onChange={(e) => {
                                            setAboutMeData({ ...aboutMeData, informacionAdicional: e.target.value });
                                        }}
                                    />
                                </Box>

                                <Box mt="1rem">
                                    <Typography sx={{ color: "black", fontSize: "20px" }}>
                                        Certificaciones:
                                    </Typography>

                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Titulo"
                                        value={certificationData.titulo}
                                        onChange={(e) => {
                                            setCertificationData({ ...certificationData, titulo: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        placeholder="Descripcion"
                                        value={certificationData.descripcion}
                                        onChange={(e) => {
                                            setCertificationData({ ...certificationData, descripcion: e.target.value });
                                        }}
                                    />
                                </Box>

                                <Box mt="1rem">
                                    <Typography sx={{ color: "black", fontSize: "20px" }}>
                                        Experiencia:
                                    </Typography>

                                    <TextField
                                        sx={{ color: "white", mr: "10px", mb: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Titulo"
                                        value={experienceData.titulo}
                                        onChange={(e) => {
                                            setExperienceData({ ...experienceData, titulo: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Compañia"
                                        value={experienceData.compania}
                                        onChange={(e) => {
                                            setExperienceData({ ...experienceData, compania: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Ubicacion"
                                        value={experienceData.ubicacion}
                                        onChange={(e) => {
                                            setExperienceData({ ...experienceData, ubicacion: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Fecha de inicio"
                                        value={experienceData.fechaInicio}
                                        onChange={(e) => {
                                            setExperienceData({ ...experienceData, fechaInicio: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Fecha de finalizacion"
                                        value={experienceData.fechaTermino}
                                        onChange={(e) => {
                                            setExperienceData({ ...experienceData, fechaTermino: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Descripcion"
                                        value={experienceData.descripcion}
                                        onChange={(e) => {
                                            setExperienceData({ ...experienceData, descripcion: e.target.value });
                                        }}
                                    />
                                </Box>

                                <Box mt="1rem">
                                    <Typography sx={{ color: "black", fontSize: "20px" }}>
                                        Educacion:
                                    </Typography>

                                    <TextField
                                        sx={{ color: "white", mr: "10px", mb: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Escuela"
                                        value={educationData.escuela}
                                        onChange={(e) => {
                                            setEducationData({ ...educationData, escuela: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Certificado"
                                        value={educationData.certificado}
                                        onChange={(e) => {
                                            setEducationData({ ...educationData, certificado: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Ciudad"
                                        value={educationData.ciudad}
                                        onChange={(e) => {
                                            setEducationData({ ...educationData, ciudad: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Fecha de inicio"
                                        value={educationData.fechaInicio}
                                        onChange={(e) => {
                                            setEducationData({ ...educationData, fechaInicio: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Fecha de finalizacion"
                                        value={educationData.fechaTermino}
                                        onChange={(e) => {
                                            setEducationData({ ...educationData, fechaTermino: e.target.value });
                                        }}
                                    />
                                    <TextField
                                        sx={{ color: "white", mr: "10px" }}
                                        variant="outlined"
                                        size="small"
                                        placeholder="Descripcion"
                                        value={educationData.descripcion}
                                        onChange={(e) => {
                                            setEducationData({ ...educationData, descripcion: e.target.value });
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