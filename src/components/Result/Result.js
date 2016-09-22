import {Component, Defaults} from 'malanka';

import styles from './Result.css';

@Defaults({
    styles
})
export class Result extends Component {

    onRender() {
        if (!this.isRendered()) {
            this.listenTo(this.code, () => {
                setTimeout(() => this.render());
            });
        }
    }

    template(context) {
        let modules = {
            malanka: require('malanka'),
            'malanka/es5/Runtime/runtime': require('malanka/es5/Runtime/runtime'),
            'malanka/es5/Runtime/eachHelper': require('malanka/es5/Runtime/eachHelper'),
            'malanka/es5/Runtime/ifHelper': require('malanka/es5/Runtime/ifHelper')
        };

        let module = {};
        let code = `(function(){
            var require = function(module) {
                return modules[module];
            }
            
            ${context.code}
        })()`;

        eval(code);

        return module.exports(context);
    }


}
