import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Block, Save } from "@mui/icons-material";
import chatApi from "../../api/chatRequest";

function ChangeProfileForm({ userCurrent, handleClose, open }) {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [story, setStory] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    setLastName(userCurrent.lastName);
    setFirstName(userCurrent.firstName);
    
  }, []);

  const changeProfile = async () => {
    try {
      const data = {
        firstName: firstName,
        lastName: lastName,
        story: story,
        address: address,
      };
      chatApi.changeProfile(data);
      toast.success("Change Profile Success!");
    } catch (error) {
      console.log(error);
      toast.error("Change Profile Fail!");
    }
  };

  const handleChangeProfile = () => {
    changeProfile();
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth={"md"} fullWidth>
      <DialogTitle>Change Profile</DialogTitle>
      <ValidatorForm onSubmit={handleChangeProfile}>
        <DialogContent>
          <TextValidator
            className="form-control form-control-lg mb-4"
            variant="outlined"
            label="Last Name"
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            name="Last Name"
            value={lastName === "" ? null : lastName}
            validators={["required"]}
            errorMessages={["this field is required"]}
          />
          <TextValidator
            className="form-control form-control-lg mb-4"
            variant="outlined"
            label="First Name"
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            name="First Name"
            value={firstName === "" ? null : firstName}
            validators={["required"]}
            errorMessages={["this field is required"]}
          />
          <TextValidator
            className="form-control form-control-lg mb-4"
            variant="outlined"
            label="Story"
            type="text"
            onChange={(e) => setStory(e.target.value)}
            name="Story"
            value={story === "" ? null : story}
            validators={["required"]}
            errorMessages={["this field is required"]}
          />
          <TextValidator
            className="form-control form-control-lg mb-4"
            variant="outlined"
            label="Address"
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            name="Address"
            value={address === "" ? null : address}
            validators={["required"]}
            errorMessages={["this field is required"]}
          />
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<Block />}
            variant="contained"
            className="mr-8"
            color="secondary"
            onClick={() => handleClose()}
          >
            Cancel
          </Button>
          <Button
            startIcon={<Save />}
            variant="contained"
            className="mr-8"
            color="primary"
            type="submit"
          >
            Save
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  );
}

export default ChangeProfileForm;
