## Improvements Explosiv have over Dhow

- If a file ends with `.html.js`, say `404.html.js` it will be outputted as `404.html`, not the default `404/index.html` way
- `Head` is built-in.
- No need to import `Explosiv` everytime.
- Provide an `explosiv serve` command that serve a static directory on a specified port (defaults to  3000).
- `Head` elements are added on top of `document.head` instead of the bottom (allowing overriding existing tags)
- Rewritten for `build` code to be independent and ease debugging
- Does not use `polka` but the more minimal `connect`.
- Use middleware deemed as useful like `morgan` which log all requests and `compression` which compress resources on HTTP.
- Fixed bugs on edge cases like rendering `<>` (aka Fragment tags) as root elements and rendering empty children.
- Added support for `className` HTML attribute.
- Fixed bug where self-closing (like `<img src="/path/to.img">`) elements doesn't render correctly.
- Use tabs instead of 4 spaces lol!
- And other many but subtle changes.

## Benefits of using Explosiv over something like React

- Very easy to learn (if you already know HTML _or_ React)
- Super duper fast builds (mainly because of using ESBuild)
- No need to `render` or `hydrate` on the client-side
- No need to load large Javascript bundles on the client-side (React, React-DOM, webpack, unnecessary polyfills)
- Pages load fast and run very smoothly, aiming always for 100% Lighthouse scores

> Whatever you do, note that Explosiv is for building static sites only. Not fully featured sites that use data at runtime server-side. If you want something complex, your best bet is [Next.js](https://nextjs.org)