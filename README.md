# Explosiv

![npm version](https://img.shields.io/npm/v/explosiv) ![License](https://img.shields.io/npm/l/explosiv) ![Size](https://img.shields.io/bundlephobia/minzip/explosiv)

JSX Static Site Generator for Ambitious projects. Simple, powerful and performant.

> A fork of the already beautiful [Dhow](https://www.github.com/kartiknair/dhow)

## Getting started

Install it to your development dependencies.

```bash
# install explosiv
npm i explosiv -D
```

## Simple example

Explosiv is basically a transpiler. Create a file `pages/index.js`:

```jsx
// pages/index.js
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

To build your pages (pages are in `pages/` by default).

```bash
npx explosiv build
```

Explosiv will generate a static site in `out/` with a file `out/index.html` like this:

```html
<!-- out/index.html -->
<!DOCTYPE html>
<html>
  <Head>
    <title>Home page</title>
  </Head>
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

> Note the use of `Head`, which is a built in component

> There is an [article about how Explosiv works][article].

## Advanced usage

### getProps

If you export an optional `getProps` function from your file, that function will be called at build-time to get data.

```jsx
// pages/blog.js
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

> Here the data is passed to the component as `posts`

### getPaths

You can encapsulate your file within square brackets like `[post].js` to get a dynamic number of pages. To define valid slugs, you use a `getPaths` function which can return an array of strings. Each of them will replace your filename in the end result. Each of the paths will also be passed to your `getProps` function if you export one.

```jsx
// pages/[post].js
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

To manage the contents of the document head you can use the `Head` component that Explosiv exports. `Head` is built-in natively. But you can import it like this:

```jsx
import { Head } from 'explosiv'
```

And then whatever you put inside it will be inserted into the paage head at build time:

```jsx
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

## Bottom line

Please read the [notes] to get Improvements over Dhow, and differences with React.

[article]: https://vixalien.ga/post/explosiv
[notes]: https://github.com/vixalien/explosiv/blob/master/notes.md