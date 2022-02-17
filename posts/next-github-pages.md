---
title: 'Deploying a static Next Js website to Github Pages'
date: '2022-02-15'
---

Before proceeding to explain the steps on deployment let's make a few things clear about **Github Pages**

- Github Pages is meant for hosting of static websites. Which means hosting plain old websites comprised of html, css and javascript.
- Github processes your static website using Jekyll before hosting. This can be easily disabled by adding a **.nojekyll** file to the root directory of your website. This is required for two reasons
	- Jekyll can bring in unwanted changes or behaviors on a website that has already been created using NextJs
	- Jekyll ignores directories starting with an underscore while NextJs creates an _next directory after exporting a static website

I'm assuming that you have a static website ready waiting to be deployed but if not and you're new to NextJs then you can follow this simple yet awesome tutorial provided in the NextJs website [here](https://nextjs.org/learn/basics/create-nextjs-app?utm_source=next-site&utm_medium=homepage-cta&utm_campaign=next-website)

### Steps to deploy on Github Pages:
- Open your project's Github page and click **Actions**
- Click on **set up a workflow yourself**
- Paste the following

```yaml
# This is a basic workflow to help you get started with Actions

name: CI

# Controls when the workflow will run
on:
  # Triggers the workflow on push request events but only for the main branch
  push:
    branches: [ main ]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2
      #Uses node 16
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      # npm ci is a faster way to install modules on automated environments
      - name: install modules
        run: npm ci
      
      # Build and export static
      - name: Build and export a static site
        run: npm run build && npm run export

      # Deploy the build folder to gh-pages
      - name: Deploy build to gh-pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
          enable_jekyll: false

```
- Click **Start Commit** and after writing a commit message click **Commit new file**
- The above procedure should be enough to deploy your website. If your website isn't being hosted from your root url (example: xyz.github.io) but instead is being hosted on a branch url (example: xyz.github.io/blog) then there would be errors while fetching static files. Also if you're using the **next/image** tag of NextJs then there will also be errors while exporting your project as the default image loader won't work.
- To fix these add a file named **.env.production** to the root directory of your NextJs project and paste something like the following

```
BASE_PATH=/nextjs-blog
```
This is an environment variable that is referencing a branch url where the website and its static files will exist. NextJs will read this while building the project.

- Now add a file named **next.config.js** and paste the following

```js
module.exports = {
    distDir: 'build',
    images: {
        loader: 'akamai',
        path: process.env.BASE_PATH || '/',
    },
    basePath: process.env.BASE_PATH || ''
}
```
- The above file uses one of the possible image [loaders](https://nextjs.org/docs/api-reference/next/image#built-in-loaders) and makes use of the base path available from the environment file
- Once done, commit and push the project. The Github action will take care of building and deploying your website. 

### Possible Issues that may occur
- **favicon** may not display properly
	- This generally occurs when you're hosting on a branch url instead of root
	- One way to circumvent this is by using relative urls for favicon in each of your page. For example your index page might use a url **"./favicon.ico"** while sub-pages might use a url like **"../favicon.ico"** depending on the depth of the directory where your pages are present.
	- Check out my project [here](https://github.com/nilanshu96/nextjs-blog) based on the nextjs-blog tutorial from the NextJs website. I've made slight changes to my project to circumvent this exact issue.