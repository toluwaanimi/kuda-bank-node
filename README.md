# Kuda Bank NodeJS Library

## Getting Started



## Quick Start

```typescript
import { Kuda } from 'kuda-bank-node'
const fs = require("fs");


const email = ""
const clientKey = "n";
const accessToken = ""
const kuda  = new Kuda({
    email: email,
    clientApiKey: clientKey,
    accessToken: accessToken
},false)
const reference  = Math.floor(Math.random() * 1000000000000 + 1).toString()
kuda.request('ADMIN_MAIN_ACCOUNT_TRANSACTIONS',reference ,{
    PageSize: 10,
    PageNumber: 1
}).then(
    console.log
).catch(console.log)

```


