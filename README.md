# next-task-server
## Running
There needs to be a `private.key` file containing your JWT secret. This file is not included in the repository for security reasons. You can generate a new one with the following command:

```bash
openssl rand -base64 64 > private.key
```

Copy this file into the project's root directory.

## Dependencies

- @koa/router: ^12.0.0,
- @tsoa/runtime: ^5.0.0,
- class-transformer: ^0.5.1,
- class-validator: ^0.14.0,
- koa: ^2.14.1,
- pg: ^8.10.0,
- tslib: ^2.5.0,
- tsoa: ^5.1.1,
- typeorm: ^0.3.12,
- argon2: ^0.30.3,
- jsonwebtoken: ^9.0.0,
- try-v2: ^1.0.1,
- uuid: ^9.0.0 (marked for removal)
- @total-typescript/ts-reset: ^0.4.2
- @types/jest: ^29.5.0
- @types/koa: ^2.13.6
- @types/koa\_\_router: ^12.0.0
- @types/jsonwebtoken: ^9.0.1,
- @types/node: ^18.15.11,
- @types/uuid: ^9.0.1 (marked for removal)
- @typescript-eslint/eslint-plugin: ^5.57.1
- @typescript-eslint/parser: ^5.57.1
- eslint: ^8.37.0
- nodemon: ^2.0.22
- ts-jest: ^29.1.0
- ts-node: ^10.9.1
- typescript: ^5.0.3