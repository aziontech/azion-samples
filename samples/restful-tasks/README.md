# Restful Tasks

The Azion **Restful Tasks Example** is designed to demonstrate how to create a RESTful API using Edge Functions and Edge SQL.

## Prerequisites

Before running this project, ensure you have an Edge SQL instance set up and configured. This project relies on Edge SQL for data persistence.

## Usage Information

_Install dependencies_

```bash
pnpm install
```

### Local Development Setup

To run this application locally, you need to configure your `.env` file. Create a `.env` based in the `.env.example` file in the `restful-tasks` directory.

_Build Command_: To run the application build command

```bash
pnpm build
```

_Run local DEV_: To run the application locally with Vulcan

```bash
pnpm dev
```

## API Endpoints

This application provides a RESTful API for managing tasks.

### 1. Get all tasks

- **URL**: `/tasks`
- **Method**: `GET`
- **Description**: Retrieves a list of all tasks.
- **Response**:

  ```json
  [
    {
      "id": 1,
      "title": "Buy groceries",
      "completed": false
    },
    {
      "id": 2,
      "title": "Walk the dog",
      "completed": true
    }
  ]
  ```

### 2. Get a single task by ID

- **URL**: `/tasks/:id`
- **Method**: `GET`
- **Description**: Retrieves a single task by its ID.
- **Path Parameters**:
  - `id` (number): The ID of the task to retrieve.
- **Response**:

  ```json
  {
    "id": 1,
    "title": "Buy groceries",
    "completed": false
  }
  ```

- **Error Response (Task not found)**:

  ```json
  {
    "error": "Task not found"
  }
  ```

### 3. Create a new task

- **URL**: `/tasks`
- **Method**: `POST`
- **Description**: Creates a new task.
- **Request Body**:

  ```json
  {
    "title": "New task title",
    "completed": false
  }
  ```

  - `title` (string, required): The title of the new task.
  - `completed` (boolean, optional, default: `false`): The completion status of the task.

- **Response**:

  ```json
  {
    "id": 3,
    "title": "New task title",
    "completed": false
  }
  ```

### 4. Update an existing task

- **URL**: `/tasks/:id`
- **Method**: `PUT`
- **Description**: Updates an existing task by its ID.
- **Path Parameters**:
  - `id` (number): The ID of the task to update.
- **Request Body**:

  ```json
  {
    "title": "Updated task title",
    "completed": true
  }
  ```

  - `title` (string, optional): The new title for the task.
  - `completed` (boolean, optional): The new completion status for the task.

- **Response**:

  ```json
  {
    "id": 1,
    "title": "Updated task title",
    "completed": true
  }
  ```

- **Error Response (Task not found)**:

  ```json
  {
    "error": "Task not found"
  }
  ```

### 5. Delete a task

- **URL**: `/tasks/:id`
- **Method**: `DELETE`
- **Description**: Deletes a task by its ID.
- **Path Parameters**:
  - `id` (number): The ID of the task to delete.
- **Response**:

  ```json
  {
    "message": "Task deleted"
  }
  ```

- **Error Response (Task not found)**:

  ```json
  {
    "error": "Task not found"
  }
  ```
