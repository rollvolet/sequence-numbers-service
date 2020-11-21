# Sequence number service

Microservice generating sequence numbers for resources.

## Getting started
### Adding the service to your stack
Add the following snippet to your `docker-compose.yml`:
```yml
  sequence-numbers:
    image: rollvolet/sequence-numbers-service
```

Add the following rule to the dispatcher config in `./config/dispatcher/dispatcher.ex`
```elixir
  post "/sequence-numbers/*path", @json do
    Proxy.forward conn, path, "http://sequence-numbers/sequence-numbers/"
  end
```

## Reference
### API
#### POST /sequence-numbers
Get the next sequence number for a product

##### Response
- **200 OK** on successfull generation of a next sequence number.

Example response body
```javascript
{
  "data": {
    "type": "sequence-number",
    "id": "712a8670-2c45-11eb-865b-d941594a75d9",
    "attributes": {
      "value": 6344
    }
  }
}
```

#### POST /reset
Reset the in-memory cache of sequence numbers

##### Response
- **204 No Content** on successfull reset of the in-memory cache

#### GET /cache
Get the current state of the in-memory sequence numbers cache

##### Response
- **200 OK** containing the current state of the cache in the response body

Example response body
```javascript
{
  "data": {
    "type": "sequence-number",
    "id": "712a8670-2c45-11eb-865b-d941594a75d9",
    "attributes": {
      "value": 6344
    }
  }
}
```
