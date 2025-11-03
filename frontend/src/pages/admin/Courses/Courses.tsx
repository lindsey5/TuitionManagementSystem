import { useState } from "react";
import { AddButton, DeleteButton, EditButton } from "../../../components/Button";
import { Title } from "../../../components/Text";
import CourseModal from "./ui/Course";
import useFetch from "../../../hooks/useFetch";
import PurpleTable from "../../../components/Table";
import { CircularProgress } from "@mui/material";
import { deleteData } from "../../../utils/api";
import { confirmDialog, errorAlert, successAlert } from "../../../utils/swal";
import { useDebounce } from "../../../hooks/useDebounce";
import { SearchField } from "../../../components/Textfield";

const Courses = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course>();
    const [searchTerm, setSearchTerm] = useState('');
    const searchDebounce = useDebounce(searchTerm, 500);
    const { data, loading } = useFetch(`/api/courses?searchTerm=${searchDebounce}`);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCourse(undefined);
    }

    const handleEdit = (course : Course) => {
        setSelectedCourse(course);
        setShowModal(true);
    }

    const handleDelete = async (courseId : string) => {
        if(await confirmDialog('Are you sure?', 'Do you really want to delete this course?')){
            const response = await deleteData(`/api/courses/${courseId}`);
            if(!response.success){
                errorAlert('Error', response.message || 'Failed to delete course.');
                return;
            }
            await successAlert('Deleted', 'Course deleted successfully.');
            window.location.reload();
        }
    }

    return (
        <div className="p-5 w-full">
            <div className="flex items-center justify-between mb-6">
                <Title label="Courses" />
                <AddButton onClick={() => setShowModal(true)} label="Add Course" />
            </div>

            <div className="mb-6 md:w-1/2">
                <SearchField 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    placeholder="Search by course name or course code"
                />
            </div>

            <CourseModal isOpen={showModal} course={selectedCourse} onClose={handleCloseModal}/>

            {loading ? (
            <div className="w-full flex justify-center items-center h-64">
                <CircularProgress />
            </div>) 
            : 
            data?.courses.length === 0 ? (
                <p className="text-center text-gray-500 mt-20">No courses found.</p>
            ) :
            <PurpleTable 
                columns={['#', 'Course Name', 'Course Code', 'Actions']}
                data={data?.courses.map((course : Course, i : number) => ({
                    '#' : i + 1,
                    'Course Name' : course.name,
                    'Course Code' : course.code,
                    'Actions' : (
                        <div className="flex items-center gap-4">
                            <EditButton onClick={() => handleEdit(course)}/>
                            <DeleteButton onClick={() => handleDelete(course._id as string)}/>
                        </div>
                    )
                })) || []}
            />}

        </div>
    )
}

export default Courses;