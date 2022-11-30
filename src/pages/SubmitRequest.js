import { useState } from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import axios from "axios";
import { collection, addDoc } from "firebase/firestore";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import React from "react";
import { db, storage } from "../firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { Container } from "@mui/system";

function SubmitRequest() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    about: "",
    contact: "",
    isDisplay: false,
    email: "",
    location: "",
    lat: "",
    lng: "",
    mapURL: "",
    logoURL: "",
    organisationName: "",
    project: "",
    remuneration: "",
    skills: "",
    contactName: "",
    renumerationDetails: "",
    dueDate: "",
  });

  const [logo, setLogo] = React.useState(null);
  const [fileValue, setFileValue] = React.useState("");

  const handleFileChange = (e) => {
    setFileValue(e.target.value);
    setLogo(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fileRef = storageRef(storage, `logos/${logo.name}`);
    axios
      .get(
        `https://developers.onemap.sg/commonapi/search?searchVal=${formData.location}&returnGeom=Y&getAddrDetails=Y`
      )
      .then((response) => response.data.results[0])
      .then((geoData) =>
        axios.get(
          `https://developers.onemap.sg/commonapi/staticmap/getStaticImage?layerchosen=default&lat=${geoData.LATITUDE}&lng=${geoData.LONGITUDE}&postal=${formData.location}&zoom=15&width=512&height=256&points=[${geoData.LATITUDE},${geoData.LONGITUDE}]`
        )
      )
      .then((response) => {
        console.log(response.config.url);
        uploadBytes(fileRef, logo).then(() => {
          getDownloadURL(fileRef).then((downloadUrl) => {
            console.log(formData);
            const collectionRef = collection(db, "posts");
            addDoc(collectionRef, {
              ...formData,
              logoURL: downloadUrl,
              mapURL: response.config.url,
              dueDate: selectedDate.toDateString(),
            });
          });
        });
      });

    //working but save to different id
    // axios
    //   .get(
    //     `https://developers.onemap.sg/commonapi/search?searchVal=543272&returnGeom=Y&getAddrDetails=Y`
    //   )
    //   .then((response) => response.data.results[0])
    //   .then((geoData) =>
    //     axios.get(
    //       `https://developers.onemap.sg/commonapi/staticmap/getStaticImage?layerchosen=original&lat=${geoData.LATITUDE}&lng=${geoData.LONGITUDE}&postal=${geoData.POSTAL}&zoom=15&width=256&height=256&points=[${geoData.LATITUDE},${geoData.LONGITUDE}]`
    //     )
    //   )
    //   .then((response) => {
    //     console.log(response.config.url);
    //     const collectionRef = collection(db, "posts");
    //     addDoc(collectionRef, {
    //       ...formData,
    //       mapURL: response.config.url,
    //     });
    //   });

    // uploadBytes(fileRef, logo).then(() => {
    //   getDownloadURL(fileRef).then((downloadUrl) => {
    //     console.log(formData);
    //     const collectionRef = collection(db, "posts");
    //     addDoc(collectionRef, {
    //       ...formData,
    //       logoURL: downloadUrl,
    //     });
    //   });
    // });

    console.log(formData);
  };

  return (
    <div>
      {" "}
      <Box
        sx={{
          height: 60,
        }}
      />
      <Container sx={{ p: 2, mt: 2 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          Submit Request
        </Typography>

        <Box component="form">
          <Typography>
            We’ll take some time to review the details below, and get in touch
            if we have any questions. You’ll hear from us if the listing is
            approved!
          </Typography>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ mb: 1 }}>
                Information for us to contact you
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                gap={2}
                sx={{ mb: 3 }}
              >
                <TextField
                  fullWidth
                  sx={{ m: 1 }}
                  label="Contact Name"
                  id="contact name"
                  name="contactName"
                  onChange={handleChange}
                  //this is needs to be created
                  value={formData.contactName}
                  size="Normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  sx={{ m: 1 }}
                  label="Email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  // defaultValue="Enter Email"
                  size="Normal"
                  variant="outlined"
                />
              </Stack>

              <Divider />
              <Typography sx={{ mb: 1 }}>
                Information you would like to display in the volunteer
                opportunities page
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                sx={{ width: "100%" }}
                gap={2}
              >
                <Stack direction="column" sx={{ width: "100%" }} gap={2}>
                  {/* <Typography>Organisation Logo </Typography>
        <Button variant="outlined"> Upload</Button> */}
                  <TextField
                    fullWidth
                    sx={{ m: 1 }}
                    label="Organisation Name"
                    id="organisationName"
                    name="organisationName"
                    onChange={handleChange}
                    value={formData.name}
                    // defaultValue="Enter Name"
                    size="Normal"
                    variant="outlined"
                  />

                  <TextField
                    label=""
                    fullWidth
                    sx={{ m: 1 }}
                    type="file"
                    id="logo"
                    name="logo"
                    onChange={handleFileChange}
                    value={fileValue}
                    size="Normal"
                    variant="outlined"
                  />
                  <TextField
                    label="Skills Needed"
                    fullWidth
                    sx={{ m: 1 }}
                    id="skills"
                    name="skills"
                    onChange={handleChange}
                    value={formData.skills}
                    multiline
                    rows={4}
                    // defaultValue="What skills do you need? e.g. illustration, content creating, video, packaging design"
                  />
                  <TextField
                    label="Contact Details"
                    fullWidth
                    sx={{ m: 1 }}
                    id="contact"
                    name="contact"
                    onChange={handleChange}
                    value={formData.contact}
                    // defaultValue="Contact email or link to sign up form for volunteers"
                    size="Normal"
                    variant="outlined"
                  />
                  <TextField
                    label="About your non-profit/community initiative"
                    fullWidth
                    sx={{ m: 1 }}
                    id="about"
                    name="about"
                    onChange={handleChange}
                    value={formData.about}
                    multiline
                    rows={4}
                    // defaultValue="Tell us more about your organisation"
                  />
                </Stack>
                <Stack direction="column" sx={{ width: "100%" }} gap={2}>
                  <TextField
                    label="Project Details"
                    fullWidth
                    sx={{ m: 1 }}
                    id="project"
                    name="project"
                    onChange={handleChange}
                    value={formData.project}
                    multiline
                    rows={4}
                    // defaultValue="Tell us more about your project in detail."
                  />
                  <TextField
                    label="Location postal code"
                    fullWidth
                    sx={{ m: 1 }}
                    id="location"
                    name="location"
                    onChange={handleChange}
                    value={formData.location}
                    // defaultValue="Enter postal code"
                  />
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel id="remuneration">Remuneration </InputLabel>
                    <Select
                      id="remuneration"
                      name="remuneration"
                      onChange={handleChange}
                      value={formData.remuneration}
                    >
                      <MenuItem value={"Paid Project"}>Paid Project</MenuItem>
                      <MenuItem value={"Low Bono"}>Low Bono</MenuItem>
                      <MenuItem value={"Pro Bono"}>Pro Bono</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Remuneration Details"
                    fullWidth
                    sx={{ m: 1 }}
                    id="renumerationDetails"
                    name="renumerationDetails"
                    onChange={handleChange}
                    valugite={formData.renumerationDetails}
                    multiline
                    rows={4}
                    // defaultValue="Tell us more about your project in detail."
                  />
                  <DesktopDatePicker
                    name="selectedDate"
                    label="Date Picker"
                    value={selectedDate}
                    onChange={(newValue) => {
                      setSelectedDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </Stack>
              <Grid container justifyContent="start">
                <Button
                  sx={{ ml: 1, mt: 2 }}
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}

export default SubmitRequest;
