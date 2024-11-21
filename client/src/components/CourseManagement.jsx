import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Button } from "@headlessui/react";
import React, { useState } from "react";
import { JWT_KEY, useLocalState } from "../hooks/useLocalStorage";
import ChangePassword from "./changePassword";
import "../styles/webPage.css";
import AddCourse from "./addForms/AddCourseForm";

const CourseManagement = () => {
  const [jwt, setJwt] = useLocalState("", JWT_KEY);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isRemoveCourseOpen, setIsRemoveCourseOpen] = useState(false);

  return (
    <div>
      <h1>Course Management</h1>
      <div>
        <Button type="button" onClick={() => setIsAddCourseOpen(true)}>
          Add
        </Button>
        <Button type="button" onClick={() => setIsRemoveCourseOpen(true)}>
          Remove
        </Button>
      </div>

      <Dialog
        open={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
        className="dialog-pop"
      >
        <div className="dialog-pop-back">
          <div className="pop-panel">
            <DialogPanel>
              <DialogTitle className="font-bold">Add Course</DialogTitle>
              <Description>
                This will add a course to a specified Major
              </Description>
              <AddCourse jwt={jwt} setIsOpen={setIsAddCourseOpen} />
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={isRemoveCourseOpen}
        onClose={() => setIsRemoveCourseOpen(false)}
        className="dialog-pop"
      >
        <div className="dialog-pop-back">
          <div className="pop-panel">
            <DialogPanel>
              <DialogTitle className="font-bold">Remove Course</DialogTitle>
              <Description>
                This will remove a course to a specified Major
              </Description>
              <ChangePassword jwt={jwt} setIsOpen={setIsRemoveCourseOpen} />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CourseManagement;
