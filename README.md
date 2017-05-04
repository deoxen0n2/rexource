REST API client made ...easy?

> **Development status:** This is a rather experimental module, so don't use it in any way. The API is not stable and the only use is in the `hipjabber` package that's also an experimental module.

## Install

```sh
$ yarn add rexource   # or npm install --save rexource
```

## Usage

Define:

```js
import { Base, Resource, Resources } from 'rexource'

const Comment = Resource.extend()

const Comments = Resources.extend('comments', {
  Resource: Comment
})

const Post = Resource.extend({
  comments: Comments
})

const Posts = Resources.extend('posts', {
  Resource: Post
})

class Blog extends Base {
  get posts () {
    return new Posts(this.baseURL, this.options)
  }
}
```

Use:

```js
const blog = new Blog('https://example-blog-url.com/api/v2', {
  headers: {
    Authorization: 'Bearer authTokenHere'
  }
})

// Issue POST request to https://example-blog-uri.com/api/v2/posts
blog.posts.create({
  title: 'Hello World!',
  content: 'First post.'
})
.then((post) => {
  // Assuming post.id === '3826',
  // issue POST request to https://example-blog-uri.com/api/v2/posts/3826/comments
  // Also, can use it like blog.posts('3826').comments.create({ ... })
  return post.comments.create({ comment: 'First comment.' })
})
```

## License

Copyright 2017 Saran Siriphantnon &lt;deoxen0n2@gmail.com&gt; MIT License.
