# iwh-demo


## Run

```
npm install
cp .env.example .env   # fill in PRIVATE_APP_ACCESS and CUSTOM_OBJECT_TYPE
npm start              # http://localhost:3000
```

`CUSTOM_OBJECT_TYPE` is the object type id (for example `0-1`) or its fully qualified name.

## How it works

- `index.js` creates one axios client for `/crm/v3/objects/<type>` with the bearer token.
- `PROPS` is the single list of properties used for the GET query, the form fields, the table columns and the POST body.
- `GET /` fetches records and renders `views/homepage.pug`.
- `GET /update-cobj` renders the form in `views/updates.pug`.
- `POST /update-cobj` creates the record, then redirects to `/`.
- Async errors go to one handler that shows HubSpot's error message.

## Not included

The token lives in `.env`, which is git-ignored. Never commit it.
