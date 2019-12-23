import '~/styles/global.css'

import App from 'next/app'
import React from 'react'
import authenticate from '~/lib/authenticate'
import { UserContext } from '~/lib/user-context'
import Head from 'next/head'
import { fullStoryScript } from '~/lib/scripts'

export default class MyApp extends App {
  state = {
    user: {},
    userLoaded: false
  }

  async componentDidMount() {
    const { user } = await authenticate()
    this.setState({
      user,
      userLoaded: true
    })
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <UserContext.Provider value={this.state}>
        <Head>
          {typeof document !== 'undefined' &&
            document.cookie &&
            document.cookie.indexOf('token=') > -1 && (
              <script
                async
                dangerouslySetInnerHTML={{
                  __html: fullStoryScript
                }}
              />
            )}
        </Head>
        <Component {...pageProps} />
      </UserContext.Provider>
    )
  }
}
