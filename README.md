# Kuda Bank NodeJS Library

## Getting Started



## Quick Start

```typescript
import { Kuda } from 'kuda-bank-node'
const fs = require("fs");

const publicKey = fs.readFileSync("./kuda.public.xml"); // or path to your kuda public key
const privateKey = fs.readFileSync("./path-to-private-key.xml"); // or path to your kuda kuda private key
const clientKey = "name-of-private-key-file";

const kuda  = new Kuda(publicKey,privateKey,clientKey,true)
const reference  = Math.floor(Math.random() * 1000000000000 + 1).toString()
kuda.request('Admin_Retrieve_Virtual_Accounts',reference ,{
    PageSize: 10,
    PageNumber: 1
}).then(
    console.log
).catch(console.log)

```


