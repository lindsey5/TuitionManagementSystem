import {
    Select,
    type SelectProps,
    FormControl,
    InputLabel,
    MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export type PurpleSelectProps = SelectProps<any> & {
    label?: string;
};

// Styled Select with purple theme
const StyledSelect = styled((props: SelectProps) => <Select {...props} />)({
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#d1d5db", // default (gray-300)
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#7e22ce", // purple-600
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#6b21a8", // purple-700
    },
    "& .MuiSelect-icon": {
        color: "#7e22ce", // purple-600
    },
});

// Styled InputLabel with purple focus color
const PurpleInputLabel = styled(InputLabel)({
    "&.Mui-focused": {
        color: "#7e22ce", // purple-600
    },
});

export const PurpleSelect = ({ label, ...props }: PurpleSelectProps) => {
    return (
        <FormControl fullWidth margin="normal">
        <PurpleInputLabel>{label}</PurpleInputLabel>
        <StyledSelect label={label} {...props} />
        </FormControl>
    );
};

interface SchoolYearProps {
    schoolYear: string;
    setSchoolYear: React.Dispatch<React.SetStateAction<string>>;
}

export const SchoolYear = ({ schoolYear, setSchoolYear } : SchoolYearProps) => {
    const startYear = 2022;
    const totalYears = 10;

    const years = Array.from({ length: totalYears }).map((_, i) => {
    const start = startYear + i;
    return `${start}-${start + 1}`;
    });

    return (
        <PurpleSelect
            label="School Year"
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
        >
            {years.map((year) => (
                <MenuItem key={year} value={year}>
                    {year}
                </MenuItem>
            ))}
        </PurpleSelect>
    )
}