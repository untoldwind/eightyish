
import './app.less'
import './index.html'
import './index-dev.html'

import 'babel/polyfill'

import React from 'react'

import App from './app'

React.render(
    <App />,
    document.getElementById('app')
)
