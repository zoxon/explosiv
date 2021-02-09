# 🧨 Explosiv ![npm version](https://img.shields.io/npm/v/explosiv) ![License](https://img.shields.io/npm/l/explosiv) ![Size](https://img.shields.io/bundlephobia/minzip/explosiv)

> A fork of the already beautiful [Dhow](https://www.github.com/kartiknair/dhow)

Simple and powerful JSX Static Site Generator.

## Getting started

1. Install it to your development dependencies.

```bash
npm i explosiv -D
```

## Simple example

Explosiv allow you to build static sites written in JSX. To get started, create a file called `pages/index.js`:

```js
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

Then build your static site! It's this simple.

```bash
npx explosiv build
```

Your site will be exported into the `out/` directory.

> An alternate way to use: Install Explosiv globally `npm i explosiv -g` then run your commands like this: `explosiv build`

> There is an [article about how Explosiv works][article].

## Usage

> There are real-world examples in [the `examples/` directory](examples)

**With Fragment tags**

```js
// pages/fragment.js
export default () => (
  <main>
    <h3>Hello!</h3>
    <>
      <p>I'm vixalien</p>
      <p>But only on the internet</p>
    </>
  </main>
)
```

<br/>

**`style` can either be an Object or String**

```js
// pages/style-prop.js
export default () => (
  <main>
    <Head>
      <title>Home page</title>
    </Head>
    <p style="color: blue;">This is my blue paragraph</p>
    <p style={{color: 'blue'}}>This does the same thing</p>
  </main>
)
```

<br/>

**`class` and `className`**

The `className` prop will export a `class` HTML attribute.

```js
// pages/className-is-same-as-class.js
export default () => (
  <main>
    <Head>
      <title>Home page</title>
    </Head>
    <p> class="fancy">This is my fancy paragraph</p>
    <p> className="fancy">Another similarly fancy paragraph</p>
  </main>
)
```

<br/>

**Using `Head`**

`Head` will export it's children into the `<head>` of HTML. Useful for SEO!

```js
// pages/Head.js
export default () => (
  <main>
    <Head>
      <title>Home page</title>
      <meta name="description" content="This is my Internet home"/>
    </Head>
    <h3>This is my home</h3>
    <p>On the internet obviously</p>
  </main>
)
```

<br/>

**Using getProps**

If you export `getProps`, it will be called at build time to any data you may require. That data will be passed into the main export of your file.

```js
// pages/onepost.js
export default (data) => (
  <main>
    <Head>
      <title>{data.name}</title>
      <meta name="description" content={data.description}/>
    </Head>
    <h3>Post name: {data.name}</h3>
    <p>Description: {data.description}</p>
    <small>Created: {data.created}</small>
  </main>
)

export getProps = () => {
  return {
    name: 'Post',
    description: 'A Post lol',
    created: 'Yesterday'
  }
}
```

<br/>

**Using getPaths**

If you name your file like `[slug].js`, (i.e with curly brackets) and export `getPaths`, it will be called at build time to get all possible slugs.

```js
// pages/[posts].js
export default (data) => (
  <main>
    <Head>
      <title>{data.name}</title>
      <meta name="description" content={data.description}/>
    </Head>
    <h3>Post name: {data.name}</h3>
    <p>Description: {data.description}</p>
    <small>Created: {data.created}</small>
  </main>
)

export getProps = (slug) => {
  return somehowGetDataAboutPost(slug);
}

export getData = () => {
  return ['post1', 'post2']
}
```

<br/>

## Public files

Files in `public/` will be copied into your build output. However, CSS files will be processed with [PostCSS](https://github.com/postcss/postcss). This means you can create a `postcss.config.js` file in the root of your directory, and Explosiv will use the plugins you use in that file (you can see this in the [TailwindCSS example](https://github.com/vixalien/explosiv/tree/master/examples/tailwind)).

## CLI

**explosiv dev**

Start the dev server, & rebuilds static files on file change

| Option          | Description                               | Default        |
| --------------- | ----------------------------------------- | -------------- |
| -i, --indir     | Change input directory for your files.    | `./pages`        |
| -d, --devdir    | Change directory where your temporary development builds are  stored.  | `./__explosiv__` |
| -p, --port      | Change port for `dev server`              | process.env.PORT or `3000` |

<br/>

**explosiv serve**

Start a static file server

| Option          | Description                               | Default        |
| --------------- | ----------------------------------------- | -------------- |
| -d, --dir       | Change input directory for your files.    | `./pages`      |
| -p, --port      | Change port for `dev server`              | process.env.PORT or `3000` |

<br/>

**explosiv build**

Build production ready static files

| Option          | Description                               | Default        |
| --------------- | ----------------------------------------- | -------------- |
| -i, --indir     | Change input directory for your files.    | `./pages`        |
| -d, --devdir    | Change directory where your temporary development builds are  stored.  | `./__explosiv__` |

<br/>

## API

There is no case we can see you doing `require('explosiv')`. But, it exports a JSX Runtime, that we uses under the hood to transform your JSX pages into HTML. Functions it export are listed here.

### el(tag, props, ...children)

Append a new Element to the DOM. In other words, turn a JSX component into an HTML DOM element.

* **tag** {`String `|`Function`} tagName of component to create, or a function to create an element.
* **props** {`Object`} A dictionary of HTML attributes.
* **children** {`Array`|`String`|`Fragment`|`Component`}

> The prop `html` sets the innerHTML of the element.

> The `class` and `className` props all create a `class` attribute.

> The `style` attribute can be a `String` or `Object`. If it is an Object, it will be transformed into a String.

### Head({ children, ...props })

Add children to the DOM's `<head>` element. Available built-in, no need to import it

### Fragment({ children, ...props })

Add children to the parent component without creating a new HTML element. Built-in in JSX as `<>text</>`

## Contributing

Feel free to add any features you might find useful. Just open an issue and we can go there. If you find a bug you can also open an issue but please make sure to include details like your system, node version, etc.

## Bottom line

Please read the [notes] to see Improvements over Dhow, and differences with React.

[article]: https://vixalien.ga/post/explosiv
[notes]: https://github.com/vixalien/explosiv/blob/master/notes.md

[react]: https://reactjs.org
[examples]: https://github.com/vixalien/explosiv/tree/master/examples