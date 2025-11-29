import mongoose, { Schema, Document, Types } from "mongoose";
import EnrolledSubject, { IEnrolledSubject } from "./EnrolledSubject";
import Payment from "./Payment";

export interface ISemester extends Document {
  student_id: Types.ObjectId;
  term: "1st" | "2nd" | "Summer";
  schoolYear: string;
  enrollmentStatus: "Regular" | "Irregular";
  course: Types.ObjectId;
  pricePerUnit: number;
  discount: number;
  due_date?: Date;
  totalTuition: number;
  remainingBalance: number;
  classification: "regular" | "full_scholar" | "partial_scholar" | "academic_grant" | "athlete_scholar" | "sponsored"
  enrolledsubjects?: IEnrolledSubject[]
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
    },
    totalTuition: {
      type: Number,
      required: true,
      default: 0
    },
    remainingBalance: {
      type: Number,
      required: true,
      default: 0
    },
    classification: {
      type: String,
      enum: [
        "regular",
        "full_scholar",
        "partial_scholar",
        "academic_grant",
        "athlete_scholar",
        "sponsored",
      ],
      required: true
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100
    },
    due_date: {
      type: Date,
      required: false
    }
  },
  { timestamps: true }
);

SemesterSchema.virtual("enrolledsubjects", {
  ref: "EnrolledSubject",
  localField: "_id",
  foreignField: "semester",
  justOne: false,   
});

SemesterSchema.set("toObject", { virtuals: true });
SemesterSchema.set("toJSON", { virtuals: true });

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