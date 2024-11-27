import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Field } from "../components/ui/field"
import { useRef } from "react"
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../components/ui/select";
import { Button, Card, createListCollection, Input, Stack, Textarea } from "@chakra-ui/react"
import { Toaster, toaster } from "../components/ui/toaster"

const JobCreationForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [categoryId, setCategoryId] = useState("");
  // const [frameworks, setFrameworks] = useState(createListCollection({ items: [] }));
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const ref = useRef(null)
  console.log('ref', ref)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/api/categories/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/api/jobs/create/",
        {
          title,
          description,
          requirements,
          location,
          application_deadline: applicationDeadline,
          category_id: categoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setSuccess("Job created successfully!");
      toaster.create({
        title: `Job created successfully!`,
        type: 'success',
      })
      setError("");
    } catch (err) {
      setError(err.response.data.error || "An error occurred.");
      toaster.create({
        title: `Could not create a job due to an error!`,
        type: 'error',
      })
      setSuccess("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <DialogRoot initialFocusEl={() => ref.current} placement="center">
          <DialogTrigger asChild>
            <Button variant="solid">Post a job</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Job</DialogTitle>
            </DialogHeader>
            <DialogBody pb="4">
              <Stack gap="4">
                <Field label="Title">
                  <Input placeholder="Title" type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required />
                </Field>
                <Field label="Description">
                  <Textarea ref={ref} placeholder="Description" value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required />
                </Field>
                <Field label="Requirements">
                  <Input ref={ref} placeholder="Requirements" value={requirements}
                    onChange={(e) => setRequirements(e.target.value)} />
                </Field>
                <Field label="Application deadline">
                  <Input ref={ref} placeholder="YYYY-DD-MM" value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} />
                </Field>
                <Field label="Location">
                  <Input ref={ref} placeholder="Location" type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required />
                </Field>
                {/* <SelectRoot collection={frameworks} size="md" value={categoryId}
                  onValueChange={(e) => setCategoryId(e.value)}
                >
                  <SelectLabel>Category</SelectLabel>
                  <SelectTrigger>
                    <SelectValueText placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {frameworks.items.map((jobtype) => (
                      <SelectItem item={jobtype} key={jobtype.value}>
                        {jobtype.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot> */}
                <Field label="Category">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </Stack>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {success && <p style={{ color: "green" }}>{success}</p>}
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogActionTrigger>
              <Button type="submit" onClick={() => { handleSubmit() }}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </form>
    </div>
  );
};

export default JobCreationForm;
