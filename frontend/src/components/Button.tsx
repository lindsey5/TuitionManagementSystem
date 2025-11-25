import { Button, type ButtonProps } from "@mui/material";
import { Pencil, Plus, Trash2 } from "lucide-react";

interface CustomButtonProps {
  onClick: (e : React.MouseEvent) => void;
  label?: string;
}

export const AddButton = ({ onClick, label }: CustomButtonProps) => {
    return (
        <button
            className="flex items-center gap-2 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition cursor-pointer"
            onClick={onClick}
        >
            <Plus size={18} />
            <span className="inline">{label}</span>
        </button>
    );
};

export const EditButton = ({ onClick }: CustomButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-1 rounded-md text-blue-600 border border-blue-200 hover:bg-blue-50 transition cursor-pointer"
    >
      <Pencil size={16} />
    </button>
  );
};

export const DeleteButton = ({ onClick }: CustomButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-1 rounded-md text-red-600 border border-red-200 hover:bg-red-50 transition cursor-pointer"
    >
      <Trash2 size={16} />
    </button>
  );
};

export const PurpleButton = ({ sx, ...props }: ButtonProps) => {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#6B46C1", // base purple
        color: "white",
        ":hover": {
          backgroundColor: "#5A3DB1", // darker purple on hover
        },
        "&.Mui-disabled": {
          backgroundColor: "#e0e0e0",
          color: "white",
        },
        ...sx,
      }}
      {...props}
    />
  );
};