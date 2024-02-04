'use strict';

import calendar from './calendar.js';
import holiday from './holiday/index.js';

const map = new Map([...calendar, ...holiday]);
export default map;
