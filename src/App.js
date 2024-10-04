import Button from "react-bootstrap/Button";
import "./App.css";
import { useState } from "react";
import axios from "axios";
import { SunOutlined, MoonOutlined, EyeOutlined } from "@ant-design/icons";
import Modal from "react-bootstrap/Modal";

import { CloseOutlined } from "@ant-design/icons";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [show, setShow] = useState(false);
  const [showFinishedTasks, setShowFinishedTasks] = useState(false);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [_index, set_index] = useState(null);

  function handleChange(event) {
    setTask(event.target.value);
  }
  function onTaskAdd() {
    let taskobj = {
      id: (Math.random() + 1).toString(36).substring(7),
      title: task,
      time: new Date().getHours() + ":" + new Date().getMinutes(),
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    };
    axios
      .post("http://localhost:4001/storetasks", taskobj)
      .then((res) => {
        setTasks(res.data.tasks || []);
      })
      .catch((error) => {
        console.error("Error adding task:", error.response.data);
        setTasks([]);
      });
  }
  const handleDelete = (index) => {
    axios
      .delete(`http://localhost:4001/deletetaskbyid?id=${tasks[index].id}`)
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };
  const handleTaskChange = (event) => {
    let _tasks = [...tasks];
    _tasks[_index].title = event.target.value;
    setTasks(_tasks);
  };
  function handleSave() {
    let task = tasks[_index];
    const taskTitle = task.title;
    axios
      .put(`http://localhost:4001/updatetaskbyid?id=${task.id}`, taskTitle)
      .then((res) => {
        setTasks(res.data.tasks);
        handleClose();
      });
    // console.log(task.title, "title")
  }
  const handleStatusChange = (index) => {
    let _tasks = [...tasks];
    _tasks[index].status = "Finished";
    setTasks(_tasks);

    axios
      .put(
        `http://localhost:4001/updatetaskbyid?id=${_tasks[index].id}`,
        _tasks[index]
      )
      .then((res) => {
        setTasks(res.data.tasks);
        console.log(res.data.tasks);
      })
      .catch((error) => {
        console.error("Error updating task status:", error);
      });
  };
  const handleShowFinishedTasks = () => {
    const filteredTasks = tasks.filter((task) => task.status === "Finished");
    setFinishedTasks(filteredTasks);
    setShowFinishedTasks(true);
  };
  return (
    <div
      className={
        darkMode
          ? "outer container-fluid dark-mode"
          : "outer container-fluid light-mode"
      }
    >
      <div className="inner">
        <div className="heading ">
          <h2>My To Do List</h2>
        </div>

        <div className="w-100 my-5 d-flex justify-content-center gap-4">
          <form className="form-input  d-flex justify-content-center  ">
            <input value={task} onChange={handleChange} />
          </form>

          <div>
            <Button
              variant="outline-info"
              style={{
                fontWeight: "600",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                fontSize: "16px",
                padding: "5px 20px 5px 20px",
              }}
              type="submit"
              onClick={onTaskAdd}
            >
              Add
            </Button>
          </div>
          <div>
            <Button
              variant="outline-light"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <SunOutlined /> : <MoonOutlined />}
            </Button>
          </div>
        </div>

        <div className="container  table overflow-auto overflow-x-hidden">
          <table className="mb-4 w-100 gap-3 ">
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Todo item</th>
                <th scope="col">Status</th>
                <th scope="col">Date/Time</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1 + "-"}</td>
                  <td>{item.title}</td>
                  <td>{item.status}</td>
                  <td>
                    {item.date} / {item.time}
                  </td>
                  <td>
                    <button
                      className="col btn btn-outline-dark ms-1"
                      onClick={() => {
                        handleShow();
                        set_index(index);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="col btn btn-outline-dark ms-1"
                      onClick={() => handleStatusChange(index)}
                    >
                      Finished
                    </button>
                    <Button
                      className="col btn-outline-dark ms-1"
                      onClick={handleShowFinishedTasks}
                    >
                      <EyeOutlined />
                    </Button>
                  </td>
                  <td>
                    <CloseOutlined onClick={() => handleDelete(index)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show}
          onHide={handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontWeight: "bold" }}>Edit Task</Modal.Title>
          </Modal.Header>
          <div className="form-input2">
            <input
              value={tasks?.[_index]?.title || ""}
              onChange={handleTaskChange}
              type="text"
              className="w-50"
            />
          </div>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="success" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        {/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
        <Modal
          aria-labelledby="finished-tasks-modal"
          centered
          show={showFinishedTasks}
          onHide={() => setShowFinishedTasks(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontWeight: "bold" }}>
              Finished Tasks
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {finishedTasks.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Todo item</th>
                    <th>Date/Time</th>
                  </tr>
                </thead>
                <tbody >
                  {finishedTasks.map((task, index) => (
                    <tr key={task.id}>
                      <td>{index + 1}</td>
                      <td>{task.title}</td>
                      <td>
                        {task.date} / {task.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No finished task</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowFinishedTasks(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default App;
