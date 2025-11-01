import { styled } from "@mui/material/styles";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

export const PurpleTextField = styled((props: TextFieldProps) => (
    <TextField {...props} />
))({
    "& .MuiOutlinedInput-root": {
        "&:hover fieldset": {
        borderColor: "#7e22ce", // purple-700
        },
        "&.Mui-focused fieldset": {
        borderColor: "#6b21a8", // purple-800
        },
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#7e22ce", // purple-700
    },
});