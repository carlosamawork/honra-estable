// components/OrderingComponent.js
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const OrderingComponent = ({ value, onChange }) => {
  // Handle the drag-and-drop logic here...
  // Reorder the list based on drag-and-drop results
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    // Get the reordered list
    const items = reorder(
      value,
      result.source.index,
      result.destination.index
    );

    // Update the order field for each post based on its position
    const updatedItems = items.map((post, index) => ({
      ...post,
      order: index + 1 // Assuming order starts from 1
    }));

    onChange(updatedItems); // Update Sanity
  };


  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="posts">
        {(provided) => (
          <div ref={provided.innerRef}>
            {value.map((post, index) => (
              <Draggable key={post._id} draggableId={post._id} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    {post.title}
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default OrderingComponent;
