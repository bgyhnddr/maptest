const Koa = require('koa')
const serve = require('koa-static-server')
const fs = require('fs')
const app = new Koa()

app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

app.use(async (ctx, next) => {
  if (ctx.request.path == '/stream') {
    const readable = require('stream').Readable
    const s = new readable()
    s._read = () => {}

    new Promise((resolve) => {
      setTimeout(() => {
        s.push('中文1')
        resolve()
      }, 3000)
    })
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            s.push('中文2')
            resolve()
          }, 3000)
        })
      })
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            s.push('🌝')
            s.push(null)
            resolve()
          }, 3000)
        })
      })

    ctx.body = s
    // var s = new readable
    // ctx.body = s
    // setTimeout(() => {
    //   s.push(1)
    //   setTimeout(() => {
    //     s.push(2)
    //     setTimeout(() => {
    //       s.push(null) // indicates end of the stream
    //     }, 1000)
    //   }, 1000)
    // }, 1000)
  } else if (ctx.request.path == '/map.zip') {
    const src = fs.createReadStream('./f49c003004.zip')
    ctx.response.set('content-type', 'application/zip')
    ctx.body = src
  } else {
    await next()
  }
})

app.use(serve({ rootDir: 'static', rootPath: '/' }))

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

app.listen(80, () => {
  console.log('listen on 80')
})
