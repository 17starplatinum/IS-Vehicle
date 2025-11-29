# IS-1: Backend

# Стек технологий:
- Jakarta EE (CDI)
- JAX-RS 
- Mapstruct 
- WebSocket 
- PostgreSQL 
- Flyway 
- JPA 
- Hibernate 
- WildFly

# Ручки:
### Vehicles (машины):

- `/api/v1/vehicles` — `GET`

    Получает список транспортных средств.

    **Параметры запроса**:
    - **_page_** (default: 1) — номер страницы
    - **_size_** (default: 10) — размер страницы
    - **_sortBy_** (default: id) — поле сортировки
    - **_ascending_** (default: true) — направление сортировки (обычно — возрастающий)

    **Ответ**:
  ```json
  [
    {
      "id": 1,
      "name": "Geranium",
      "creationDate": "2025/11/07",
      "coordinates": {
        "id": 1,
        "x": 59,
        "y": 204
      },
      "type": "DRONE",
      "enginePower": 155.24,
      "numberOfWheels": 2,
      "capacity": 1,
      "distanceTravelled": 0,
      "fuelConsumption": 212306.445,
      "fuelType": "KEROSENE" 
    },
    {
       "...":  "..." 
    }
  ]
    ```

    **Коды**:
    - `200 OK` — успешно
    - `422 Unprocessable Entity` — ошибка валидации
    - `500 Internal Server Error` — другие ошибки



- `/api/v1/vehicles/{id}` — `GET`

    Получает транспортное средство по ID.

    **Параметр пути**: 
  - **_id_** — ID сущности

  **Ответ**:
  ```json
  {
      "id": 1,
      "name": "Geranium",
      "creationDate": "2025/11/07",
      "coordinates": {
          "id": 1,
          "x": 59,
          "y": 204
      },
      "type": "DRONE",
      "enginePower": 155.24,
      "numberOfWheels": 2,
      "capacity": 1,
      "distanceTravelled": 0,
      "fuelConsumption": 212306.445,
      "fuelType": "KEROSENE" 
  }
  ```

    **Коды**:
     - `200 OK` — успешно
     - `404 Not Found` — сущность не найдена
     - `500 Internal Server Error` — другие ошибки


- `/api/v1/vehicles` — `POST`
   Создает новое транспортное средство.

   **Параметр тела**:
    ```json
    {
        "name": "Geranium",
        "coordinates": {
            "x": 59,
            "y": 204
        },
        "type": "DRONE",
        "enginePower": 155.24,
        "numberOfWheels": 2,
        "capacity": 1,
        "distanceTravelled": 0,
        "fuelConsumption": 212306.445,
        "fuelType": "KEROSENE" 
    }
    ```

   **Ответ**:
    ```json
    {
        "id": 1,
        "name": "Geranium",
        "creationDate": "2025/11/07",
        "coordinates": {
            "id": 1,
            "x": 59,
            "y": 204
        },
        "type": "DRONE",
        "enginePower": 155.24,
        "numberOfWheels": 2,
        "capacity": 1,
        "distanceTravelled": 0,
        "fuelConsumption": 212306.445,
        "fuelType": "KEROSENE" 
    }
    ```
   **Коды**:
     - `201 Created` — успешное создание
     - `422 Unprocessable Entity` — ошибка валидации
     - `500 Internal Server Error` — другие ошибки


- `/api/v1/vehicles/{id}` — `PUT`

    Обновляет заданную через `id` транспортного средства.

    **Параметр пути**: 
  - **_id_** — ID сущности
   
  **Параметр тела**:
     ```json
     {
         "name": "Geranium",
         "coordinates": {
             "x": 59,
             "y": 204
         },
         "type": "PLANE",
         "enginePower": 155.24,
         "numberOfWheels": 2,
         "capacity": 1,
         "distanceTravelled": 22000000,
         "fuelConsumption": 212306.445,
         "fuelType": "ALCOHOL" 
     }
     ```

    **Ответ**:
     ```json
     {
         "id": 1,
         "name": "Geranium",
         "creationDate": "2025/11/07",
         "coordinates": {
             "id": 1,
             "x": 59,
             "y": 204
         },
         "type": "PLANE",
         "enginePower": 155.24,
         "numberOfWheels": 2,
         "capacity": 1,
         "distanceTravelled": 22000000,
         "fuelConsumption": 212306.445,
         "fuelType": "ALCOHOL" 
     }
     ```
    **Коды**:
     - `200 OK` — успешно
     - `404 Not Found` — сущность не найдена
     - `422 Unprocessable Entity` — ошибка валидации
     - `500 Internal Server Error` — другие ошибки


- `/api/v1/vehicles/{id}` — `DELETE`

  Удаляет транспортное средство по `id`.

  **Параметр пути**:
  - **_id_** — ID сущности
  
  **Ответ**: `-`

  **Коды**:
  - `204 No Content` — успешно
  - `404 Not Found` — сущность не найдена
  - `500 Internal Server Error` — другие ошибки



- `/api/v1/vehicles/special/total-fuel-consumption` — `GET`

  Возвращает сумму значений поля `fuelConsumption` для всех транспортных средств.

  **Ответ**:
  ```json
  
  ```

  **Коды**:
    - `200 OK` — успешно
    - `500 Internal Server Error` — ошибки


