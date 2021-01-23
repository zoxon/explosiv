# Explosiv

![npm version](https://img.shields.io/npm/v/explosiv) ![License](https://img.shields.io/npm/l/explosiv)

> A clone of the already beautiful [Dhow](https://www.github.com/kartiknair/dhow)

JSX-powered SSG for Node.js. Write logic like React with a directory-structure like Next.js but generate plain HTML with no client side JS.

- [Getting Started](#getting-started)
- [What it does](#what-it-does)
- [CSS Files](#css-files)
- [The `Head` component](#the-head-component)
- [How it works](#how-it-works)
- [Contributing](#contributing)

The default template will show you the basic structure of a Explosiv app but using something like the blog template will show you everything Explosiv can offer.

### Getting started

Let's walk through it.

```shell
# make a directory for your project
mkdir my-app

# change your directory
cd my-app

# initialize npm (optionally using `-y`)
npm init -y

# install explosiv
npm i explosiv

# create a `./pages` directory
mkdir pages
```

Once you're at this point add a few `.js` files to the `./pages` directory. After that we can set up our scripts in `package.json`. We're gonna add two scripts `dev` to start the Explosiv dev server & `build` to build the files a single time.

```diff
{
    "name": "my-app",
    "version": "1.0.0",
    "description": "Basic example using Explosiv as a Static Site Generator",
    "main": "index.js",
+    "scripts": {
+        "dev": "explosiv dev",
+        "build": "explosiv build"
+    },
    "author": "",
    "license": "MIT",
    "dependencies": {
        "explosiv": "^1.2.1"
    }
}
```

## What it does

Explosiv is basically a transpiler. It takes a `.js` file like this:

```jsx
import Explosiv, { Head } from 'explosiv'

export default () => (
	<main>
		<Head>
			<title>Home page</title>
		</Head>
		<h3>This is my home</h3>
		<p>On the internet obviously</p>
	</main>
)
```

and converts it into a static HTML file like this:

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Home page</title>
	</head>
	<body>
		<div class="explosiv">
			<main>
				<h3>This is my home</h3>
				<p>On the internet obviously</p>
			</main>
		</div>
	</body>
</html>
```

You can also export an (optionally) async `getProps` function from your file to fetch data. This will be run during build time & the props that it returns will be passed to your `Head` component & default component.

```jsx
import Explosiv, { Head } from 'explosiv'
import fetch from 'node-fetch'

export default ({ posts }) => (
	<main>
		<Head>
			<title>Blog Posts</title>
		</Head>
		<h1>All the blog posts</h1>
		<ul>
			{posts.map((post) => (
				<li>
					<h3>{post.title}</h3>
				</li>
			))}
		</ul>
	</main>
)

export const getProps = async () => {
	const res = await fetch('https://jsonplaceholder.typicode.com/posts')
	const data = await res.json()
	return { posts: data }
}
```

To generate multiple files using a single `.js` file you can export an (optionally) async `getPaths` function from your file. It should return an array of strings. Each of them will replace your filename in the end result. Each of the paths will also be passed to your `getProps` function if you do export one.

```jsx
import Explosiv, { Head } from 'explosiv'
import { readFile, readdir } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'
import marked from 'marked'

export default ({
	post: {
		content,
		data: { title, date, description },
	},
}) => (
	<article>
		<Head>
			<title>{title}</title>
			<meta name="description" content={description} />
		</Head>

		<h2>{title}</h2>
		<p>
			<small>{new Date(date).toDateString()}</small>
		</p>
		<p>{description}</p>
		<h4>―</h4>
		<div html={content}></div>
	</article>
)

export const getPaths = async () => {
	const files = await readdir('./content')
	return files.map((path) => path.slice(0, path.length - 3))
}

export const getProps = async (slug) => {
	let post = await readFile(join('./content', `${slug}.md`), 'utf-8')
	post = matter(post)
	post.content = marked(post.content)
	return { post }
}
```

## CSS Files

Explosiv uses [PostCSS](https://github.com/postcss/postcss) under the hood to process all your CSS files. This means you can create a `postcss.config.js` file in the root of your directory, and Explosiv will use the plugins you use in that file (you can see this in the [TailwindCSS example](https://github.com/kartiknair/explosiv/tree/master/examples/tailwind)).

> Note: Explosiv unlike some bundlers (like Parcel) uses **no plugins by default**

## The `Head` component

To manage the contents of the document head you can use the `Head` component that Explosiv exports. Import it like this:

```jsx
import Explosiv, { Head } from 'explosiv'
```

And then whatever you put inside it will be inserted into the paage head at build time:

```jsx
import Explosiv, { Head } from 'explosiv'

export default () => (
    <main>
        <Head>
            <title>Hello there</title>
        </Head>
        <h1>Hello world</h1>
    </main>
)

/* Will become this: */
<html>
    <head>
        <title>Hello there</title>
    </head>
    <body>
        <div class="explosiv">
            <h1>Hello world</h1>
        </div>
    </body>
<html>
```

The `Head` component prioritizes children components. Do if you have a `Head` component on the parent & on the child. The childs `Head` contents will **completely override** the page head. Example:

```jsx
import Explosiv, { Head } from 'explosiv'

const Child = () => (
    <div>
        <Head>
            <title>Hello there from the child</title>
        </Head>
        <p>I'm a nested component</p>
    </div>
)

export default () => (
    <main>
        <Head>
            <title>Hello there</title>
        </Head>
        <h1>Hello world</h1>
        <Child />
    </main>
)

/* Will become this: */
<html>
    <head>
        <title>Hello there from the child</title>
    </head>
    <body>
        <div class="explosiv">
            <h1>Hello world</h1>
            <p>I'm a nested component</p>
        </div>
    </body>
<html>
```

This is similar to the behaviour in other libraries like [Helmet](https://github.com/nfl/react-helmet)

## How it works

Behind the scenes Explosiv is actually pretty simple, it uses [`min-document`](https://github.com/Raynos/min-document) & [`esbuild`](https://github.com/evanw/esbuild) to create fake DOM nodes from your JSX.

As a CLI tool Explosiv takes `.js` files from your `./pages` directory & uses esbuild to compile it into non-JSX. Then it calls your default export function and appends the element it returns to a `.explosiv` div in the document. If you do export a `Head` function then the contents of that are added to the `<head>` of the document. Then the `outerHTML` of this document is saved into an `html` file corresponding to the path of your source file.

If you export a `getProps` function then the results of that function are passed to your default & `Head` component. If you export a `getPaths` function then the same file is evalauated once for each path. Each path is also passed to `getProps` (if it exists) so you can fetch path-specific data. While it is not necessary you can use square brackets around the name of a file that exports a `getPaths` function to remain true to Next.js (e.g `[fileName].js`)

## Contributing

Feel free to add any features you might find useful. Just open an issue and we can go there. If you find a bug you can also open an issue but please make sure to include details like your system, node version, etc.
