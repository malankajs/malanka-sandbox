import {Defaults} from 'malanka';
import {DiComponent} from '../DiComponent';

import template from './BodyContainer.hbs';
import styles from './BodyContainer.css';

@Defaults({
    template,
    styles,
    tagName: 'div'
})
export class BodyContainer extends DiComponent {

}
