import {Component, Defaults} from 'malanka';

import styles from './Brace.css';

@Defaults({
    styles
})
export class Brace extends Component {

    onRender() {
        if (this.env.isBrowser) {
            require([
                'brace',
                'brace/theme/monokai',
                'brace/mode/handlebars',
                'brace/mode/javascript'
            ], () => {
                setTimeout(() => {
                    var editor = ace.edit(this.getElement());
                    editor.getSession().setMode('ace/mode/' + this.lang);
                    editor.setTheme('ace/theme/monokai');
                    editor.setValue(this.value.getValue());
                    editor.$blockScrolling = Infinity;

                    editor.commands.addCommand({
                        name: 'submit',
                        bindKey: {win: 'Ctrl-Enter',  mac: 'Command-Enter'},
                        exec: (editor) => {
                            this.value.setValue(editor.getValue());
                            this.emitEvent('enter');
                        }
                    });

                    if (!this.readonly) {
                        editor.getSession().on('change', () => {
                            setTimeout(() => {
                                this.value.setValue(editor.getSession().getValue());
                            });
                        });
                    }

                    this.listenTo(this.value, (value) => {
                        if (editor.getSession().getValue() !== value) {
                            editor.getSession().setValue(value)
                        }
                    });
                });
            });
        }
    }

}
