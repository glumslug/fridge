import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { cuisines, recipe, sources } from "../utilities/interfaces";

type CreateRecipeProps = {
  setView: (arg0: string) => void;
};

type CreateRecipeForm = {
  title: string | null;
  cuisine: string | null;
  source: string | null;
};

const CreateRecipe = ({ setView }: CreateRecipeProps) => {
  // Cuisine be pulled from a table and queried only once, if blank it will default to 'general'?
  // Source should query authors, but only those with aliases. use regex or string-similarity package to see if close to something already in the db
  // If no matching source is found, they can hit +, which will INSERT into authors db as alias
  const [step, setStep] = useState<1 | 2>(1);
  const [cuisines, setCuisines] = useState<cuisines[] | null>(null);
  const [cuisineValue, setCuisineValue] = useState<string>("");
  const [displayCuisines, setDisplayCuisines] = useState<cuisines[]>([]);
  const [sourceValue, setSourceValue] = useState<string>("");
  const [sourceResults, setSourceResults] = useState<sources[]>([]);
  const [recipe, setRecipe] = useState<recipe | null>(null);
  const [form, setForm] = useState<CreateRecipeForm>({
    title: null,
    cuisine: null,
    source: null,
  });
  const setField = (field: string, value: string | number) => {
    setForm({ ...form, [field]: value });
  };
  const handleSubmit = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    e.preventDefault();
    const { title, cuisine, source } = form;
    if (!title) {
      toast.error("Please give your recipe a title!");
      return;
    }
    alert(JSON.stringify(form));
  };
  // STEP 1: create recipe with title, user, cuisine
  // STEP 2: populate recipe details with product search, unit/quant pickers

  // get cuisines list
  useEffect(() => {
    const getCuisines = async () => {
      const cuisineList = await axios.get("/db/cuisines");
      if (cuisineList.data) {
        setCuisines(cuisineList.data);
      }
    };
    getCuisines();
  }, []);

  //search cuisines
  const searchCuisines = (search: string) => {
    setCuisineValue(search);
    if (search.length === 0) {
      setDisplayCuisines([]);
      return;
    }
    const re = new RegExp("^" + search, "i");
    const match = cuisines?.filter((c) => re.test(c.name));
    if (match) {
      console.log(match);
      setDisplayCuisines(match);
    }
  };

  //select cuisine
  const selectCuisine = (c: cuisines) => {
    setCuisineValue(c.name);
    setDisplayCuisines([]);
    setField("cuisine", c.id);
  };

  //search sources
  const searchSources = async (str: string) => {
    setSourceValue(str);
    if (str.length === 0) {
      setSourceResults([]);
    } else {
      try {
        const response = await axios.post("db/sources", { search: str });

        setSourceResults(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Access to config, request, and response
          console.log(error.response); // this is the main part. Use the response property from the error object
          toast.error(error.response?.data);
          return error.response as AxiosResponse;
        } else {
          // Just a stock error
          return error as Error;
        }
      }
    }
  };

  //select source
  const selectSource = (s: sources) => {
    setSourceValue(s.name);
    setSourceResults([]);
    setField("source", s.id);
  };
  return (
    <>
      {/* Title Row */}
      <div
        style={{
          borderBottom: "2px solid #3960E8",
          marginBottom: "5px",
          width: "100%",

          color: "#71CDEA",
        }}
        className=" d-flex align-items-center justify-content-between"
      >
        <div className="px-1 d-flex align-items-center" style={{ gap: "15px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="white"
            className="bi bi-arrow-left-circle bright-fill"
            viewBox="0 0 16 16"
            onClick={() => setView("overview")}
          >
            <path
              fillRule="evenodd"
              d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
            />
          </svg>
          {"Step " + step}
        </div>
      </div>
      {/* Title */}
      <Form className="d-flex flex-column w-100">
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Title your recipe"
            onChange={(e) => setField("title", e.target.value)}
            className="border-1 border-black rounded text-white shadow-none"
            style={{
              border: "1.5px solid #529CDF",
              background: "#202020",
              padding: "2px 10px",
            }}
          />
        </Form.Group>

        {/* Cuisine */}
        <Form.Group className="mb-3 position-relative">
          <Form.Label>Cuisine</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. Italian"
            onChange={(e) => searchCuisines(e.target.value)}
            onClick={() => setCuisineValue("")}
            className="border-1 border-black rounded text-white shadow-none position-relative"
            value={cuisineValue}
            style={{
              border: "1.5px solid #529CDF",
              background: "#202020",
              padding: "2px 10px",
            }}
          />
          {displayCuisines.length > 0 && (
            <ul className="position-absolute w-100 list-unstyled">
              {displayCuisines.map((c) => {
                return (
                  <li
                    className="w-100 cuisine-btn"
                    key={c.id}
                    style={{
                      background: "#202020",
                      padding: "2px 10px",
                      borderBottom: "1px solid grey",

                      cursor: "pointer",
                    }}
                    onClick={() => selectCuisine(c)}
                  >
                    {c.name}
                  </li>
                );
              })}
            </ul>
          )}
        </Form.Group>

        {/* Source */}
        <Form.Group className="mb-3">
          <Form.Label>Source</Form.Label>
          <Form.Control
            type="text"
            placeholder="Name of blog or recipe book"
            onChange={(e) => searchSources(e.target.value)}
            value={sourceValue}
            onClick={() => setSourceValue("")}
            className="border-1 border-black rounded text-white shadow-none"
            style={{
              border: "1.5px solid #529CDF",
              background: "#202020",
              padding: "2px 10px",
            }}
          />
          {sourceResults.length > 0 && (
            <ul className="position-absolute w-100 list-unstyled">
              {sourceResults.map((s) => {
                return (
                  <li
                    className="w-100 cuisine-btn"
                    key={s.id}
                    style={{
                      background: "#202020",
                      padding: "2px 10px",
                      borderBottom: "1px solid grey",

                      cursor: "pointer",
                    }}
                    onClick={() => selectSource(s)}
                  >
                    {s.name}
                  </li>
                );
              })}
            </ul>
          )}
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="align-self-end"
          onClick={(e) => handleSubmit(e)}
        >
          Create
        </Button>
      </Form>
    </>
  );
};

export default CreateRecipe;
