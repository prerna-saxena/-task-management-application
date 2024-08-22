import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

const initialColumns = {
  todo: {
    name: "To Do",
    items: []
  },
  inProgress: {
    name: "In Progress",
    items: []
  },
  done: {
    name: "Done",
    items: []
  }
};

const App = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [taskTitle, setTaskTitle] = useState("");

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };

  const handleAddTask = () => {
    if (!taskTitle) return;

    const newTask = { id: Date.now().toString(), content: taskTitle };
    const newColumns = {
      ...columns,
      todo: {
        ...columns.todo,
        items: [newTask, ...columns.todo.items]
      }
    };
    setColumns(newColumns);
    setTaskTitle("");
  };

  return (
    <div className="App">
      <h2>Task Management</h2>
      <div className="task-input">
        <input
          type="text"
          placeholder="Enter task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <div className="columns">
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div className="column" key={columnId}>
                <h3>{column.name}</h3>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: snapshot.isDraggingOver
                          ? "lightblue"
                          : "lightgrey",
                        padding: 4,
                        width: 250,
                        minHeight: 500
                      }}
                    >
                      {column.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: "none",
                                padding: 16,
                                margin: "0 0 8px 0",
                                minHeight: "50px",
                                backgroundColor: snapshot.isDragging
                                  ? "#263B4A"
                                  : "#456C86",
                                color: "white",
                                ...provided.draggableProps.style
                              }}
                            >
                              {item.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
};

export default App;
