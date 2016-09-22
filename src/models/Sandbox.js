import {Model, Prototype, Mutator} from 'malanka';

import {TemplateCompiler} from 'malanka/es5/Template/TemplateCompiler'
import {TemplateCSSModulesPlugin} from 'malanka/es5/Template/plugins/TemplateCSSModulesPlugin'
import {TemplateTrimSpacesPlugin} from 'malanka/es5/Template/plugins/TemplateTrimSpacesPlugin'
import {TemplateFlattenPlugin} from 'malanka/es5/Template/plugins/TemplateFlattenPlugin'

import {js} from 'js-beautify';

@Prototype({
    code: '<div>Hello world!</div>',
    css: true,
    trim: true
})
export class Sandbox extends Model {

    @Mutator(['code', 'css', 'trim'])
    compiledCode([code, css, trim]) {
        let plugins = [];

        if (css) {
            plugins.push(new TemplateCSSModulesPlugin());
        }

        if (trim) {
            plugins.push(new TemplateTrimSpacesPlugin());
        }

        plugins.push(new TemplateFlattenPlugin());

        let compiler = new TemplateCompiler({
            components: {
                Component: 'malanka',
                ValueProxy: 'malanka'
            },
            runtimePath: 'malanka/es5/Runtime/runtime',
            helpers: {
                each: 'malanka/es5/Runtime/eachHelper',
                if: 'malanka/es5/Runtime/ifHelper'
            },
            plugins
        });

        return js(compiler.compileString(code));
    }

}
