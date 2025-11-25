import mongoose, { Schema, Document, Types } from "mongoose";
import EnrolledSubject from "./EnrolledSubject";
import Payment from "./Payment";

export interface ISemester extends Document {
  student_id: Types.ObjectId;
  term: "1st" | "2nd" | "Summer";
  schoolYear: string;
  enrollmentStatus: "Regular" | "Irregular";
  course: Types.ObjectId;
  pricePerUnit: number;
}

const SemesterSchema: Schema<ISemester> = new Schema(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    term: {
      type: String,
      enum: ["1st", "2nd", "Summer"],
      required: true,
    },
    enrollmentStatus: {
      type: String,
      enum: ["Regular", "Irregular"],
      required: true,
    },
    schoolYear: {
      type: String,
      required: true,
      match: /^\d{4}-\d{4}$/, 
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course", 
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

// Cascade delete StudentSubjects when a Semester is deleted
SemesterSchema.pre("findOneAndDelete", async function (next) {
    const semester = await this.model.findOne(this.getFilter());
    if (semester) {
        await EnrolledSubject.deleteMany({ semester_id: semester._id });
        await Payment.deleteMany({ semester: semester._id });
    }
    next();
});

const Semester = mongoose.model<ISemester>("Semester", SemesterSchema);

export default Semester;