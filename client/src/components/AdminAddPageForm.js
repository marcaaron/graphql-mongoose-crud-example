import React from 'react';

const AdminAddPageForm = (props) => {
  const {handleChange, handleSubmit, title, route, content, links} = props;
  return (
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input onChange={handleChange} type="text" id="title" value={title}></input>

        <label>Route</label>
        <input onChange={handleChange} type="text" id="route" value={route}></input>

        <label>Content</label>
        <input onChange={handleChange} type="text" id="content" value={content}></input>
        <input type="submit" value="Submit"/>
      </form>
  );
}
export default AdminAddPageForm;
