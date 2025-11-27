# Code Generation Copilot - API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend-url.onrender.com/api
```

## Authentication
Currently, the API does not require authentication. User ID can be optionally provided in requests.

---

## Endpoints

### 1. Health Check

Check if the API is running.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-11-22T10:30:00.000Z"
}
```

**Status Codes:**
- `200 OK` - API is running

---

### 2. Get Supported Languages

Retrieve list of all supported programming languages.

**Endpoint:** `GET /api/languages`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Python",
      "extension": ".py"
    },
    {
      "id": 2,
      "name": "JavaScript",
      "extension": ".js"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Database error

---

### 3. Generate Code

Generate code from a natural language prompt using AI.

**Endpoint:** `POST /api/generate`

**Request Body:**
```json
{
  "prompt": "Write a Python function to calculate factorial",
  "language": "Python",
  "userId": 1  // Optional
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| prompt | string | Yes | Natural language description (10-5000 chars) |
| language | string | Yes | Programming language name |
| userId | integer | No | User ID for tracking |

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "prompt": "Write a Python function to calculate factorial",
    "language": "Python",
    "code": "def factorial(n):\n    if n == 0 or n == 1:\n        return 1\n    return n * factorial(n - 1)",
    "createdAt": "2025-11-22T10:30:00.000Z",
    "user": null
  }
}
```

**Error Responses:**

**400 Bad Request** - Validation error:
```json
{
  "success": false,
  "errors": [
    "Prompt must be between 10 and 5000 characters"
  ]
}
```

**400 Bad Request** - Unsupported language:
```json
{
  "success": false,
  "error": "Language \"Ruby\" is not supported. Please choose from available languages."
}
```

**500 Internal Server Error** - OpenAI API error:
```json
{
  "success": false,
  "error": "Failed to generate code. Please try again."
}
```

**Status Codes:**
- `201 Created` - Code generated successfully
- `400 Bad Request` - Invalid input
- `500 Internal Server Error` - Server or AI API error

---

### 4. Get Generation History

Retrieve paginated list of previous code generations.

**Endpoint:** `GET /api/history`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number (min: 1) |
| limit | integer | No | 10 | Items per page (1-50) |
| language | string | No | - | Filter by language name |
| userId | integer | No | - | Filter by user ID |

**Example Requests:**

```
GET /api/history
GET /api/history?page=2
GET /api/history?page=1&limit=20
GET /api/history?language=Python
GET /api/history?userId=1&page=2
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "generations": [
      {
        "id": 123,
        "prompt": "Write a Python function to calculate factorial",
        "language": "Python",
        "code": "def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)",
        "createdAt": "2025-11-22T10:30:00.000Z",
        "user": {
          "username": "demo",
          "email": "demo@example.com"
        }
      },
      {
        "id": 122,
        "prompt": "Create a JavaScript function to reverse string",
        "language": "JavaScript",
        "code": "function reverseString(str) {\n  return str.split('').reverse().join('');\n}",
        "createdAt": "2025-11-22T09:15:00.000Z",
        "user": null
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 47,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

**Error Responses:**

**400 Bad Request** - Invalid parameters:
```json
{
  "success": false,
  "errors": [
    "Page must be a positive integer",
    "Limit must be between 1 and 50"
  ]
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid query parameters
- `500 Internal Server Error` - Database error

---

## Response Format

All API responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ]  // Optional
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Invalid API key (OpenAI) |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Duplicate entry |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, consider implementing:
- Max 100 requests per 15 minutes per IP
- Max 50 code generations per hour

---

## Code Examples

### JavaScript (Axios)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Generate code
async function generateCode(prompt, language) {
  try {
    const response = await axios.post(`${API_URL}/generate`, {
      prompt,
      language
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}

// Get history
async function getHistory(page = 1) {
  try {
    const response = await axios.get(`${API_URL}/history`, {
      params: { page, limit: 10 }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}

// Usage
const result = await generateCode('Sort an array in Python', 'Python');
console.log(result.data.code);

const history = await getHistory(1);
console.log(history.data.generations);
```

### Python (Requests)

```python
import requests

API_URL = 'http://localhost:5000/api'

# Generate code
def generate_code(prompt, language):
    response = requests.post(f'{API_URL}/generate', json={
        'prompt': prompt,
        'language': language
    })
    return response.json()

# Get history
def get_history(page=1, limit=10):
    response = requests.get(f'{API_URL}/history', params={
        'page': page,
        'limit': limit
    })
    return response.json()

# Usage
result = generate_code('Sort an array in Python', 'Python')
print(result['data']['code'])

history = get_history(page=1)
print(f"Total items: {history['data']['pagination']['totalItems']}")
```

### cURL

```bash
# Generate code
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a function to reverse a string",
    "language": "Python"
  }'

# Get history
curl http://localhost:5000/api/history?page=1&limit=10

# Get languages
curl http://localhost:5000/api/languages

# Health check
curl http://localhost:5000/api/health
```

---

## Database Schema Reference

### Tables

**users**
- `id` (PK): Integer, Auto-increment
- `username`: String, Unique
- `email`: String, Unique
- `created_at`: Timestamp

**languages**
- `id` (PK): Integer, Auto-increment
- `name`: String, Unique
- `extension`: String
- `created_at`: Timestamp

**generations**
- `id` (PK): Integer, Auto-increment
- `prompt`: Text
- `language_id` (FK): Integer → languages.id
- `user_id` (FK): Integer → users.id (nullable)
- `code`: Text
- `created_at`: Timestamp (indexed)

---

## Testing with Postman

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "Code Copilot API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/health"
      }
    },
    {
      "name": "Get Languages",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/languages"
      }
    },
    {
      "name": "Generate Code",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/generate",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"prompt\": \"Write a Python function to calculate factorial\",\n  \"language\": \"Python\"\n}"
        }
      }
    },
    {
      "name": "Get History",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/history?page=1&limit=10"
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ]
}
```

---

## Changelog

### v1.0.0 (2025-11-22)
- Initial API release
- Endpoints: generate, history, languages, health
- PostgreSQL database integration
- OpenAI GPT-3.5-turbo integration
- Pagination support
- Input validation
- Error handling

---

## Support

For issues or questions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/code-copilot/issues)
- Email: support@example.com

---

**Last Updated:** November 22, 2025
