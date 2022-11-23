import React, { useState, useEffect } from "react";
import { onSnapshot, collection, doc, deleteDoc} from "firebase/firestore";
import { db } from "../firebase";

import {
  Card,
  Chip,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Stack,
} from "@mui/material";

import {
  BusinessCenter,
  CalendarMonth,
  LocationOn,
  Storefront,
  Delete
} from "@mui/icons-material";

export default function ListCard() {
  const [posts, setPosts] = useState([]);

  const handleDelete = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  useEffect(
    () =>
      onSnapshot(collection(db, "posts"), (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPosts(data);
        console.log(data);
      }),
    []
  );

  return (
    
    <>
    {posts.map((post) => (
      <Card key={post.id} variant="outlined" sx={{ maxWidth: 345, p: 1, m: 4 }}>
        <CardContent>
          <Stack spacing={1}>
            <CardMedia
              component="img"
              height="120"
              image="./images/seedful-logo.png"
            />

            <Stack direction="row" gap={1}>
              <Chip label="Paid Project" />
              <Chip label="Available" />
            </Stack>

            <Stack direction="row" gap={1}>
              <BusinessCenter />
              <Typography>{post.skills}</Typography>
            </Stack>
            <Stack direction="row" gap={1}>
              <CalendarMonth />

              <Typography>Date due</Typography>
            </Stack>
            <Stack direction="row" gap={1}>
              <LocationOn />
              <Typography>{post.location}</Typography>
            </Stack>
            <Stack direction="row" gap={1}>
              <Storefront />
              <Typography>{post.name}</Typography>
            </Stack>

            <Typography>
              {post.project}
            </Typography>
          </Stack>
        </CardContent>

        <CardActions>
          <Stack direction="row" spacing={2}>
          <Button variant="contained"> Learn More </Button>
          <Delete onClick={() => handleDelete(post.id)}/>
          </Stack>
        </CardActions>
      </Card>
))}
    </>
    
  );
}
