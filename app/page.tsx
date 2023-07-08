"use client";

import { useEffect, useRef, useState } from "react";

const API_URL = `${process.env.NEXT_PUBLIC_URL}/api/todoList`;

export default function Home() {
  const [list, setList] = useState<any[]>([]);

  async function getTodoList() {
    const response = await fetch(API_URL);
    const data = await response.json();
    setList(data);
  }

  // for inital loading
  useEffect(() => {
    getTodoList();
  }, []);

  // READ section
  const readSection = (
    <div className="space-y-2">
      <div className="mt-2 text-center font-bold text-2xl">TODO LIST</div>
      <div className="rounded-lg border border-gray-800">
        <ul role="list" className="divide-y divide-gray-500">
          {list.map((item: { id: number; todo: string }) => (
            <li
              key={item.id}
              className="flex p-2 justify-between gap-x-6 text-lg"
            >
              <span>{item.todo}</span>
              <span>ID # {item.id}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // CREATE section
  const addRef = useRef("");
  const handleAddChange = (e: React.FormEvent<HTMLInputElement>) => {
    addRef.current = e.currentTarget.value;
  };
  const addItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent refreshing
    const init = {
      method: "POST",
      body: JSON.stringify({ todo: addRef.current }),
    };
    const response = await (await fetch(API_URL, init)).json();
    if (response.message === "success") {
      const info = response.todoInfo;
      setList([...list, { id: info.id, todo: info.todo }]);
    }
    (e.target as HTMLFormElement).reset();
  };
  const createSection = (
    <div className="space-y-2">
      <div className="mt-2 text-center font-bold text-2xl">ADD</div>
      <form className="space-y-2" onSubmit={addItem}>
        <label htmlFor="create" className="font-bold text-lg">
          Add a new todo:
        </label>
        <br />
        <input
          className="outline outline-1 w-full indent-2"
          type="text"
          id="create"
          placeholder="TODO"
          onChange={handleAddChange}
        ></input>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-3 py-1 border border-blue-700 rounded w-full"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );

  // DELETE Section
  const deleteRef = useRef("");
  const handleDeleteChange = (e: React.FormEvent<HTMLInputElement>) => {
    deleteRef.current = e.currentTarget.value;
  };
  const deleteItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent refreshing
    const deleteId = Number(deleteRef.current);
    if (!Number.isFinite(deleteId)) return;
    const init = {
      method: "DELETE",
      body: JSON.stringify({ id: deleteId }),
    };
    const response = await (await fetch(API_URL, init)).json();
    if (response.message === "success") {
      let newList = [...list];
      for (let i = 0; i < newList.length; i += 1) {
        if (list[i].id === deleteId) {
          newList.splice(i, 1);
          break;
        }
      }
      setList(newList);
    }
    (e.target as HTMLFormElement).reset();
  };
  const deleteSection = (
    <div className="space-y-2">
      <div className="mt-2 text-center font-bold text-2xl">DELETE</div>
      <form className="space-y-2" onSubmit={deleteItem}>
        <label htmlFor="create" className="font-bold text-lg">
          Submit the ID you want to delete:
        </label>
        <br />
        <input
          className="outline outline-1 w-full indent-2"
          type="text"
          id="dekete"
          placeholder="ID"
          onChange={handleDeleteChange}
        ></input>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold px-3 py-1 border border-red-700 rounded w-full">
          Submit
        </button>
      </form>
    </div>
  );

  // UPDATE Section
  const updateIdRef = useRef("");
  const updateTodoRef = useRef("");
  const handleUpdateIdChange = (e: React.FormEvent<HTMLInputElement>) => {
    updateIdRef.current = e.currentTarget.value;
  };
  const handleUpdateTodoChange = (e: React.FormEvent<HTMLInputElement>) => {
    updateTodoRef.current = e.currentTarget.value;
  };
  const updateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent refreshing
    const updateId = Number(updateIdRef.current);
    const updateTodo = updateTodoRef.current;
    if (!Number.isFinite(updateId)) return;
    const init = {
      method: "PUT",
      body: JSON.stringify({ id: updateId, todo: updateTodo }),
    };
    const response = await (
      await fetch("http://localhost:3000/api/todoList", init)
    ).json();
    if (response.message === "success") {
      let newList = [...list];
      for (let i = 0; i < newList.length; i += 1) {
        if (list[i].id === updateId) {
          newList.splice(i, 1, { id: updateId, todo: updateTodo });
          break;
        }
      }
      setList(newList);
    }
    (e.target as HTMLFormElement).reset();
  };
  const updateSection = (
    <div className="space-y-2">
      <div className="mt-2 text-center font-bold text-2xl">UPDATE</div>
      <form className="space-y-2" onSubmit={updateItem}>
        <label htmlFor="update_id" className="font-bold text-lg">
          Submit the ID and TODO you want to change:
        </label>
        <input
          className="outline outline-1 w-full indent-2"
          type="text"
          id="update_id"
          placeholder="ID"
          onChange={handleUpdateIdChange}
        ></input>
        <input
          className="outline outline-1 w-full indent-2"
          type="text"
          id="update_todo"
          placeholder="TODO"
          onChange={handleUpdateTodoChange}
        ></input>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold px-3 py-1 border border-green-700 rounded w-full">
          Submit
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex justify-center">
      <div className="m-2 space-y-4 divide-y-4 max-w-lg">
        {readSection}
        {createSection}
        {deleteSection}
        {updateSection}
      </div>
    </div>
  );
}
