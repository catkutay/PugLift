## INSTALLATION

### Prerequisites

* [node 8](https://nodejs.org/en/) _optionally install via `nvm` ([Mac/Linux](https://github.com/creationix/nvm), [Windows](https://github.com/coreybutler/nvm-windows))_
* [git](https://git-scm.com/)
* _optional_ [yarn](https://yarnpkg.com/en/)

### Setup repository

Clone this repository to your computer and bring up your `terminal` to this directory. Install js dependencies by typing:

```
yarn
```
or

```
npm i
```

## DEVELOP

To start developing simply type:

```
yarn start
```

This automatically lints the files based on slightly modified __standard__ javascript rules. If you want to just lint you can run:

```
yarn run lint
```

## TEST THE SERVER

To test the server you need to install [wrk](https://github.com/wg/wrk)
