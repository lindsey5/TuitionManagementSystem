import { InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { SearchIcon } from "lucide-react";

export const PurpleTextField = styled((props: TextFieldProps) => (
    <TextField {...props} />
))({
    "& .MuiOutlinedInput-root": {
        borderRadius: "15px", 
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

type SearchFieldProps = {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fullWidth?: boolean;
};


export const SearchField: React.FC<SearchFieldProps> = ({
    placeholder = "Search...",
    value,
    onChange,
    fullWidth = true,
}) => {
    return (
        <PurpleTextField
            fullWidth={fullWidth}
            variant="outlined"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon style={{ color: "#9333ea" }} />
                </InputAdornment>
                ),
            }}
        />
    );
};