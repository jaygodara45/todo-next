"use client";
import Todo from "@/components/Todo";
import axios from "axios";
import { mongo } from "mongoose";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [todoData, setTodoData] = useState([]);

  const fetchTodos = async () => {
    const response = await axios.get("/api");
    setTodoData(response.data.todos);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const deleteTodo = async (id) => {
    const response = await axios.delete("/api", {
      params: {
        mongoId: id,
      },
    });
    toast.success(response.data.msg);
    await fetchTodos();
  };

  const completeTodo = async (id) => {
    const response = await axios.put(
      "/api",
      {},
      {
        params: {
          mongoId: id,
        },
      }
    );
    toast.success(response.data.msg);
    await fetchTodos();
  };

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((form) => ({ ...form, [name]: value }));
    console.log(formData);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      //api code
      const response = await axios.post("/api", formData);
      // toast.success("Done");
      toast.success(response.data.msg);
      setFormData({
        title: "",
        description: "",
      });
      await fetchTodos();
    } catch (error) {
      toast.error("Error");
    }
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={onSubmitHandler}
        className="flex items-start flex-col gap-2 w-[80%] max-w-[600px] mt-24 px-2 mx-auto"
      >
        <input
          type="text"
          name="title"
          placeholder="Enter title"
          className="px-3 py-2 border-2 border-zinc-400 rounded-md w-full"
          onChange={onChangeHandler}
          value={formData.title}
        />
        <textarea
          name="description"
          placeholder="Enter the description here"
          className="px-2 py-2 border-2 w-full rounded-md resize-none border-zinc-300"
          onChange={onChangeHandler}
          value={formData.description}
        ></textarea>
        <button
          type="submit"
          className="bg-orange-600 py-3 px-11 text-white rounded-md w-auto"
        >
          Add TODO
        </button>
      </form>

      <div className="relative overflow-x-auto mt-24 w-[60%] mx-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Id
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {todoData.reverse().map((item, index) => {
              return (
                <Todo
                  key={index}
                  id={index}
                  title={item.title}
                  description={item.description}
                  complete={item.isCompleted}
                  mongoId={item._id}
                  deleteTodo={deleteTodo}
                  completeTodo={completeTodo}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
