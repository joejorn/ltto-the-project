// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false
};

export const CONST_PATH_IDS = {
    root: 'dev',
    config: 'config',
    priceList: 'ENTRY_PRICE_LIST',
    priceCatgory: 'ENTRY_PRICE_CATEGORY',
	users: 'users',
    entryPath: {
        root: 'entries'
    },
    sheetPath: {
        root: 'sheets',
        nested: 'sheet-groups',
        children: ['entries']
    },
    sheetGroupPath: {
        root: 'sheet-groups',
        nested: 'sheets',
        children: ['sheets', 'entries'],
    },
    documentPath: {
        root: 'documents',
        children: ['sheet-groups', 'sheets', 'entries']
    }
};

export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  storageBucket: "",
  messagingSenderId: ""
};