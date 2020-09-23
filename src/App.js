import React from 'react'
import PropTypes from 'prop-types'
import { TodoForm, TodoList, Footer } from './components/todo/index'
import {
  addTodo,
  generateId,
  findById,
  toggleTodo,
  updateTodo,
  removeTodo,
  filterTodos,
} from './lib/todoHelpers'
import { pipe, partial } from './lib/utils'
import { loadTodos, createTodo, saveTodo, destroyTodo } from './lib/todoService'

import './App.css'

class App extends React.Component {
  state = {
    todos: [],
    currentTodo: '',
  }

  static contextTypes = {
    route: PropTypes.string,
  }

  componentDidMount() {
    loadTodos().then((todos) => this.setState({ todos }))
  }

  handleRemove = (id, evt) => {
    evt.preventDefault()
    const updatedTodos = removeTodo(this.state.todos, id)
    this.setState({ todos: updatedTodos })
    destroyTodo(id).then(() => this.showTempMessage('Todo Removed'))
  }

  /*handleToggle = (id) => {
    const todo = findById(id, this.state.todos)
    const toggled = toggleTodo(todo)
    const updatedTodos = updateTodo(this.state.todos, toggled)
    this.setState({ todos: updatedTodos })
  }*/

  handleToggle = (id) => {
    const getToggledTodo = pipe(findById, toggleTodo)
    const updated = getToggledTodo(id, this.state.todos)
    const getUpdatedTodos = partial(updateTodo, this.state.todos)
    const updatedTodos = getUpdatedTodos(updated)
    console.log('updated', updated)
    this.setState({ todos: updatedTodos })
    saveTodo(updated).then(() => this.showTempMessage('Todo Updated'))
  }

  handleInputChange = (e) => {
    this.setState({
      currentTodo: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const newId = generateId()
    const newTodo = {
      id: newId,
      name: this.state.currentTodo,
      isComplete: false,
    }
    const updateTodos = addTodo(this.state.todos, newTodo)
    this.setState({
      todos: updateTodos,
      currentTodo: '',
      errorMessage: '',
    })
    console.log('newTodo', newTodo)
    createTodo(newTodo).then(() => this.showTempMessage('Todo Added'))
  }

  handleEmptySubmit = (evt) => {
    evt.preventDefault()
    this.setState({
      errorMessage: 'Please supply the todo name',
    })
  }

  showTempMessage = (msg) => {
    this.setState({ successMessage: msg })
    setTimeout(() => this.setState({ successMessage: '' }), 2500)
  }

  render() {
    const submitHandler = this.state.currentTodo
      ? this.handleSubmit
      : this.handleEmptySubmit
    const displayTodos = filterTodos(this.state.todos, this.context.route)
    return (
      <div className="App">
        <div className="Todo-App">
          {this.state.errorMessage && !this.state.currentTodo && (
            <span className="error">{this.state.errorMessage}</span>
          )}
          {this.state.successMessage && (
            <span className="success">{this.state.successMessage}</span>
          )}
          <TodoForm
            handleInputChange={this.handleInputChange}
            currentTodo={this.state.currentTodo}
            handleSubmit={submitHandler}
          />
          <TodoList
            handleToggle={this.handleToggle}
            todos={displayTodos}
            handleRemove={this.handleRemove}
          />
          <Footer />
        </div>
      </div>
    )
  }
}

export default App
