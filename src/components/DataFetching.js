import React, { useReducer, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./styles.module.css";
const initialState = {
  loading: true,
  error: "",
  posts: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        loading: false,
        error: "",
        posts: action.payload,
      };
    case "ADD_SUCCESS":
      return {
        loading: false,
        error: "",
        posts: [...state.posts, action.payload],
      };
    case "REMOVE_SUCCESS":
      return {
        loading: false,
        error: "",
        posts: state.posts.filter((post) => post.id !== action.payload),
      };
    case "FETCH_ERROR":
      return {
        loading: false,
        posts: [],
        error: "something went wrong",
      };
    default:
      return state;
  }
};

export default function DataFetching() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const titleInputRef = useRef();
  const bodyInputRef = useRef();

  useEffect(() => {
    state.posts.length === 0 &&
      axios
        .get("https://jsonplaceholder.typicode.com/posts")
        .then((response) => {
          dispatch({ type: "FETCH_SUCCESS", payload: response.data });
        })
        .catch((error) => {
          dispatch({ type: "FETCH_ERROR" });
        });
  }, [state]);

  const addPost = (e) => {
    e.preventDefault();
    
    const newPost = {
      title: titleInputRef.current.value,
      body: bodyInputRef.current.value,
      userId: new Date().getMilliseconds(),
    };
    axios
      .post("https://jsonplaceholder.typicode.com/posts", newPost)
      .then((response) => {
        dispatch({ type: "ADD_SUCCESS", payload: response.data });
      });
  };

  const removePost = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
    dispatch({ type: "REMOVE_SUCCESS", payload: id });
  };

  return (
    <div>
      {state.loading ? (
        "Loading"
      ) : (
        <div>
          <form onSubmit={addPost}>
            <p style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="title">title:</label>
              <input name="title" id="title" ref={titleInputRef} />

              <label htmlFor="body">body:</label>
              <input name="body" id="body" ref={bodyInputRef} />
            </p>
            <button onClick={addPost}>Add Post</button>
          </form>
          <p>
            number of Post:
            <span>{state.posts.length}</span>
          </p>
          <div style={{ display: "flex", flexDirection: "column-reverse" }}>
            {state.posts.map((post, index) => {
              return (
                <div className={styles.card} key={index}>
                  <p>{post.title}</p>
                  <hr />
                  <p>{post.body}</p>
                  <button onClick={() => removePost(post.id)}>REMOVE</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
