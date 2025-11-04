import { InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

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

interface SearchDropdownProps {
  onSelect: (value: any) => void; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  options: Option[];
  value: string;
  isLoading: boolean;
}

export const SearchDropdown = ({
  onChange,
  options,
  onSelect,
  value,
  placeholder,
  isLoading
}: SearchDropdownProps) => {
  const [focus, setFocus] = useState<boolean>(false);

    return (
        <div className="w-full relative">
        <PurpleTextField
            fullWidth
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            onFocus={() => setFocus(true)}
            onBlur={() => setTimeout(() => setFocus(false), 200)} 
        />
        {value && focus && (
            <div className="absolute inset-x-0 mt-1 border border-gray-200 bg-white z-50 rounded-md shadow max-h-[300px] overflow-y-auto">
            {options.length > 0 ? (
                options.map((option, idx) => (
                <div
                    key={idx}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => onSelect(option.value)}
                >
                    {option.label}
                </div>
                ))
            ) : isLoading ? (
                <div className="px-3 py-2 text-gray-500">Loading...</div>
            ) : (
                <div className="px-3 py-2 text-gray-500">No results found.</div>
            )}
            </div>
        )}
        </div>
    );
};