<template>
  <div id="app">
    <AddTodo v-on:add-todo="addTodo" />
    <Todos v-bind:todos="todos" v-on:del-todo="deleteTodo" />
  </div>
</template>

<script>
// eslint-disable-next-line
import Todos from "../components/Todos";
import AddTodo from "../components/AddTodo";

import axios from "axios";

export default {
  name: "Home",
  components: {
    Todos,
    AddTodo
  },
  data() {
    return {
      todos: []
    };
  },
  methods: {
    async deleteTodo(id) {
      try {
        await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);

        this.todos = this.todos.filter(todo => todo.id !== id);
      } catch (error) {
        console.error(error);
      }
    },
    async addTodo(newTodo) {
      const { title, completed } = newTodo;

      try {
        const todo = await axios.post(
          "https://jsonplaceholder.typicode.com/todos",
          {
            title,
            completed
          }
        );

        this.todos = [...this.todos, todo.data];
      } catch (error) {
        console.error(error);
      }
    }
  },
  async created() {
    try {
      const todos = await axios.get(
        "https://jsonplaceholder.typicode.com/todos?_limit=11"
      );
      this.todos = todos.data;
    } catch (error) {
      console.error(error);
    }
  }
};
</script>

<style>
* {
  margin: 0;
  box-sizing: border-box;
  padding: 0%;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.4;
}
.btn {
  display: inline-block;
  border: none;
  background: #555;
  color: #fff;
  padding: 7px 20px;
  cursor: pointer;
}
.btn:hover {
  background: #666;
}
</style>
