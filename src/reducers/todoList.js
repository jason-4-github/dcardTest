const todoList = (state = {}, action) => {
  switch(action.type) {
    default:
      return {
        ...state,
        ...action,
      }
  }
};

export default todoList;