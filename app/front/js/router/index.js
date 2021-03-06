/**
 * Created by '苏萧' on 2017/7/13.
 */
import React from 'react';
// import { Router, Route, hashHistory, browserHistory, Link, IndexLink, IndexRoute, Redirect } from 'react-router';
import { Route, IndexRoute, Redirect } from 'react-router';

import About from '../components/About';
import Home from '../containers/Home';
import Login from '../containers/Login';
import Register from '../containers/Register';
// import Blog from '../components/Blog';
import App from '../containers/App';
import NotFound from '../components/NotFound'
import { All, Auto, Mongo, Node, Blog } from '../components/Blog';
import { Admin, Users, AdminHome, Article, EditArticle } from '../components/Admin'
import { enterHomePage, leaveHomePage } from '../utils/enterOrLeaveRoute'

export default (
    <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="home" component={Home} onEnter={enterHomePage} onLeave={leaveHomePage} />
        <Route path="/blog" component={Blog}>
            <IndexRoute component={All} />
            <Route path="node" component={Node} />
            <Route path="auto" component={Auto} />
            <Route path="mongo" component={Mongo} />
        </Route>
        <Route path="about" component={About}/>
        <Route path="guestbook" component={NotFound} />
        <Route path="sign" component={Login} />
        <Route path="register" component={Register} />
        <Route path="admin" component={Admin}>
          <IndexRoute components={AdminHome}/>
          <Route path="users" component={Users} />
          <Route path="article" component={Article} />
          <Route path="edit" component={EditArticle} />
        </Route>
        <Route path="404" component={NotFound} />
        <Redirect from="/*" to="/404" />
        {/*
          <Route path="/repos/:name/:paramName" component={ParamName}/>
        */}
    </Route>
)