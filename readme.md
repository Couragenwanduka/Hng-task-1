
# Express API Example

This repository contains an example Express API project that demonstrates how to retrieve a client's IP address and handle visitor names using Express.js.

## Getting Started

To get started with this project, follow these steps:

### Prerequisites

- Node.js and npm should be installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <https://github.com/Couragenwanduka/Hng-task-1.git>
  
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Define a `PORT` variable in the `.env` file, or it defaults to `8000`.

   Example `.env` file:
   ```
   PORT=8000
   ```

4. Start the server:
   ```bash
   npm start
   ```

   This will start the Express server on the specified port.

### Usage

#### `/user` Endpoint

- **Description**: Retrieves client's IP address and visitor name.
- **Method**: GET
- **URL**: `http://localhost:8000/api/hello`
- **Query Parameters**:
  - `visitorName`: Required parameter for the visitor's name.

#### Example Request

Make a GET request to `http://localhost:8000/api/hello?visitorName=John`.

```bash
curl -X GET 'http://localhost:8000/api/hello?visitorName=John'
```

#### Example Response

```json
{
    "clientsIp": "127.0.0.1",
    "visitorName": "John"
}
```

### Handling IPv6-mapped IPv4 Addresses

The server handles IPv6-mapped IPv4 addresses (`::ffff:127.0.0.1`) by extracting the IPv4 part for consistent output.

### Error Handling

The API handles errors gracefully and returns appropriate HTTP status codes and error messages.

### Logging

The server logs client IP addresses to aid in debugging and monitoring.
