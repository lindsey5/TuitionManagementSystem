import Student from "../models/Student"

export const getStudentById = async (id : string) => {
    try{
        const student = await Student.findById(id).populate('course');

        return student;

    }catch(err : any){
        throw new Error(err.message)
    }
}