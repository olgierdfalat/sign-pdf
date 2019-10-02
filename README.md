# sign-pdf

Simple example how to use sign PDF using [node-signpdf](https://github.com/vbuch/node-signpdf/) library

### How install

```
npm install
```

### How to run

Sign dynamic PDF with passphrase:

```
node index.js --passphrase=password
```

Sign static pdf without passphrase
```
node index.js
```


That should create signed PDF in *./output* directory



