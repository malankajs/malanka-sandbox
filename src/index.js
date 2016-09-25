import {staticResolver, then, createContainer} from 'di.js';

import {DomRenderer} from 'malanka/es5/Renderer/DomRenderer';
import {FetchRequest} from 'malanka/es5/Request/FetchRequest';

import {diConfig} from './di.config';

diConfig.resolvers.push(staticResolver({FetchRequest}));
diConfig.dependencies.request = 'FetchRequest';

let di = createContainer(diConfig);

di.put('renderer', new DomRenderer());

then(di({'env': 'env', page: 'home'}, {di}), ({env, page}) => {
    let element = env.render(page);
    document.body.appendChild(element);
});

