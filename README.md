## INSTALLATION

### Prerequisites

* [node 8](https://nodejs.org/en/) _optionally install via `nvm` ([Mac/Linux](https://github.com/creationix/nvm), [Windows](https://github.com/coreybutler/nvm-windows))_
* [git](https://git-scm.com/)

### Setup repository

Clone this repository to your computer and bring up your `terminal` to this directory. Install js dependencies by typing:

```
npm i
```

## DEVELOP

To start developing simply type:

```
npm run develop
```

This automatically lints the files based on slightly modified __standard__ javascript rules. If you want to just lint you can run:

```
npm run lint
```

## UPLOAD TO GCLOUD

First you need to install the gcloud tool and follow the instructions to initialise it on your machine. Then simply run:

```
npm run deploy
```

## TEST THE SERVER

To test the server you need to install [Gatling](http://gatling.io/) and download the other repository in this project.
