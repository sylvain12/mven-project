# MVEN (MongoDB, Vue.JS, Express, Node.JS) PROJECT

the project implement CRUD operations on clients and providers.

---
## 1. Requirements

=> `Node.js / npm`

For development, you will only need Node.js and a node global package, npm, git
 installed in your environment.

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Linux (Ubuntu)

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt update
      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

=> `Git`
- #### Git installation on Windows
Visit: this site https://git-scm.com/

- #### Git installation on Linux(Ubuntu)

       $ sudo apt-get install git

After you can run this command to check

      $ git --version
      git version 2.25.1



---

## 2. Install project

Clone the project code on your machine

    $ git clone https://github.com/sylvain12/mven-project
    $ cd mven-project
    $ ls
    Readme.md   client   config.example.env models   package-lock.json  routes     utils app.js    config.env    controllers   package.json  server.js

## 3. Configuraton
 ### `Node Configuration`
 At the root of the project run :

    $ npm install


Rename `config.example.env` to `config.env`

    $ mv config.example.env


## Database
## Running the project

    $ yarn start