import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Navbar from "./components/Navbar";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

function App() {
  const [Todo, setTodo] = useState("");
  const [Todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(true);
  const [isUpdate, setisUpdate] = useState(false);
  const edited = useRef({
    id: "",
    value: ""
  })
  let addBtn = useRef(null);
  let inputBar = useRef(null);
  let updateBtn = useRef(null);
  const flag = useRef(false);

  const saveToLS = () => {
    localStorage.setItem("Todos", JSON.stringify(Todos));
  };

  const toggleFinished = () => {
    setshowFinished(!showFinished);
  };

  useEffect(() => {
    let todoString = localStorage.getItem("Todos");
    if (todoString) {
      let todos = JSON.parse(localStorage.getItem("Todos"));
      setTodos(todos);
    }
  }, []);

  useEffect(() => {
    if (flag.current) {
      saveToLS();
    }
    flag.current = true;
  }, [Todos]);

  const handleEdit = (id) => {
    inputBar.current.focus();
    let temp = Todos.filter((val)=> {
      return val.id === id
    })
    const value = temp[0].Todo
    edited.current.id = temp[0].id
    edited.current.value = value

    setTodo(value)
    setisUpdate(true)
  };

  const handleDelete = (id) => {
    let flag = confirm("Are u sure want to delete the note!!!");
    if (flag) {
      let updatedTodos = Todos.filter((item) => {
        return item.id !== id;
      });
      setTodos(updatedTodos);
    }
  };

  const handleAdd = () => {
    if (Todo.length > 3) {
      setTodos([...Todos, { id: uuidv4(), Todo, isCompleted: false }]);
      setTodo("");
    } else {
      alert("The Input Length should be greater than 3 !!!");
    }
  };

  const handleUpdate = () => {
    if (Todo.length > 3) {
      const id = edited.current.id
      let updatedTodos = [...Todos]
      let index = updatedTodos.findIndex((item)=>{
        return item.id === id
      })
      updatedTodos[index].Todo = Todo
      console.log(updatedTodos)
      setTodos(updatedTodos)
      setTodo("")
      edited.current = {}
      setisUpdate(false)
    } else {
      alert("The Input Length should be greater than 3 !!!");
      setTodo("")
       edited.current = {}
      setisUpdate(false)
    }
  }

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheck = (e) => {
    let id = e.target.name;
    let index = Todos.findIndex((val) => {
      return val.id === id;
    });
    let updatedTodos = [...Todos];
    updatedTodos[index].isCompleted = !updatedTodos[index].isCompleted;
    setTodos(updatedTodos);
  };

  return (
    <>
      <Navbar />
      <div className="md:container bg-violet-200 mx-auto w-[92vw] md:w-[40%] my-5 p-3 md:p-5 rounded-xl min-h-[70vh] md:min-h-[85vh]">
        <h1 className="font-bold text-2xl text-center">
          i-Task Manage your todos at one place
        </h1>
        <div className="addTodo my-5 flex flex-col gap-5">
          <h2 className="text-xl font-bold">Add Todo</h2>
          <div className="flex gap-2">
            <input
              ref={inputBar}
              onChange={handleChange}
              value={Todo}
              type="text"
              className="w-full px-5 py-1 rounded-full font-medium"
            />
            {isUpdate?( <button
              ref={updateBtn}
              onClick={handleUpdate}
              className="bg-violet-800 px-2 py-1 font-semibold text-base hover:bg-violet-950 rounded-lg text-white"
            >
              Update
            </button>):
            ( <button
              ref={addBtn}
              onClick={handleAdd}
              className="bg-violet-800 px-2 py-1 font-semibold text-base hover:bg-violet-950 rounded-lg text-white"
            >
              Add
            </button>)
            }
          </div>
        </div>
        <input
          id="show"
          onChange={toggleFinished}
          type="checkbox"
          checked={showFinished}
        />
        <label className="font-semibold mx-2" htmlFor="show">
          Show Finished
        </label>
        <h2 className="text-xl font-bold my-2">Your Todos</h2>
        <div className="todos flex flex-col">
          {Todos.length === 0 && <div className="m-4">No Todos to display</div>}

          {Todos.map((item, index) => {
            return (
              (showFinished || !item.isCompleted) && (
                <div
                  key={index}
                  className="todo flex w-full my-2 justify-between"
                >
                  <div className="flex gap-5">
                    <input
                      name={item.id}
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={handleCheck}
                    />
                    <div
                      className={
                        item.isCompleted
                          ? "line-through font-semibold text-lg"
                          : " font-semibold text-lg"
                      }
                    >
                      {item.Todo}
                    </div>
                  </div>
                  <div className="buttons flex items-center">
                    <button
                      onClick={() => {
                        handleEdit(item.id);
                      }}
                      className="bg-violet-800 px-2 py-1 font-bold text-base hover:bg-violet-950 mx-1 rounded-md text-white"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(item.id);
                      }}
                      className="bg-violet-800 px-2 py-1 font-bold text-base hover:bg-violet-950 mx-1 rounded-md text-white"
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
