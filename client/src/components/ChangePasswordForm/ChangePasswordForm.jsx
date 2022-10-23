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

function ChangePasswordForm({ handleClose, open }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changePassword = async () => {
    try {
      const data = {
        oldPassword: oldPassword,
        newPassword: newPassword,
      };
      chatApi.changePassword(data);
      toast.success("Change Profile Success!");
    } catch (error) {
      console.log(error);
      toast.error("Change Profile Fail!");
    }
  };

  const handleChangePassword = () => {
    changePassword();
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth={"md"} fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <ValidatorForm onSubmit={handleChangePassword}>
        <DialogContent>
          <TextValidator
            className="form-control form-control-lg mb-4"
            variant="outlined"
            label="Old Password"
            type="password"
            onChange={(e) => setOldPassword(e.target.value)}
            name="Old Password"
            value={oldPassword === "" ? null : oldPassword}
            validators={["required"]}
            errorMessages={["this field is required"]}
          />
          <TextValidator
            className="form-control form-control-lg mb-4"
            variant="outlined"
            label="New Password"
            type="password"
            onChange={(e) => setNewPassword(e.target.value)}
            name="New Password"
            value={newPassword === "" ? null : newPassword}
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

export default ChangePasswordForm;
