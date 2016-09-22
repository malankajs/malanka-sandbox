import {Component, Defaults, Mutator} from 'malanka';

import styles from './Check.css';
import template from './Check.hbs';

@Defaults({
    styles,
    template,
    tagName: 'label'
})
export class Check extends Component {

    @Mutator('value')
    checked(value) {
        return Boolean(value);
    }

    /**
     * Event handler
     *
     * @param event
     */
    onChange(event) {
        this.value.setValue(event.target.checked);
    }

}
