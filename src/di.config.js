import {webpackResolver, staticResolver} from 'di.js';
import {BodyContainer} from './components/BodyContainer/BodyContainer';
import {Environment, Model, Collection} from 'malanka';

export let diConfig = {
    resolvers: [
        webpackResolver([
            require.context('./models', true, /\.js$/),
            require.context('./components', true, /(Header|Page)\.js$/)
        ]),
        staticResolver({
            BodyContainer,
            Environment,
            Collection,
            Model
        })
    ],
    dependencies: {
        // routes

        home: ['!BodyContainer', {
            content: 'homePage'
        }],

        error: ['!BodyContainer', {
            content: 'errorPage'
        }],

        // Pages

        BodyContainer: {
            env: 'env',
            header: 'Header'
        },

        homePage: ['HomePage', {
            sandbox: 'sandbox'
        }],

        errorPage: ['ErrorPage', {

        }],
        
        // Components

        Header: {
            sandbox: 'sandbox'
        },

        // Data models & collections

        sandbox: 'Sandbox',

        // States

        // Infrastructure

        env: ['Environment', {
            renderer: 'renderer'
        }]
    }
};