- `/api/v1/vehicles/special/group-by-fuel-consumption` — `GET`

  Возвращает количество транспортных средств в каждой группе расхода топлива.

  **Ответ**:
    ```json
    {
      "1": "2",
      "2.22": "3",
      "...": "..."
    }
    ```

    **Коды**:
    - `200 OK` — успешно
    - `500 Internal Server Error` — ошибки


- `/api/v1/vehicles/special/fuel-type-less` — `GET`
  
    Возвращает массив транспортных средств, значение поля fuelType которых меньше заданного.

  **Параметры запроса**:
    - **_fuelType_** — вид топлива

  **Ответ**:
    ```json
    [
      {
        "id": 1,
        "name": "Geranium",
        "creationDate": "2025/11/07",
        "coordinates": {
          "id": 1,
          "x": 59,
          "y": 204
        },
        "type": "DRONE",
        "enginePower": 155.24,
        "numberOfWheels": 2,
        "capacity": 1,
        "distanceTravelled": 0,
        "fuelConsumption": 212306.445,
        "fuelType": "KEROSENE" 
      },
      {
         "...":  "..." 
      }
   ]
    ```

    **Коды**:
     - `204 OK` — успешно
     - `400 Bad Request` — Неправильный вид топлива (которого не рассматривали в системе) 
     - `500 Internal Server Error` — ошибки


- `/api/v1/vehicles/special/power-range` — `GET`

  Возвращает транспортные средства с мощностью двигателя в заданном диапазоне (включительно).

  **Параметры запроса**:
    - **_min_** — минимальный порог
    - **_max_** — максимальный предел

  **Ответ**:
    ```json
    [
      {
        "id": 1,
        "name": "Geranium",
        "creationDate": "2025/11/07",
        "coordinates": {
          "id": 1,
          "x": 59,
          "y": 204
        },
        "type": "DRONE",
        "enginePower": 155.24,
        "numberOfWheels": 2,
        "capacity": 1,
        "distanceTravelled": 0,
        "fuelConsumption": 212306.445,
        "fuelType": "KEROSENE" 
      },
      {
         "...":  "..." 
      }
   ]
    ```

  **Коды**:
    - `204 OK` — успешно
    - `400 Bad Request` — Невалидные пределы (оба должны быть не null)
    - `500 Internal Server Error` — ошибки
  

- `/api/v1/vehicles/special/reset-distance/{id}` — `PATCH`

  "Скручивает" счётчик пробега транспортного средства с заданным `id` до нуля.

  **Параметр пути**:
    - **_id_** — ID сущности

  **Ответ**: `-`

  **Коды**:
    - `200 OK` — успешно
    - `404 Not Found` — сущность не найдена
    - `500 Internal Server Error` — ошибки


### Coordinates (координаты)
- `/api/v1/coordinates` — `GET`

   Получает список координат.

   **Параметры запроса**:

  - **_page_** (default: 1) — номер страницы
  - **_size_** (default: 10) — размер страницы
  - **_sortBy_** (default: id) — поле сортировки
  - **_ascending_** (default: true) — направление сортировки (обычно — возрастающий)

  **Ответ**:
    ```json
    [
      {
        "id": 1,
        "x": 0.124654,
        "y": 120.5461 
      },
      {
        "...":  "..." 
      }
    ]
    ```
    **Коды**:
    - `200 OK` — успешно
    - `422 Unprocessable Entity` — ошибка валидации
    - `500 Internal Server Error` — другие ошибки


- `/api/v1/coordinates/{id}` — `GET`

   Получает транспортное средство по ID.

   **Параметр пути**: 
   - **_id_** — ID сущности

    **Ответ**:
    ```json
    {
      "id": 1,
      "x": 0.124654,
      "y": 120.5461
    }
    ```

  **Коды**:
    - `200 OK` — успешно
    - `404 Not Found` — сущность не найдена
    - `500 Internal Server Error` — другие ошибки


- `/api/v1/coordinates` — `POST`

  Создает новое транспортное средство.

  **Параметр тела**:
    ```json
    {
      "x": 59,
      "y": 204
    }
    ```

  **Ответ**:
    ```json
    {
      "id": 1,
      "x": 59,
      "y": 204
    }
    ```
  **Коды**:
    - `201 Created` — успешное создание
    - `422 Unprocessable Entity` — ошибка валидации
    - `500 Internal Server Error` — другие ошибки


- `/api/v1/coordinates/{id}` — `PUT`

  Обновляет заданную через `id` координат.

  **Параметр пути**:
    - **_id_** — ID сущности

  **Параметр тела**:
     ```json
     {
       "x": 22,
       "y": 23.15654 
     }
     ```

  **Ответ**:
     ```json
     {
       "id": 1,
       "x": 22,
       "y": 23.15654 
     }
     ```
  **Коды**:
    - `200 OK` — успешно
    - `404 Not Found` — сущность не найдена
    - `422 Unprocessable Entity` — ошибка валидации
    - `500 Internal Server Error` — другие ошибки


- `/api/v1/coordinates/{id}` — `DELETE`

  Удаляет координаты по `id`.

  **Параметр пути**:
    - **_id_** — ID сущности

  **Ответ**: `-`

  **Коды**:
    - `204 No Content` — успешно
    - `404 Not Found` — сущность не найдена
    - `500 Internal Server Error` — другие ошибки
