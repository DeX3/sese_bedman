Bedman hotel management app
===========================

Na na na Na na na Na na na Na na na BEDMAN

This document explains how to get bedman up and running and how to add new
features to it.

Setup
-----

Bedman is a node.js application so you're gonna need node.js installed on your
system.

Bedman is split into a backEnd and a frontEnd: The backEnd is basically a
RESTful API (backed by a MySQL database) created with express.js. The frontEnd
is implemented with AngularJS and consumes the API the backEnd provides.

Once you have cloned this repo, `cd` into it and execute `npm install`.
This will install all dependencies bedman needs. If you want to develop new
features, you should also `npm install` the following node packages globally
(you have to install them globally so that their executables get added to your
`$PATH`):

    npm install
    npm install -g grunt-cli    # for the grunt-executable
    npm install -g bower        # for the bower-executable

Now that you have your backEnd dependencies all nice set up, go ahead and
install the frontEnd deps as well:
    
    bower install       # this will install angular, jquery and bootstrap


## Database stuff

Bedman is backed by a MySQL database (actually, a lot of databases should work,
but we'll stick to MySQL here). If you haven't already, go ahead and install a
mysql server on your machine.

It's best if you create a user and database(s) that bedman can use just for
itself. You should create 3 databases - one for each environment (check the
Configuration section for more info on environments). What you name the user (as
well as his password) is completely up to you, just make sure to put the same
values in your local bedman configuration file.

    mysql -u root -p
    mysql> CREATE DATABASE bedman_development;
    mysql> CREATE DATABASE bedman_test;
    mysql> CREATE DATABASE bedman_production;
    mysql> CREATE USER "bedman"@"localhost" IDENTIFIED BY "somepassword";
    mysql> GRANT ALL PRIVILEGES ON bedman_development.* TO
           "bedman"@"localhost";
    mysql> GRANT ALL PRIVILEGES ON bedman_test.* TO
            "bedman"@"localhost";
    mysql> GRANT ALL PRIVILEGES ON bedman_production.* TO
            "bedman"@"localhost";
    mysql> exit

## Initial configuration

In the `config/` folder of this repository, you should find bedmans
configuration files. Go ahead and create a file called `local.json` there. This
file is purposefully .gitignored and should contain your own personal
configuration options for bedman (such as the db-user-password you chose for
your database user). Fill it with the following:

    {
        "db": {
            "connection": {
                "user": "bedman",
                "password": "somepassword"
            }
        }
    }

Good on you! You should now be able to start bedman by running `grunt server`.
Access it via http://localhost:3000/


The Gruntfile
-------------
The gruntfile handles all the tasks associated with bedman. Its tasks
include:

* `server`: Start the development server. All javascript files will be linted
  before the server starts. Once the server is running, the task watches for
  changes to server-relevant javascript-files and restarts the server if
  necessary. Also includes livereload so you don't have to press that pesky F5
  key.
* `test`: Start the application in the `test`-environment and perform the tests.
* `lint`: Simply lint all javascript files and print results to stdout.
* `doc`: Generate documentation. If you're looking at this in a webbrowser, you
  already did this, yay! Documentation will be put into `doc/`.
* `express:<env>` for `<env>` use `development`, `production` or `test` to start
  the app in the according environment. Use `express:production` to start the
  application in production mode!

Configuration
-------------

Bedman is environment-driven, that means it can be started in 3 modes:

* `development`: Your bread-and-butter mode, when you develop new features,
  bedman will typically run in this environment.
* `test`: This environment is used by the automatic test suite, when you run
  `grunt test`, bedman will automatically start in this environment.
* `production`: This is the environment used in production mode.

Application configuration is handled by node-config
(https://github.com/lorenwest/node-config) and all config files are located in
`config/`. You can use `json` and `js` (and more!) as file extensions for all
configuration files, but for the sake of simplicity in this explanation, `js` is
assumed from now on. This has the added benefit, that you can actually compute
configuration values. 

`config/default.json` contains basic configuration options that are the same
across all environments. To configure environment-specific stuff, use
`config/<environment.js>` which will override the default settings. To further
override these settings, you can use `config/local.js` or
`config/local-<environment>.js` which are gitignored, so they are perfect for
storing locally specific settings such as a database password.

Database
--------
The application expects one of the following SQL-servers:
* MySQL (default)
* PostgreSQL
* SQLite
* and more (whatever bookshelf.js/knex.js support)

The application's connection settings are stored in `config/default.json`, 
`config/<environment>.json` and `config/local.json`. Configure your SQL-server
to be listening for incoming connections at the endpoint specified there. Also
make sure the required user(s) and database(s) exist and that the appropriate
privileges are set. Everything else (creating the schema, etc.) will be handled
by the application (using migrations).

Example for configuring a mysql server:

    mysql -u root
    mysql> CREATE DATABASE dbname_development;
    mysql> CREATE DATABASE dbname_test;
    mysql> CREATE DATABASE dbname_production;
    mysql> CREATE USER "username"@"localhost" IDENTIFIED BY "userpassword";
    mysql> GRANT ALL PRIVILEGES ON dbname_development.* TO
           "username"@"localhost";
    mysql> GRANT ALL PRIVILEGES ON dbname_test.* TO
            "username"@"localhost";
    mysql> GRANT ALL PRIVILEGES ON dbname_production.* TO
            "username"@"localhost";
    mysql> exit
    
Models
------
Models reside in the `app/models` directory. All files placed there will
automatically be loaded by `app/models/models.js`, which is required by
`app.js`. Models are made available to the rest of the app via `app.get(
"models" )` which will retrieve a hash of bookshelf-models.

### What a model should look like
The application expects models to be a node.js-module whose `exports`-object is
a function returning a single bookshelf.js-Model. So typically, your models will
look like this:

    "use strict";

    module.exports = function( app ) {

        var bookshelf = app.get( "bookshelf" );     //get bookshelf from the app

        var Cat = bookshelf.Model.extend( {
            tableName: "cats",
            hasTimestamps: true
        } );

        return Cat;
    };

For more info on how to define bookshelf.js-models see
http://bookshelfjs.org/#Model.
    
You can then use your defined models in your controllers like this:

    var models = app.get( "models" );
    var User = models.User;

    /* ... */

    User.fetchAll().then( function( users ) {
        res.render( "users/index", { users: users } );
    } ).catch( function(error) {
        res.status( 500 ).json( error );
    } );

For more info on querying models check http://bookshelfjs.org/ and
http://knexjs.org/ which bookshelf is using internally.

Migrations
----------
Your models will rely on a database. To keep your database schema easily
updatable, knex migrations are used.

Migrations are placed in `app/migrations` and run via `grunt:migrate:<command>`.
There is no knexfile for these migrations as described in the knex migrations
docs, instead the gruntfile will compute the necessary configuration for each
command (as it differs for each environment).

Most commands are specific to an environment, so the syntax for most
migration-related commands is as follows:

    migrate:<environment>:<command>

This will perform the given command for the specified environment
(`development`, `test` or `production`) The available commands are:

* `migrate:<environment>:latest`: Migrate to the latest version
* `migrate:<environment>:rollback`: Rollback one version
* `migrate:<environment>:currentVersion`: Print the current migration version
* `migrate:make:<migrationname>`: Create the migration with the given name
  (independent of environment)

Tests
-----

Tests can be run via `grunt test`. All tests must be placed inside `test/` and
have the suffix `.test.js`.

For easier testing, tests can require `test/testsetup.js` using `require(
"./testsetup" ). This will instantiate all models and controllers just like the
app does in order to use them in the tests.

