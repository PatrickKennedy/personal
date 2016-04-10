The source for my personal site currently hosted at [dysio.de](http://dysio.de).

The site is, for the moment, a static site built on Angular using a thin node.js
layer to process requests. All content will be written in Jade and compiled into
Angular templatecache objects.

The site will be deployed via Dokku running on a Digital Ocean instance.

The primary goals for this project, aside from building a personal website, are
to familiarize myself with

1. Angular Routing and Views
2. The Gulp build system

I've chosen to continue with Angular 1 so I can produce the site with minimal
effort, as opposed to possibly having to jerry rig a Jade-Templatecache system
for Angular 2 without a better understanding of the changes between the two
versions.
