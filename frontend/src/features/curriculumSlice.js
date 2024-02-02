import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const curriculumState = {
    updateState: false,
    loading: false,
    curriculumList: [],
    error: "",
    response: "",
};

export const fetchCurriculums = createAsyncThunk(
    "curriculums/fetchCurriculums",
    async () => {
        const response = await axios.get("http://localhost:8000/api/curriculums");
        return response.data.response;
    }
);

export const addCurriculum = createAsyncThunk(
    "curriculum/addCurriculum",
    async (data) => {
        const formData = new FormData();

        if (data.aboutMe.fotografia) {
            formData.append('fotografia', new Blob([data.aboutMe.fotografia]), 'file.jpg');
        }

        formData.append('aboutMe', JSON.stringify(data.aboutMe));
        formData.append('certifications', JSON.stringify(data.certifications));
        formData.append('experience', JSON.stringify(data.experience));
        formData.append('education', JSON.stringify(data.education));
        formData.append('information', JSON.stringify(data.information));
        formData.append('redes', JSON.stringify(data.redes));

        const response = await axios.post("http://localhost:8000/api/curriculums", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        // const response = await axios.post("http://localhost:8000/api/curriculums", data);
        return response.data.response;
    }
);

export const removeCurriculum = createAsyncThunk(
    "curriculum/removeCurriculum",
    async (data) => {
        const response = await axios.delete(
            `http://localhost:8000/api/curriculums/${data}`
        );
        console.log(data);
        return response.data.response;
    }
);

export const modifyCurriculum = createAsyncThunk(
    "curriculum/modifyCurriculum",
    async (data) => {
        const response = await axios.put(
            `http://localhost:8000/api/curriculums/${data.id}`,
            data
        );
        return response.data.response;
    }
);

const curriculumSlice = createSlice({
    name: "curriculum",
    initialState: curriculumState,
    reducers: {
        changeStateTrue: (state) => {
            state.updateState = true;
        },
        changeStateFalse: (state) => {
            state.updateState = false;
        },
        clearResponse: (state) => {
            state.response = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addCurriculum.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCurriculum.fulfilled, (state, action) => {
                state.loading = false;
                state.curriculumList.push(action.payload);
                state.response = "add";
            })
            .addCase(addCurriculum.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        builder
            .addCase(fetchCurriculums.fulfilled, (state, action) => {
                state.curriculumList = action.payload;
            })
            .addCase(fetchCurriculums.rejected, (state, action) => {
                state.error = action.error.message;
            });

        builder.addCase(removeCurriculum.fulfilled, (state, action) => {
            state.curriculumList = state.curriculumList.filter(
                (item) => item._id != action.payload
            );
            state.response = "delete";
        });

        builder.addCase(modifyCurriculum.fulfilled, (state, action) => {
            const updateItem = action.payload;
            const index = state.curriculumList.findIndex(
                (item) => item._id === updateItem._id
            );
            if (index !== -1) {
                state.curriculumList[index] = updateItem;
            }
            state.response = "update";
        });
    },
});

export default curriculumSlice.reducer;
export const { changeStateTrue, changeStateFalse, clearResponse } =
    curriculumSlice.actions;