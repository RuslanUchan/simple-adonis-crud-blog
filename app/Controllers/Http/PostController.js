'use strict'

// Bring in Model
const Post = use('App/Models/Post')

// Bring in Validator
const { validate } = use('Validator')

class PostController {
  
  // Render home page
  async index({ view }) {
    const posts = await Post.all()

    return view.render('posts.index', { title: "Latest Posts", posts: posts.toJSON() }) // Index inside posts folder
  }

  // Render the post details page
  async details({ params, view }) {
    const post = await Post.find(params.id)

    return view.render('posts.details', { post: post })
  }

  // Render Add Post view
  async add({ view }) {
    return view.render('posts.add')
  }

  // Catch POST request from Add Post form
  async store({ request, response, session }) {

    // validate input before storing to the database
    const validation = await validate(request.all(), {
      title: 'required|min:3|max:255',
      body: 'required|min:3'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back') // Reload the same page
    }

    const post = new Post()

    post.title = request.input('title')
    post.body = request.input('body')

    await post.save()

    // Send flash message
    session.flash({ notification: "Post Added" })

    return response.redirect('/posts')
  }

  async edit({ params, view }) {
    const post = await Post.find(params.id)
    
    return view.render('posts.edit', { post: post })
  }

  async update({ params, request, response, session }) {
    // validate input before storing to the database
    const validation = await validate(request.all(), {
      title: 'required|min:3|max:255',
      body: 'required|min:3'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back') // Reload the same page
    }

    const post = await Post.find(params.id)

    post.title = request.input('title')
    post.body = request.input('body')

    await post.save()

    session.flash({ notification: 'Post Updated'})

    return response.redirect('/posts')
  }

  async destroy({ params, session, response }) {
    const post = await Post.find(params.id)

    await post.delete()

    session.flash({ notification: 'Post Deleted'})

    return response.redirect('/posts')
  }
}

module.exports = PostController
